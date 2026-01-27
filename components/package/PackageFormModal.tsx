import { Checkbox, Form, Input, message, Modal, Radio } from 'antd';
import React, { useEffect } from 'react';
import { PackageGroupField } from './PackageGroupField';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createPackageGroup,
  fetchPackageGroup,
  updatePackageGroup,
} from '@redux/feature/package/packageThunk';
import { Status } from '@lib/constants/enum';
import { createRange, updateRange } from '@redux/feature/admin/sales/range/rangeThunk';
import {
  createDwellingType,
  updateDwellingType,
} from '@redux/feature/admin/sales/dwellingType/dwellingTypeThunk';

export const PackageFormModal = ({ title, open, onClose, onSubmit, initialValues, isEditing }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { group, status } = useAppSelector(state => state.package);
  const { rangeOptions } = useDwellingAndRangeHook({ type: 'range' });
  const { dwellingTypeOptions } = useDwellingAndRangeHook({ type: 'dwellingType' });
  useEffect(() => {
    isEditing && form.setFieldsValue(initialValues);
  }, []);
  async function fetchGroup() {
    try {
      await dispatch(fetchPackageGroup()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch package group');
    }
  }
  useEffect(() => {
    if (status.group === Status.IDLE) {
      fetchGroup();
    }
  }, [status.group]);

  async function handleSubmit() {
    const values = await form.validateFields();
    onSubmit(values);
  }

  const handleGroupSubmit = async (values, selectedPackage) => {
    try {
      if (!!selectedPackage) {
        await dispatch(
          updatePackageGroup({ data: values, id: selectedPackage.packageGroupId })
        ).unwrap();
        message.success('Package group updated successfully');
      } else {
        await dispatch(createPackageGroup(values)).unwrap();
        message.success('Package group saved successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to save package group');
    }
  };

  const handleRangeSubmit = async (values, selectedRange) => {
    try {
      if (!!selectedRange) {
        await dispatch(updateRange({ data: values, id: selectedRange.rangeId })).unwrap();
        message.success('Range updated successfully');
      } else {
        await dispatch(createRange(values)).unwrap();
        message.success('Range saved successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to save range');
    }
  };
  const handleDwellingTypeSubmit = async (values, selectedDwellingType) => {
    try {
      if (!!selectedDwellingType) {
        await dispatch(
          updateDwellingType({ data: values, id: selectedDwellingType.dwellingTypeId })
        ).unwrap();
        message.success('DwellingType updated successfully');
      } else {
        await dispatch(createDwellingType(values)).unwrap();
        message.success('DwellingType saved successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to save dwelling type');
    }
  };

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
            <Form.Item name="builderCost">
              <Input addonBefore="$" type="number" />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span>Sort Order</span>
            <Form.Item name="sortOrder">
              <Input type="number" />
            </Form.Item>
          </div>

          <div>
            <span>Status</span>
            <Form.Item name="status">
              <Radio.Group
                options={[
                  { label: 'Active', value: true },
                  { label: 'InActive', value: false },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex gap-2 items-baseline">
          <span className="min-w-[100px]">Group Name</span>
          <Form.Item name="packageGroupId">
            <PackageGroupField
              form={form}
              formName="packageGroupId"
              label="Group"
              fields={[
                { label: 'Group Namw', name: 'name', type: 'text' },
                { label: 'noOfPackages', name: 'noOfPackages', type: 'number' },
              ]}
              onSubmit={handleGroupSubmit}
              data={group?.map(item => ({
                ...item,
                name: item.name,
                id: item.packageGroupId,
              }))}
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 items-baseline">
          <span className="min-w-[100px]">Label Name</span>
          <Form.Item name="rangeId">
            <PackageGroupField
              form={form}
              formName="rangeId"
              label="Range"
              fields={[{ label: 'Range Name', name: 'name', type: 'text' }]}
              onSubmit={handleRangeSubmit}
              data={rangeOptions?.map(item => ({
                ...item,
                name: item.label,
                id: item.value,
              }))}
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 items-baseline">
          <span className="min-w-[100px]">Dwelling Type</span>
          <Form.Item name="dwellingTypeId">
            <PackageGroupField
              form={form}
              formName="dwellingTypeId"
              label="Dwelling Type"
              fields={[{ label: 'Dwelling Type Name', name: 'name', type: 'text' }]}
              onSubmit={handleDwellingTypeSubmit}
              data={dwellingTypeOptions?.map(i => ({ ...i, id: i.value, name: i.label }))}
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 items-baseline mt-2">
          <Form.Item name="allowAddItemFromPricelist" valuePropName="checked" initialValue={true}>
            <Checkbox />
          </Form.Item>
          <span>Allow to add items from price list items</span>
        </div>

        <div className="flex gap-2 items-baseline">
          <Form.Item name="allowRemovePackageItems" valuePropName="checked" initialValue={true}>
            <Checkbox />
          </Form.Item>
          <span>Allow to remove package items</span>
        </div>
      </Form>
    </Modal>
  );
};
