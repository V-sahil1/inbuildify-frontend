import { Button, Tooltip } from 'antd';
import { IconExternalLink } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { EstateDocument } from '@redux/feature/estate/IEstateState';

export const EstateDocumentsColumns = () => {
  const columns = [
    {
      title: 'File Name',
      dataIndex: 'documentName',
      key: 'documentName',
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
      render: (_, record: EstateDocument) => (
        <Tooltip title="Open">
          <Button
            type="text"
            icon={<IconExternalLink size={16} />}
            onClick={() => record.fileUrl && window.open(record.fileUrl, '_blank')}
          />
        </Tooltip>
      ),
    },
  ];

  return { columns };
};
