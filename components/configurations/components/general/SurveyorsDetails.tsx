'use client';

import React, { useState } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message } from 'antd';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { stateRegionOptions } from 'data/options';

const SurveyorsDetails = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(data.length === 0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleFinish = (values: any) => {
    if (editingIndex !== null) {
      const updated = [...data];
      updated[editingIndex] = values;
      setData(updated);
      message.success('Surveyor details updated successfully!');
      setEditingIndex(null);
    } else {
      setData([...data, values]);
      message.success('Surveyor details saved successfully!');
    }
    form.resetFields();
    setIsFormVisible(false);
  };

  const handleEdit = (record: any, index: number) => {
    form.setFieldsValue(record);
    setEditingIndex(index);
    setIsFormVisible(true);
  };

  const handleDelete = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    setData(updated);
    message.success('Surveyor removed!');
    if (updated.length === 0) setIsFormVisible(true);
  };

  const columns = [
    { title: 'Name', dataIndex: 'surveyorName', key: 'surveyorName' },
    {
      title: 'Address',
      render: (_: any, record: any) =>
        `${record.address1 || ''}${
          record.address2 ? ', ' + record.address2 : ''
        }, ${record.citySuburb || ''}`,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: any, index: number) => (
        <Space>
          <Button type="text" icon={<IconEdit />} onClick={() => handleEdit(record, index)} />
          <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(index)}>
            <Button type="text" danger icon={<IconTrash />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {isFormVisible ? (
        <>
          <h2 className="text-xl font-semibold border-b pb-2">Surveyor Details</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="grid grid-cols-3 gap-6 mt-4"
          >
            <Form.Item
              label="Surveyor Name"
              name="surveyorName"
              rules={[{ required: true, message: 'Enter Surveyor Name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Enter Email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Enter Phone Number' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="ABN" name="abn">
              <Input />
            </Form.Item>
            <Form.Item label="Register Number" name="registerNumber">
              <Input />
            </Form.Item>
            <div></div> {/* spacer */}
            <Form.Item
              label="Address1"
              name="address1"
              rules={[{ required: true, message: 'Enter Address1' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Address2" name="address2">
              <Input />
            </Form.Item>
            <Form.Item
              label="City / Suburb"
              name="citySuburb"
              rules={[{ required: true, message: 'Enter City / Suburb' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="State / Region"
              name="stateRegion"
              rules={[{ required: true, message: 'Select State / Region' }]}
            >
              <Select options={stateRegionOptions} placeholder="Please Select" />
            </Form.Item>
            <Form.Item
              label="Zip / Postal Code"
              name="zipPostalCode"
              rules={[{ required: true, message: 'Enter Zip / Postal Code' }]}
            >
              <Input />
            </Form.Item>
            <div></div> {/* spacer */}
            <div className="col-span-3 flex justify-end gap-4 pt-4">
              <Button
                onClick={() => {
                  if (data.length === 0) return;
                  setIsFormVisible(false);
                  form.resetFields();
                  setEditingIndex(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Surveyor Details</h2>
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={() => {
                setIsFormVisible(true);
                form.resetFields();
                setEditingIndex(null);
              }}
            >
              New
            </Button>
          </div>
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            rowKey={record => record.email || record.phone}
          />
        </>
      )}
    </div>
  );
};

export default SurveyorsDetails;
