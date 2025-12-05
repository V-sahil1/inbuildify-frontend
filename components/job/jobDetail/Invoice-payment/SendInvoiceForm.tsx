import React, { useState } from 'react';
import { Button, Card, Form, Input, Checkbox } from 'antd';
import { IconSend, IconX, IconPaperclip, IconPlus, IconPencil } from '@tabler/icons-react';
import RichTextEditor from '@/components/common/rich-text-editor/RichTextEditor';

interface SendInvoiceFormProps {
  invoiceId: string;
  recipient?: string;
  subject?: string;
  message?: string;
  buttonText?: string;
  onCancel: () => void;
  onSend: (emailData: any) => void;
}

export const SendInvoiceForm: React.FC<SendInvoiceFormProps> = ({
  invoiceId,
  recipient = 'hello@aluxhomes.com.au',
  subject = `My Home: Invoice ${invoiceId}`,
  message = `Please find the attached invoice for the job Suite 10, 45 Tallis Circuit, Truganina, VIC, 3029.\n\nThe due date for this payment is 09-10-2025.\n\nPlease do not hesitate to contact me if you need any further clarification.\n\nRegards | Kishan`,
  buttonText = 'Send',
  onCancel,
  onSend,
}) => {
  const [form] = Form.useForm();
  const [attachPdf, setAttachPdf] = useState(true);
  const [messageContent, setMessageContent] = useState(message);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubjectEditable, setIsSubjectEditable] = useState(false);

  const handleSend = () => {
    const emailData = {
      to: form.getFieldValue('to') || recipient,
      subject: form.getFieldValue('subject') || subject,
      message: messageContent,
      attachPdf,
      attachedFiles,
      invoiceId,
    };
    onSend(emailData);
  };

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card
      title={`${invoiceId} - Send Invoice`}
      className="shadow-sm border border-gray-100"
      extra={
        <Button type="text" onClick={onCancel}>
          <IconX size={18} />
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          to: recipient,
          subject: subject,
        }}
      >
        <Form.Item label="To" name="to">
          <div className="flex gap-2">
            <Input style={{ flex: 1 }} />
            <Button type="default" icon={<IconPlus size={18} />} />
          </div>
        </Form.Item>

        <Form.Item label="Subject">
          <div className="flex gap-2 items-center">
            {isSubjectEditable ? (
              <Input
                style={{ flex: 1 }}
                defaultValue={subject}
                onBlur={e => {
                  form.setFieldsValue({ subject: e.target.value });
                  setIsSubjectEditable(false);
                }}
                onPressEnter={e => {
                  form.setFieldsValue({ subject: e.currentTarget.value });
                  setIsSubjectEditable(false);
                }}
                autoFocus
              />
            ) : (
              <span className="flex-1 cursor-pointer" onClick={() => setIsSubjectEditable(true)}>
                {form.getFieldValue('subject') || subject}
              </span>
            )}
            <Button
              type="default"
              icon={<IconPencil size={18} />}
              onClick={() => setIsSubjectEditable(!isSubjectEditable)}
            />
          </div>
        </Form.Item>

        <Form.Item label="Message">
          <RichTextEditor
            value={messageContent}
            onChange={setMessageContent}
            placeholder="Compose your message..."
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between">
            <Checkbox checked={attachPdf} onChange={e => setAttachPdf(e.target.checked)}>
              Attach the Invoice as a PDF
            </Checkbox>
            <div>
              <input
                type="file"
                multiple
                style={{ display: 'none' }}
                id="file-upload"
                onChange={handleFileAttach}
              />
              <Button
                type="link"
                style={{ padding: 0, height: 'auto' }}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Attach files
              </Button>
            </div>
          </div>

          {/* Show attached files */}
          {(attachPdf || attachedFiles.length > 0) && (
            <div className="space-y-2">
              {attachPdf && <div className="flex items-center gap-2"></div>}
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2">
                  <IconPaperclip size={16} />
                  <Button type="link" style={{ padding: 0, height: 'auto' }}>
                    {file.name}
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => removeFile(index)}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    <IconX size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Form.Item>

        <Form.Item>
          <div className="flex items-center justify-between bg-body-color p-2 rounded-md">
            <div>
              <span className="text-blue">Brouchures</span> (0)
            </div>
            <button type="button">
              <IconX size={18} />
            </button>
          </div>
        </Form.Item>

        <div className="flex justify-end">
          <Button type="primary" onClick={handleSend} icon={<IconSend size={18} />}>
            {buttonText}
          </Button>
        </div>
      </Form>
    </Card>
  );
};
