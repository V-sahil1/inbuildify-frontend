'use client';

import React, { useState } from 'react';
import { Modal, Input, Button, Form, Select, Upload, Checkbox } from 'antd';
import RichTextEditor from '../rich-text-editor/RichTextEditor';
import { useUsersHook } from '@hooks/useUserData';

interface MailSendModalProps {
  open: boolean;
  onCancel: () => void;
  onSend: (data: { to: string[]; subject: string; content: string }) => void;
  title?: string;
  initialValue?: { to: string[]; subject: string; content: string };
  attachedCopy?: boolean;
  attachFile?: boolean;
}

const MailSendModal: React.FC<MailSendModalProps> = ({
  open,
  onCancel,
  onSend,
  title = 'Send Mail',
  initialValue,
  attachedCopy,
  attachFile,
}) => {
  const [form] = Form.useForm();
  const [toEmails, setToEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editedContent, setEditedContent] = useState('');
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

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      centered
      footer={
        <div>
          {attachedCopy && (
            <div className="flex justify-start gap-2 items-center">
              <Checkbox />
              <p>Send me a copy of this mail</p>
            </div>
          )}
          <div className="flex justify-end gap-1 items-center">
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button key="send" type="primary" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      }
    >
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
    </Modal>
  );
};

export default MailSendModal;
