'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Button, Form, Switch, Input, Popconfirm, message } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { InvoiceSettingFields } from '@/components/formFields/InvoiceSettingFields';
import {
  JobInvoiceSetting,
  JobInvoiceStage,
} from '@redux/feature/admin/job/jobInvoice/IJobInvoiceState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import {
  createJobInvoiceStage,
  deleteJobInvoiceStage,
  fetchJobInvoiceSetting,
  fetchJobInvoiceStage,
  updateJobInvoiceSetting,
  updateJobInvoiceStage,
} from '@redux/feature/admin/job/jobInvoice/jobInvoiceThunk';

export const Invoice: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<JobInvoiceStage | null>(null);
  const dispatch = useAppDispatch();
  const { jobInvoiceSetting, status, jobInvoiceStage, InvoiceStageStatus } = useAppSelector(
    state => state.job.jobInvoice
  );
  const [invoiceSettings, setInvoiceSettings] = useState<JobInvoiceSetting>({
    showInvoiceSummaryInPdf: false,
    invoiceTermsDays: 0,
  });

  useEffect(() => {
    if (jobInvoiceSetting) {
      setInvoiceSettings({
        showInvoiceSummaryInPdf: jobInvoiceSetting.showInvoiceSummaryInPdf ?? false,
        invoiceTermsDays: jobInvoiceSetting.invoiceTermsDays ?? 0,
      });
    }
  }, [jobInvoiceSetting]);

  const hasUnsavedChanges = useMemo(() => {
    if (!jobInvoiceSetting) return false;
    const changedFields = getUpdatedFields(invoiceSettings, jobInvoiceSetting);
    return Object.keys(changedFields).length > 0;
  }, [invoiceSettings, jobInvoiceSetting]);

  const fetchJobInvoiceSettingData = useCallback(async () => {
    try {
      await dispatch(fetchJobInvoiceSetting()).unwrap();
    } catch (error) {
      message.error(error || 'failed to load invoice setting');
    }
  }, [dispatch]);

  const fetchJobInvoiceStageData = useCallback(async () => {
    try {
      await dispatch(fetchJobInvoiceStage()).unwrap();
    } catch (error) {
      message.error(error || 'failed to load invoice setting');
    }
  }, [dispatch]);

  useEffect(() => {
    if (status?.fetch === Status.IDLE) {
      fetchJobInvoiceSettingData();
    }
    if (InvoiceStageStatus?.fetch === Status.IDLE) {
      fetchJobInvoiceStageData();
    }
  }, [
    status?.fetch,
    InvoiceStageStatus?.fetch,
    dispatch,
    fetchJobInvoiceSettingData,
    fetchJobInvoiceStageData,
  ]);

  const [form] = Form.useForm();

  const handleEdit = (record: JobInvoiceStage) => {
    setEditingStage(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    try {
      dispatch(deleteJobInvoiceStage(key)).unwrap();
    } catch (error) {
      console.error('Delete stage error:', error);
      message.error(error || 'Failed to delete stage');
    }
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: JobInvoiceStage) => (
        <span>
          {text}{' '}
          {/* {record.isDeposit && (
            <span className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">Deposit</span>
          )} */}
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
      render: (_, record: JobInvoiceStage) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<IconEdit size={18} className="text-blue-500" />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this stage?"
            onConfirm={() => handleDelete(record.jobInvoiceStagePaymentId)}
          >
            <Button type="text" icon={<IconTrash size={18} className="text-red-500" />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleSaveInvoiceSettings = async () => {
    if (!invoiceSettings || !jobInvoiceSetting) return false;

    const updatedSetting = getUpdatedFields(invoiceSettings, jobInvoiceSetting);
    if (Object.keys(updatedSetting).length === 0) {
      message.info('No changes to save');
      return;
    }

    try {
      await dispatch(updateJobInvoiceSetting(updatedSetting)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to update Invoice setting');
    }
  };

  const handleJobInvoiceStageSubmit = async (values: JobInvoiceStage) => {
    try {
      const data = {
        ...values,
        percentage: Number(values.percentage),
        sortOrder: Number(values.sortOrder),
      };

      if (editingStage) {
        await dispatch(
          updateJobInvoiceStage({
            data,
            jobInvoiceStagePaymentId: editingStage.jobInvoiceStagePaymentId,
          })
        ).unwrap();
        message.success('Stage payment updated successfully');
      } else {
        console.log('create in UI');
        await dispatch(createJobInvoiceStage(data)).unwrap();
        message.success('Stage payment created successfully');
      }

      setIsModalOpen(false);
      setEditingStage(null);
    } catch (error) {
      message.error(error || (editingStage ? 'Failed to update stage' : 'Failed to create stage'));
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border p-3 rounded-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Show Invoice Summary in PDF</span>
              <Switch
                checked={invoiceSettings.showInvoiceSummaryInPdf}
                onChange={checked =>
                  setInvoiceSettings(prev => ({
                    ...prev,
                    showInvoiceSummaryInPdf: checked,
                  }))
                }
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
              value={invoiceSettings.invoiceTermsDays}
              onChange={e =>
                setInvoiceSettings(prev => ({
                  ...prev,
                  invoiceTermsDays: parseInt(e.target.value) || 0,
                }))
              }
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
            <Button
              type="primary"
              onClick={handleSaveInvoiceSettings}
              loading={status?.update === Status.PENDING}
            >
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
        dataSource={jobInvoiceStage}
        pagination={false}
        className="rounded-lg"
        rowKey="jobInvoiceStagePaymentId"
      />
      <ActionDialogmodel
        title={editingStage ? 'Edit Stage Payment' : 'Add Stage Payment'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStage(null);
        }}
        onSubmit={handleJobInvoiceStageSubmit}
        submitButtonText="Save"
        isEditing={editingStage !== null}
        initialValues={editingStage || {}}
        fields={InvoiceSettingFields}
        loading={InvoiceStageStatus?.update === Status.PENDING}
      />
    </div>
  );
};
