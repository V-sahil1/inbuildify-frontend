import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { IconEdit } from '@tabler/icons-react';
import { message, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { EmailTemplateForm } from './EmailTemplateForm';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { fetchEmailTemplate } from '@redux/feature/admin/template/email/emailThunk';
import TooltipButton from '@/components/common/TooltipButton';
import { IEmailTemplate } from '@redux/feature/admin/template/email/IemailState';

export const EmailTemplate = () => {
  const [EditTemplate, setEditTemplate] = useState<IEmailTemplate | null>(null);
  const { emailTemplate, count, status } = useAppSelector(state => state.template.emailTemplate);
  const dispatch = useAppDispatch();

  const fetchEmailTemplateData = async (type?: string) => {
    try {
      await dispatch(fetchEmailTemplate({ type })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch email template');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchEmailTemplateData();
    }
  }, []);

  const filterOptions = useMemo(
    () => [
      { type: 'all', label: 'All', count: count?.total ?? 0 },
      { type: 'standard', label: 'Standard', count: count?.standard ?? 0 },
      { type: 'customized', label: 'Customized', count: count?.customized ?? 0 },
    ],
    [count]
  );

  const handleFilterChange = (tab: string) => {
    fetchEmailTemplateData(tab === 'all' ? null : tab);
  };

  const column = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'templateName',
      width: '70%',
      render: (templateName: string, record: IEmailTemplate) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-sm">{templateName}</p>
          <p className="text-xs text-gray-500">{record.emailContent}</p>
          <p className="text-xs text-gray-500 bg-green-500 w-fit text-white px-2 py-1 rounded">
            {record.type}
          </p>
        </div>
      ),
    },
    {
      title: 'Additional Recipients',
      dataIndex: 'additionalRecipientUsers',
      key: 'additionalRecipientUsers',
      width: '20%',
      render: value => value?.map(i => i.name).join(', ') || '',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '10%',
      render: (_, record: IEmailTemplate) => (
        <TooltipButton
          title="Edit"
          type="text"
          size="small"
          icon={<IconEdit size={16} />}
          onClick={() => {
            setEditTemplate(record);
          }}
        />
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
            additionalRecipientUsers: EditTemplate.additionalRecipientUsers?.map(i => i.id) || [],
            additionalRecipientGroups:
              EditTemplate?.additionalRecipientGroups?.map(i => i.id) || [],
            subject: EditTemplate.subject || '',
            emailContent: EditTemplate.emailContent || '',
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
          <Table columns={column} dataSource={emailTemplate} pagination={false} />
        </>
      )}
    </div>
  );
};
