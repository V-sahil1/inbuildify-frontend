import { Button, Tooltip } from 'antd';
import { IconExternalLink } from '@tabler/icons-react';
import dayjs from 'dayjs';

export interface EstateDocItem {
  key: string;
  name: string;
  createdAt: string;
  url?: string;
}

export const EstateDocumentsColumns = () => {
  const estateDocumentsData: EstateDocItem[] = [
    { key: '1', name: 'ready-reckoner.pdf', createdAt: '2025-09-30T10:00:00.000Z' },
  ];
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      render: (text: string) => <span className="whitespace-pre-wrap">{text}</span>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '30%',
      render: (iso: string) => dayjs(iso).format('DD-MM-YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: EstateDocItem) => (
        <Tooltip title="Open">
          <Button
            type="text"
            icon={<IconExternalLink size={16} />}
            onClick={() => record.url && window.open(record.url, '_blank')}
          />
        </Tooltip>
      ),
    },
  ];

  return { columns, estateDocumentsData };
};
