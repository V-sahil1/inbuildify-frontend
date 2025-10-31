import { IconDotsVertical } from '@tabler/icons-react';
import { Button, Dropdown, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { JobVariationDataType } from 'data/types';

type JobVariationProps = {
  data: JobVariationDataType[];
  setActiveScreen: (screen: 'list' | 'createVariation') => void;
};
const JobVariation: React.FC<JobVariationProps> = ({ data, setActiveScreen }) => {
  const columns: TableColumnsType<JobVariationDataType> = [
    {
      title: 'Reference ID',
      dataIndex: 'ReferenceID',
      key: 'ReferenceID',
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
    },
    {
      title: 'Requested By',
      dataIndex: 'RequestedBy',
      key: 'RequestedBy',
    },
    {
      title: 'Delayed By',
      dataIndex: 'DelayedBy',
      key: 'DelayedBy',
    },
    {
      title: 'Drawing Changes Required',
      dataIndex: 'DrawingChanges',
      key: 'DrawingChanges',
    },
    {
      title: 'Created',
      dataIndex: 'Created',
      key: 'Created',
      render: (_, record) => {
        return (
          <div>
            <div className="flex justify-center items-center my-2">
              <div className="rounded-full w-8 h-8 flex justify-center text-xs items-center bg-gray-200">
                {record.Created.user}
              </div>
            </div>
            <div>
              {new Date(record.Created.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Approved',
      dataIndex: 'Approved',
      key: 'Approved',
      render: (_, record) => {
        return (
          <div>
            <div className="flex justify-center items-center my-2">
              <div className="rounded-full w-8 h-8 flex justify-center items-center text-xs bg-gray-200">
                {record.Approved.user}
              </div>
            </div>
            <div>
              {new Date(record.Approved.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (_, record) => (
        <>
          <Tag color={`${record.Status == 'Approved' ? 'green' : 'grey'}`} key={record.Status}>
            {record.Status.toUpperCase()}
          </Tag>
        </>
      ),
    },
    {
      title: 'Invoice',
      dataIndex: 'Invoice',
      key: 'Invoice',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit',
                },
                {
                  key: 'delete',
                  label: 'Delete',
                },
              ],
              onClick: e => {},
            }}
          >
            <span>
              <IconDotsVertical />
            </span>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col justify-center bg-card-color">
      <div className="flex justify-end mt-6 mb-1 mx-2">
        <Button type="primary" onClick={() => setActiveScreen('createVariation')}>
          New Variation
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="ReferenceID"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
    </div>
  );
};
export default JobVariation;
