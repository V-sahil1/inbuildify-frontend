import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import CategorySelect from '@/components/common/custom-selects/CategorySelect';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import CustomAvtar from '@/components/common/CustomAvtar';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { exportToExcel } from '@lib/utils/exportToExcel';
import { IconDots, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Dropdown, Input, Popover, Switch, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { debounce } from 'lodash';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { data, DataType } from 'data/appointmentData';

export default function Appointments() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [CancelledIncluded, setCancelledIncluded] = useState(false);
  const [filters, setFilters] = useState<{
    title: string;
    location: string;
    date: string;
    assignee: string;
    category: string;
    status: string;
  }>({
    title: searchParams.get('title') || '',
    location: searchParams.get('location') || '',
    date: searchParams.get('date') || '',
    assignee: searchParams.get('assignee') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
  });

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: typeof filters) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value.toString());
          } else {
            params.delete(key);
          }
        });
        router.replace(`${pathname}?${params.toString()}`);
      }, 500), // 500ms debounce delay
    [pathname, router, searchParams]
  );

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters(prev => {
        const newFilters = { ...prev, ...updates };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const columns: ColumnsType<DataType> = [
    {
      title: (
        <div>
          <span>Title</span>
          <Input onChange={e => handleFilterChange({ ...filters, title: e.target.value })} />
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
          <Input onChange={e => handleFilterChange({ ...filters, location: e.target.value })} />
        </div>
      ),
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: (
        <div>
          <div>Date</div>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              handleFilterChange({ ...filters, date: dateString });
            }}
            onClear={() => {
              console.log('Cleared date filter');
              handleFilterChange({ ...filters, date: '' });
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
            onChange={value => handleFilterChange({ ...filters, assignee: value })}
          />
        </div>
      ),
      dataIndex: 'assignee',
      key: 'assignee',
      width: 150,
      render: (_, record) => <CustomAvtar label={record.assignee} />,
    },
    {
      title: (
        <div>
          <div>Category</div>
          <CategorySelect
            value={filters.category}
            onChange={value => handleFilterChange({ ...filters, category: value })}
          />
        </div>
      ),
      dataIndex: 'category',
      key: 'category',
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
  const [activeFilter, setActiveFilter] = useState<{
    type: FilterType;
    label: string;
    count?: number;
  }>({ type: 'today', label: 'Today' });

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
    setActiveFilter(filterOptions.find(f => f.type === selectedType) || activeFilter);
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
            tabs={filterOptions.map(f => ({ type: f.type, label: f.label, count: f.count }))}
            activeTab={activeFilter.type}
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
        dataSource={data}
        pagination={{
          pageSize: 10,
        }}
      ></Table>
    </div>
  );
}
