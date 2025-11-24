import React from 'react';
import { Button, Drawer, Table } from 'antd';
import { IconX } from '@tabler/icons-react';

interface TableDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  table: { columns: any[]; data: any[] };
  width?: number | string;
  loading?: boolean;
  children?: React.ReactNode;
}

export const TableDrawer: React.FC<TableDrawerProps> = ({
  open,
  onClose,
  title,
  table,
  width = 900,
  loading = false,
  children,
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      width={width}
      closeIcon={false}
      extra={
        <Button
          className="ml-2"
          type="text"
          icon={<IconX style={{ cursor: 'pointer' }} onClick={onClose} />}
        />
      }
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="p-4">
        {children}
        <Table
          columns={table?.columns}
          dataSource={table?.data}
          pagination={false}
          scroll={{ x: true }}
          loading={loading}
          rowKey={record => record.key || record.id}
          tableLayout="fixed"
        />
      </div>
    </Drawer>
  );
};
