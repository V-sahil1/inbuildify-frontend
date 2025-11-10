'use client';
import React from 'react';
import { Button, Select, Input, Switch, InputNumber, Upload, message } from 'antd';
import RichTextEditor from '@/components/common/rich-text-editor/RichTextEditor';
import { IconInfoCircle, IconPin } from '@tabler/icons-react';
import { useUsersHook } from '@hooks/useUserData'; // ✅ Import your hook

export interface SchedulerSettings {
  key: number | string;
  name: string;
  description: string;
  scheduled?: boolean;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  sendToActive: boolean;
  notificationUsers?: string[];
  excludeUsers?: string[];
  replyToUsers?: string[];
  subject: string;
  actionDays: number;
  noRecordMessage?: boolean;
  noRecordMessageBody?: string;
  attachments?: any[];
}

export const SchedulerSettingsForm = ({ data, onCancel, onSave }: any) => {
  const { users } = useUsersHook();
  const userOptions =
    users?.map((u: any) => ({
      label: u.name,
      value: u.usersId,
    })) || [];

  const [formData, setFormData] = React.useState<SchedulerSettings>({
    key: data?.key,
    name: data?.name || '',
    description: data?.description || '',
    scheduled: data?.scheduled || false,
    frequency: data?.frequency || 'Daily',
    sendToActive: data?.sendToActive || false,
    notificationUsers: data?.notificationUsers || [],
    excludeUsers: data?.excludeUsers || [],
    replyToUsers: data?.replyToUsers || [],
    subject: data?.subject || data?.name || '',
    actionDays: data?.actionDays || 30,
    noRecordMessage: data?.noRecordMessage || false,
    noRecordMessageBody: data?.noRecordMessageBody || '',
    attachments: data?.attachments || [],
  });

  const updateField = (key: keyof SchedulerSettings, value: any) => {
    setFormData(p => ({ ...p, [key]: value }));
  };

  const uploadProps = {
    multiple: true,
    fileList: formData.attachments,
    beforeUpload: () => false,
    onChange: ({ fileList }: any) => updateField('attachments', fileList),
    onRemove: (file: any) =>
      updateField(
        'attachments',
        formData.attachments.filter((f: any) => f.uid !== file.uid)
      ),
  };

  const handleSave = () => {
    if (!formData.frequency) {
      return message.error('Frequency is required.');
    }
    onSave(formData);
  };

  return (
    <div className="bg-card-color p-6 rounded shadow space-y-5">
      <h2 className="text-lg font-semibold">Scheduler Settings – {data?.name}</h2>

      <div className="flex gap-2 items-start text-blue-700 bg-blue-50 p-3 rounded text-sm">
        <IconInfoCircle size={18} />
        Selected users will receive this scheduled notification email.
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Frequency *</label>
          <Select
            className="w-full"
            value={formData.frequency}
            onChange={v => updateField('frequency', v)}
          >
            <Select.Option value="Daily">Daily</Select.Option>
            <Select.Option value="Weekly">Weekly</Select.Option>
            <Select.Option value="Monthly">Monthly</Select.Option>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Send to all active users</label> <br />
          <Switch checked={formData.sendToActive} onChange={v => updateField('sendToActive', v)} />
        </div>

        <div>
          <label className="text-sm font-medium">No of Action Days</label>
          <InputNumber
            className="w-full"
            min={1}
            value={formData.actionDays}
            onChange={v => updateField('actionDays', v)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {!formData.sendToActive && (
          <div>
            <label className="text-sm font-medium">Notification Recipients</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select users"
              value={formData.notificationUsers}
              onChange={v => updateField('notificationUsers', v)}
              options={userOptions}
            />
          </div>
        )}

        {formData.sendToActive && (
          <div>
            <label className="text-sm font-medium">Exclude Recipients</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select users"
              value={formData.excludeUsers}
              onChange={v => updateField('excludeUsers', v)}
              options={userOptions}
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Reply To (Optional)</label>
          <Select
            mode="multiple"
            className="w-full"
            placeholder="Select users"
            value={formData.replyToUsers}
            onChange={v => updateField('replyToUsers', v)}
            options={userOptions}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Subject</label>
        <Input value={formData.subject} onChange={e => updateField('subject', e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium">Body</label>
        <RichTextEditor
          value={formData.description}
          onChange={v => updateField('description', v)}
          maxHeight="180px"
        />

        <div className="flex items-center gap-2 mt-3">
          <Switch
            checked={formData.noRecordMessage}
            onChange={v => updateField('noRecordMessage', v)}
          />
          <span>No Record Message</span>
        </div>

        {formData.noRecordMessage && (
          <div className="border rounded p-3 mt-2">
            <label className="text-sm font-medium">No Record Message Content</label>
            <RichTextEditor
              value={formData.noRecordMessageBody}
              onChange={v => updateField('noRecordMessageBody', v)}
              maxHeight="160px"
            />
          </div>
        )}

        <div className="mt-2 w-fit">
          <Upload {...uploadProps} listType="text">
            <Button icon={<IconPin />}>Attach files</Button>
          </Upload>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
