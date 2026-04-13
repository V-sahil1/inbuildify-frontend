import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Tooltip,
  Tag,
  Spin,
  Empty,
  Badge,
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
  IconExternalLink,
  IconBriefcase,
  IconLoader2,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { exportToExcel } from '@lib/utils/exportToExcel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getAllJobsThunk } from '@redux/feature/job/jobThunk';
import { setJobFilters, resetJobFilters } from '@redux/feature/job/jobSlice';
import { Job } from '@redux/feature/job/IJobState';
import { Status } from '@lib/constants/enum';
import SystemRoutes from '@lib/constants/Routes';
import CustomAvtar from '@/components/common/CustomAvtar';
import DynamicHorizontalChart from '@/components/common/charts/DynamicHorizontalChart';

const { RangePicker } = DatePicker;

// ── Status config ─────────────────────────────────────────────────────────────
const JOB_STATUS_CONFIG: Record<string, { bgClass: string; label: string }> = {
  'In Progress': { bgClass: 'bg-blue-100 text-blue-700',     label: 'In Progress' },
  'Completed':   { bgClass: 'bg-green-100 text-green-700',   label: 'Completed'   },
  'On Hold':     { bgClass: 'bg-orange-100 text-orange-700', label: 'On Hold'     },
  'Cancelled':   { bgClass: 'bg-red-100 text-red-700',       label: 'Cancelled'   },
  'Archived':    { bgClass: 'bg-gray-100 text-gray-600',     label: 'Archived'    },
};

const CHART_COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#ff4d4f', '#8c8c8c'];

type TabStatus = 'all' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled' | 'Archived';

const STATUS_TABS: Array<{ type: TabStatus; label: string }> = [
  { type: 'all',         label: 'All'        },
  { type: 'In Progress', label: 'In Progress' },
  { type: 'Completed',   label: 'Completed'   },
  { type: 'On Hold',     label: 'On Hold'     },
  { type: 'Cancelled',   label: 'Cancelled'   },
  { type: 'Archived',    label: 'Archived'    },
];

// ── Debounce helper ───────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [dv, setDv] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

