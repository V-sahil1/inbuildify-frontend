import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Form, Select, Upload, Checkbox, Button, Input } from 'antd';
import RichTextEditor from './rich-text-editor/RichTextEditor';
import { useUsersHook } from '@hooks/useUserHook';

interface MainSendFormProps {
  onSend: (data: { to: string[]; subject: string; content: string }) => void;
  title?: string;
  initialValue?: { to: string[]; subject: string; content: string };
  attachedCopy?: boolean;
  attachFile?: boolean;
  showButtons?: boolean;
  cancelButtonText?: string;
  sendButtonText?: string;
  onCancel?: () => void;
}

export interface MainSendFormRef {
  triggerSend: () => void;
}

const MainSendForm = forwardRef<MainSendFormRef, MainSendFormProps>(
  (
    {
      onSend,
      title = 'Send Mail',
      initialValue,
      attachedCopy,
      attachFile,
      showButtons = true,
      cancelButtonText = 'Clear',
      sendButtonText = 'Send',
      onCancel,
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const [toEmails, setToEmails] = useState<string[]>(initialValue?.to || []);
    const [inputValue, setInputValue] = useState('');
    const [editedContent, setEditedContent] = useState(initialValue?.content || '');
    const { users } = useUsersHook();
    const userOptions = users.map(user => ({ label: user.name, value: user.usersId }));

    const handleInputConfirm = () => {
      const email = inputValue.trim();

      if (email && !toEmails.includes(email)) {
        setToEmails(prev => [...prev, email]);
      }

      setInputValue('');
    };

    const handleEmailsChange = (values: string[]) => {
      setToEmails(values);
    };

    const handleSearch = (value: string) => {
      setInputValue(value);
    };

    const handleSend = () => {
      form
        .validateFields()
        .then(() => {
          onSend({
            to: toEmails,
            subject: form.getFieldValue('subject'),
            content: editedContent,
          });
          console.log('text editor content', editedContent);
          form.resetFields();
          setToEmails([]);
          setEditedContent('');
          setInputValue('');
        })
        .catch(err => {
          console.log('Validation failed', err);
        });
    };

    useImperativeHandle(ref, () => ({
      triggerSend: handleSend,
    }));

    return (
      <div className="w-full">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        <Form form={form} layout="vertical">
          <Form.Item
            label="To"
            name="to"
            initialValue={initialValue?.to}
            rules={[{ required: true, message: 'Please add at least one recipient' }]}
          >
            <Select
              mode="tags"
              placeholder="Enter recipient(s)"
              style={{ width: '100%' }}
              value={toEmails}
              onChange={handleEmailsChange}
              tokenSeparators={[',', ';']}
              onSearch={handleSearch}
              options={userOptions}
              onInputKeyDown={e => {
                if (e.key === 'Enter') {
                  handleInputConfirm();
                }
              }}
              onBlur={handleInputConfirm}
            />
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: 'Please enter subject' }]}
            initialValue={initialValue?.subject}
          >
            <Input placeholder="Enter subject" />
          </Form.Item>

          <Form.Item label="Message" name="content" initialValue={initialValue?.content}>
            <RichTextEditor
              value={editedContent}
              onChange={setEditedContent}
              placeholder="Job Pdf will be attached with this email"
              maxHeight="300px"
            />
          </Form.Item>

          {attachFile && (
            <Form.Item name="file">
              <Upload>
                <Button>Upload File</Button>
              </Upload>
            </Form.Item>
          )}
        </Form>

        {showButtons && (
          <div className="mt-6">
            {attachedCopy && (
              <div className="flex justify-start gap-2 items-center mb-4">
                <Checkbox />
                <p>Send me a copy of this mail</p>
              </div>
            )}
            <div className="flex justify-end gap-2 items-center">
              <Button
                onClick={() => {
                  if (onCancel) {
                    onCancel();
                  } else {
                    form.resetFields();
                    setToEmails([]);
                    setEditedContent('');
                    setInputValue('');
                  }
                }}
              >
                {cancelButtonText}
              </Button>
              <Button type="primary" onClick={handleSend}>
                {sendButtonText}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default MainSendForm;
