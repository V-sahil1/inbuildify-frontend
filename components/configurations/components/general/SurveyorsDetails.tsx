'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Table, Space, Popconfirm, message } from 'antd';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createSurveyor,
  deleteServeyor,
  fetchAllServeyor,
  updateServeyor,
} from '@redux/feature/admin/general/surveyor/surveyorThunk';
import { RootState } from '@redux/feature/store';
import { getStatesByCountryIdThunk } from '@redux/feature/location/locationThunk';
import { Status } from '@lib/constants/enum';
import { Surveyor } from '@redux/feature/admin/general/surveyor/ISurveyorState';
import {
  abnRules,
  addressRules,
  emailRules,
  nameRules,
  phoneRules,
  zipCodeRules,
} from '@lib/constants/formInputValidations';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const SurveyorsDetails = () => {
  const [form] = Form.useForm();
  const { states, status: stateStatus } = useAppSelector((state: RootState) => state.location);
  const { surveyor, status } = useAppSelector((state: RootState) => state.general.surveyor);
  const [isFormVisible, setIsFormVisible] = useState(surveyor.length === 0);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const stateOption = states && states.map(state => ({ label: state.name, value: state.stateId }));

  useEffect(() => {
    if (stateStatus === Status.IDLE) {
      fetchState();
    }

    if (status.fetch === Status.IDLE) {
      fetchSurveyor();
    }
  }, [status.fetch, stateStatus]);
  const fetchState = async () => {
    try {
      await dispatch(getStatesByCountryIdThunk('1950a40a-03df-42be-9ab4-c2bdf324cef0')).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch states');
    }
  };
  const fetchSurveyor = async () => {
    try {
      await dispatch(fetchAllServeyor()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Servayor Details');
    }
  };
  const handleFinish = async (values: Surveyor) => {
    if (values) {
      try {
        if (editingIndex !== null) {
          const prevValues = surveyor.filter(i => i.surveyorId === editingIndex)[0];
          const { isUpdated, updatedFields } = getUpdatedFields<Surveyor>(values, prevValues);
          if (!isUpdated) {
            message.info('No changes detected');
            return;
          }
          await dispatch(
            updateServeyor({ data: updatedFields, surveyorId: editingIndex })
          ).unwrap();
          message.success('Surveyor details updated successfully!');
          setEditingIndex(null);
        } else {
          await dispatch(createSurveyor(values)).unwrap();
          message.success('Surveyor details saved successfully!');
        }
        form.resetFields();
        setIsFormVisible(false);
      } catch (error) {
        message.error(error || 'Failed to save surveyor details');
      }
    }
  };

  const handleEdit = (record: Surveyor) => {
    form.setFieldsValue(record);
    setEditingIndex(record.surveyorId);
    setIsFormVisible(true);
  };

  const handleDelete = async (index: string) => {
    try {
      await dispatch(deleteServeyor(index)).unwrap();
      message.success('Surveyor deleted successfully!');
    } catch (error) {
      message.error(error || 'Failed to delete surveyor');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Address',
      render: (_, record: Surveyor) =>
        `${record.address1 || ''}${
          record.address2 ? ', ' + record.address2 : ''
        }, ${record.city || ''}`,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: '',
      key: 'actions',
      render: (_, record: Surveyor) => (
        <Space>
          <Button type="text" icon={<IconEdit />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.surveyorId)}
          >
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
            disabled={status.create === Status.PENDING}
          >
            <Form.Item label="Surveyor Name" name="name" rules={nameRules}>
              <Input
                placeholder="Constance Hernandez"
                disabled={status.create === Status.PENDING}
              />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={emailRules}>
              <Input
                placeholder="constance@mailinator.com"
                disabled={status.create === Status.PENDING}
              />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={phoneRules}>
              <Input
                placeholder="7654832318"
                disabled={status.create === Status.PENDING}
                maxLength={15}
                minLength={10}
              />
            </Form.Item>
            <Form.Item label="ABN" name="abnNumber" rules={abnRules}>
              <Input
                placeholder="47021213123"
                disabled={status.create === Status.PENDING}
                maxLength={11}
              />
            </Form.Item>
            <Form.Item
              label="Register Number"
              name="registrationNumber"
              rules={[{ len: 4, message: 'Regestration number must be of 4 digits' }]}
            >
              <Input placeholder="9793" disabled={status.create === Status.PENDING} maxLength={4} />
            </Form.Item>
            <div></div> {/* spacer */}
            <Form.Item label="Address1" name="address1" rules={addressRules}>
              <Input placeholder="927 Fabien Drive" disabled={status.create === Status.PENDING} />
            </Form.Item>
            <Form.Item
              label="Address2"
              name="address2"
              rules={[{ min: 10, message: 'Address must be at least 10 characters' }]}
            >
              <Input
                placeholder="Et consectetur vel m"
                disabled={status.create === Status.PENDING}
              />
            </Form.Item>
            <Form.Item
              label="City / Suburb"
              name="city"
              rules={[
                { required: true, message: 'Enter City / Suburb' },
                { min: 3, message: 'City must be at least 3 characters' },
              ]}
            >
              <Input placeholder="Brisbane" disabled={status.create === Status.PENDING} />
            </Form.Item>
            <Form.Item
              label="State / Region"
              name="stateId"
              rules={[{ required: true, message: 'Select State / Region' }]}
            >
              <Select
                options={stateOption}
                placeholder="Please Select"
                disabled={status.create === Status.PENDING}
              />
            </Form.Item>
            <Form.Item label="Zip / Postal Code" name="zipPostalCode" rules={zipCodeRules}>
              <Input placeholder="4067" disabled={status.create === Status.PENDING} maxLength={4} />
            </Form.Item>
            <div></div> {/* spacer */}
            <div className="col-span-3 flex justify-end gap-4 pt-4">
              <Button
                onClick={() => {
                  if (surveyor.length === 0) return;
                  setIsFormVisible(false);
                  form.resetFields();
                  setEditingIndex(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={status.create === Status.PENDING}>
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
            dataSource={surveyor}
            columns={columns}
            pagination={false}
            rowKey={record => record.email || record.phone}
            loading={status.fetch === Status.PENDING}
          />
        </>
      )}
    </div>
  );
};

export default SurveyorsDetails;
