"use client";

import React, { useState } from "react";
import { Form, Input, Button, Radio, Checkbox, InputNumber, Select, Switch, Modal } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const AddMasterPricingItemModal = ({ open, onClose, categoryId }: any) => {
    const [form] = Form.useForm();
    const [costType, setCostType] = useState('');

    const onFinish = (values: any) => {
        console.log("CategoryId",categoryId)
        console.log("Form values:", values);
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
                style={{ maxWidth: '100%' }}
                className="responsive-form"
            >
                {/* Item Description */}
                <Form.Item
                    label="Item Description"
                    name="itemDescription"
                    rules={[{ required: true, message: "Please enter item description" }]}
                    className="form-item-responsive"
                >
                    <TextArea rows={4} placeholder="Enter item description" style={{ width: '100%' }} />
                </Form.Item>

                {/* Short Description */}
                <Form.Item 
                    label="Short Description (Optional)" 
                    name="shortDescription"
                    className="form-item-responsive"
                >
                    <Input placeholder="Enter short description" style={{ width: '100%' }} />
                </Form.Item>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Cost Type */}
                    <Form.Item 
                        label="Cost Type" 
                        name="costType"
                        className="form-item-responsive flex-1"
                    >
                        <Radio.Group onChange={onCostTypeChange} style={{ width: '100%' }}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Radio value="included">Included</Radio>
                                <Radio value="fixed">Fixed</Radio>
                                <Radio value="variable">Variable</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>

                    {/* Cost Options */}
                    <Form.Item 
                        label="Cost Options" 
                        name="costOptions"
                        className="form-item-responsive flex-1"
                    >
                        <Radio.Group style={{ width: '100%' }}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Radio value="none">None</Radio>
                                <Radio value="tba">TBA</Radio>
                                <Radio value="tbc">TBC</Radio>
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
                            <Option value="ran1">Range 1</Option>
                            <Option value="ran2">Range 2</Option>
                        </Select>
                    </Form.Item>

                    {/* Dwelling Type */}
                    <Form.Item label="Dwelling Type" name="dwellingType" className="form-item-responsive">
                        <Select placeholder="Please select" style={{ width: '100%' }}>
                            <Option value="dw1">dwelling type 1</Option>
                            <Option value="dw2">dwelling type 2</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Conditions */}
                    <Form.Item label="Conditions" name="conditions" className="form-item-responsive">
                        <Select placeholder="Please select" style={{ width: '100%' }}>
                            <Option value="cond1">Condition 1</Option>
                            <Option value="cond2">Condition 2</Option>
                        </Select>
                    </Form.Item>

                    {/* Range Start */}
                    <Form.Item label="Range - Start" name="rangeStart" className="form-item-responsive">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    {/* Range End */}
                    <Form.Item label="Range - End" name="rangeEnd" className="form-item-responsive">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                {/* Status */}
                <Form.Item 
                    label="Status" 
                    name="status" 
                    initialValue="active"
                    className="form-item-responsive"
                >
                    <Radio.Group style={{ width: '100%' }}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Radio value="active">Active</Radio>
                            <Radio value="inactive">Inactive</Radio>
                        </div>
                    </Radio.Group>
                </Form.Item>

                {/* Show in HL Package */}
                <Form.Item 
                    name="showInHLPackage" 
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
