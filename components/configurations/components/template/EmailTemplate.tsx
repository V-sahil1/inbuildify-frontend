import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { IconEdit } from '@tabler/icons-react';
import { Button, Table } from 'antd';
import { emailTemplateData } from 'data/configuration/TemplateData';
import { useState } from 'react';
import { EmailTemplateForm } from './EmailTemplateForm';

export const EmailTemplate = () => {
  const [EditTemplate, setEditTemplate] = useState(null);
  const filterOptions = [
    { type: 'All', label: 'All', count: 1 },
    { type: 'Standard', label: 'Standard', count: 2 },
    { type: 'Customized', label: 'Customized', count: 5 },
  ];

  const handleFilterChange = (tab: string) => {
    console.log('Selected filter:', tab);
  };

  const column = [
    {
      title: 'Template Name',
      dataIndex: 'templateName',
      key: 'templateName',
      width: '70%',
      render: (templateName: string, record: any) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-sm">{templateName}</p>
          <p className="text-xs text-gray-500">{record.description}</p>
          <p className="text-xs text-gray-500 bg-green-500 w-fit text-white px-2 py-1 rounded">
            {record.type}
          </p>
        </div>
      ),
    },
    {
      title: 'Additional Recipients',
      dataIndex: 'additionalRecipients',
      key: 'additionalRecipients',
      width: '20%',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '10%',
      render: (key, record: any) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditTemplate(record);
            }}
          >
            <IconEdit size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {EditTemplate ? (
        <EmailTemplateForm
          templateId={EditTemplate.key}
          templateName={EditTemplate.templateName}
          template={EditTemplate.template}
          onCancel={() => setEditTemplate(null)}
        />
      ) : (
        <>
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterChange}
            isActionShow={false}
            isCountShow={true}
          />
          <Table columns={column} dataSource={emailTemplateData} />
        </>
      )}
    </div>
  );
};
