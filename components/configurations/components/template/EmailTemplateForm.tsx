'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Input, Select, message } from 'antd';
import { IconInfoCircle, IconMapDown } from '@tabler/icons-react';
import RichTextEditor from '@/components/common/rich-text-editor/RichTextEditor';
import { useUsersHook } from '@hooks/useUserHook';
import { InsertAtCursor } from '@lib/utils/InsertAtCursor';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { useAppDispatch } from '@hooks/redux';
import { updateEmailTemplate } from '@redux/feature/admin/template/email/emailThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const EmailTemplateForm = ({
  templateId,
  templateName,
  template,
  onCancel,
}: {
  templateId: string;
  templateName: string;
  template: {
    additionalRecipientUsers: string[];
    subject: string;
    emailContent: string;
  };
  onCancel: () => void;
}) => {
  const { userOptions } = useUsersHook();
  const dispatch = useAppDispatch();
  const inputRef = useRef<TextAreaRef>(null);
  console.log('template', template);

  const [formData, setFormData] = useState({
    additionalRecipientUsers: template?.additionalRecipientUsers || [],
    subject: template?.subject || '',
    emailContent: template?.emailContent || '',
  });

  // Memoize original template for comparison
  const originalTemplate = useMemo(() => ({
    additionalRecipientUsers: template?.additionalRecipientUsers || [],
    subject: template?.subject || '',
    emailContent: template?.emailContent || '',
  }), [template]);

  useEffect(() => {
    if (template) {
      setFormData({
        additionalRecipientUsers: template?.additionalRecipientUsers || [],
        subject: template?.subject || '',
        emailContent: template?.emailContent || '',
      });
    }
  }, [template]);

  const options = [
    'Address',
    'Logged User Name',
    'RequestAcknowledgement',
    'Address1',
    'jobAddress',
    'Full CustomerName',
    'First Name',
    'Last Name',
  ];

  const updateField = (key: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      // Only send fields that have changed
      const updatedFields = getUpdatedFields(formData, originalTemplate);

      if (Object.keys(updatedFields).length === 0) {
        message.info('No changes to save');
        return;
      }

      await dispatch(updateEmailTemplate({ data: updatedFields, templateId: templateId }));
      message.success('Template saved successfully');
      onCancel();
    } catch (error) {
      message.error('Failed to save template');
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded">
      <p className="text-base font-medium">Template Settings – {templateName}</p>

      <div className="flex gap-2 items-center text-gray-600">
        <IconInfoCircle size={18} />
        <p className="text-sm">
          Email is sent when the maintenance task is completed and an acknowledgment is sent to the
          customer.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="min-w-[160px]">Additional Recipient</label>
        <Select
          className="flex-1"
          mode="multiple"
          placeholder="Select recipient"
          value={formData.additionalRecipientUsers}
          onChange={value => updateField('additionalRecipientUsers', value)}
          options={userOptions}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="min-w-[160px] mt-2">Subject</label>
        <div className="flex-1 flex gap-2">
          <Input.TextArea
            ref={inputRef}
            rows={2}
            value={formData.subject}
            onChange={e => updateField('subject', e.target.value)}
            placeholder="Enter subject..."
            className="flex-1"
          />
          <Dropdown
            menu={{
              items: options.map(opt => ({
                key: opt,
                label: opt,
                onClick: () => {
                  updateField(
                    'subject',
                    InsertAtCursor(inputRef, opt, formData.subject, 'textarea')
                  );
                },
              })),
            }}
            trigger={['click']}
          >
            <Button type="default" className="whitespace-nowrap flex items-center gap-1">
              Insert Personalization <IconMapDown size={16} />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div>
        <label className="block mb-1">Email Content</label>
        <RichTextEditor
          value={formData.emailContent}
          onChange={value => updateField('emailContent', value)}
          maxHeight="400px"
          placeholder="Write your email content..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSave}>
          Save Template
        </Button>
      </div>
    </div>
  );
};
