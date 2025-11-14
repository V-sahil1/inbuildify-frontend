import { Drawer, Table, Tooltip } from 'antd';
import CustomAvtar from '../CustomAvtar';
import { IconShare3, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { ColumnsType } from 'antd/es/table';

interface DataType {
  name: string;
  cost: string;
  status: string;
  createdby: string;
}

const data = [
  {
    name: 'Lot 33 Tarneit',
    cost: '34,000.00',
    status: 'Published',
    createdby: 'Akshay',
  },
  {
    name: 'Lot 87',
    cost: '34,000.00',
    status: 'Available',
    createdby: 'Meet',
  },
  {
    name: '60 Tarneit',
    cost: '34,000.00',
    status: 'Published',
    createdby: 'Heer',
  },
];

const LandPackageDrawer = ({ title, onClose, open }) => {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created By',
      dataIndex: 'createdby',
      key: 'createdby',
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <Tooltip title={record.createdby}>
            {' '}
            <CustomAvtar label={record.createdby} />
          </Tooltip>
          <Link href="#">
            <IconShare3 size={15} className="cursor-pointer text-blue" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Drawer
        title={title}
        open={open}
        onClose={onClose}
        closeIcon={false}
        extra={<IconX style={{ cursor: 'pointer' }} onClick={onClose} size={20} />}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
          }}
        />
      </Drawer>
    </div>
  );
};

export default LandPackageDrawer;