// ─────────────────────────────────────────────────────────────────────────────
const JobPage: React.FC = () => {
  const router   = useRouter();
  const dispatch = useAppDispatch();

  // ── Redux ────────────────────────────────────────────────────────────────
  const { statusSummary, totalJobs, filters, status } =
    useAppSelector(s => s.jobList);
  const isLoading = status.list === Status.PENDING;

  // ── Local state ──────────────────────────────────────────────────────────
  const [activeStatusTab, setActiveStatusTab] = useState<TabStatus>('all');
  const [isSearchOpen,    setIsSearchOpen]    = useState(false);
  const [searchText,      setSearchText]      = useState('');
  const [showFilters,     setShowFilters]     = useState(false);
  const [sortBy,          setSortBy]          = useState<string>('created_at');
  const [sortOrder,       setSortOrder]       = useState<'asc' | 'desc'>('desc');

  // Infinite scroll state
  const [renderList,    setRenderList]    = useState<Job[]>([]);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [hasMore,       setHasMore]       = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter panel state
  const [filterStatuses,     setFilterStatuses]     = useState<string[]>([]);
  const [filterCreatedDates, setFilterCreatedDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [filterTitleDates,   setFilterTitleDates]   = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const debouncedSearch    = useDebounce(searchText, 400);
  const tableScrollRef     = useRef<HTMLDivElement | null>(null);
  const inFlightRequestsRef = useRef<Set<string>>(new Set());
  const isFirstMount        = useRef(true);
  const autoFillPagesRef    = useRef(0);

  // ── Reset list when any non-page filter changes ──────────────────────────
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setCurrentPage(1);
    setRenderList([]);
    setHasMore(true);
    autoFillPagesRef.current = 0;
  }, [
    debouncedSearch,
    filters.status,
    filters.createdAtFrom,
    filters.createdAtTo,
    filters.titleDateFrom,
    filters.titleDateTo,
    sortBy,
    sortOrder,
  ]);

  // ── Fetch (append or replace) ────────────────────────────────────────────
  const fetchData = useCallback(
    async (pageToLoad: number, append: boolean) => {
      const requestKey = JSON.stringify({ pageToLoad, filters, sortBy, sortOrder });
      if (inFlightRequestsRef.current.has(requestKey)) return;
      inFlightRequestsRef.current.add(requestKey);
      if (append) setIsLoadingMore(true);
      try {
        const payload: any = await dispatch(
          getAllJobsThunk({
            ...filters,
            page:      pageToLoad,
            limit:     filters.limit ?? 25,
            sortBy,
            sortOrder,
          })
        ).unwrap();

        const nextJobs: Job[]  = payload?.jobs ?? [];
        const pagination       = payload?.pagination ?? { page: pageToLoad, totalPages: 0 };

        setRenderList(prev => {
          if (!append) return nextJobs;
          const merged = [...prev, ...nextJobs];
          const byId   = new Map(merged.map(j => [j.jobId, j]));
          return Array.from(byId.values());
        });
        setHasMore((pagination.page ?? pageToLoad) < (pagination.totalPages ?? 0));
      } catch {
        // error handled in slice
      } finally {
        inFlightRequestsRef.current.delete(requestKey);
        if (append) setIsLoadingMore(false);
      }
    },
    [dispatch, filters, sortBy, sortOrder],
  );

  // Fire whenever currentPage changes or fetchData is recreated (filter change)
  useEffect(() => {
    fetchData(currentPage, currentPage > 1);
  }, [fetchData, currentPage]);

  // Sync debouncedSearch → Redux filter
  useEffect(() => {
    dispatch(setJobFilters({ search: debouncedSearch, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep search panel open while typing
  useEffect(() => {
    if (searchText) setIsSearchOpen(true);
  }, [searchText]);

  // ── Scroll handler for infinite loading ─────────────────────────────────
  const tryLoadMoreFromScroll = useCallback(
    (el: HTMLElement) => {
      const { scrollHeight, scrollTop, clientHeight } = el;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 150;
      if (nearBottom && hasMore && !isLoadingMore && !isLoading) {
        setCurrentPage(prev => prev + 1);
      }
    },
    [hasMore, isLoadingMore, isLoading],
  );

  /** Ant Design table body is the scroll container when `scroll.y` is set */
  useEffect(() => {
    const root = tableScrollRef.current;
    if (!root) return;
    const body = root.querySelector('.ant-table-body') as HTMLElement | null;
    if (!body) return;
    const onScroll = () => tryLoadMoreFromScroll(body);
    body.addEventListener('scroll', onScroll, { passive: true });
    return () => body.removeEventListener('scroll', onScroll);
  }, [tryLoadMoreFromScroll, renderList.length, isLoading]);

  /** If the viewport is not scrollable but more pages exist, fetch until it scrolls or cap is hit */
  useEffect(() => {
    if (!hasMore) {
      autoFillPagesRef.current = 0;
      return;
    }
    if (renderList.length === 0) {
      autoFillPagesRef.current = 0;
      return;
    }
    if (isLoadingMore || isLoading) return;
    const root = tableScrollRef.current;
    const body = root?.querySelector('.ant-table-body') as HTMLElement | null;
    if (!body) return;
    if (body.scrollHeight <= body.clientHeight + 2) {
      if (autoFillPagesRef.current >= 8) return;
      autoFillPagesRef.current += 1;
      setCurrentPage(p => p + 1);
    } else {
      autoFillPagesRef.current = 0;
    }
  }, [renderList.length, hasMore, isLoadingMore, isLoading]);

  // ── Status tab ───────────────────────────────────────────────────────────
  const handleStatusTab = (tab: TabStatus) => {
    setActiveStatusTab(tab);
    if (tab === 'all') setFilterStatuses([]);
    else setFilterStatuses([tab]);
    dispatch(setJobFilters({ status: tab === 'all' ? '' : tab, page: 1 }));
  };

  // Chart bar click
  const handleBarClick = (label: string) => {
    const found = STATUS_TABS.find(t => t.label.toLowerCase() === label.toLowerCase());
    if (found) handleStatusTab(found.type);
  };

  // ── Sort via table header ────────────────────────────────────────────────
  const handleTableChange = (
    _pg: any,
    _f: Record<string, any>,
    sorter: SorterResult<Job> | SorterResult<Job>[],
  ) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (!s?.order) return;
    setSortBy((s.field as string) || sortBy);
    setSortOrder(s.order === 'ascend' ? 'asc' : 'desc');
  };

  // ── Push advanced filter panel to Redux immediately (no Apply button) ───
  const commitFilterPanel = useCallback(
    (overrides?: {
      statuses?: string[];
      created?: [dayjs.Dayjs | null, dayjs.Dayjs | null];
      title?: [dayjs.Dayjs | null, dayjs.Dayjs | null];
    }) => {
      const statuses = overrides?.statuses ?? filterStatuses;
      const created  = overrides?.created ?? filterCreatedDates;
      const title    = overrides?.title ?? filterTitleDates;
      const [cf, ct] = created;
      const [tf, tt] = title;
      dispatch(
        setJobFilters({
          status:        statuses.length ? statuses.join(',') : '',
          createdAtFrom: cf ? cf.toISOString() : '',
          createdAtTo:   ct ? ct.toISOString() : '',
          titleDateFrom: tf ? tf.toISOString() : '',
          titleDateTo:   tt ? tt.toISOString() : '',
          page:          1,
        }),
      );
      if (statuses.length === 1) setActiveStatusTab(statuses[0] as TabStatus);
      else setActiveStatusTab('all');
    },
    [dispatch, filterCreatedDates, filterTitleDates, filterStatuses],
  );

  const clearAllFilters = () => {
    setFilterStatuses([]);
    setFilterCreatedDates([null, null]);
    setFilterTitleDates([null, null]);
    setSearchText('');
    setIsSearchOpen(false);
    setActiveStatusTab('all');
    dispatch(resetJobFilters());
  };

  const hasActiveFilters =
    !!filters.search        ||
    !!filters.status        ||
    !!filters.createdAtFrom ||
    !!filters.createdAtTo   ||
    !!filters.titleDateFrom ||
    !!filters.titleDateTo;

  // ── Export ───────────────────────────────────────────────────────────────
  const handleExport = () => {
    exportToExcel({
      data: renderList.map(j => ({
        referenceNumber: j.referenceNumber,
        customerName:    j.customerName,
        jobAddress:      j.jobAddress,
        createdAt:       j.createdAt ? new Date(j.createdAt).toLocaleDateString() : '',
        titleDate:       j.titleDate || '',
        estateName:      j.estateName || '',
        consultant:      j.consultantName || '',
        status:          j.status,
      })),
      fileName:      'Jobs',
      sheetName:     'Jobs',
      columnHeaders: {
        referenceNumber: 'Reference ID',
        customerName:    'Customer Name',
        jobAddress:      'Job Address',
        createdAt:       'Created Date',
        titleDate:       'Title Date',
        estateName:      'Estate Name',
        consultant:      'Consultant',
        status:          'Status',
      },
    });
  };

  // ── Status counts ────────────────────────────────────────────────────────
  const getStatusCount = (tab: TabStatus): number => {
    if (tab === 'all') return Object.values(statusSummary).reduce((a, b) => a + b, 0);
    return statusSummary[tab as keyof typeof statusSummary] ?? 0;
  };

  // ── Chart data ────────────────────────────────────────────────────────────
  const chartCategories = ['In Progress', 'Completed', 'On Hold', 'Cancelled', 'Archived'];
  const chartData = chartCategories.map(c => statusSummary[c as keyof typeof statusSummary] ?? 0);

  // ── Columns ───────────────────────────────────────────────────────────────
  // All columns have fixed widths so layout never shifts when sort arrows appear.
  const columns: ColumnsType<Job> = [
    {
      title:     'Reference ID',
      dataIndex: 'referenceNumber',
      key:       'reference_id',
      width:     150,
      sorter:    true,
      sortOrder: sortBy === 'reference_id' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (val: string) => (
        <span className="font-mono text-sm font-semibold" style={{ color: 'var(--primary)' }}>
          {val}
        </span>
      ),
    },
    {
      title:     'Customer Name',
      dataIndex: 'customerName',
      key:       'customer_name',
      width:     180,
      sorter:    true,
      sortOrder: sortBy === 'customer_name' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (val: string) => <span className="font-medium">{val || '—'}</span>,
    },
    {
      title:    'Job Address',
      dataIndex: 'jobAddress',
      key:       'job_address',
      width:     220,
      render: (val: string) => {
        const display = val && val !== 'N/A' ? val : '—';
        const tip     = val && val !== 'N/A' ? val : undefined;
        return (
          <div className="min-w-0 max-w-full">
            <Tooltip
              title={tip}
              placement="topLeft"
              mouseEnterDelay={0.2}
              getPopupContainer={trigger =>
                (trigger.closest('.ant-table-wrapper') as HTMLElement) || document.body
              }
              align={{ offset: [0, -6] }}
            >
              <span className="block w-full truncate cursor-default align-middle">
                {display}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title:            'Created Date',
      dataIndex:        'createdAt',
      key:              'created_at',
      width:            130,
      sorter:           true,
      defaultSortOrder: 'descend',
      sortOrder:        sortBy === 'created_at' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString('en-AU') : '—',
    },
    {
      title:     'Title Date',
      dataIndex: 'titleDate',
      key:       'title_date',
      width:     120,
      sorter:    true,
      sortOrder: sortBy === 'title_date' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString('en-AU') : '—',
    },
    {
      title:     'Estate Name',
      dataIndex: 'estateName',
      key:       'estate_name',
      width:     160,
      sorter:    true,
      sortOrder: sortBy === 'estate_name' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (val: string) => val || '—',
    },
    {
      title: 'Consultant',
      key:   'consultant',
      width: 120,
      render: (_: unknown, record: Job) => (
        <div className="flex items-center justify-between gap-2">
          <Tooltip title={record.consultantName || 'Unassigned'}>
            <div>
              <CustomAvtar label={record.consultantName || '?'} />
            </div>
          </Tooltip>
          <button
            onClick={e => {
              e.stopPropagation();
              router.push(`${SystemRoutes.JOB}/${record.jobId}`);
            }}
            className="text-blue-500 hover:text-blue-700 flex-shrink-0"
          >
            <IconExternalLink size={16} />
          </button>
        </div>
      ),
    },
    {
      title:     'Status',
      dataIndex: 'status',
      key:       'status',
      width:     130,
      sorter:    true,
      sortOrder: sortBy === 'status' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (val: string) => {
        const cfg = JOB_STATUS_CONFIG[val];
        if (!cfg) return <Tag>{val}</Tag>;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cfg.bgClass}`}
          >
            {cfg.label}
          </span>
        );
      },
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: 'var(--body-color)' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--font-color)' }}>
            Job List
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSearchOpen ? 'w-64 sm:w-[22rem] opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <Input
                prefix={<IconSearch size={15} className="text-gray-400" />}
                placeholder="Search by reference, customer, email, estate…"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                allowClear
                suffix={
                  <IconX
                    size={14}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSearchText('');
                      setIsSearchOpen(false);
                    }}
                  />
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
          </div>
        </div>

        {/* ── Status tabs ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-3">
          {STATUS_TABS.map(tab => {
            const count    = getStatusCount(tab.type);
            const isActive = activeStatusTab === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => handleStatusTab(tab.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-[--primary] text-white border-[--primary] shadow-sm'
                    : 'hover:border-[--primary] hover:text-[--primary]'
                }`}
                style={
                  isActive
                    ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }
                    : {
                        backgroundColor: 'var(--card-color)',
                        color:           'var(--font-color-100)',
                        borderColor:     'var(--border-color)',
                      }
                }
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs"
                    style={
                      isActive
                        ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }
                        : { backgroundColor: 'var(--primary-10)', color: 'var(--font-color-100)' }
                    }
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Filter panel ─────────────────────────────────────────────── */}
        {showFilters && (
          <div
            className="rounded-lg p-4 mb-3"
            style={{
              backgroundColor: 'var(--card-color)',
              border:          '1px solid var(--border-color)',
            }}
          >
            <Row gutter={[16, 12]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: 'var(--font-color-100)' }}
                >
                  Status
                </label>
                <Select
                  className="w-full"
                  mode="multiple"
                  allowClear
                  placeholder="Filter by status"
                  value={filterStatuses}
                  onChange={(vals: string[]) => {
                    setFilterStatuses(vals);
                    commitFilterPanel({ statuses: vals });
                  }}
                  options={Object.keys(JOB_STATUS_CONFIG).map(s => ({
                    label: s,
                    value: s,
                  }))}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: 'var(--font-color-100)' }}
                >
                  Created Date Range
                </label>
                <RangePicker
                  style={{ width: '100%' }}
                  value={filterCreatedDates}
                  onChange={dates => {
                    const next = dates ? [dates[0], dates[1]] : [null, null];
                    setFilterCreatedDates(next as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
                    commitFilterPanel({ created: next as [dayjs.Dayjs | null, dayjs.Dayjs | null] });
                  }}
                  format="DD/MM/YYYY"
                  allowEmpty={[true, true]}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: 'var(--font-color-100)' }}
                >
                  Title Date Range
                </label>
                <RangePicker
                  style={{ width: '100%' }}
                  value={filterTitleDates}
                  onChange={dates => {
                    const next = dates ? [dates[0], dates[1]] : [null, null];
                    setFilterTitleDates(next as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
                    commitFilterPanel({ title: next as [dayjs.Dayjs | null, dayjs.Dayjs | null] });
                  }}
                  format="DD/MM/YYYY"
                  allowEmpty={[true, true]}
                />
              </Col>

              <Col xs={24} className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button danger icon={<IconX size={14} />} onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        )}
      </div>

      {/* ── Widgets ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

        {/* Widget 1 — Total Jobs */}
        <div
          className="rounded-xl p-5 flex items-center gap-4 min-w-0"
          style={{
            backgroundColor: 'var(--card-color)',
            border:          '1px solid var(--border-color)',
          }}
        >
          <div
            className="rounded-full p-3 flex-shrink-0"
            style={{ backgroundColor: 'var(--primary-10)' }}
          >
            <IconBriefcase size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="min-w-0">
            <p
              className="text-xs uppercase tracking-wide font-medium truncate"
              style={{ color: 'var(--font-color-100)' }}
            >
              Total Jobs
            </p>
            <p className="text-3xl font-bold leading-tight" style={{ color: 'var(--font-color)' }}>
              {isLoading && totalJobs === 0 ? '—' : totalJobs}
            </p>
            <p
              className="text-xs mt-0.5 truncate"
              style={{ color: 'var(--font-color-100)' }}
            >
              All-time across all statuses
            </p>
          </div>
        </div>

        {/* Widget 2 — Status Overview chart */}
        <div
          className="rounded-xl overflow-hidden min-w-0"
          style={{
            backgroundColor: 'var(--card-color)',
            border:          '1px solid var(--border-color)',
          }}
        >
          <DynamicHorizontalChart
            title="Job Status Overview"
            seriesName="Jobs"
            categories={chartCategories}
            chartType="bar"
            seriesData={chartData}
            onBarClick={handleBarClick}
            colors={CHART_COLORS}
            height={160}
          />
        </div>
      </div>

      {/* ── Table with infinite scroll ──────────────────────────────────── */}
      <div
        ref={tableScrollRef}
        className="rounded-lg shadow-sm"
        style={{
          backgroundColor: 'var(--card-color)',
          border:          '1px solid var(--border-color)',
        }}
      >
        <Spin spinning={isLoading && currentPage === 1} tip="Loading jobs…">
          <Table<Job>
            columns={columns}
            dataSource={renderList}
            rowKey="jobId"
            tableLayout="fixed"
            scroll={{ x: 1050, y: 'calc(70vh - 220px)' }}
            pagination={false}
            showSorterTooltip={false}
            onChange={handleTableChange}
            onRow={record => ({
              onClick: () => router.push(`${SystemRoutes.JOB}/${record.jobId}`),
              style:   { cursor: 'pointer' },
            })}
            locale={{
              emptyText: (
                <Empty
                  description={
                    hasActiveFilters ? 'No jobs match your filters' : 'No jobs found'
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            className="job-listing-table"
            size="middle"
          />

          {/* Infinite scroll footer */}
          <div
            className="py-3 text-center text-sm"
            style={{ color: 'var(--font-color-100)' }}
          >
            {isLoadingMore ? (
              <span className="inline-flex items-center gap-2">
                <IconLoader2 size={14} className="animate-spin" />
                Loading more jobs…
              </span>
            ) : hasMore && renderList.length > 0 ? (
              'Scroll to load more'
            ) : renderList.length > 0 ? (
              'You\'ve reached the end'
            ) : null}
          </div>
        </Spin>
      </div>

      {/* ── Table styles — dark mode + sort stability ────────────────────── */}
      <style jsx global>{`
        /* ── Column sort: always reserve space for the sorter arrows so the
           header width never changes when a sort is activated/deactivated. ── */
        .job-listing-table .ant-table-column-sorters {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 4px !important;
          width: 100% !important;
        }
        .job-listing-table .ant-table-column-sorter {
          flex-shrink: 0 !important;
          visibility: visible !important;
          opacity: 0.35;
          transition: opacity 0.2s;
        }
        .job-listing-table th:hover .ant-table-column-sorter,
        .job-listing-table .ant-table-column-sort .ant-table-column-sorter {
          opacity: 1;
        }
        /* Prevent column title text from wrapping/shifting */
        .job-listing-table .ant-table-column-title {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        /* ── Header ──────────────────────────────────────────────────────── */
        .job-listing-table .ant-table-thead > tr > th {
          background-color: var(--body-color) !important;
          color: var(--font-color) !important;
          border-bottom: 1px solid var(--border-color) !important;
          white-space: nowrap;
        }
        /* Sort state: keep header chrome identical; only sorter arrows show active sort */
        .job-listing-table .ant-table-thead > tr > th.ant-table-column-sort {
          background-color: var(--body-color) !important;
        }
        .job-listing-table .ant-table-thead > tr > th.ant-table-column-sort:hover {
          background-color: var(--body-color) !important;
        }
        .job-listing-table .ant-table-thead > tr > th::before {
          background-color: var(--border-color) !important;
        }

        /* ── Body rows ───────────────────────────────────────────────────── */
        .job-listing-table .ant-table-tbody > tr > td {
          background-color: var(--card-color) !important;
          color: var(--font-color) !important;
          border-bottom: 1px solid var(--border-color) !important;
        }
        .job-listing-table .ant-table-tbody > tr:hover > td {
          background-color: var(--primary-10) !important;
        }
        .job-listing-table .ant-table {
          background-color: var(--card-color) !important;
        }

        /* ── Sorter icons ────────────────────────────────────────────────── */
        .job-listing-table .ant-table-column-sorter-up,
        .job-listing-table .ant-table-column-sorter-down {
          color: var(--font-color-400) !important;
        }
        .job-listing-table .ant-table-column-sorter-up.active,
        .job-listing-table .ant-table-column-sorter-down.active {
          color: var(--primary) !important;
        }

        /* ── Empty state ─────────────────────────────────────────────────── */
        .job-listing-table .ant-empty-description {
          color: var(--font-color-100) !important;
        }

        /* ── Spin overlay ────────────────────────────────────────────────── */
        .job-listing-table .ant-spin-container {
          background-color: var(--card-color) !important;
        }
      `}</style>
    </div>
  );
};

export default JobPage;
