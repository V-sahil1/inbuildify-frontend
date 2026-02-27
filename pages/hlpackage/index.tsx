import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import { IconCopy, IconDotsVertical, IconShare3, IconTable } from '@tabler/icons-react';
import { Button, Dropdown, Input, message, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CustomAvtar from '@/components/common/CustomAvtar';
import HLPackageCopyModal from '@/components/common/Models/HLPackageCopyModal';
import { data } from 'data/hlpackageData';
import Link from 'next/link';
import SystemRoutes from '@lib/constants/Routes';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { HouseLandPackage } from '@redux/feature/land/ILandState';
import { createLandPackage, fetchAllLandPackage } from '@redux/feature/land/landThunk';
import { Status } from '@lib/constants/enum';
import dayjs from 'dayjs';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';

export default function HLPackages() {
  const dispatch = useAppDispatch()
  const { package: packages, status } = useAppSelector(state => state.land)
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<'create' | 'copy' | null>(null);
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: [
      'packages',
      'lotAddress',
      'estateName',
      'facadeName',
      'floorplanName',
      'cost',
      'createdDate',
      'assignee',
    ],
  });
  const fetchAllLandPackageData = async () => {
    try {
      await dispatch(fetchAllLandPackage({})).unwrap()
    }
    catch (error) {
      message.error(error || 'Failed to fetch land package')
    }
  }

  useEffect(() => {
    if (status.package.fetch === Status.IDLE) {
      fetchAllLandPackageData()
    }
  }, [status.package.fetch])

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const columns: ColumnsType<HouseLandPackage> = [
    {
      title: (
        <div>
          <span>Package</span>
          <Input value={filters.packages} onChange={e => setParams({ packages: e.target.value })} />
        </div>
      ),
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Lot Address</span>
          <Input
            value={filters.lotAddress}
            onChange={e => setParams({ lotAddress: e.target.value })}
          />
        </div>
      ),
      width: 150,
      render: (_, record) => (
        record?.lotDetails && record?.lotDetails?.street + ',' + record?.lotDetails?.city
      )
    },
    {
      title: (
        <div>
          <span>Estate Name</span>
          <Input
            value={filters.estateName}
            onChange={e => setParams({ estateName: e.target.value })}
          />
        </div>
      ),
      width: 150,
      render: (_, record) => (
        record?.lotDetails?.estateName
      )
    },
    {
      title: (
        <div>
          <span>Facade Name</span>
          <Input
            value={filters.facadeName}
            onChange={e => setParams({ facadeName: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'facade',
      key: 'facade  ',
      width: 150,
      render: (_, record) => (
        record?.facade?.name
      )
    },
    {
      title: (
        <div>
          <span>Floor Plan Name</span>
          <Input
            value={filters.floorplanName}
            onChange={e => setParams({ floorplanName: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'floorPlan',
      key: 'floorPlan',
      width: 150,
      render: (_, record) => (
        record?.floorPlan?.name
      )
    },
    {
      title: (
        <div>
          <span>Cost</span>
          <Input value={filters.cost} onChange={e => setParams({ cost: e.target.value })} />
        </div>
      ),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Created Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              setParams({ createdDate: dateString });
            }}
            onClear={() => {
              setParams({ createdDate: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (_, record) => (
        dayjs(record.createdAt).format('DD/MM/YYYY')
      )
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
      width: 200,
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <CustomAvtar label={record?.createdByName} />
          <div className="flex gap-4 text-blue items-center">
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'Available',
                    label: 'Available',
                    onClick: () => { },
                  },
                  {
                    key: 'Delete',
                    label: 'Delete',
                    onClick: () => { },
                  },
                ],
              }}
              trigger={['click']}
            >
              <IconDotsVertical
                size={15}
                className="cursor-pointer"
                onClick={e => e.stopPropagation()}
              />
            </Dropdown>
            <Tooltip title="Copy House and Land Package">
              <IconCopy
                size={15}
                onClick={e => {
                  e.stopPropagation();
                  setIsModalOpen('copy');
                }}
                className="cursor-pointer"
              />
            </Tooltip>
            <Link href="#" onClick={e => e.stopPropagation()}>
              <IconShare3 size={15} className="cursor-pointer text-blue" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  type FilterType =
    | 'all'
    | 'available'
    | 'modified'
    | 'approved'
    | 'published'
    | 'sold'
    | 'unavailable';

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
      { type: 'all', label: 'All', count: data.length },
      { type: 'available', label: 'Available', count: data.length },
      { type: 'modified', label: 'Modified', count: data.length },
      { type: 'approved', label: 'Approved', count: data.length },
      { type: 'published', label: 'Published', count: data.length },
      { type: 'sold', label: 'Sold', count: data.length },
      { type: 'unavailable', label: 'Unavailable', count: data.length },
    ];
  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
  };

  const handleNewPackageSubmit = async (values) => {
    try {
      await dispatch(createLandPackage(values)).unwrap()
      message.success('Package created successfully')
      setIsModalOpen(null);
    }
    catch (error) {
      message.error(error || 'Failed to create package')
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">H & L Packages</h1>
        <div>
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />
        </div>
        <Space>
          <Button onClick={() => setIsModalOpen('create')}>New Package</Button>
          <div className="text-primary border border-primary p-1 rounded-lg">
            {' '}
            <IconTable />
          </div>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={packages}
        pagination={{
          pageSize: 10,
        }}
        onRow={record => ({
          style: { cursor: 'pointer' },
          onClick: () => router.push(`/${SystemRoutes.HLPACKAGE}/${record.houseLandPackageId}`),
        })}
      />

      {/* create package modal */}
      {isModalOpen === 'create' && (
        <ActionDialogmodel
          title="New Package"
          open={isModalOpen === 'create'}
          onCancel={() => setIsModalOpen(null)}
          onSubmit={handleNewPackageSubmit}
          fields={[
            {
              label: 'Title',
              name: 'title',
            },
          ]}
        />
      )}

      {/* copy package modal */}
      {isModalOpen === 'copy' && (
        <HLPackageCopyModal
          title="Copy Package"
          open={isModalOpen === 'copy'}
          onCancel={() => setIsModalOpen(null)}
          onOk={() => {
            setIsModalOpen(null);
          }}
        />
      )}
    </div>
  );
}
