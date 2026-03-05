import { IconDotsVertical } from '@tabler/icons-react';
import { Dropdown } from 'antd';

export const LeadDepositColumn = () => {
  const menu = [
    { label: 'Record Payment', key: 'record_payment' },
    { label: 'Preview Invoice', key: 'preview_invoice' },
    { label: 'Preview Receipt', key: 'preview_receipt' },
    { label: 'Send Invoice', key: 'send_invoice' },
    { label: 'Send Receipt', key: 'send_receipt' },
    { label: 'Sync to Xero', key: 'sync_to_xero' },
    { label: 'Delete', key: 'delete' },
  ];
  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Invoice ($)',
      render: (_, record) => record?.invoiceAmount || record?.depositeAmount,
    },
    {
      title: 'Payment ($)',
      render: (_, record) => record?.paymentAmount || record?.depositeAmount,
    },
    {
      title: 'Status',
    },
    {
      title: 'Actions',
      render: () => (
        <Dropdown menu={{ items: menu }} trigger={['click']}>
          <IconDotsVertical size={16} className="cursor-pointer" />
        </Dropdown>
      ),
    },
  ];
  return { columns };
};
