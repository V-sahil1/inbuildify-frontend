import { Button, Form, Input, Tooltip } from 'antd';
import CampaignFilter from './CampaignFilter';
import { IconSearch, IconX } from '@tabler/icons-react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { data, DataType } from 'data/CampaignContactData';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { debouncedURL } from '@lib/utils/debounceURL';
const CampaignContacts = ({ current, setCurrent }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('Selected');
  const [form] = Form.useForm();
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['contact'],
  });

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 150,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 150,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: () => (
        <div>
          <Tooltip title="Remove this email id from the recipient list">
            <IconX size={15} />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleSubmit = values => {
    console.log('filter submit', values);
  };
  return (
    <div className="border border-border-color bg-card-color mt-8 p-4 mb-3">
      <Form form={form} onFinish={handleSubmit}>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-medium">Type of Contacts</h1>
          <div className="gap-2 flex">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setCurrent(current + 1);
                router.replace(`${pathname}`);
              }}
            >
              Next
            </Button>
          </div>
        </div>
        <p className="text-red-500 text-xs mb-3">
          Contacts those are having email address will be filtered and shown below
        </p>
        <CampaignFilter />
        <div>
          <div className="flex gap-8 mb-3">
            <Input
              addonBefore={<IconSearch size={20} />}
              placeholder="Search Contacts by name,email"
              style={{ width: '800px' }}
              value={instantFilters.contact}
              onChange={e => setParams({ contact: e.target.value })}
            />
            <div className="flex">
              <Button
                className={` ${activeTab === 'Selected' ? 'bg-primary' : 'bg-white text-primary'} rounded-none`}
                type="primary"
                onClick={() => setActiveTab('Selected')}
              >
                Selected
              </Button>
              <Button
                className={` ${activeTab === 'UnSelected' ? 'bg-primary' : 'bg-white text-primary'} rounded-none`}
                type="primary"
                onClick={() => setActiveTab('UnSelected')}
              >
                UnSelected
              </Button>
              <p className="ml-1 text-xs">169 contacts</p>
            </div>
          </div>
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }}></Table>
        </div>
      </Form>
    </div>
  );
};

export default CampaignContacts;
