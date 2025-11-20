import { Checkbox, Form, Input, Modal, Radio } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { PackageGroupField } from './PackageGroupField';

export const PackageFormModal = ({ title, open, onClose, onSubmit, initialValues, isEditing }) => {
  const [form] = Form.useForm();

  const [labelItems, setLabelItems] = useState([
    { id: 'abc', name: 'abc' },
    { id: 'pqr', name: 'pqr' },
  ]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedDwelling, setSelectedDwelling] = useState([]);
  const [dwellingItems, setDwellingItems] = useState([
    { id: 'abc', name: 'abc' },
    { id: 'pqr', name: 'pqr' },
  ]);
  useEffect(() => {
    isEditing && form.setFieldsValue(initialValues);
  }, []);

  async function handleSubmit() {
    const values = await form.validateFields();
    console.log('submit-------', values);
    onSubmit(values);
  }
  const handleAddNewItem = useCallback(async (setItems, name: string) => {
    // In a real app, you would save this to your backend first
    const newItem = {
      id: Date.now().toString(),
      name,
    };
    setItems(prev => [...prev, newItem]);
    return newItem;
  }, []);

  return (
    <Modal title={title} open={open} onCancel={onClose} onOk={handleSubmit}>
      <Form form={form} className="space-y-2">
        <div>
          <span>Package Name</span>
          <Form.Item name="name">
            <Input />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span>Cost</span>
            <Form.Item name="cost">
              <Input addonBefore="$" type="number" />
            </Form.Item>
          </div>

          <div>
            <span>Builder Cost</span>
            <Form.Item name="builder_cost">
              <Input addonBefore="$" type="number" />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span>Sort Order</span>
            <Form.Item name="sort">
              <Input type="number" />
            </Form.Item>
          </div>

          <div>
            <span>Status</span>
            <Form.Item name="status">
              <Radio.Group
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'InActive', value: 'InActive' },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        <div className='flex gap-2 items-baseline'>
          <span className='min-w-[100px]'>Group Name</span>
          <Form.Item name="group">
            <PackageGroupField form={form} formName="group" label='Group' />
          </Form.Item>
        </div>

        <div className='flex gap-2 items-baseline'> 
          <span className='min-w-[100px]'>Label Name</span>
          <Form.Item name="range">
            <MultiSelectDropdown
              items={labelItems}
              selectedItems={selectedLabels}
              onSelectionChange={v => {
                setSelectedLabels(v);
                form.setFieldValue('range', v);
              }}
              onAddNewItem={name => handleAddNewItem(setLabelItems, name)}
              placeholder="Range"
            />
          </Form.Item>
        </div>

        <div className='flex gap-2 items-baseline'>
          <span className='min-w-[100px]'>Dwelling Type</span>
          <Form.Item name="dwellingType">
            <MultiSelectDropdown
              items={dwellingItems}
              selectedItems={selectedDwelling}
              onSelectionChange={v => {
                setSelectedDwelling(v);
                form.setFieldValue('dwellingType', v);
              }}
              onAddNewItem={name => handleAddNewItem(setDwellingItems, name)}
              placeholder="Dwelling"
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 items-baseline mt-2">
          <Form.Item name="allowAddPricelistItem" valuePropName="checked" initialValue={true}>
            <Checkbox />
          </Form.Item>
          <span>Allow to add items from price list items</span>
        </div>

        <div className="flex gap-2 items-baseline">
          <Form.Item name="allowRemovePackageItem" valuePropName="checked" initialValue={true}>
            <Checkbox />
          </Form.Item>
          <span>Allow to remove package items</span>
        </div>
      </Form>
    </Modal>
  );
};
