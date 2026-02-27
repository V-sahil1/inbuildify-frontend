import { Drawer, Table, Tooltip } from 'antd';
import CustomAvtar from '../CustomAvtar';
import { IconShare3, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import SystemRoutes from '@lib/constants/Routes';

const LandPackageDrawer = ({ title, onClose, open, data }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Cost',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
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
            <CustomAvtar label={record.createdby} />
          </Tooltip>
          <Link href={SystemRoutes.HLPACKAGE +'/'+ record.houseLandPackageId}>
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
