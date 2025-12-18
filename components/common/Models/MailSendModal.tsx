'use client';

import React from 'react';
import { Modal } from 'antd';
import MailSendForm from '../MailSendForm';

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
  return (
    <Modal title={title} open={open} onCancel={onCancel} centered footer={null}>
      <MailSendForm
        onSend={onSend}
        title=""
        initialValue={initialValue}
        attachedCopy={attachedCopy}
        attachFile={attachFile}
        showButtons={true}
        onCancel={onCancel}
      />
    </Modal>
  );
};

export default MailSendModal;
