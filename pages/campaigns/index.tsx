import { IconDotsVertical, IconSearch, IconShare3 } from '@tabler/icons-react';
import { Button, Input, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';
import { data, DataType } from 'data/CampaignData';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SystemRoutes from '@lib/constants/Routes';
import { debouncedURL } from '@lib/utils/debounceURL';
export default function Campaigns() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<{
    campaignName: string;
  }>({
    campaignName: searchParams.get('contact') || '',
  });
  const debouncedUpdateURL = debouncedURL();
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

  // const card = [
  //   {
  //     title: 'Created',
  //     count: '59',
  //     icon: <IconSpeakerphone size={40} />,
  //     footer: 'Last 1 month: 1',
  //   },
  //   {
  //     title: 'Sent',
  //     count: '14',
  //     icon: <IconMail size={40} />,
  //     footer: 'Last 1 month: 0(0 %)',
  //   },
  //   {
  //     title: 'Campaign Contacts',
  //     count: '4',
  //     icon: <IconBook2 size={40} />,
  //     footer: 'Last 1 month: 0(0 %)',
  //   },
  //   {
  //     title: 'Groups',
  //     count: '1',
  //     icon: <IconUsersGroup size={40} />,
  //   },
  //   {
  //     title: 'Unsubscribed',
  //     count: '0',
  //     icon: <IconBellOff size={40} />,
  //     footer: 'Last 1 month: 0(0 %)',
  //   },
  //   {
  //     title: 'Usage',
  //     count: '0%',
  //     icon: <IconBattery size={40} />,
  //     footer: 'Sent 0 out of 1000',
  //   },
  // ];
  const columns: ColumnsType<DataType> = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (_, record) => <Tag color="gray">{record.status}</Tag>,
    },
    {
      title: 'Campaign Name',
      dataIndex: 'campaignName',
      key: 'scampaignName',
      width: 150,
    },
    {
      title: 'Created User',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
    },
    {
      title: 'Sent User',
      dataIndex: 'sentBy',
      key: 'sentBy',
      width: 150,
    },
    {
      title: 'Sent Date',
      dataIndex: 'sentDate',
      key: 'sentDate',
      width: 150,
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: () => (
        <div className="flex gap-2 justify-end">
          <div>
            <IconDotsVertical size={15} />
          </div>
          <div>
            <IconShare3 size={15} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Campaigns</h1>
      {/* <div className="flex justify-between gap-3 mt-3">
        {card.map(op => (
          <div className="p-3 bg-card-color w-full">
            <p>{op.title}</p>
            <div className="flex justify-between mt-3 items-center">
              <h1 className="text-[35px] font-medium">{op.count}</h1>
              <div className=" font-bold text-primary">{op.icon}</div>
            </div>
            {op.footer && (
              <>
                <Divider className="!mb-2"></Divider>
                <p className="text-xs">{op?.footer}</p>
              </>
            )}
          </div>
        ))}
      </div> */}
      <div className="mt-6">
        <div className="flex justify-between mb-2 ">
          <div className="flex gap-2 w-[60%]">
            <Input
              addonBefore={<IconSearch size={20} />}
              value={filters.campaignName}
              onChange={e => handleFilterChange({ campaignName: e.target.value })}
              placeholder="Search Campaigns by Campaign name"
              style={{ width: '80%' }}
            />
            <p className="text-sm">54 Campaigns</p>
          </div>
          <Button type="primary" onClick={() => router.push(`${SystemRoutes.CAMPAIGN}/create`)}>
            New Campaign
          </Button>
        </div>
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
      </div>
    </div>
  );
}
