import React, { useState, useRef } from 'react';
import { Button, Card, Checkbox } from 'antd';
import { IconSend, IconX, IconPaperclip } from '@tabler/icons-react';
import MainSendForm, { MainSendFormRef } from '@/components/common/MailSendForm';

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
  const [attachPdf, setAttachPdf] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const mainSendFormRef = useRef<MainSendFormRef>(null);

  const handleSend = (emailData: { to: string[]; subject: string; content: string }) => {
    const fullEmailData = {
      ...emailData,
      attachPdf,
      attachedFiles,
      invoiceId,
    };
    onSend(fullEmailData);
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
      <MainSendForm
        ref={mainSendFormRef}
        onSend={handleSend}
        title={''}
        initialValue={{
          to: [recipient],
          subject: subject,
          content: message,
        }}
        attachFile={false}
        showButtons={false}
      />

      <div className="mt-4">
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
          <div className="space-y-2 mt-2">
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
      </div>

      <div className="flex items-center justify-between bg-body-color p-2 rounded-md mt-4">
        <div>
          <span className="text-blue">Brouchures</span> (0)
        </div>
        <button type="button">
          <IconX size={18} />
        </button>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          onClick={() => mainSendFormRef.current?.triggerSend()}
          icon={<IconSend size={18} />}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};
