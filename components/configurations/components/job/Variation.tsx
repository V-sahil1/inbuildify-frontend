import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Space, Table, Popconfirm, Select } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { variationSettingFields } from '@/components/formFields/VariationSettingFields';
import { useUsersHook } from '@hooks/useUserHook';
interface Variation {
  key: string;
  role: string;
  amount: number;
}

export const Variation = () => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariation, setEditingVariation] = useState<Variation | null>(null);
  const { userOptions } = useUsersHook();

  const notifyAfterContract = Form.useWatch('notifySignedVariationAfterContract', form);
  const notifySignedVariation = Form.useWatch('notifySignedVariation', form);

  const handleDelete = (key: string) => {
    setVariations(variations.filter(item => item.key !== key));
  };

  const handleVariationSave = (values: any) => {
    if (editingVariation) {
      setVariations(
        variations.map(item =>
          item.key === editingVariation.key ? { ...values, key: item.key } : item
        )
      );
    } else {
      setVariations([...variations, { ...values, key: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingVariation(null);
  };

  const defaultValues = {
    role: '',
    amount: 0,
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
    setInitialValues(defaultValues);
  }, [form]);

  const handleValuesChange = (_, allValues) => {
    const changed = Object.keys(allValues).some(key => allValues[key] !== initialValues[key]);
    setIsChanged(changed);
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    console.log('✅ Saved Values:', values);
    setInitialValues(values);
    setIsChanged(false);
  };

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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
      render: (_: any, record: Variation) => (
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
            onConfirm={() => handleDelete(record.key)}
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
        initialValues={defaultValues}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="allowNotesInVariation" valuePropName="checked" noStyle>
          <InputSwitch name="allowNotesInVariation" label="Allow Notes in Variation" />
        </Form.Item>

        <Form.Item name="allowCostAdjustment" valuePropName="checked" noStyle>
          <InputSwitch name="allowCostAdjustment" label="Allow Cost Adjustment" />
        </Form.Item>

        <Form.Item name="showNotesByDefault" valuePropName="checked" noStyle>
          <InputSwitch name="showNotesByDefault" label="Show Notes in Variation by Default" />
        </Form.Item>

        <Form.Item name="drawingChangesRequired" valuePropName="checked" noStyle>
          <InputSwitch name="drawingChangesRequired" label="Drawing Changes Required" />
        </Form.Item>

        <InputSwitch
          name="notifySignedVariation"
          label="Notify Signed Variation only after Contract Prepared"
          description="Murthy Muthuswarny"
        />

        {notifySignedVariation && (
          <Form.Item
            name="notifySignedVariation"
            label="Select Notification Type"
            className="ml-9"
            rules={[{ required: true, message: 'Please select a type!' }]}
          >
            <Select
              placeholder="Select a type"
              options={userOptions}
            />
          </Form.Item>
        )}
        <InputSwitch
          name="notifySignedVariationAfterContract"
          label="Notify Signed Variation only after Contract Prepared"
          description="Murthy Muthuswarny"
        />
        {notifyAfterContract && (
          <Form.Item
            name="notifySignedVariationAfterContract"
            label="Select Notification Type"
            className="ml-9"
            rules={[{ required: true, message: 'Please select a type!' }]}
          >
            <Select
              placeholder="Select a type"
              options={userOptions}
            />
          </Form.Item>
        )}

        <Form.Item name="allowJobMoveWithPendingVariation" valuePropName="checked" noStyle>
          <InputSwitch
            name="allowJobMoveWithPendingVariation"
            label="Allowed to Move the Job to Construction Even there is a Pending Variation"
          />
        </Form.Item>

        <Form.Item name="makeRequestedByAndDelayedDaysMandatory" valuePropName="checked" noStyle>
          <InputSwitch
            name="makeRequestedByAndDelayedDaysMandatory"
            label="Make Requested by and Delayed days are Mandatory"
          />
        </Form.Item>

        <Form.Item name="sendMailOnSelfApproval" valuePropName="checked" noStyle>
          <InputSwitch
            name="sendMailOnSelfApproval"
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
        <Form.Item name="variationTitle" label="Title" valuePropName="checked">
          <Input />
        </Form.Item>

        {isChanged && (
          <div className="flex justify-end w-full">
            <Button type="primary" onClick={handleSave} disabled={!isChanged}>
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

        <Table columns={columns} dataSource={variations} rowKey="key" bordered />

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
          initialValues={editingVariation || undefined}
          fields={variationSettingFields}
        />
      </div>
    </div>
  );
};
