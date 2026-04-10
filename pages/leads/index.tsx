import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Table, Input, Button, Tooltip, Badge, Select, Spin, Empty, Row, Col, Tag } from 'antd';
import { IconFilter, IconDownload, IconSearch, IconX, IconLoader2 } from '@tabler/icons-react';
import type { ColumnsType } from 'antd/es/table';
import { exportToExcel } from '@lib/utils/exportToExcel';
import { getLeadSourcesThunk, getLeadStatsThunk, getLeadThunk } from '@redux/feature/lead/leadThunk';
import { Status } from '@lib/constants/enum';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Lead } from '@redux/feature/lead/ILeadState';
import SystemRoutes from '@lib/constants/Routes';
import CustomAvtar from '@/components/common/CustomAvtar';

type LeadFilterType = 'all' | 'new' | 'working' | 'qualified' | 'convert';

const STATUS_CONFIG: Record<string, { label: string; bgClass: string }> = {
  new: { label: 'New', bgClass: 'bg-gray-100 text-gray-700' },
  working: { label: 'Working', bgClass: 'bg-blue-100 text-blue-700' },
  qualified: {
    label: 'Qualified',
    bgClass: 'bg-green-100 text-green-700',
  },
  convert: {
    label: 'Converted',
    bgClass: 'bg-orange-100 text-orange-700',
  },
};

const FILTER_TABS: Array<{ type: LeadFilterType; label: string }> = [
  { type: 'all', label: 'All' },
  { type: 'new', label: 'New' },
  { type: 'working', label: 'Working' },
  { type: 'qualified', label: 'Qualified' },
  { type: 'convert', label: 'Converted' },
];

const STATUS_API_MAP: Record<LeadFilterType, string | undefined> = {
  all: undefined,
  new: 'New',
  working: 'Working',
  qualified: 'Qualified',
  convert: 'Convert',
};

const LeadPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { leadListPagination, leadSources, leadStats } = useAppSelector(state => state.lead);
  const { leads: leadLoading } = useAppSelector(state => state.lead.status);
  const isLoading = leadLoading === Status.PENDING;

  const safePagination = leadListPagination ?? { total: 0, page: 1, limit: 25, totalPages: 0 };
  const safeLeadStats = leadStats ?? {
    totalLeads: 0,
    newLeads: 0,
    workingLeads: 0,
    qualifiedLeads: 0,
  };
  const safeLeadSources = Array.isArray(leadSources) ? leadSources : [];

  const [selectedStatus, setSelectedStatus] = useState<LeadFilterType>('all');
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedCreatedAt, setSelectedCreatedAt] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [renderList, setRenderList] = useState<Lead[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<'created_at' | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const inFlightRequestsRef = useRef<Set<string>>(new Set());
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchText]);

  useEffect(() => {
    if (searchText) setIsSearchOpen(true);
  }, [searchText]);

  useEffect(() => {
    setCurrentPage(1);
    setRenderList([]);
    setHasMore(true);
  }, [
    debouncedSearch,
    selectedStatus,
    selectedSourceIds,
    selectedAssigneeIds,
    selectedRatings,
    selectedCreatedAt,
    sortBy,
    sortOrder,
  ]);

  const fetchData = useCallback(
    async (pageToLoad: number, append: boolean) => {
      const requestKey = JSON.stringify({
        pageToLoad,
        append,
        debouncedSearch,
        selectedStatus,
        selectedSourceIds,
        selectedAssigneeIds,
        selectedRatings,
        selectedCreatedAt,
        sortBy,
        sortOrder,
      });
      if (inFlightRequestsRef.current.has(requestKey)) return;

      try {
        inFlightRequestsRef.current.add(requestKey);
        if (append) setIsLoadingMore(true);
        const payload: any = await dispatch(
          getLeadThunk({
            page: pageToLoad,
            limit: 20,
            search: debouncedSearch || undefined,
            status: STATUS_API_MAP[selectedStatus],
            lead_source_id: selectedSourceIds.length ? selectedSourceIds : undefined,
            assignee_id: selectedAssigneeIds.length ? selectedAssigneeIds : undefined,
            rating: selectedRatings.length ? selectedRatings : undefined,
            created_at: selectedCreatedAt,
            sort_by: sortBy,
            sort_order: sortOrder,
          })
        ).unwrap();

        const listingPayload =
          payload?.data && Array.isArray(payload?.data?.leads)
            ? payload.data
            : Array.isArray(payload?.leads)
              ? payload
              : { leads: [], pagination: { total: 0, page: pageToLoad, totalPages: 0 } };
        const nextItems: Lead[] = listingPayload.leads || [];
        const pagination = listingPayload.pagination || {
          total: 0,
          page: pageToLoad,
          totalPages: 0,
        };

        setRenderList(prev => {
          if (!append) return nextItems;
          const merged = [...prev, ...nextItems];
          const byId = new Map(merged.map(item => [item.leadsId, item]));
          return Array.from(byId.values());
        });
        setHasMore((pagination?.page || pageToLoad) < (pagination?.totalPages || 0));
      } finally {
        inFlightRequestsRef.current.delete(requestKey);
        if (append) setIsLoadingMore(false);
      }
    },
    [
      dispatch,
      debouncedSearch,
      selectedStatus,
      selectedSourceIds,
      selectedAssigneeIds,
      selectedRatings,
      selectedCreatedAt,
      sortBy,
      sortOrder,
    ]
  );

  useEffect(() => {
    fetchData(currentPage, currentPage > 1);
  }, [fetchData, currentPage]);

  useEffect(() => {
    dispatch(getLeadSourcesThunk());
    dispatch(getLeadStatsThunk());
  }, [dispatch]);

  const assigneeOptions = useMemo(() => {
    const unique = new Map<string, string>();
    renderList.forEach(item => {
      if (item.assigneeId && item.assigneeName) {
        unique.set(item.assigneeId, item.assigneeName);
      }
    });
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }));
  }, [renderList]);

  const sourceOptions = useMemo(() => {
    const byId = new Map<string, string>();
    safeLeadSources.forEach(source => {
      if (source?.leadSourceId && source?.name) {
        byId.set(source.leadSourceId, source.name);
      }
    });
    renderList.forEach(item => {
      if (item?.leadSourceId && item?.leadSourceName) {
        byId.set(item.leadSourceId, item.leadSourceName);
      }
    });
    return Array.from(byId.entries()).map(([value, label]) => ({ value, label }));
  }, [safeLeadSources, renderList]);

  const handleRowClick = (record: Lead) => {
    router.push(`${SystemRoutes.LEADS}/${record.leadsId}`);
  };

  const handleExport = () => {
    exportToExcel({
      data: renderList.map(item => ({
        referenceNumber: item.referenceNumber,
        name: item.name,
        leadSourceName: item.leadSourceName,
        rating: item.rating,
        status: item.status,
        assigneeName: item.assigneeName,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-AU') : '',
      })),
      fileName: 'Leads',
      sheetName: 'Leads',
      columnHeaders: {
        referenceNumber: 'Reference ID',
        name: 'Lead Name',
        leadSourceName: 'Source',
        rating: 'Rating',
        status: 'Status',
        assigneeName: 'Assignee',
        createdAt: 'Created At',
      },
    });
  };

  const clearAllFilters = () => {
    setSearchText('');
    setDebouncedSearch('');
    setSelectedStatus('all');
    setSelectedSourceIds([]);
    setSelectedAssigneeIds([]);
    setSelectedRatings([]);
    setSelectedCreatedAt(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch ||
      selectedStatus !== 'all' ||
      selectedSourceIds.length ||
      selectedAssigneeIds.length ||
      selectedRatings.length ||
      selectedCreatedAt
  );

  const getStatusCount = (type: LeadFilterType): number => {
    if (type === 'all') return safeLeadStats.totalLeads || safePagination.total || 0;
    if (type === 'new') return safeLeadStats.newLeads || 0;
    if (type === 'working') return safeLeadStats.workingLeads || 0;
    if (type === 'qualified') return safeLeadStats.qualifiedLeads || 0;
    return renderList.filter(item => (item.status || '').toLowerCase() === 'convert').length;
  };

  const columns: ColumnsType<Lead> = [
    {
      title: 'Lead Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      render: (val: string) => val || '—',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      ellipsis: true,
      render: (val: string) => val || '—',
    },
    {
      title: 'Contact Number',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (val: string) => val || '—',
    },
    {
      title: 'Source',
      dataIndex: 'leadSourceName',
      key: 'leadSourceName',
      width: 160,
      render: (val: string) => val || '—',
    },
    {
      title: 'Property Details',
      dataIndex: 'propertyDetails',
      key: 'propertyDetails',
      width: 260,
      render: (_: string, record) => {
        const propertyDetails = record?.propertyDetails || '—';
        return (
          <Tooltip title={propertyDetails}>
            <div className="truncate max-w-[240px]">{propertyDetails}</div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (val: string) => {
        if (!val || val === 'None') return <span style={{ color: 'var(--font-color-100)' }}>—</span>;
        return <Tag>{val}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (val: string) => {
        const key = (val || '').toLowerCase();
        const cfg = STATUS_CONFIG[key];
        if (!cfg) return <Tag>{val || '—'}</Tag>;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bgClass}`}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortBy === 'created_at' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (_: string, record) => {
        const createdAt = (record as any)?.createdAt || (record as any)?.created_at;
        return createdAt ? new Date(createdAt).toLocaleDateString('en-AU') : '—';
      },
    },
    {
      title: 'Assignee',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 140,
      render: (val: string) => (
        <Tooltip title={val || 'Unassigned'}>
          <div>
            <CustomAvtar label={val || '?'} />
          </div>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: 'var(--body-color)' }}>
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--font-color)' }}>Leads List</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSearchOpen ? 'w-72 sm:w-[28rem] opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <Input
                prefix={<IconSearch size={15} className="text-gray-400" />}
                placeholder="Search by reference, name, email, phone..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                allowClear
                className="w-72 sm:w-[28rem]"
                suffix={
                  searchText ? (
                    <IconX
                      size={14}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setSearchText('');
                        setDebouncedSearch('');
                        setIsSearchOpen(false);
                      }}
                    />
                  ) : (
                    <IconX
                      size={14}
                      className="cursor-pointer text-gray-300 hover:text-gray-500"
                      onClick={() => setIsSearchOpen(false)}
                    />
                  )
                }
              />
            </div>
            {!isSearchOpen && (
              <Tooltip title="Search">
                <Button icon={<IconSearch size={16} />} onClick={() => setIsSearchOpen(true)} />
              </Tooltip>
            )}
            <Tooltip title="Advanced Filters">
              <Badge dot={hasActiveFilters} offset={[-2, 4]}>
                <Button
                  icon={<IconFilter size={16} />}
                  onClick={() => setShowFilters(v => !v)}
                  type={showFilters ? 'primary' : 'default'}
                >
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </Badge>
            </Tooltip>
            <Tooltip title="Export to Excel">
              <Button icon={<IconDownload size={16} />} onClick={handleExport}>
                <span className="hidden sm:inline">Export</span>
              </Button>
            </Tooltip>
            <Badge count={safePagination.total} showZero color="#f97316" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {FILTER_TABS.map(tab => {
            const count = getStatusCount(tab.type);
            const isActive = selectedStatus === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => {
                  setSelectedStatus(tab.type);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'hover:border-orange-300 hover:text-orange-600'
                }`}
                style={
                  isActive
                    ? undefined
                    : {
                        backgroundColor: 'var(--card-color)',
                        color: 'var(--font-color-100)',
                        borderColor: 'var(--border-color)',
                      }
                }
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs ${
                      isActive ? 'bg-orange-400 text-white' : ''
                    }`}
                    style={
                      isActive
                        ? undefined
                        : {
                            backgroundColor: 'var(--primary-10)',
                            color: 'var(--font-color-100)',
                          }
                    }
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showFilters && (
          <div
            className="rounded-lg p-4 mb-3"
            style={{
              backgroundColor: 'var(--card-color)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Row gutter={[16, 12]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--font-color-100)' }}>Source</label>
                <Select
                  className="w-full"
                  mode="multiple"
                  allowClear
                  placeholder="Filter by source"
                  value={selectedSourceIds}
                  onChange={(values: string[]) => {
                    setSelectedSourceIds(values);
                    setCurrentPage(1);
                  }}
                  options={sourceOptions}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--font-color-100)' }}>Assignee</label>
                <Select
                  className="w-full"
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="Filter by assignee"
                  value={selectedAssigneeIds}
                  onChange={(values: string[]) => {
                    setSelectedAssigneeIds(values);
                    setCurrentPage(1);
                  }}
                  options={assigneeOptions}
                  optionFilterProp="label"
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--font-color-100)' }}>Rating</label>
                <Select
                  className="w-full"
                  mode="multiple"
                  allowClear
                  placeholder="Filter by rating"
                  value={selectedRatings}
                  onChange={(values: string[]) => {
                    setSelectedRatings(values);
                    setCurrentPage(1);
                  }}
                  options={['Hot', 'Warm', 'Cold', 'None'].map(value => ({ value, label: value }))}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--font-color-100)' }}>Created</label>
                <Select
                  className="w-full"
                  allowClear
                  placeholder="Filter by created time"
                  value={selectedCreatedAt}
                  onChange={(value: string) => {
                    setSelectedCreatedAt(value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 'today', label: 'Today' },
                    { value: 'yesterday', label: 'Yesterday' },
                    { value: 'last_7_days', label: 'Last 7 days' },
                    { value: 'last_15_days', label: 'Last 15 days' },
                    { value: 'last_30_days', label: 'Last 30 days' },
                  ]}
                />
              </Col>
              <Col xs={24} sm={24} md={8} className="flex items-end">
                {hasActiveFilters && (
                  <Button danger onClick={clearAllFilters} icon={<IconX size={14} />} className="mt-4">
                    Clear Filters
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        )}
      </div>

      <div
        ref={tableScrollRef}
        className="rounded-lg shadow-sm overflow-auto max-h-[70vh]"
        style={{
          backgroundColor: 'var(--card-color)',
          border: '1px solid var(--border-color)',
        }}
        onScroll={event => {
          const target = event.currentTarget;
          const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 120;
          if (nearBottom && hasMore && !isLoadingMore && !isLoading) {
            setCurrentPage(prev => prev + 1);
          }
        }}
      >
        <Spin spinning={isLoading && currentPage === 1} tip="Loading leads...">
          <Table<Lead>
            columns={columns}
            dataSource={renderList}
            rowKey={record => record.leadsId}
            rowClassName="cursor-pointer group hover:bg-orange-50 transition-colors"
            scroll={{ x: 950 }}
            locale={{
              emptyText: (
                <Empty
                  description={hasActiveFilters ? 'No leads match your filters' : 'No leads found'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            pagination={false}
            onChange={(_pagination, _filters, sorter) => {
              if (Array.isArray(sorter)) return;
              if (!sorter.order) {
                setSortBy(undefined);
                setSortOrder(undefined);
                return;
              }
              if (sorter?.field !== 'createdAt') return;
              setSortBy('created_at');
              setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
            }}
            onRow={record => ({
              onClick: () => handleRowClick(record),
            })}
          />
          <div className="py-3 text-center text-sm" style={{ color: 'var(--font-color-100)' }}>
            {isLoadingMore ? (
              <span className="inline-flex items-center gap-2">
                <IconLoader2 size={14} className="animate-spin" />
                Loading more leads...
              </span>
            ) : hasMore && renderList.length > 0 ? (
              'Scroll to load more'
            ) : renderList.length > 0 ? (
              'You have reached the end'
            ) : null}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default LeadPage;
