'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Space, message, Popconfirm, Switch } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createETSRehargeItem,
  deleteETSRehargeItem,
  fetchAllETSRehargeItem,
  fetchETSRechargeSetting,
  updateETSRechargeSetting,
  updateETSRehargeItem,
} from '@redux/feature/admin/construction/constructionETSRecharge/ETSRechargeThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { useRoleHook } from '@hooks/useRoleHook';
import {
  ETSRechargeItem,
  IETSRechargeSetting,
} from '@redux/feature/admin/construction/constructionETSRecharge/ETSRechargeState';

export const ETSRecharge: React.FC = () => {
  const dispatch = useAppDispatch();

  const { setting, etsItems, etsItemStatus, status } = useAppSelector(
    state => state.construction.etsRecharge
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ETSRechargeItem | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [form] = Form.useForm();
  const { roleOptions } = useRoleHook();

  const fetchSetting = async () => {
    try {
      await dispatch(fetchETSRechargeSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch setting');
    }
  };

  const fetchETSItems = async () => {
    try {
      await dispatch(fetchAllETSRehargeItem()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch ETS items');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchSetting();
    }
    if (etsItemStatus.fetch === Status.IDLE) {
      fetchETSItems();
    }
    if (setting) {
      form.setFieldsValue(setting);
    }
  }, [status.fetch, etsItemStatus.fetch]);

  const handleSettingSubmit = async values => {
    try {
      const { isUpdated, updatedFields } = getUpdatedFields(values, setting);
      if (!isUpdated) {
        message.error('No changes detected');
        return;
      }
      await dispatch(updateETSRechargeSetting(updatedFields)).unwrap();
      message.success('Setting updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update setting');
    }
  };

  const handleValueChange = (_, allValues: IETSRechargeSetting) => {
    const { isUpdated } = getUpdatedFields(allValues, setting);
    setIsChanged(isUpdated);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: ETSRechargeItem) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (key: string) => {
    try {
      await dispatch(deleteETSRehargeItem(key)).unwrap();
      message.success('ETS item deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete record');
    }
  };

  const handleSubmit = async (values: ETSRechargeItem) => {
    try {
      if (editingRecord) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, editingRecord);
        if (!isUpdated) {
          setEditingRecord(null);
          setIsModalOpen(false);
          return;
        }
        await dispatch(
          updateETSRehargeItem({
            id: editingRecord.constructionEtsRechargeApprovalId,
            data: updatedFields,
          })
        ).unwrap();
        message.success('ETS item updated successfully');
      } else {
        await dispatch(createETSRehargeItem(values)).unwrap();
        message.success('ETS item added successfully');
      }
      setEditingRecord(null);
      setIsModalOpen(false);
    } catch (error) {
      message.error(error || 'Failed to add new record');
    }
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'key',
      render: (_, __, index: number) => index + 1,
      width: 80,
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      render: (roleName: string) => roleName,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Actions',
      render: (_, record: ETSRechargeItem) => (
        <Space>
          <Button icon={<IconEdit />} type="link" onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={() => handleDelete(record.constructionEtsRechargeApprovalId)}
          >
            <Button danger type="link" icon={<IconTrash />} />
          </Popconfirm>
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <Form
        form={form}
        initialValues={setting}
        onFinish={handleSettingSubmit}
        onValuesChange={handleValueChange}
        disabled={status.create === Status.PENDING}
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="pt-1">
              <Form.Item name="enableEtsSupplier" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
            <div>
              <div className="text-gray-800 font-medium text-base">
                Enable ETS Supplier Acknowledgement
              </div>
              <div className="text-gray-600 text-sm mt-1 leading-relaxed">
                When the toggle is <span className="font-semibold">ON</span> - This setting allows
                you to send ETS requests to suppliers or trades for approval. Their response will be
                captured and recorded in the system.
                <br />
                When the toggle is <span className="font-semibold">OFF</span> - The option to send
                ETS for acknowledgement will not be displayed.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="pt-1">
              <Form.Item name="enableRechargeSupplier" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
            <div>
              <div className="text-gray-800 font-medium text-base">
                Enable Recharge Supplier Acknowledgement
              </div>
              <div className="text-gray-600 text-sm mt-1 leading-relaxed">
                When the toggle is <span className="font-semibold">ON</span> - This setting allows
                you to send Recharge Notifications to suppliers or trades. Their acknowledgements
                will be captured and recorded in the system.
                <br />
                When the toggle is <span className="font-semibold">OFF</span> - The option to send a
                recharge notification will not be displayed.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="pt-1">
              <Form.Item name="signatureSection" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
            <div>
              <div className="text-gray-800 font-medium text-base">Signature and Section</div>
              <div className="text-gray-600 text-sm mt-1 leading-relaxed">
                When the toggle is <span className="font-semibold">ON</span> - The exported ETS PDF
                will include signature sections for both Supervisor and Manager (if their signatures
                are uploaded in their user profiles, they will be prepopulated). The Recharge PDF
                will include a signature section for the supplier.
                <br />
                When the toggle is <span className="font-semibold">OFF</span> - The signature
                sections will be excluded from both ETS and Recharge PDFs.
              </div>
            </div>
          </div>
        </div>

        {isChanged && (
          <div className="text-end mt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={status.create === Status.PENDING}
              disabled={status.create === Status.PENDING}
            >
              Save
            </Button>
          </div>
        )}
      </Form>

      {/* Section heading & description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          ETS &amp; Recharge Approval Limits
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Set approval limits for ETS and Recharge requests based on each role. If a request exceeds
          the limit, it will be sent for approval through the reporting hierarchy.
        </p>
        <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">
          <li>Within the limit: The approver can approve the request directly.</li>
          <li>
            Above the limit: The request will be sent to the person's reporting to for approval.
          </li>
          <li>
            Still above the limit: The request will continue moving up the reporting levels (eg:
            Site Supervisor → Construction Manager → General Manager → Director) until approved.
          </li>
          <li>No limit set: The approver can approve any amount without restriction.</li>
        </ul>
        <p className="text-gray-600 text-sm mt-3">
          The system automatically manages the approval process to reduce manual work and speed up
          approvals.
        </p>
      </div>
      <div className="flex justify-between items-center my-4">
        <h3 className="text-base font-semibold text-gray-700">ETS & Recharge Approval Limits</h3>
        <Button type="primary" icon={<IconPlus />} onClick={handleAddNew}>
          New
        </Button>
      </div>

      <Table
        dataSource={etsItems}
        columns={columns}
        pagination={false}
        loading={etsItemStatus.fetch === Status.PENDING}
      />

      {isModalOpen && (
        <ActionDialogmodel
          open={isModalOpen}
          title={editingRecord ? 'Edit Approval Limit' : 'Add Approval Limit'}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingRecord(null);
          }}
          onSubmit={values => {
            handleSubmit(values);
          }}
          isEditing={!!editingRecord}
          initialValues={editingRecord || {}}
          fields={[
            {
              label: 'Role',
              name: 'roleId',
              type: 'select',
              options: roleOptions,
              rules: [{ required: true, message: 'Please select a role' }],
            },
            {
              label: 'Amount',
              name: 'amount',
              type: 'number',
              rules: [{ required: true, message: 'Please enter an amount' }],
            },
          ]}
          loading={etsItemStatus.create === Status.PENDING}
        />
      )}
    </div>
  );
};
