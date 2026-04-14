import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import CustomAvtar from '@/components/common/CustomAvtar';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { CreateAppointmentModal } from '@/components/common/Models/createAppointementModel';
import { exportToExcel } from '@lib/utils/exportToExcel';
import { IconDots, IconDownload, IconPlus } from '@tabler/icons-react';
import { Button, Input, message, Popover, Spin, Switch, Table, Tag, Tooltip } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createAppointment,
  fetchAllAppointment,
  fetchAppointmentTabCounts,
  updateAppointment,
  FetchAppointmentParams,
} from '@redux/feature/appointment/appointmentThunk';
import { resetAppointmentFetch } from '@redux/feature/appointment/appointmentSlice';
import { Status } from '@lib/constants/enum';
import dayjs from 'dayjs';
import { IAppointment } from '@redux/feature/appointment/IAppointmentState';

const PAGE_LIMIT = 25;

export default function Appointments() {
  const dispatch = useAppDispatch();
  const { appointment, status, pagination, tabCounts } = useAppSelector(
    state => state.appointment
  );

  // ── Filters ──────────────────────────────────────────────────────────────
  const [titleFilter, setTitleFilter] = useState('');
  const [locationTextFilter, setLocationTextFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState<string | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<string | undefined>(() =>
    dayjs().startOf('day').toISOString()
  );
  const [dateTo, setDateTo] = useState<string | undefined>(() =>
    dayjs().endOf('day').toISOString()
  );
  // Track whether the date range was set by the quick-tab or the column picker
  // so we only show a dismissible date chip for column-sourced ranges.
  const [dateFilterSource, setDateFilterSource] = useState<'quick-tab' | 'column' | null>(
    'quick-tab'
  );
  const [includeCancelled, setIncludeCancelled] = useState(false);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<IAppointment | undefined>(
    undefined
  );

  // ── Scroll ref ────────────────────────────────────────────────────────────
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

  // ── Param builders ────────────────────────────────────────────────────────
  const buildListParams = useCallback(
    (page: number): FetchAppointmentParams => ({
      page,
      limit: PAGE_LIMIT,
      ...(titleFilter ? { title: titleFilter } : {}),
      ...(locationTextFilter.trim() ? { locationText: locationTextFilter.trim() } : {}),
      ...(assigneeFilter ? { assignee_id: assigneeFilter } : {}),
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
      ...(includeCancelled ? { include_cancelled: true } : {}),
    }),
    [titleFilter, locationTextFilter, assigneeFilter, dateFrom, dateTo, includeCancelled]
  );

  const buildCountParams = useCallback(
    () => ({
      anchor_date: dayjs().format('YYYY-MM-DD'),
      ...(titleFilter ? { title: titleFilter } : {}),
      ...(assigneeFilter ? { assignee_id: assigneeFilter } : {}),
      ...(includeCancelled ? { include_cancelled: true } : {}),
    }),
    [titleFilter, assigneeFilter, includeCancelled]
  );

  // ── Fetch list (page 1 replaces, page N appends) ──────────────────────────
  const fetchPage1 = useCallback(() => {
    dispatch(resetAppointmentFetch());
    dispatch(fetchAllAppointment(buildListParams(1))).catch(() =>
      message.error('Failed to fetch appointments')
    );
  }, [dispatch, buildListParams]);

  useEffect(() => {
    fetchPage1();
    return () => {
      dispatch(resetAppointmentFetch());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleFilter, locationTextFilter, assigneeFilter, dateFrom, dateTo, includeCancelled]);

  // ── Fetch tab counts (re-run when contextual filters change) ──────────────
  useEffect(() => {
    dispatch(fetchAppointmentTabCounts(buildCountParams()));
  }, [dispatch, buildCountParams]);

  // ── Infinite scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;

    const tableBody = wrapper.querySelector<HTMLElement>('.ant-table-body');
    if (!tableBody) return;

    const handleScroll = () => {
      if (loadingMoreRef.current) return;
      if (!pagination.hasMore) return;
      if (status.loadMore === Status.PENDING) return;

      const { scrollTop, scrollHeight, clientHeight } = tableBody;
      if (scrollHeight - scrollTop - clientHeight < 120) {
        loadingMoreRef.current = true;
        dispatch(fetchAllAppointment(buildListParams(pagination.currentPage + 1)))
          .unwrap()
          .catch(() => message.error('Failed to load more appointments'))
          .finally(() => {
            loadingMoreRef.current = false;
          });
      }
    };

    tableBody.addEventListener('scroll', handleScroll);
    return () => tableBody.removeEventListener('scroll', handleScroll);
  }, [dispatch, pagination, status.loadMore, buildListParams]);

  // ── Date filter from column picker ────────────────────────────────────────
  const handleDateFilter = (_: string, dates?: [dayjs.Dayjs, dayjs.Dayjs]) => {
    setDateFilterSource('column');
    if (dates && dates.length === 2) {
      setDateFrom(dates[0].toISOString());
      setDateTo(dates[1].toISOString());
    } else {
      setDateFrom(undefined);
      setDateTo(undefined);
      setDateFilterSource(null);
    }
  };

  // ── Quick-filter tab handler ──────────────────────────────────────────────
  const handleFilterTabChange = (selectedType: string) => {
    setDateFilterSource('quick-tab');
    const today = dayjs();
    switch (selectedType) {
      case 'all':
        setDateFrom(undefined);
        setDateTo(undefined);
        break;
      case 'today':
        setDateFrom(today.startOf('day').toISOString());
        setDateTo(today.endOf('day').toISOString());
        break;
      case 'tomorrow': {
        const tomorrow = today.add(1, 'day');
        setDateFrom(tomorrow.startOf('day').toISOString());
        setDateTo(tomorrow.endOf('day').toISOString());
        break;
      }
      case 'this-week':
        setDateFrom(today.startOf('week').toISOString());
        setDateTo(today.endOf('week').toISOString());
        break;
      case 'next-week': {
        const nextWeekStart = today.add(1, 'week').startOf('week');
        setDateFrom(nextWeekStart.toISOString());
        setDateTo(nextWeekStart.endOf('week').toISOString());
        break;
      }
      case 'pending':
        setDateFrom(today.startOf('day').toISOString());
        setDateTo(undefined);
        break;
      default:
        setDateFrom(undefined);
        setDateTo(undefined);
        setDateFilterSource(null);
    }
  };

  // ── Add / Edit ────────────────────────────────────────────────────────────
  const handleAddAppointment = () => {
    setEditingAppointment(undefined);
    setModalOpen(true);
  };

  const handleEditAppointment = (record: IAppointment) => {
    setEditingAppointment(record);
    setModalOpen(true);
  };

  const handleModalSubmit = async (appointmentData: Partial<IAppointment>) => {
    try {
      if (editingAppointment) {
        await dispatch(
          updateAppointment({ id: editingAppointment.appointmentId, data: appointmentData })
        ).unwrap();
        message.success('Appointment updated');
      } else {
        await dispatch(createAppointment(appointmentData as IAppointment)).unwrap();
        message.success('Appointment created');
      }
      setModalOpen(false);
      setEditingAppointment(undefined);
      // Refresh counts after mutation
      dispatch(fetchAppointmentTabCounts(buildCountParams()));
    } catch (err: any) {
      message.error(err || 'Failed to save appointment');
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const exportData = appointment.map(a => ({
      title: a.title,
      location: a.locationText?.trim() || '',
      date: a.date ? dayjs(a.date).format('DD-MM-YYYY') : '',
      startTime: a.startTime,
      endTime: a.endTime,
      status: a.isDeleted ? 'Cancelled' : 'Active',
      assignee: Array.isArray(a.selectUsers)
        ? (a.selectUsers as any[]).map(u => (typeof u === 'object' ? u?.name : u)).join(', ')
        : '',
    }));
    exportToExcel({
      data: exportData,
      fileName: 'AppointmentList',
      sheetName: 'AppointmentList',
      columnHeaders: {
        title: 'Title',
        location: 'Location',
        date: 'Date',
        startTime: 'Start Time',
        endTime: 'End Time',
        status: 'Status',
        assignee: 'Assignee',
      },
    });
  };

  // ── filterOptions with live counts ────────────────────────────────────────
  type FilterType = 'all' | 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'pending';

  const filterOptions: Array<{ type: FilterType; label: string; count: number }> = useMemo(
    () => [
      { type: 'all', label: 'All', count: tabCounts.all },
      { type: 'today', label: 'Today', count: tabCounts.today },
      { type: 'tomorrow', label: 'Tomorrow', count: tabCounts.tomorrow },
      { type: 'this-week', label: 'This Week', count: tabCounts.thisWeek },
      { type: 'next-week', label: 'Next Week', count: tabCounts.nextWeek },
      { type: 'pending', label: 'Pending', count: tabCounts.pending },
    ],
    [tabCounts]
  );

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Title</span>
          <Input
            size="middle"
            value={titleFilter}
            placeholder="Search title…"
            onChange={e => setTitleFilter(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (_: any, record: IAppointment) => (
        <span className={record.isDeleted ? 'line-through text-gray-400' : ''}>
          {record.title}
        </span>
      ),
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Location</span>
          <Input
            size="middle"
            value={locationTextFilter}
            placeholder="Search location…"
            onChange={e => setLocationTextFilter(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: 'locationText',
      key: 'locationText',
      width: 160,
      render: (val: string) => val?.trim() || '-',
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Date</span>
          <DateFilterDropdown
            onFilter={handleDateFilter}
            onClear={() => {
              setDateFrom(undefined);
              setDateTo(undefined);
              setDateFilterSource(null);
            }}
          />
        </div>
      ),
      dataIndex: 'date',
      key: 'date',
      width: 175,
      render: (_: any, record: IAppointment) => (
        <div>
          <div>{record.date ? dayjs(record.date).format('DD-MM-YYYY') : '-'}</div>
          <div className="text-xs text-gray-500">
            {record.startTime?.slice(0, 5)} – {record.endTime?.slice(0, 5)}
          </div>
          {record.isDeleted && (
            <Tag color="default" className="mt-1">
              Cancelled
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Assignee</span>
          <AssigneeSelect
            value={assigneeFilter}
            onChange={(value: string) => setAssigneeFilter(value || undefined)}
          />
        </div>
      ),
      dataIndex: 'selectUsers',
      key: 'selectUsers',
      width: 180,
      render: (_: any, record: IAppointment) => {
        const users = record.selectUsers as any[];
        if (!users || users.length === 0) return '-';
        const getName = (u: any) =>
          typeof u === 'object' && u?.name != null ? String(u.name) : String(u ?? '');
        const visible = users.slice(0, 2);
        const rest = users.slice(2);
        return (
          <div className="flex flex-wrap gap-1 items-center">
            {visible.map((user, idx) => {
              const name = getName(user);
              return (
                <Tooltip key={idx} title={name}>
                  <span className="inline-flex cursor-default">
                    <CustomAvtar label={name || '?'} />
                  </span>
                </Tooltip>
              );
            })}
            {rest.length > 0 && (
              <Tooltip title={rest.map(getName).join(', ')}>
                <span className="text-xs text-gray-500 cursor-default">+{rest.length}</span>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 180,
      render: (notes: string) =>
        notes ? (
          <Tooltip title={notes} overlayStyle={{ maxWidth: 360 }}>
            <div className="line-clamp-2 break-words max-w-[180px] cursor-default">{notes}</div>
          </Tooltip>
        ) : (
          '-'
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      render: (_: any, record: IAppointment) => (
        <Button size="small" type="link" onClick={() => handleEditAppointment(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const isInitialLoading = status.fetch === Status.PENDING;
  const isLoadingMore = status.loadMore === Status.PENDING;
  const isCreating = status.create === Status.PENDING;

  const PopOverContent = (
    <div className="flex gap-2 items-center">
      <span>Include Cancelled Appointments</span>
      <Switch checked={includeCancelled} onChange={checked => setIncludeCancelled(checked)} />
    </div>
  );

  return (
    <div className="m-2">
      {/* ── Header ── */}
      <div className="flex justify-between items-center m-3 gap-4">
        <h1 className="text-2xl font-bold shrink-0">Appointments</h1>

        {/* Quick-filter tabs with live counts */}
        <div className="flex-1 min-w-0">
          <TimelineActionsBar
            tabs={filterOptions}
            defaultActiveTab="today"
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow
          />
        </div>

        <div className="flex gap-2 shrink-0">
          <Button type="primary" icon={<IconPlus size={16} />} onClick={handleAddAppointment}>
            Add Appointment
          </Button>
          <Button icon={<IconDownload size={16} />} onClick={handleExport}>
            Export
          </Button>
          <Popover content={PopOverContent} placement="bottomRight" trigger="click">
            <Button icon={<IconDots className="text-primary" />} />
          </Popover>
        </div>
      </div>

      {/* ── Active filter tags ── */}
      <div className="flex flex-wrap gap-2 mx-3 mb-2">
        {includeCancelled && (
          <Tag color="default" closeIcon onClose={() => setIncludeCancelled(false)}>
            Cancelled Included
          </Tag>
        )}
        {dateFilterSource === 'column' && (dateFrom || dateTo) && (
          <Tag
            color="blue"
            closeIcon
            onClose={() => {
              setDateFrom(undefined);
              setDateTo(undefined);
              setDateFilterSource(null);
            }}
          >
            {dateFrom ? dayjs(dateFrom).format('DD-MM-YYYY') : ''}
            {dateFrom && dateTo ? ' – ' : ''}
            {dateTo ? dayjs(dateTo).format('DD-MM-YYYY') : ''}
          </Tag>
        )}
        {assigneeFilter && (
          <Tag color="green" closeIcon onClose={() => setAssigneeFilter(undefined)}>
            Assignee filtered
          </Tag>
        )}
        {pagination.totalRecords > 0 && (
          <span className="text-xs self-center" style={{ color: 'var(--font-color-100)' }}>
            {appointment.length} / {pagination.totalRecords} records
          </span>
        )}
      </div>

      {/* ── Table with infinite scroll ── */}
      <div ref={tableWrapperRef}>
        <Table
          columns={columns}
          dataSource={appointment}
          rowKey="appointmentId"
          loading={isInitialLoading}
          pagination={false}
          scroll={{ y: 'calc(100vh - 320px)' }}
          footer={
            isLoadingMore
              ? () => (
                  <div className="flex justify-center py-3">
                    <Spin size="small" tip="Loading more…" />
                  </div>
                )
              : !pagination.hasMore && appointment.length > 0
              ? () => (
                  <div
                    className="text-center text-xs py-2"
                    style={{ color: 'var(--font-color-100)' }}
                  >
                    All {pagination.totalRecords} records loaded
                  </div>
                )
              : undefined
          }
        />
      </div>

      {/* ── Add / Edit Appointment Modal ── */}
      <CreateAppointmentModal
        open={modalOpen}
        title={editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
        loading={isCreating}
        initialData={editingAppointment}
        onClose={() => {
          setModalOpen(false);
          setEditingAppointment(undefined);
        }}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
