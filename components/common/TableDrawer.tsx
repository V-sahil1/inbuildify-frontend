import React from "react";
import { Drawer, Table } from "antd";
import { IconX } from "@tabler/icons-react";

interface TableDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  table : {columns: any[]; data: any[]};
  width?: number | string;
  loading?: boolean;
}

export const TableDrawer: React.FC<TableDrawerProps> = ({
  open,
  onClose,
  title,
  table,
  width = 900,
  loading = false,
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      width={width}
      closeIcon={false}
      extra={<IconX style={{ cursor: "pointer" }} onClick={onClose} size={20} />}
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-4">
        <Table
          columns={table?.columns}
          dataSource={table?.data}
          pagination={false}
          bordered
          scroll={{ x: true }}
          loading={loading}
          rowKey={(record) => record.key || record.id}
          tableLayout="fixed"
        />
      </div>
    </Drawer>
  );
};
