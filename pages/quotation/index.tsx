import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Table,
  Input,
  Button,
  Tag,
  Tooltip,
  DatePicker,
  Select,
  Badge,
  Spin,
  Empty,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import {
  IconFilter,
  IconDownload,
  IconSearch,
  IconX,
  IconLoader2,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/feature/store';
import {
  getAllQuotationsThunk,
  getQuotationFilterOptionsThunk,
  getQuotationStatusCountsThunk,
} from '@redux/feature/quotation/quotationThunk';
import { QuotationListItem, QuotationStatus } from '@redux/feature/quotation/IQuotationState';
import { Status } from '@lib/constants/enum';
import { exportToExcel } from '@lib/utils/exportToExcel';
import CustomAvtar from '@/components/common/CustomAvtar';
import SystemRoutes from '@lib/constants/Routes';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

type FilterType = QuotationStatus;

const STATUS_CONFIG: Record<string, { label: string; color: string; bgClass: string }> = {
  approved: { label: 'Approved', color: 'green', bgClass: 'bg-green-100 text-green-700' },
  draft: { label: 'Draft', color: 'default', bgClass: 'bg-gray-100 text-gray-600' },
  modified: { label: 'Modified', color: 'blue', bgClass: 'bg-blue-100 text-blue-700' },
  pendingApproval: {
    label: 'Pending Approval',
    color: 'orange',
    bgClass: 'bg-orange-100 text-orange-700',
  },
  cancelled: { label: 'Cancelled', color: 'red', bgClass: 'bg-red-100 text-red-700' },
  expired: { label: 'Expired', color: 'volcano', bgClass: 'bg-red-50 text-red-500' },
};

const FILTER_TABS: Array<{ type: FilterType; label: string }> = [
  { type: 'all', label: 'All' },
  { type: 'draft', label: 'Draft' },
  { type: 'approved', label: 'Approved' },
  { type: 'modified', label: 'Modified' },
  { type: 'pendingApproval', label: 'Pending Approval' },
  { type: 'cancelled', label: 'Cancelled' },
  { type: 'expired', label: 'Expired' },
];

const QuotationPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { quotationListPagination, quotationStatusCounts, status, quotationFilterOptions } = useSelector(
    (state: RootState) => state.quotation
  );

  const safePagination = quotationListPagination ?? { total: 0, page: 1, limit: 20, totalPages: 0 };
  const safeStatusCounts = quotationStatusCounts ?? { total: 0, approved: 0, draft: 0, expired: 0 };
  const isLoading = status?.list === Status.PENDING;

  const [selectedStatuses, setSelectedStatuses] = useState<FilterType[]>([]);
  const [selectedLeadOrContactIds, setSelectedLeadOrContactIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [renderList, setRenderList] = useState<QuotationListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const inFlightRequestsRef = useRef<Set<string>>(new Set());

  const selectedLeadIds = useMemo(
    () =>
      selectedLeadOrContactIds
        .filter(value => value.startsWith('lead:'))
        .map(value => value.replace('lead:', '')),
    [selectedLeadOrContactIds]
  );

  const selectedContactIds = useMemo(
    () =>
      selectedLeadOrContactIds
        .filter(value => value.startsWith('contact:'))
        .map(value => value.replace('contact:', '')),
    [selectedLeadOrContactIds]
  );

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchText]);

  const fetchData = useCallback(
    async (pageToLoad: number, append: boolean) => {
      const requestKey = JSON.stringify({
        pageToLoad,
        append,
        debouncedSearch,
        selectedStatuses,
        selectedLeadOrContactIds,
        dateRange,
        sortBy,
        sortOrder,
      });
      if (inFlightRequestsRef.current.has(requestKey)) return;

      try {
        inFlightRequestsRef.current.add(requestKey);
        if (append) setIsLoadingMore(true);
        const payload: any = await dispatch(
          getAllQuotationsThunk({
            page: pageToLoad,
            limit: 20,
            search: debouncedSearch,
            statuses: selectedStatuses,
            leadIds: selectedLeadIds,
            contactIds: selectedContactIds,
            startDate: dateRange?.[0] || '',
            endDate: dateRange?.[1] || '',
            sortBy,
            sortOrder,
          })
        ).unwrap();
        const listingPayload = Array.isArray(payload?.data)
          ? payload
          : payload?.data && Array.isArray(payload?.data?.data)
            ? payload.data
            : payload;
        const nextItems: QuotationListItem[] = listingPayload?.data || [];
        const pagination = listingPayload?.pagination || {
          total: 0,
          page: pageToLoad,
          totalPages: 0,
        };

        setRenderList(prev => {
          if (!append) return nextItems;
          const merged = [...prev, ...nextItems];
          const byId = new Map(
            merged.map(item => [item.latestVersionId || `${item.quotationId}-${item.latestVersionNo || 0}`, item])
          );
          return Array.from(byId.values());
        });
        setHasMore((pagination?.page || pageToLoad) < (pagination?.totalPages || 0));
      } finally {
        inFlightRequestsRef.current.delete(requestKey);
        if (append) setIsLoadingMore(false);
      }
    },
    [dispatch, debouncedSearch, selectedStatuses, selectedLeadIds, selectedContactIds, selectedLeadOrContactIds, dateRange, sortBy, sortOrder]
  );

  useEffect(() => {
    setCurrentPage(1);
    setRenderList([]);
    setHasMore(true);
  }, [debouncedSearch, selectedStatuses, selectedLeadOrContactIds, dateRange, sortBy, sortOrder]);

  useEffect(() => {
    fetchData(currentPage, currentPage > 1);
  }, [fetchData, currentPage]);

  useEffect(() => {
    dispatch(getQuotationStatusCountsThunk());
    dispatch(getQuotationFilterOptionsThunk());
  }, [dispatch]);

  const handleStatusTabChange = (type: FilterType) => {
    setSelectedStatuses(type === 'all' ? [] : [type]);
    setCurrentPage(1);
  };

  const handleRowClick = (record: QuotationListItem) => {
    if (record.latestVersionId) {
      router.push(`${SystemRoutes.QUOTATION}/${record.latestVersionId}`);
    }
  };

  const handleExport = () => {
    exportToExcel({
      data: renderList.map(item => ({
        referenceNumber: item.referenceNumber,
        customerName: item.customerName,
        propertyAddress: item.propertyAddress,
        contactName: item.contactName,
        status: STATUS_CONFIG[item.status]?.label || item.status,
        approverName: item.approverName,
        assigneeName: item.assigneeName,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
      })),
      fileName: 'Quotations',
      sheetName: 'Quotations',
      columnHeaders: {
        referenceNumber: 'Reference ID',
        customerName: 'Customer Name',
        propertyAddress: 'Property Address',
        contactName: 'Contact',
        status: 'Status',
        approverName: 'Approver',
        assigneeName: 'Assignee',
        createdAt: 'Created At',
      },
    });
  };

  const clearAllFilters = () => {
    setSearchText('');
    setDebouncedSearch('');
    setDateRange(null);
    setSelectedStatuses([]);
    setSelectedLeadOrContactIds([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch || dateRange || selectedStatuses.length || selectedLeadOrContactIds.length
  );

  useEffect(() => {
    if (searchText) setIsSearchOpen(true);
  }, [searchText]);

  const getStatusCount = (type: FilterType): number => {
    if (type === 'all') return safeStatusCounts.total;
    if (type === 'approved') return safeStatusCounts.approved;
    if (type === 'draft' || type === 'pendingApproval') return safeStatusCounts.draft;
    if (type === 'cancelled') return safeStatusCounts.cancelled || 0;
    if (type === 'expired') return safeStatusCounts.expired || 0;
    return 0;
  };

  const columns: ColumnsType<QuotationListItem> = [
    {
      title: 'Reference ID',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      width: 160,
      render: (val: string, record) => (
        <div className="flex flex-col">
          <span className="font-medium" style={{ color: 'var(--font-color)' }}>{val || '—'}</span>
          <span className="text-[11px]" style={{ color: 'var(--font-color-100)' }}>
            {record.latestVersionNo ? `V${record.latestVersionNo}` : 'V1'}
          </span>
        </div>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180,
      ellipsis: true,
      render: (val: string) => val || '—',
    },
    {
      title: 'Property Details',
      dataIndex: 'propertyDetails',
      key: 'propertyDetails',
      width: 260,
      render: (_: string, record) => {
        const propertyDetails = record.propertyDetails || record.propertyAddress || '—';
        return (
          <Tooltip title={propertyDetails}>
            <div className="truncate max-w-[240px]">{propertyDetails}</div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Contact',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 160,
      ellipsis: true,
      render: (val: string) => val || '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (val: string) => {
        const cfg = STATUS_CONFIG[val];
        if (!cfg) return <Tag>{val}</Tag>;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bgClass}`}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: 'Quotation Total',
      dataIndex: 'quotationTotal',
      key: 'quotationTotal',
      width: 150,
      align: 'right',
      render: (val: number | string | null | undefined) => {
        const amount = Number(val ?? 0);
        return amount
          ? amount.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '—';
      },
      sorter: true,
      sortOrder: sortBy === 'quotationTotal' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (val: string) => (val ? new Date(val).toLocaleDateString('en-AU') : '—'),
      sorter: true,
      sortOrder: sortBy === 'createdAt' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Approver',
      dataIndex: 'approverName',
      key: 'approverName',
      width: 120,
      render: (val: string, record) => {
        if (record.status !== 'approved') {
          return <span style={{ color: 'var(--font-color-100)' }}>—</span>;
        }
        const fullName = val || record.approverInitials || 'Approver';
        return (
          <Tooltip title={fullName}>
            <div>
              <CustomAvtar label={fullName} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Assignee',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 120,
      render: (val: string, record) => (
        <div className="flex items-center">
          <Tooltip title={val || record.assigneeInitials || 'Assignee'}>
            <div>
              <CustomAvtar label={val || record.assigneeInitials || '?'} />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: 'var(--body-color)' }}>
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--font-color)' }}>Quotation List</h1>

          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSearchOpen ? 'w-72 sm:w-[28rem] opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <Input
                prefix={<IconSearch size={15} className="text-gray-400" />}
                placeholder="Search by reference, customer, property, contact, approver, assignee..."
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
            const isActive =
              tab.type === 'all'
                ? selectedStatuses.length === 0
                : selectedStatuses.length === 1 && selectedStatuses[0] === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => handleStatusTabChange(tab.type)}
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
                <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
                <RangePicker
                  className="w-full"
                  onChange={(_, dateStrings) => {
                    if (dateStrings[0] && dateStrings[1]) {
                      setDateRange([dateStrings[0], dateStrings[1]]);
                      setCurrentPage(1);
                    } else {
                      setDateRange(null);
                    }
                  }}
                  value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Lead / Customer</label>
                <Select
                  className="w-full"
                  mode="multiple"
                  allowClear
                  placeholder="Select lead/customer"
                  value={selectedLeadOrContactIds}
                  onChange={(vals: string[]) => {
                    setSelectedLeadOrContactIds(vals);
                    setCurrentPage(1);
                  }}
                  options={quotationFilterOptions
                    .map(option => {
                      const optionType = option.optionType || 'lead';
                      const optionId = option.optionId || option.leadId || option.leadsId;
                      if (!optionId) return null;
                      const defaultLabel = option.contactName
                        ? `${option.contactName} (${option.customerName})`
                        : option.customerName;
                      const optionLabel = option.optionLabel || defaultLabel;
                      return {
                        value: `${optionType}:${optionId}`,
                        label: optionLabel,
                      };
                    })
                    .filter(Boolean) as Array<{ value: string; label: string }>}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    String(option?.label || '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <Select
                  className="w-full"
                  mode="multiple"
                  allowClear
                  placeholder="Filter by status"
                  value={selectedStatuses}
                  onChange={(vals: FilterType[]) => {
                    setSelectedStatuses(vals.filter(v => v !== 'all'));
                    setCurrentPage(1);
                  }}
                  options={FILTER_TABS.filter(t => t.type !== 'all').map(t => ({
                    value: t.type,
                    label: t.label,
                  }))}
                />
              </Col>

              <Col xs={24} sm={24} md={8} className="flex items-end">
                {hasActiveFilters && (
                  <Button
                    danger
                    onClick={clearAllFilters}
                    icon={<IconX size={14} />}
                    className="mt-4"
                  >
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
        <Spin spinning={isLoading && currentPage === 1} tip="Loading quotations...">
          <Table<QuotationListItem>
            columns={columns}
            dataSource={renderList}
            rowKey={record => record.latestVersionId || `${record.quotationId}-${record.latestVersionNo || 0}`}
            rowClassName="cursor-pointer group hover:bg-orange-50 transition-colors"
            showSorterTooltip={false}
            scroll={{ x: 900 }}
            locale={{
              emptyText: (
                <Empty
                  description={hasActiveFilters ? 'No quotations match your filters' : 'No quotations found'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            pagination={false}
            onChange={(_, __, sorter) => {
              const sorterObj = (Array.isArray(sorter) ? sorter[0] : sorter) as SorterResult<QuotationListItem>;
              if (!sorterObj?.field || !sorterObj?.order) {
                setSortBy(undefined);
                setSortOrder(undefined);
                setCurrentPage(1);
                return;
              }
              setSortBy(String(sorterObj.field));
              setSortOrder(sorterObj.order === 'ascend' ? 'asc' : 'desc');
              setCurrentPage(1);
            }}
            onRow={record => ({
              onClick: () => handleRowClick(record),
            })}
          />

          <div className="py-3 text-center text-sm" style={{ color: 'var(--font-color-100)' }}>
            {isLoadingMore ? (
              <span className="inline-flex items-center gap-2">
                <IconLoader2 size={14} className="animate-spin" />
                Loading more quotations...
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

export default QuotationPage;
