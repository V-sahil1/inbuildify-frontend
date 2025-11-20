import { Table } from 'antd';
import { MasterCollectionColumn } from '../table-columns/MasterCollectionColumn';

export const MasterPricelistCollection = ({ filters, setParams }) => {
  const { columns, masterCollectionData } = MasterCollectionColumn({ filters, setParams });
  return <Table columns={columns} dataSource={masterCollectionData} />;
};
