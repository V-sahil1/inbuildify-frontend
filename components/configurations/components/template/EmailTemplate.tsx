import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { IconEdit } from '@tabler/icons-react';
import { Button, message, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { EmailTemplateForm } from './EmailTemplateForm';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { fetchEmailTemplate } from '@redux/feature/admin/template/email/emailThunk';

export const EmailTemplate = () => {
  const [EditTemplate, setEditTemplate] = useState(null);
  const { emailTemplate, count, status } = useAppSelector(state => state.template.emailTemplate);
  const dispatch = useAppDispatch();

  const fetchEmailTemplateData = async () => {
    try {
      await dispatch(fetchEmailTemplate()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch email template');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchEmailTemplateData();
    }
  }, [status.fetch]);

  const filterOptions = useMemo(() => [
    { type: 'All', label: 'All', count: count?.total ?? 0 },
    { type: 'Standard', label: 'Standard', count: count?.standard ?? 0 },
    { type: 'Customized', label: 'Customized', count: count?.customized ?? 0 },
  ], [count]);

  const handleFilterChange = (tab: string) => {
    console.log('Selected filter:', tab);
  };

  const column = [
    {
      title: 'Template Name',
      dataIndex: 'name',
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
          templateId={EditTemplate.templateEmailId}
          templateName={EditTemplate.name}
          template={{
            additionalRecipientUsers: EditTemplate.additionalRecipientUsers || [],
            subject: EditTemplate.subject || '',
            emailContent: EditTemplate.emailContent || ''
          }}
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
          <Table columns={column} dataSource={emailTemplate} />
        </>
      )}
    </div>
  );
};
