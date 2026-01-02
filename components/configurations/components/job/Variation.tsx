import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Space, Table, Popconfirm, message } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { variationSettingFields } from '@/components/formFields/VariationSettingFields';
import { useUsersHook } from '@hooks/useUserHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createJobVariationLimit,
  deleteJobVariationLimit,
  fetchJobVariationLimit,
  fetchJobVariationSetting,
  updateJobVariationLimit,
  updateJobVariationSetting,
} from '@redux/feature/admin/job/jobVariation/jobVariationThunk';
import { Status } from '@lib/constants/enum';
import { CustomBulkSelect } from '@/components/common/CustomBulkSelect';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import {
  jobVariationApproval,
  jobVariationApprovalResponse,
  JobVariationSetting,
} from '@redux/feature/admin/job/jobVariation/IJobVariationState';
import { useUserGroupHook } from '@hooks/useUserGroupHook';
import { useRoleHook } from '@hooks/useRoleHook';

export const Variation = () => {
  const dispatch = useAppDispatch();
  const { jobVariationSetting, jobVariationLimit, VariationLimitStatus, status } = useAppSelector(
    state => state.job.jobVariation
  );
  const { userGroupOptions } = useUserGroupHook();
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariation, setEditingVariation] = useState<jobVariationApprovalResponse | null>(
    null
  );
  const { userOptions } = useUsersHook();
  const { roleOptions } = useRoleHook();
  const notifyAfterContract = Form.useWatch('notifySignedVariationOnlyAfterContractPrepared', form);
  const notifySignedVariation = Form.useWatch('notifySignedVariation', form);
  const contractBasedVariationHeader = Form.useWatch('contractBasedVariationHeader', form);

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchVariationSetting();
    }
    if (VariationLimitStatus.fetch === Status.IDLE) {
      fetchVariationLimit();
    }
    if (jobVariationSetting) {
      form.setFieldsValue(jobVariationSetting);
    }
  }, [status.fetch, VariationLimitStatus.fetch]);

  const fetchVariationSetting = async () => {
    try {
      await dispatch(fetchJobVariationSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch variation setting');
    }
  };

  const fetchVariationLimit = async () => {
    try {
      await dispatch(fetchJobVariationLimit()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch variation limit');
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteJobVariationLimit(id)).unwrap();
      message.success('Variation deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete variation');
    }
  };

  const handleVariationSave = async (values: jobVariationApproval) => {
    try {
      if (values) {
        if (editingVariation) {
          const updatedFields = getUpdatedFields(values, editingVariation);
          if (Object.keys(updatedFields).length === 0) {
            setIsModalOpen(false);
            setEditingVariation(null);
            return;
          }
          await dispatch(
            updateJobVariationLimit({
              data: updatedFields,
              id: editingVariation.jobVariationApprovalId,
            })
          ).unwrap();
          message.success('variation updated successfully');
        } else {
          await dispatch(createJobVariationLimit(values)).unwrap();
          message.success('variation created successfully');
        }
        setIsModalOpen(false);
        setEditingVariation(null);
      }
    } catch (error) {
      message.error(error || 'Failed to create variation');
    }
  };

  const handleValuesChange = (_, allValues) => {
    const changed = Object.keys(allValues).some(key => allValues[key] !== jobVariationSetting[key]);
    setIsChanged(changed);
  };

  const handleSave = async () => {
    const values: JobVariationSetting = form.getFieldsValue();
    try {
      const updatedFields = getUpdatedFields(values, jobVariationSetting);
      if (Object.keys(updatedFields).length === 0) {
        setIsChanged(false);
        return;
      }
      await dispatch(updateJobVariationSetting(updatedFields)).unwrap();
      message.success('Variation setting updated successfully');
      setIsChanged(false);
    } catch (error) {
      message.error(error || 'Failed to save variation setting');
    }
  };

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: role => {
        return role.name;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record: jobVariationApprovalResponse) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<IconEdit size={18} />}
            onClick={() => {
              setEditingVariation(record);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this variation?"
            onConfirm={() => handleDelete(record.jobVariationApprovalId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<IconTrash size={18} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        initialValues={jobVariationSetting}
        onValuesChange={handleValuesChange}
        disabled={status.update === Status.PENDING}
      >
        <Form.Item name="allowNotesInVariation" valuePropName="checked" noStyle>
          <InputSwitch name="allowNotesInVariation" label="Allow Notes in Variation" />
        </Form.Item>

        <Form.Item name="allowCostAdjustment" valuePropName="checked" noStyle>
          <InputSwitch name="allowCostAdjustment" label="Allow Cost Adjustment" />
        </Form.Item>

        <Form.Item name="showNotesInVariationByDefault" valuePropName="checked" noStyle>
          <InputSwitch
            name="showNotesInVariationByDefault"
            label="Show Notes in Variation by Default"
          />
        </Form.Item>

        <Form.Item name="drawingChangesRequired" valuePropName="checked" noStyle>
          <InputSwitch name="drawingChangesRequired" label="Drawing Changes Required" />
        </Form.Item>

        <InputSwitch
          name="notifySignedVariation"
          label="Notify Signed Variation"
          description="Murthy Muthuswarny"
        />

        {notifySignedVariation && (
          <div className="flex gap-4">
            <Form.Item
              name="notifySignedVariationUserIds"
              label="Select User"
              className="ml-9"
              rules={[{ required: true, message: 'Please select a type!' }]}
            >
              <CustomBulkSelect
                placeholder="Select User"
                options={userOptions}
                onChange={() => {}}
                className="min-w-[200px]"
              />
            </Form.Item>
            <Form.Item
              name="notifySignedVariationGroupIds"
              label="Select User Group"
              className="ml-9"
              rules={[{ required: true, message: 'Please select a type!' }]}
            >
              <CustomBulkSelect
                placeholder="Select User Group"
                options={userGroupOptions}
                onChange={() => {}}
                className="min-w-[200px]"
              />
            </Form.Item>
          </div>
        )}
        <InputSwitch
          name="notifySignedVariationOnlyAfterContractPrepared"
          label="Notify Signed Variation only after Contract Prepared"
          description="Murthy Muthuswarny"
        />
        {notifyAfterContract && (
          <div className="flex gap-4">
            <Form.Item
              name="notifyAfterContractUserIds"
              label="Select User"
              className="ml-9"
              rules={[{ required: true, message: 'Please select a type!' }]}
            >
              <CustomBulkSelect
                placeholder="Select User"
                options={userOptions}
                onChange={() => {}}
                className="min-w-[200px]"
              />
            </Form.Item>
            <Form.Item
              name="notifyAfterContractGroupIds"
              label="Select User Group"
              className="ml-9"
              rules={[{ required: true, message: 'Please select a type!' }]}
            >
              <CustomBulkSelect
                placeholder="Select User Group"
                options={userGroupOptions}
                onChange={() => {}}
                className="min-w-[200px]"
              />
            </Form.Item>
          </div>
        )}

        <Form.Item
          name="allowedMoveJobToConstructionWithPendingVariation"
          valuePropName="checked"
          noStyle
        >
          <InputSwitch
            name="allowedMoveJobToConstructionWithPendingVariation"
            label="Allowed to Move the Job to Construction Even there is a Pending Variation"
          />
        </Form.Item>

        <Form.Item name="makeRequestedByAndDelayedDaysMandatory" valuePropName="checked" noStyle>
          <InputSwitch
            name="makeRequestedByAndDelayedDaysMandatory"
            label="Make Requested by and Delayed days are Mandatory"
          />
        </Form.Item>

        <Form.Item name="sendMailWhenVariationSelfApproved" valuePropName="checked" noStyle>
          <InputSwitch
            name="sendMailWhenVariationSelfApproved"
            label="Send Mail when Variation is Self Approved"
            description="If the toggle button is On - Mail will be sent once the variation is self approved"
          />
        </Form.Item>

        <Form.Item name="contractBasedVariationHeader" valuePropName="checked" noStyle>
          <InputSwitch
            name="contractBasedVariationHeader"
            label="Contract-Based Variation Header"
            description="When enabled, system shows Pre/Post contract header based on Signed Date. You can configure the labels below."
          />
        </Form.Item>

        {contractBasedVariationHeader ? (
          <div className="flex gap-4">
            <Form.Item name="preContractHeader" label="Pre Contract Header">
              <Input placeholder="Variation - Pre Contract" />
            </Form.Item>
            <Form.Item name="postContractHeader" label="Post Contract Header">
              <Input placeholder="Variation - Post Contract" />
            </Form.Item>
          </div>
        ) : (
          <Form.Item name="contractBasedVariationHeaderTitle" label="Title">
            <Input />
          </Form.Item>
        )}

        {isChanged && (
          <div className="flex justify-end w-full">
            <Button
              type="primary"
              onClick={handleSave}
              disabled={!isChanged}
              loading={status.update === Status.PENDING}
            >
              Save
            </Button>
          </div>
        )}
      </Form>

      <div className="p-3 mt-3 bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Variation approval limits</h3>
            <p>
              Set the variation approval limits for different roles. If the variation exceeds the
              specified amount, manager approval will be required.
            </p>
          </div>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => {
              setEditingVariation(null);
              setIsModalOpen(true);
            }}
          >
            Add Variation
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={jobVariationLimit}
          rowKey="key"
          bordered
          loading={VariationLimitStatus.fetch === Status.PENDING}
        />

        {isModalOpen && (
          <ActionDialogmodel
            title={editingVariation ? 'Edit Variation' : 'Add New Variation'}
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingVariation(null);
            }}
            isEditing={!!editingVariation}
            onSubmit={handleVariationSave}
            submitButtonText={editingVariation ? 'Update' : 'Create'}
            initialValues={
              editingVariation
                ? { ...editingVariation, roleId: editingVariation.role.id }
                : undefined
            }
            fields={variationSettingFields(roleOptions)}
            loading={VariationLimitStatus.update === Status.PENDING}
          />
        )}
      </div>
    </div>
  );
};
