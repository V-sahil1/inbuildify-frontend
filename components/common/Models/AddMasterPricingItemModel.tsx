"use client";

import React, { useState } from "react";
import { Form, Input, Radio, Checkbox, InputNumber, Select, Modal } from "antd";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { createCategoryItem } from "@redux/feature/masterPriceList/masterPriceListThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";

const { TextArea } = Input;
const { Option } = Select;

const AddMasterPricingItemModal = ({ open, onClose, categoryId }: any) => {
    const [form] = Form.useForm();
    const [costType, setCostType] = useState('');
    const filters = useAppSelector((state) => state.floorPlan?.filters);
    const dispatch = useAppDispatch();

    const onFinish = (values: any) => {
        console.log("CategoryId", categoryId)
        console.log("Form values:", values);
        dispatch(createCategoryItem({category_id:categoryId, ...values }));
    };

    const onCostTypeChange = (e: any) => {
        setCostType(e.target.value);
    };

    return (
        <Modal
            title="Add Master Pricing Item"
            open={open}
            onCancel={onClose}
            footer={null}
            width="90%"
            style={{ maxWidth: 800 }}
            bodyStyle={{ padding: '16px 8px' }}
            className="responsive-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: '100%', maxHeight: '70vh', overflowY: 'auto',scrollbarWidth:"none" }}
                className="responsive-form"
            >
                {/* Item Description */}
                <Form.Item
                    label="Item Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter item description" }]}
                    className="form-item-responsive"
                >
                    <TextArea rows={4} placeholder="Enter item description" style={{ width: '100%' }} />
                </Form.Item>

                {/* Short Description */}
                <Form.Item
                    label="Short Description (Optional)"
                    name="short_description"
                    className="form-item-responsive"
                >
                    <Input placeholder="Enter short description" style={{ width: '100%' }} />
                </Form.Item>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Cost Type */}
                    <Form.Item
                        label="Cost Type"
                        name="cost_type"
                        className="form-item-responsive flex-1"
                    >
                        <Radio.Group onChange={onCostTypeChange} style={{ width: '100%' }} defaultValue={"INCLUDED"}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Radio value="INCLUDED">Included</Radio>
                                <Radio value="FIXED">Fixed</Radio>
                                <Radio value="VARIABLE">Variable</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>

                    {/* Cost Options */}
                    <Form.Item
                        label="Cost Options"
                        name="cost_option"
                        className="form-item-responsive flex-1"
                    >
                        <Radio.Group style={{ width: '100%' }}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Radio value="NONE">None</Radio>
                                <Radio value="TBA">TBA</Radio>
                                <Radio value="TBC">TBC</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </div>

                {costType === 'variable' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Form.Item label="Quantity" name="quantity" className="form-item-responsive">
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                onChange={(value) => console.log(value)}
                            />
                        </Form.Item>
                        <Form.Item label="Unit Price" name="unitPrice" className="form-item-responsive">
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                                onChange={(value) => console.log(value)}
                            />
                        </Form.Item>
                    </div>
                )}

                {/* Cost */}
                <Form.Item
                    label={costType === 'variable' ? 'Total Cost' : 'Cost'}
                    name="cost"
                    rules={[{ required: costType === 'fixed', message: "Please enter cost" }]}
                    className="form-item-responsive"
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                        disabled={costType === 'included' || costType === 'variable'}
                    />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Range */}
                    <Form.Item label="Range" name="range" className="form-item-responsive">
                        <Select placeholder="Please select" style={{ width: '100%' }}>
                            {enumArrayToOptions(filters?.ranges).map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Dwelling Type */}
                    <Form.Item label="Dwelling Type" name="dwelling" className="form-item-responsive">
                        <Select placeholder="Please select" style={{ width: '100%' }}>
                            {enumArrayToOptions(filters?.dwellingTypes).map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.List name="conditionsList" initialValue={[{}]}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <div
                                    key={key}
                                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-4 items-center"
                                >
                                    {/* Condition */}
                                    <Form.Item
                                        {...restField}
                                        label="Conditions"
                                        name={[name, "condition"]}
                                        rules={[{ required: true, message: "Please select condition" }]}
                                    >
                                        <Select placeholder="Please select" className="w-full">
                                            <Option value="cond1">Condition 1</Option>
                                            <Option value="cond2">Condition 2</Option>
                                        </Select>
                                    </Form.Item>

                                    {/* Range Start */}
                                    <Form.Item
                                        {...restField}
                                        label="Range - Start"
                                        name={[name, "range_start"]}
                                        rules={[{ required: true, message: "Please enter start range" }]}
                                    >
                                        <InputNumber min={0} className="w-full" />
                                    </Form.Item>

                                    {/* Range End */}
                                    <Form.Item
                                        {...restField}
                                        label="Range - End"
                                        name={[name, "range_end"]}
                                        rules={[{ required: true, message: "Please enter end range" }]}
                                    >
                                        <InputNumber min={0} className="w-full" />
                                    </Form.Item>

                                    {/* Minus Button – hidden if only one row */}
                                    <div className="flex items-center justify-center">
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn-danger flex flex-1 items-center justify-center  h-full rounded hover:bg-gray-300"
                                                onClick={() => remove(name)}
                                            >
                                                <IconMinus />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add Button */}
                            <Form.Item>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => add()}
                                >
                                    <IconPlus /> Add Condition
                                </button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item
                    label="Status"
                    name="status"
                    initialValue="ACTIVE"
                    className="form-item-responsive"
                >
                    <Radio.Group style={{ width: '100%' }}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Radio value="ACTIVE">Active</Radio>
                            <Radio value="INACTIVE">Inactive</Radio>
                        </div>
                    </Radio.Group>
                </Form.Item>

                {/* Show in HL Package */}
                <Form.Item
                    name="show_in_hl_package"
                    valuePropName="checked"
                    className="form-item-responsive mb-6"
                >
                    <Checkbox>Show in HL Package</Checkbox>
                </Form.Item>

                <Form.Item className="mb-0">
                    <button
                        type="submit"
                        className="btn btn-primary w-full md:w-auto px-8 py-2 text-base"
                    >
                        Save Item
                    </button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddMasterPricingItemModal;
