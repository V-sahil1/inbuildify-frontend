'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Form, Input, Radio, Checkbox, Select, Modal, message } from 'antd';
import { IconPlus, IconCheck, IconX, IconEdit, IconTrash } from '@tabler/icons-react';
import {
  createCategoryItem,
  fetchPricelistMaster,
  updateCategoryItem,
  createCategoryItemCondition,
  updateCategoryItemCondition,
  deleteCategoryItemCondition,
} from '@redux/feature/masterPriceList/masterPriceListThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { addPackageItems } from '@redux/feature/package/packageSlice';
import Loading from '../Loading';
import RangeSelect from '../custom-selects/RangeSelect';
import DwellingTypeSelect from '../custom-selects/DwellingTypeSelect';
import { IPriceList, IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { PackageGroupField } from '@/components/package/PackageGroupField';
import { createRange, updateRange } from '@redux/feature/admin/sales/range/rangeThunk';
import {
  createDwellingType,
  updateDwellingType,
} from '@redux/feature/admin/sales/dwellingType/dwellingTypeThunk';

export const UOM_OPTIONS = [
  { label: 'Square Feet (sq ft)', value: 'SQ_FT', category: 'AREA' },
  { label: 'Square Meter (sq m)', value: 'SQ_M', category: 'AREA' },
  { label: 'Square Yard (sq yd)', value: 'SQ_YD', category: 'AREA' },
  { label: 'Acre', value: 'ACRE', category: 'AREA' },
  { label: 'Hectare', value: 'HECTARE', category: 'AREA' },
  { label: 'Cubic Meter (m³)', value: 'CUBIC_METER', category: 'VOLUME' },
  { label: 'Cubic Feet (ft³)', value: 'CUBIC_FEET', category: 'VOLUME' },
  { label: 'Kilogram (kg)', value: 'KG', category: 'WEIGHT' },
  { label: 'Ton', value: 'TON', category: 'WEIGHT' },
  { label: 'Meter (m)', value: 'METER', category: 'LENGTH' },
  { label: 'Feet (ft)', value: 'FEET', category: 'LENGTH' },
  { label: 'Number (Nos)', value: 'NOS', category: 'COUNT' },
  { label: 'Units', value: 'UNITS', category: 'COUNT' },
  { label: 'Liter (L)', value: 'LITER', category: 'LIQUID' },
];

const { TextArea } = Input;

interface AddMasterPricingItemModalProps {
  open: boolean;
  onClose: () => void;
  category?: IPriceList;
  categoryItem?: IPriceListItem;
  // preselectedRange?: string;
  // preselectedDwelling?: string;
  extraField?: boolean;
}

const AddMasterPricingItemModal = ({
  open,
  onClose,
  category,
  categoryItem,
  // preselectedRange,
  // preselectedDwelling,
  extraField,
}: AddMasterPricingItemModalProps) => {
  const [form] = Form.useForm();
  const [costType, setCostType] = useState('Included');
  const { priceMaster, status: mplStatus } = useAppSelector(state => state.masterPriceList);
  const { rangeOptions } = useDwellingAndRangeHook({ type: 'range' });
  const { dwellingTypeOptions } = useDwellingAndRangeHook({ type: 'dwellingType' });
  const masterPriceOptions = priceMaster?.map((item: IPriceList) => ({
    label: item.name,
    value: item.priceListId,
  }));
  const allConditionOptions = [
    { label: 'Site Fall(mm)', value: 'site_fall' },
    { label: 'Land Size', value: 'land_size' },
    { label: 'Corner Block', value: 'corner_block' },
    { label: 'Land Fill', value: 'land_fill' },
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (mplStatus.priceMaster === Status.IDLE) {
      dispatch(fetchPricelistMaster({}));
    }
  }, [dispatch]);

  // New state for button loading
  const [isAddingItem, setIsAddingItem] = useState(false);

  // State for condition management
  const [editingConditionId, setEditingConditionId] = useState<string | null>(null);
  const [createdConditions, setCreatedConditions] = useState<Set<string>>(new Set());
  const [conditionLoading, setConditionLoading] = useState<string | null>(null);

  const conditionsList = Form.useWatch('conditions', form) || [];
  const costOptionValue = Form.useWatch('costOption', form);
  const isCostDisabled = costOptionValue === 'tba' || costOptionValue === 'tbc';

  // Get selected condition names to filter out already selected ones
  const selectedConditionNames = conditionsList
    .map((condition: any) => condition?.conditionName)
    .filter(Boolean);

  const conditionOption = allConditionOptions.filter(
    option =>
      !selectedConditionNames.includes(option.value) ||
      // Keep the option if it's the current one being edited
      (editingConditionId &&
        conditionsList.find(
          (c: any, index: number) =>
            c?.priceListItemConditionId === editingConditionId && c?.conditionName === option.value
        ))
  );

  // Handler functions for condition operations
  const handleSaveCondition = async (fieldName: string) => {
    const isExistingCondition = createdConditions.has(fieldName);
    try {
      setConditionLoading(fieldName);
      const conditionData = form.getFieldValue(['conditions', fieldName]);
      const condition = form
        .getFieldValue('conditions')
        ?.find(i => i.priceListItemConditionId === fieldName);
      const payload = isExistingCondition ? condition : conditionData;

      if (!categoryItem?.priceListItemId || !category?.priceListId) {
        message.error('Missing required information for condition operation');
        return;
      }
      const commonPayload = {
        conditionName: payload?.conditionName,
        rangeEnd: payload?.conditionName !== 'corner_block' ? payload?.rangeEnd : undefined,
        rangeStart: payload?.conditionName !== 'corner_block' ? payload?.rangeStart : undefined,
        status: payload?.conditionName === 'corner_block' ? payload?.status : undefined,
      };

      if (isExistingCondition) {
        // Update existing condition
        await dispatch(
          updateCategoryItemCondition({
            id: fieldName,
            pricelistId: category.priceListId,
            data: commonPayload,
          })
        ).unwrap();
        message.success('Condition updated successfully');
      } else {
        // Create new condition
        const result = await dispatch(
          createCategoryItemCondition({
            id: categoryItem.priceListItemId,
            pricelistId: category.priceListId,
            data: {
              ...commonPayload,
              priceListItemId: categoryItem.priceListItemId,
            },
          })
        ).unwrap();
        setCreatedConditions(prev => new Set(prev).add(result.priceListItemConditionId));
        message.success('Condition created successfully');
      }

      setEditingConditionId(null);
    } catch (error) {
      message.error(
        error?.message || `Failed to ${isExistingCondition ? 'update' : 'create'} condition`
      );
    } finally {
      setConditionLoading(null);
    }
  };

  const handleEditCondition = (conditionId: string) => {
    setEditingConditionId(conditionId);
  };

  const handleDeleteCondition = async (conditionId: string, removeFn?: (index: number) => void) => {
    try {
      setConditionLoading(conditionId);

      if (!categoryItem?.priceListItemId || !category?.priceListId) {
        message.error('Missing required information for condition deletion');
        return;
      }

      await dispatch(
        deleteCategoryItemCondition({
          id: conditionId,
          priceListId: category.priceListId,
          pricelistItemId: categoryItem.priceListItemId,
        })
      ).unwrap();

      setCreatedConditions(prev => {
        const newSet = new Set(prev);
        newSet.delete(conditionId);
        return newSet;
      });

      // Remove the condition from form using remove function if available
      if (removeFn) {
        removeFn(parseInt(conditionId));
      } else {
        // Fallback: Remove the condition from form manually
        const currentConditions = form.getFieldValue('conditions') || [];
        const updatedConditions = currentConditions.filter(
          (_: any, index: number) => index.toString() !== conditionId
        );
        form.setFieldValue('conditions', updatedConditions);
      }

      message.success('Condition deleted successfully');
    } catch (error) {
      message.error('Failed to delete condition');
    } finally {
      setConditionLoading(null);
    }
  };

  const handleCancelCondition = (fieldName: string, removeFn?: (index: number) => void) => {
    setEditingConditionId(null);
    if (!createdConditions.has(fieldName) && removeFn) {
      removeFn(parseInt(fieldName));
    }
  };

  useLayoutEffect(() => {
    if (categoryItem) {
      form.setFieldsValue({
        ...categoryItem,
        priceListId: categoryItem?.priceList?.id,
        dwellingTypeId: categoryItem?.dwellingType?.map(i => i.id),
        rangeId: categoryItem?.range?.map(i => i.id),
        conditions: categoryItem.conditions,
      });
      setCostType(categoryItem.costType);
    } else {
      form.resetFields();
      setCostType('Included');
    }
  }, [categoryItem, form]);

  useEffect(() => {
    if (categoryItem?.conditions && Array.isArray(categoryItem.conditions)) {
      const existingConditionIds = categoryItem.conditions.map(
        (condition: any) => condition.priceListItemConditionId
      );
      setCreatedConditions(new Set(existingConditionIds));
    }
  }, [categoryItem?.conditions]);

  const onFinish = async (values: IPriceListItem) => {
    if (values.costType === 'Included') {
      delete values.builderCost;
      delete values.cost;
      delete values.costOption;
    } else {
      delete values.costTypeText;
      if (values.costOption === 'tba' || values.costOption === 'tbc') {
        delete values.builderCost;
        delete values.cost;
      }
    }
    await form.validateFields();
    try {
      setIsAddingItem(true);

      if (categoryItem) {
        const { priceListId, conditions, ...newPayload } = values;
        const res = await dispatch(
          updateCategoryItem({
            payload: newPayload,
            id: categoryItem.priceListItemId,
          })
        ).unwrap();
      } else {
        const response = await dispatch(
          createCategoryItem({
            ...values,
            priceListId: !!category ? category?.priceListId : values?.priceListId,
          })
        ).unwrap();
        if (values.showOnlyInPackage) {
          dispatch(addPackageItems(response));
        }
      }
      message.success('Master Pricing Item added successfully');
      form.resetFields();
      onClose();
    } catch (error) {
      setIsAddingItem(false);
      message.error(error || 'Failed to add item.');
    } finally {
      setIsAddingItem(false);
    }
  };

  const onCostTypeChange = e => {
    const newCostType = e.target.value;
    setCostType(newCostType);
    if (newCostType === 'Included') {
      form.setFieldsValue({ cost: undefined });
      form.setFieldsValue({ cost_option: undefined });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleRangeSubmit = async (values, selectedRange) => {
    try {
      if (!!selectedRange) {
        await dispatch(updateRange({ data: values, id: selectedRange.id })).unwrap();
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
        await dispatch(updateDwellingType({ data: values, id: selectedDwellingType.id })).unwrap();
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
    <Modal
      title={categoryItem ? 'Update Master Pricing Item' : 'Add Master Pricing Item'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width="90%"
      style={{ maxWidth: 800 }}
      className="responsive-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{
          maxWidth: '100%',
          maxHeight: '70vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}
        className="responsive-form"
      >
        {/* New Item Category */}
        {/* {!category && ( */}
        <Form.Item
          label="Item Category"
          name="priceListId"
          className="form-item-responsive flex-1"
          rules={[{ required: true, message: 'Please Select Category' }]}
          initialValue={category?.priceListId}
        >
          <Select
            placeholder="Please select"
            style={{ width: '100%' }}
            options={masterPriceOptions}
            disabled={!!category}
          />
        </Form.Item>
        {/* )} */}

        {/* Item Description */}
        <Form.Item
          label="Item Description"
          name="itemDescription"
          rules={[{ required: true, message: 'Please enter item description' }]}
          className="form-item-responsive"
        >
          <TextArea
            rows={4}
            placeholder="Enter item description"
            style={{ width: '100%', resize: 'none' }}
            maxLength={1000}
            showCount
          />
        </Form.Item>

        {/* Short Description */}
        <Form.Item
          label="Short Description (Optional)"
          name="shortDescription"
          className="form-item-responsive"
        >
          <Input
            placeholder="Enter short description"
            style={{ width: '100%' }}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Cost Type */}
          <Form.Item
            label="Cost Type"
            name="costType"
            className="form-item-responsive flex-1"
            initialValue="Included"
            rules={[{ required: true, message: 'Please select cost type' }]}
          >
            <Radio.Group
              onChange={onCostTypeChange}
              style={{ width: '100%' }}
              options={[
                { label: 'INCLUDED', value: 'Included' },
                { label: 'FIXED', value: 'Fixed' },
                { label: 'VARIABLE', value: 'Variable' },
              ]}
            />
          </Form.Item>

          {/* Cost Options */}
          {costType === 'Included' ? (
            <Form.Item
              label="Cost type text"
              name="costTypeText"
              className="form-item-responsive w-full"
              rules={[
                { required: true, message: 'Please enter cost type text' },
                {
                  validator: (_, value: string) => {
                    if (!value) return Promise.resolve();
                    if (value.trim().length < 3)
                      return Promise.reject('Cost type text must be at least 3 characters');
                    if (value.length > 225) {
                      return Promise.reject('Cost type text must be at most 225 characters');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="string" style={{ width: '100%' }} />
            </Form.Item>
          ) : (
            <Form.Item
              label="Cost Options"
              name="costOption"
              className="form-item-responsive flex-1"
              initialValue="none"
              rules={[{ required: true, message: 'Please select cost option' }]}
            >
              <Radio.Group
                style={{ width: '100%' }}
                options={[
                  { label: 'NONE', value: 'none' },
                  { label: 'TBA', value: 'tba' },
                  { label: 'TBC', value: 'tbc' },
                ]}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'tba' || val === 'tbc') {
                    form.setFieldsValue({ cost: undefined, builderCost: undefined });
                  }
                }}
              />
            </Form.Item>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Cost */}
          <Form.Item
            label="Cost"
            name="cost"
            rules={[{ required: costType !== 'Included' && !isCostDisabled, message: 'Please enter cost' }]}
            className="form-item-responsive"
          >
            <Input
              min={0}
              max={100000}
              prefix="$"
              type="number"
              style={{ width: '100%' }}
              onWheel={e => e.currentTarget.blur()}
              onKeyDown={e => (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.preventDefault()}
              disabled={costType === 'Included' || isCostDisabled}
            />
          </Form.Item>
          {/* Builder Cost */}
          {extraField && (
            <Form.Item
              label="Builder Cost"
              name="builderCost"
              rules={[{ required: costType !== 'Included' && !isCostDisabled, message: 'Please enter cost' }]}
              className="form-item-responsive"
            >
              <Input
                min={0}
                max={100000}
                prefix="$"
                type="number"
                style={{ width: '100%' }}
                onWheel={e => e.currentTarget.blur()}
                onKeyDown={e => (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.preventDefault()}
                disabled={costType === 'Included' || isCostDisabled}
              />
            </Form.Item>
          )}
        </div>
        {extraField && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Form.Item
              label="Sort Order"
              name="sortOrder"
              className="form-item-responsive"
              initialValue={category?.items?.length + 1 || 1}
              rules={[
                { required: true, message: 'Please enter sort order' },
                {
                  validator: (_, value) => {
                    const num = Number(value);
                    if (value !== undefined && value !== null && value !== '') {
                      if (!Number.isInteger(num) || num <= 0) {
                        return Promise.reject('Sort order must be a positive number');
                      }

                      const selectedPriceListId = form.getFieldValue('priceListId');
                      const selectedCategory = priceMaster?.find(
                        (item: IPriceList) => item.priceListId === selectedPriceListId
                      );

                      const itemsCount = selectedCategory?.items?.length || 0;
                      const maxSort = categoryItem ? Math.max(itemsCount, 1) : itemsCount + 1;

                      if (num > maxSort) {
                        return Promise.reject(`Sort order must not be greater than ${maxSort}`);
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                min={1}
                max={100000}
                onWheel={e => e.currentTarget.blur()}
                onKeyDown={e => (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.preventDefault()}
              />
            </Form.Item>
            <Form.Item label="UOM" name="uom" className="form-item-responsive">
              <Select
                placeholder="Select Unit of Measurement"
                options={UOM_OPTIONS}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                allowClear
              />
            </Form.Item>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Range */}
          {
            <Form.Item
              label="Range"
              name="rangeId"
              className="form-item-responsive"
              rules={[{ required: true, message: 'Please select range' }]}
            >
              {extraField ? (
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
              ) : (
                <RangeSelect />
              )}
            </Form.Item>
          }

          {/* Dwelling Type */}
          <Form.Item
            label="Dwelling Type"
            name="dwellingTypeId"
            className="form-item-responsive"
            rules={[{ required: true, message: 'Please select dwelling type' }]}
          >
            {extraField ? (
              <PackageGroupField
                form={form}
                formName="dwellingTypeId"
                label="Dwelling Type"
                fields={[{ label: 'Dwelling Type Name', name: 'name', type: 'text' }]}
                onSubmit={handleDwellingTypeSubmit}
                data={dwellingTypeOptions?.map(i => ({ ...i, id: i.value, name: i.label }))}
              />
            ) : (
              <DwellingTypeSelect />
            )}
          </Form.Item>
        </div>

        <Form.List name="conditions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                const conditionData = form.getFieldValue(['conditions', name.toString()]);
                const conditionName = conditionData?.conditionName;
                console.log('condition----', conditionName, conditionData);
                const conditionId = conditionData?.priceListItemConditionId;
                return (
                  <div
                    key={key}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-4 items-center"
                  >
                    {/* Condition */}
                    <Form.Item
                      {...restField}
                      label="Conditions"
                      name={[name.toString(), 'conditionName']}
                      rules={[{ required: true, message: 'Please select condition' }]}
                    >
                      <Select
                        placeholder="Please select"
                        className="w-full"
                        options={conditionOption}
                        disabled={conditionId && editingConditionId !== conditionId}
                      />
                    </Form.Item>

                    {/* Range Start */}
                    {conditionName !== 'corner_block' && (
                      <Form.Item
                        {...restField}
                        label="Range - Start"
                        name={[name.toString(), 'rangeStart']}
                        dependencies={[['conditions', name.toString(), 'rangeEnd']]}
                        rules={[
                          { required: true, message: 'Please enter range start' },
                          {
                            validator: async (_, value) => {
                              if (value === undefined || value === null) return Promise.resolve();

                              const start = Number(value);
                              if (start > 100000)
                                return Promise.reject('Range must not exceed 100,000');
                              if (start < 0) return Promise.reject('Range must be greater than 0');

                              const end = form.getFieldValue([
                                'conditions',
                                name.toString(),
                                'rangeEnd',
                              ]);
                              if (end !== undefined && end !== null && start >= Number(end)) {
                                return Promise.reject('Range Start must be less than Range End');
                              }

                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          min={0}
                          max={100000}
                          className="w-full"
                          disabled={conditionId && editingConditionId !== conditionId}
                          onWheel={e => e.currentTarget.blur()}
                          onKeyDown={e => (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.preventDefault()}
                        />
                      </Form.Item>
                    )}

                    {/* Range End */}
                    {conditionName !== 'corner_block' && (
                      <Form.Item
                        {...restField}
                        label="Range - End"
                        name={[name.toString(), 'rangeEnd']}
                        dependencies={[['conditions', name.toString(), 'rangeStart']]}
                        rules={[
                          { required: true, message: 'Please enter range end' },
                          {
                            validator: async (_, value) => {
                              if (value === undefined || value === null) return Promise.resolve();

                              const end = Number(value);
                              if (end > 100000)
                                return Promise.reject('Range must not exceed 100,000');
                              if (end < 0) return Promise.reject('Range must be greater than 0');

                              const start = form.getFieldValue([
                                'conditions',
                                name.toString(),
                                'rangeStart',
                              ]);
                              if (start !== undefined && start !== null && end <= Number(start)) {
                                return Promise.reject('Range End must be greater than Range Start');
                              }

                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          min={0}
                          max={100000}
                          className="w-full"
                          disabled={conditionId && editingConditionId !== conditionId}
                          onWheel={e => e.currentTarget.blur()}
                          onKeyDown={e => (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.preventDefault()}
                        />
                      </Form.Item>
                    )}
                    {/* status */}
                    {conditionName === 'corner_block' && (
                      <Form.Item
                        label="Status"
                        name={[name.toString(), 'status']}
                        dependencies={[['conditions', name.toString(), 'status']]}
                      >
                        <Radio.Group
                          options={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false },
                          ]}
                          disabled={conditionId && editingConditionId !== conditionId}
                        />
                      </Form.Item>
                    )}
                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-1">
                      {editingConditionId === (conditionId || name.toString()) ? (
                        <>
                          <button
                            type="button"
                            className="flex items-center justify-center p-1 rounded hover:bg-green-100 text-green-600"
                            onClick={() => handleSaveCondition(conditionId || name.toString())}
                            disabled={conditionLoading === (conditionId || name.toString())}
                          >
                            <IconCheck size={16} />
                          </button>
                          <button
                            type="button"
                            className="flex items-center justify-center p-1 rounded hover:bg-gray-100 text-gray-600"
                            onClick={() =>
                              handleCancelCondition(conditionId || name.toString(), remove)
                            }
                            disabled={conditionLoading === (conditionId || name.toString())}
                          >
                            <IconX size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          {conditionId && createdConditions.has(conditionId) ? (
                            <>
                              <button
                                type="button"
                                className="flex items-center justify-center p-1 rounded hover:bg-blue-100 text-blue-600"
                                onClick={() => handleEditCondition(conditionId)}
                                disabled={conditionLoading === conditionId}
                              >
                                <IconEdit size={16} />
                              </button>
                              <button
                                type="button"
                                className="flex items-center justify-center p-1 rounded hover:bg-red-100 text-red-600"
                                onClick={() => handleDeleteCondition(conditionId, remove)}
                                disabled={conditionLoading === conditionId}
                              >
                                <IconTrash size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              {categoryItem && (
                                <button
                                  type="button"
                                  className="flex items-center justify-center p-1 rounded hover:bg-green-100 text-green-600"
                                  onClick={() =>
                                    handleSaveCondition(conditionId || name.toString())
                                  }
                                  disabled={conditionLoading === (conditionId || name.toString())}
                                >
                                  <IconCheck size={16} />
                                </button>
                              )}
                              <button
                                type="button"
                                className="flex items-center justify-center p-1 rounded hover:bg-gray-100 text-gray-600"
                                onClick={() =>
                                  handleCancelCondition(conditionId || name.toString(), remove)
                                }
                                disabled={conditionLoading === (conditionId || name.toString())}
                              >
                                <IconX size={16} />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add Button */}
              <Form.Item>
                <button type="button" className="btn btn-secondary" onClick={() => add()}>
                  <IconPlus /> Add Condition
                </button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          label="Status"
          name="status"
          initialValue="active"
          className="form-item-responsive"
        >
          <Radio.Group
            style={{ width: '100%' }}
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </Form.Item>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {extraField && (
            <div>
              <Form.Item
                name="includeByDefault"
                valuePropName="checked"
                className="form-item-responsive"
                initialValue={false}
              >
                <Checkbox>Include By Default</Checkbox>
              </Form.Item>
              <Form.Item
                name="allowRemoveFromQuotation"
                valuePropName="checked"
                className="form-item-responsive"
                initialValue={false}
              >
                <Checkbox>Do not allow to remove from Quotation</Checkbox>
              </Form.Item>
            </div>
          )}
          <div>
            <Form.Item
              name="showOnlyInPackage"
              valuePropName="checked"
              className="form-item-responsive"
              initialValue={false}
            >
              <Checkbox> Package Only </Checkbox>
            </Form.Item>

            <Form.Item
              name="showInHlPackage"
              valuePropName="checked"
              className="form-item-responsive mb-6"
              initialValue={false}
            >
              <Checkbox>Show in HL Package</Checkbox>
            </Form.Item>
          </div>
        </div>

        <Form.Item className="mb-0">
          <button
            type="submit"
            className={`btn btn-primary w-full md:w-auto px-8 py-2 text-base ${isAddingItem ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isAddingItem}
          >
            {isAddingItem ? (
              <div className="flex items-center justify-center">
                <Loading type="secondary" />
                <span className="ml-2">{categoryItem ? 'Updating...' : 'Adding...'}</span>
              </div>
            ) : categoryItem ? (
              'Update Item'
            ) : (
              'Add Item'
            )}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMasterPricingItemModal;
