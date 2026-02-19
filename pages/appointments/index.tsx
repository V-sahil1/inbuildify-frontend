import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import CategorySelect from '@/components/common/custom-selects/CategorySelect';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import CustomAvtar from '@/components/common/CustomAvtar';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { exportToExcel } from '@lib/utils/exportToExcel';
import { IconDots, IconDownload } from '@tabler/icons-react';
import { Button, Input, message, Popover, Switch, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { data, DataType } from 'data/appointmentData';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllAppointment } from '@redux/feature/appointment/appointmentThunk';
import { Status } from '@lib/constants/enum';
//todo : in appointment create form add link to field it's present in video but not in ui and add filter
export default function Appointments() {
  const dispatch = useAppDispatch();
  const [CancelledIncluded, setCancelledIncluded] = useState(false);
  const { appointment, status } = useAppSelector(state => state.appointment);
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['title', 'location', 'date', 'assignee', 'category', 'status'],
  });

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchAppointmentData();
    }
  }, [status.fetch]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const fetchAppointmentData = async () => {
    try {
      const params = {
        title: filters?.title,
        location_id: filters?.location,
        date: filters?.date,
        assignee: filters?.assignee,
        category: filters?.category,
        status: filters?.status,
      };
      await dispatch(fetchAllAppointment()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch appointment');
    }
  };
  const columns = [
    {
      title: (
        <div>
          <span>Title</span>
          <Input onChange={e => setParams({ title: e.target.value })} />
        </div>
      ),
      dataIndex: 'title',
      key: 'title',
      width: 150,
      render: (_, record) => (
        <div className={`${record.status === 'Cancelled' ? 'line-through' : ''}`}>
          {record.title}
        </div>
      ),
    },
    {
      title: (
        <div>
          <span>Location</span>
          <Input onChange={e => setParams({ location: e.target.value })} />
        </div>
      ),
      dataIndex: 'location',
      key: 'location',
      width: 150,
      render: location => location.name,
    },
    {
      title: (
        <div>
          <div>Date</div>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              setParams({ date: dateString });
            }}
            onClear={() => {
              console.log('Cleared date filter');
              setParams({ date: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.date}</div>
          <div>
            <Tag color="orange">{record.status}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div>
          <span>Assignee</span>
          <AssigneeSelect
            value={filters.assignee}
            onChange={value => setParams({ assignee: value })}
          />
        </div>
      ),
      dataIndex: 'selectUsers',
      key: 'selectUsers',
      width: 150,
      render: (_, record) => <CustomAvtar label={record?.selectUsers?.[0]?.name} />,
    },
    {
      title: (
        <div>
          <div>Category</div>
          <CategorySelect
            value={filters.category}
            onChange={value => setParams({ category: value })}
          />
        </div>
      ),
      // dataIndex: 'category',
      // key: 'category',
      width: 150,
    },
  ];

  const handleExport = (data: DataType[]) => {
    const column = {
      title: 'Title',
      location: 'Location',
      date: 'Date',
      status: 'Status',
      assignee: 'Assignee',
      category: 'Category',
    };
    exportToExcel({
      data,
      fileName: 'AppointmentList',
      sheetName: 'AppointmentList',
      columnHeaders: column,
    });
  };

  type FilterType = 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'pending';

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: 'today', label: 'Today', count: data.length },
    { type: 'tomorrow', label: 'Tomorrow', count: data.length },
    { type: 'this-week', label: 'This Week', count: data.length },
    { type: 'next-week', label: 'Next Week', count: data.length },
    {
      type: 'pending',
      label: 'Pending',
      count: data.filter(d => d.status === 'pending').length,
    },
  ];
  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
  };

  const PopOverContent = (
    <div className="flex gap-2">
      <p>Include Cancelled Appointment </p>
      <Switch checked={CancelledIncluded} onChange={checked => setCancelledIncluded(checked)} />
    </div>
  );
  return (
    <div className="m-2">
      <div className="flex justify-between  items-center m-3">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div>
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />
        </div>
        <div className="flex gap-2">
          <Button
            icon={<IconDownload />}
            onClick={() => {
              handleExport(data);
            }}
          >
            Export
          </Button>
          <Popover content={PopOverContent} placement="bottomRight">
            <Button icon={<IconDots className="text-primary" />}></Button>
          </Popover>
        </div>
      </div>
      {CancelledIncluded && (
        <div className="mb-1">
          <Tag color="gray" closeIcon onClose={() => setCancelledIncluded(false)}>
            Cancelled Included
          </Tag>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={appointment}
        pagination={{
          pageSize: 10,
        }}
      ></Table>
    </div>
  );
}
