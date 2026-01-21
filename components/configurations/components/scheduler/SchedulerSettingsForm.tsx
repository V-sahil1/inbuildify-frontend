'use client';
import React, { useCallback, useState } from 'react';
import { Button, Select, Input, Switch, InputNumber, Upload, message } from 'antd';
import RichTextEditor from '@/components/common/rich-text-editor/RichTextEditor';
import { IconInfoCircle, IconPin } from '@tabler/icons-react';
import { useUsersHook } from '@hooks/useUserHook';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { ScheduleEmail } from '@redux/feature/admin/scheduler/schedularEmail/ischeduleEmailState';

export interface SchedulerSettings extends ScheduleEmail {
  key?: string;
}

interface SchedulerSettingsFormProps {
  data: SchedulerSettings;
  onCancel: () => void;
  onSave: (updatedFields: Partial<SchedulerSettings>) => void;
  isSubmitting?: boolean;
}

export const SchedulerSettingsForm: React.FC<SchedulerSettingsFormProps> = ({
  data,
  onCancel,
  onSave,
  isSubmitting = false,
}) => {
  const { userOptions } = useUsersHook();
  const [formData, setFormData] = useState<SchedulerSettings>(data);

  const updateField = useCallback((key: keyof SchedulerSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const uploadProps = {
    multiple: true,
    fileList: Array.isArray(formData.attachFiles)
      ? (formData.attachFiles || []).map((file: any, index: number) => ({
          uid: file.uid || `file-${index}-${file.name}`,
          name: file.name,
          status: 'done' as const,
          originFileObj: file,
        }))
      : typeof formData.attachFiles === 'string' && formData.attachFiles
        ? [
            {
              uid: 'existing-file',
              name: 'attachment',
              status: 'done' as const,
              url: formData.attachFiles,
              originFileObj: null,
            },
          ]
        : [],
    beforeUpload: () => false,
    onChange: ({ fileList }: any) => {
      const files = fileList
        .filter((file: any) => file.originFileObj)
        .map((file: any) => {
          const fileObj = file.originFileObj;
          return Object.assign(fileObj, { uid: file.uid });
        });
      updateField('attachFiles', files);
    },
    onRemove: (file: any) => {
      if (Array.isArray(formData.attachFiles)) {
        const currentFiles = formData.attachFiles;
        updateField(
          'attachFiles',
          currentFiles.filter((f: any) => f.uid !== file.uid)
        );
      } else {
        updateField('attachFiles', []);
      }
    },
  };

  const handleSave = useCallback(async () => {
    if (isSubmitting) return;

    if (!formData.frequency) {
      return message.error('Frequency is required.');
    }

    try {
      const { isUpdated, updatedFields } = getUpdatedFields(formData, data || {});
      if (!isUpdated) {
        return;
      }
      onSave(updatedFields);
    } catch (error) {
      message.error(error || 'Failed to save scheduler settings');
    }
  }, [formData, data, onSave, isSubmitting]);

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
          <Switch
            checked={formData.sendToAllActiveUsers}
            onChange={v => updateField('sendToAllActiveUsers', v)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">No of Action Days</label>
          <InputNumber
            className="w-full"
            min={1}
            value={formData.noOfActionDays}
            onChange={v => updateField('noOfActionDays', v)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {!formData.sendToAllActiveUsers && (
          <div>
            <label className="text-sm font-medium">Notification Recipients</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select users"
              value={formData.notificationRecipientUsers}
              onChange={v => updateField('notificationRecipientUsers', v)}
              options={userOptions}
            />
          </div>
        )}

        {formData.sendToAllActiveUsers && (
          <div>
            <label className="text-sm font-medium">Exclude Recipients</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select users"
              value={formData.excludeRecipients}
              onChange={v => updateField('excludeRecipients', v)}
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
          value={formData.messageBody}
          onChange={v => updateField('messageBody', v)}
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
        <Button onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleSave} loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
