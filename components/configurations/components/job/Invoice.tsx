'use client';
import React, { useState } from 'react';
import { Table, Button, Form, Switch, Input, Popconfirm } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { InvoiceSettingFields } from '@/components/formFields/InvoiceSettingFields';
import { initialInvoiceSettings, initialStagePayments } from 'data/configuration/InvoiceData';

interface StagePayment {
  key: string;
  description: string;
  percentage: number;
  sortOrder: number;
  isDeposit?: boolean;
}

interface InvoiceSettings {
  showInvoiceSummary: boolean;
  invoiceTerms: number;
}

export const Invoice: React.FC = () => {
  const [stagePayments, setStagePayments] = useState<StagePayment[]>(initialStagePayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<StagePayment | null>(null);
  const [initialSettings] = useState<InvoiceSettings>({
    ...initialInvoiceSettings,
  });
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(initialInvoiceSettings);
  const [form] = Form.useForm();

  const handleEdit = (record: StagePayment) => {
    setEditingStage(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    setStagePayments(prev => prev.filter(stage => stage.key !== key));
  };

  const handleModalSave = (values: any) => {
    if (editingStage) {
      setStagePayments(prev =>
        prev.map(stage => (stage.key === editingStage.key ? { ...values, key: stage.key } : stage))
      );
    } else {
      setStagePayments(prev => [...prev, { ...values, key: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingStage(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: StagePayment) => (
        <span>
          {text}{' '}
          {record.isDeposit && (
            <span className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">Deposit</span>
          )}
        </span>
      ),
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: number) => `${value}%`,
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: StagePayment) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<IconEdit size={18} className="text-blue-500" />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this stage?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type="text" icon={<IconTrash size={18} className="text-red-500" />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleInvoiceSettingChange = (key: keyof InvoiceSettings, value: any) => {
    setInvoiceSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveInvoiceSettings = () => {
    console.log('Saving invoice settings:', invoiceSettings);
    initialSettings.showInvoiceSummary = invoiceSettings.showInvoiceSummary;
    initialSettings.invoiceTerms = invoiceSettings.invoiceTerms;
  };
  const hasUnsavedChanges =
    initialSettings.showInvoiceSummary !== invoiceSettings.showInvoiceSummary ||
    initialSettings.invoiceTerms !== invoiceSettings.invoiceTerms;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border p-3 rounded-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Show Invoice Summary in PDF</span>
              <Switch
                checked={invoiceSettings.showInvoiceSummary}
                onChange={checked => handleInvoiceSettingChange('showInvoiceSummary', checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Enable this option to include a summary of the invoice details in the Invoice PDF.
            </p>
          </div>
        </div>

        <div className="border p-3 rounded-md">
          <div className="space-y-1">
            <label className="font-medium block">Invoice Terms</label>
            <Input
              type="number"
              value={invoiceSettings.invoiceTerms}
              onChange={e => handleInvoiceSettingChange('invoiceTerms', parseInt(e.target.value))}
              suffix="days"
              style={{ width: '200px' }}
            />
            <p className="text-sm text-gray-500">
              Enter the number of days from the invoice date to the payment due date.
            </p>
          </div>
        </div>

        {hasUnsavedChanges && (
          <div className="flex justify-end">
            <Button type="primary" onClick={handleSaveInvoiceSettings}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stage Payments</h3>
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          onClick={() => {
            setEditingStage(null);
            setIsModalOpen(true);
          }}
        >
          New
        </Button>
      </div>
      <p className="text-gray-600 mb-4">
        Set up Stage Payments and their respective percentages to auto-allocate invoice amounts from
        the Contract Amount for each job.
      </p>
      <Table
        bordered
        size="middle"
        columns={columns}
        dataSource={stagePayments}
        pagination={false}
        className="rounded-lg"
      />
      <ActionDialogmodel
        title={editingStage ? 'Edit Stage Payment' : 'Add Stage Payment'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStage(null);
        }}
        onSubmit={handleModalSave}
        submitButtonText="Save"
        isEditing={editingStage !== null}
        initialValues={editingStage || {}}
        fields={InvoiceSettingFields}
      />
    </div>
  );
};
