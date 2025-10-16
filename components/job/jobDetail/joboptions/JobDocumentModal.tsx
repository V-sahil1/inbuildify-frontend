"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Button, Space, Select, Checkbox, Tooltip, Form } from "antd";
import { IconInfoCircle } from "@tabler/icons-react";
import { JobDocumentOptions } from "data/options";
import MailSendModal from "@/components/common/Models/MailSendModal";

const DocumentItem = React.memo(({ doc, handleCheck }: any) => {
  const signedClass = doc.isSigned
    ? "bg-gray-200 text-gray-500"
    : "bg-gray-100 text-gray-700";

  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-100">
      {/* Left Side */}
      <div className="flex flex-col w-3/5">
        <Form.Item
          name={`document_${doc.id}_checked`}
          valuePropName="checked"
          noStyle
        >
          <Checkbox
            onChange={(e) => handleCheck(doc.id, e.target.checked)}
            className="ant-checkbox-wrapper-lg"
          >
            <span className="text-gray-800 font-medium">{doc.title}</span>
          </Checkbox>
        </Form.Item>

        {doc.options && doc.checked && (
          <Form.Item
            name={`document_${doc.id}_selection`}
            className="mt-2 ml-7"
          >
            <Select
              options={doc.options.map((opt: string) => ({
                label: opt,
                value: opt,
              }))}
            />
          </Form.Item>
        )}
      </div>

      {doc.status && (
        <div className="flex items-center space-x-2">
          <Button
            type="primary"
            className={`font-semibold ${
              doc.checked ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={doc.checked}
          >
            Approved
          </Button>

          <span
            className={`px-3 py-1.5 rounded-md font-medium text-sm border ${signedClass} flex items-center`}
          >
            Signed
            {doc.isSigned && (
              <Tooltip title="This document has been successfully eSigned.">
                <IconInfoCircle className="ml-1 text-xs" />
              </Tooltip>
            )}
          </span>
        </div>
      )}
    </div>
  );
});
DocumentItem.displayName = "DocumentItem";

const JobDocumentModal = ({
  open,
  onCancel,
  documents = JobDocumentOptions,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const initialValues: Record<string, any> = {};
    documents.forEach((doc) => {
      initialValues[`document_${doc.id}_checked`] = doc.checked;
      if (doc.options) {
        initialValues[`document_${doc.id}_selection`] = doc.selectedOption;
      }
    });
    form.setFieldsValue(initialValues);
  }, [documents, form]);

  const handleCheck = useCallback(
    (id: string, newChecked: boolean) => {
      const updated = { [`document_${id}_checked`]: newChecked };
      form.setFieldsValue(updated);
    },
    [form]
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const values = form.getFieldsValue();

      const finalData = documents
        .filter((doc) => values[`document_${doc.id}_checked`])
        .map((doc) => ({
          id: doc.id,
          title: doc.title,
          status: doc.status,
          selectedOption: doc.options
            ? values[`document_${doc.id}_selection`]
            : null,
        }));

      console.log(finalData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onCancel?.();
    } finally {
      setIsLoading(false);
    }
  }, [documents, form, onCancel]);

  const handleEmail = useCallback(async () => {
    onCancel?.();
    setEmailModalOpen(true);
    //    email api logic
  }, [documents, form, onCancel]);

  const renderedDocs = useMemo(
    () =>
      documents.map((doc) => (
        <DocumentItem key={doc.id} doc={doc} handleCheck={handleCheck} />
      )),
    [documents, handleCheck]
  );

  return (
    <>
      <Modal
        open={open}
        title={<span className="text-xl font-semibold">Job Document</span>}
        onCancel={onCancel}
        centered
        footer={
          <div className="flex justify-end pt-3">
            <Space size="middle">
              <Button
                onClick={handleEmail}
                loading={isLoading}
                disabled={isLoading}
              >
                Email
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
              >
                Download
              </Button>
            </Space>
          </div>
        }
        width={600}
        className="p-0"
      >
        <Form form={form} layout="vertical">
          <div className="py-4 px-1 space-y-1">{renderedDocs}</div>
        </Form>
      </Modal>
      <MailSendModal
        open={emailModalOpen}
        onCancel={() => setEmailModalOpen(false)}
        onSend={() => setEmailModalOpen(false)}
        title="Send Email"
        initialValue={{
          to: ["test@inbuildify.com"],
          subject: "subject is subkece",
          content: "hello how are you",
        }}
      />
    </>
  );
};

export default JobDocumentModal;
