'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Input, Select, message } from 'antd';
import { IconInfoCircle, IconMapDown } from '@tabler/icons-react';
import RichTextEditor from '@/components/common/rich-text-editor/RichTextEditor';
import { useUsersHook } from '@hooks/useUserHook';
import { InsertAtCursor } from '@lib/utils/InsertAtCursor';
import { TextAreaRef } from 'antd/es/input/TextArea';

export const EmailTemplateForm = ({
  templateId,
  templateName,
  template,
  onCancel,
}: {
  templateId: string;
  templateName: string;
  template: any;
  onCancel: () => void;
}) => {
  const { users } = useUsersHook();
  const inputRef = useRef<TextAreaRef>(null);

  const [formData, setFormData] = useState({
    additionalRecipient: template?.additionalRecipient || [],
    subject: template?.subject || '',
    content: template?.content || '',
  });

  useEffect(() => {
    if (template) {
      setFormData({
        additionalRecipient: template?.additionalRecipient || [],
        subject: template?.subject || '',
        content: template?.content || '',
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

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const payload = {
      templateId: templateId,
      templateName: templateName,
      ...formData,
    };

    try {
      console.log('Saving template:', payload);
      // Example API call here:
      // await api.saveTemplate(payload);

      message.success('Template saved successfully');
    } catch (error) {
      message.error('Failed to save template');
    }
  };

  // Cancel functionality
  const handleCancel = () => {
    setFormData({
      additionalRecipient: template?.additionalRecipient || [],
      subject: template?.subject || '',
      content: template?.content || '',
    });
    message.info('Changes reverted');
    onCancel();
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded">
      <p className="text-base font-medium">Template Settings – {template?.templateName}</p>

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
          value={formData.additionalRecipient}
          onChange={value => updateField('additionalRecipient', value)}
          options={users.map((user: any) => ({
            label: user.name,
            value: user.usersId,
          }))}
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
          value={formData.content}
          onChange={value => updateField('content', value)}
          maxHeight="400px"
          placeholder="Write your email content..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSave}>
          Save Template
        </Button>
      </div>
    </div>
  );
};
