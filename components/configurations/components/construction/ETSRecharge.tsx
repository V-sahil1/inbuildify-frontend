'use client';
import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Popconfirm,
  Switch,
} from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';

interface ApprovalLimit {
  key: string;
  role: string;
  amount: number;
}

export const ETSRecharge: React.FC = () => {
  const [data, setData] = useState<ApprovalLimit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ApprovalLimit | null>(null);
  const [enableEts, setEnableEts] = useState(true);
  const [enableRecharge, setEnableRecharge] = useState(true);
  const [signatureSection, setSignatureSection] = useState(true);
  const [form] = Form.useForm();

  const handleAddNew = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: ApprovalLimit) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    setData(prev => prev.filter(item => item.key !== key));
    message.success('Record deleted successfully');
  };

  const handleSubmit = (values: any) => {
    if (editingRecord) {
      // Update existing record
      setData(data.map(item => (item.key === editingRecord.key ? { ...item, ...values } : item)));
    } else {
      // Add new record
      setData([...data, { ...values, key: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'key',
      render: (_: string, __: ApprovalLimit, index: number) => index + 1,
      width: 80,
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Actions',
      render: (_: any, record: ApprovalLimit) => (
        <Space>
          <Button icon={<IconEdit />} type="link" onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={() => handleDelete(record.key)}
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
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="pt-1">
            <Switch checked={enableEts} onChange={setEnableEts} />
          </div>
          <div>
            <div className="text-gray-800 font-medium text-base">
              Enable ETS Supplier Acknowledgement
            </div>
            <div className="text-gray-600 text-sm mt-1 leading-relaxed">
              When the toggle is <span className="font-semibold">ON</span> - This setting allows you
              to send ETS requests to suppliers or trades for approval. Their response will be
              captured and recorded in the system.
              <br />
              When the toggle is <span className="font-semibold">OFF</span> - The option to send ETS
              for acknowledgement will not be displayed.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="pt-1">
            <Switch checked={enableRecharge} onChange={setEnableRecharge} />
          </div>
          <div>
            <div className="text-gray-800 font-medium text-base">
              Enable Recharge Supplier Acknowledgement
            </div>
            <div className="text-gray-600 text-sm mt-1 leading-relaxed">
              When the toggle is <span className="font-semibold">ON</span> - This setting allows you
              to send Recharge Notifications to suppliers or trades. Their acknowledgements will be
              captured and recorded in the system.
              <br />
              When the toggle is <span className="font-semibold">OFF</span> - The option to send a
              recharge notification will not be displayed.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="pt-1">
            <Switch checked={signatureSection} onChange={setSignatureSection} />
          </div>
          <div>
            <div className="text-gray-800 font-medium text-base">Signature and Section</div>
            <div className="text-gray-600 text-sm mt-1 leading-relaxed">
              When the toggle is <span className="font-semibold">ON</span> - The exported ETS PDF
              will include signature sections for both Supervisor and Manager (if their signatures
              are uploaded in their user profiles, they will be prepopulated). The Recharge PDF will
              include a signature section for the supplier.
              <br />
              When the toggle is <span className="font-semibold">OFF</span> - The signature sections
              will be excluded from both ETS and Recharge PDFs.
            </div>
          </div>
        </div>
      </div>

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

      <Table dataSource={data} columns={columns} pagination={false} />

      <ActionDialogmodel
        open={isModalOpen}
        title={editingRecord ? 'Edit Approval Limit' : 'Add Approval Limit'}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onSubmit={values => {
          handleSubmit(values);
          form.resetFields();
        }}
        initialValues={editingRecord || {}}
        fields={[
          {
            label: 'Role',
            name: 'role',
            type: 'select',
            options: [
              {
                label: 'Construction Manager',
                value: 'construction manager',
              },
            ],
            rules: [{ required: true, message: 'Please select a role' }],
          },
          {
            label: 'Amount',
            name: 'amount',
            type: 'number',
            rules: [{ required: true, message: 'Please enter an amount' }],
          },
        ]}
      />
    </div>
  );
};
