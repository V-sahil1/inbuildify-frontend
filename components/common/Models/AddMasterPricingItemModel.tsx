"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Radio, Checkbox, Select, Modal, message ,Spin} from "antd";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { createCategoryItem } from "@redux/feature/masterPriceList/masterPriceListThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { getConditions, getFloorPlanFilters } from "@redux/feature/floorPlan/floorPlanThunk";
import { enumToReadable } from "@lib/utils/enumToRedable";
import { Status } from "@lib/constants/enum";

const { TextArea } = Input;
const { Option } = Select;

const AddMasterPricingItemModal = ({ open, onClose, categoryId }: any) => {
    const [form] = Form.useForm();
    const [costType, setCostType] = useState('INCLUDED');
    const {filters, status} = useAppSelector((state) => state.floorPlan);
    const dispatch = useAppDispatch();
    
    // New state for button loading
    const [isAddingItem, setIsAddingItem] = useState(false);

    useEffect(() => {
        if (!filters) {
            dispatch(getFloorPlanFilters()).unwrap().then(() => {
            });
        }
        if(status.conditions === Status.IDLE){
            dispatch(getConditions()).unwrap();
        }
    }, [dispatch, filters, status.conditions]); 

    const onFinish = (values: any) => {
        form.validateFields().then((values) => {
            // Start loading state
            setIsAddingItem(true);
            dispatch(createCategoryItem({ category_id: categoryId, ...values }))
                .unwrap()
                .then(() => {
                    message.success("Master Pricing Item added successfully");
                    form.resetFields();
                    onClose();
                })
                .catch((error) => {
                    message.error(error || "Failed to add item."); 
                })
                .finally(() => {
                    setIsAddingItem(false);
                });
        }).catch((error) => {
            console.error('Validation failed:', error);
        });
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
                style={{ maxWidth: '100%', maxHeight: '70vh', overflowY: 'auto', scrollbarWidth: "none" }}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Cost Type */}
                    <Form.Item
                        label="Cost Type"
                        name="cost_type"
                        className="form-item-responsive flex-1"
                        initialValue="INCLUDED" // Set initial value here
                    >
                        <Radio.Group onChange={onCostTypeChange} style={{ width: '100%' }}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Radio value="INCLUDED">Included</Radio>
                                <Radio value="FIXED">Fixed</Radio>
                                <Radio value="VARIABLE">Variable</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>

                    {/* Cost Options */}
                    {costType === 'INCLUDED' ? (
                        <Form.Item label="Cost type text" name="cost_type_text" className="form-item-responsive w-full" rules={[{ required: true, message: "Please enter cost type text" }]}>
                        <Input
                            type="string"
                            style={{ width: '100%' }}
                            onChange={(value) => console.log(value)}
                        />
                    </Form.Item>
                    ) : (
                        <Form.Item
                        label="Cost Options"
                        name="cost_option"
                        className="form-item-responsive flex-1"
                        initialValue="NONE" // Set initial value here
                    >
                        <Radio.Group style={{ width: '100%' }}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Radio value="NONE">None</Radio>
                                <Radio value="TBA">TBA</Radio>
                                <Radio value="TBC">TBC</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                    )}
                </div>


                {/* Cost */}
                <Form.Item
                    label="Cost"
                    name="cost"
                    rules={[{ required: costType !== 'INCLUDED', message: "Please enter cost" }]}
                    className="form-item-responsive"
                >
                    <Input
                        min={0}
                        prefix="$"
                        type="number"
                        style={{ width: '100%' }}
                        disabled={costType === 'INCLUDED'}
                    />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Range */}
                    <Form.Item label="Range" name="range" className="form-item-responsive" rules={[{ required: true, message: "Please select range" }]}>
                        <Select placeholder="Please select" style={{ width: '100%' }}>
                            {enumArrayToOptions(filters?.ranges).map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Dwelling Type */}
                    <Form.Item label="Dwelling Type" name="dwelling" className="form-item-responsive" rules={[{ required: true, message: "Please select dwelling type" }]}>
                        <Select placeholder="Please select" style={{ width: '100%' }}>
                            {enumArrayToOptions(filters?.dwellingTypes).map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.List name="conditions" initialValue={[{}]}>
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
                                        name={[name, "name"]}
                                        // rules={[{ required: true, message: "Please select condition" }]}
                                    >
                                        <Select placeholder="Please select" className="w-full">
                                            {filters?.conditions?.map((condition: { name: string }) => (
                                                <Option key={condition.name} value={condition.name}>
                                                    {enumToReadable(condition.name)}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* Range Start */}
                                    <Form.Item
                                        {...restField}
                                        label="Range - Start"
                                        name={[name, "range_start"]}
                                        // rules={[{ required: true, message: "Please enter start range" }]}
                                    >
                                        <Input min={0} className="w-full" type="number" />
                                    </Form.Item>

                                    {/* Range End */}
                                    <Form.Item
                                        {...restField}
                                        label="Range - End"
                                        name={[name, "range_end"]}
                                        // rules={[{ required: true, message: "Please enter end range" }]}
                                    >
                                        <Input min={0} className="w-full" type="number" />
                                    </Form.Item>

                                    {/* Minus Button – hidden if only one row */}
                                    <div className="flex items-center justify-center">
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn-danger flex flex-1 items-center justify-center h-full rounded hover:bg-gray-300"
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
                        className={`btn btn-primary w-full md:w-auto px-8 py-2 text-base ${isAddingItem ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isAddingItem}
                    >
                        {isAddingItem ? (
                            <div className="flex items-center justify-center">
                                    <Spin size="small" />
                                <span className="ml-2">Adding...</span>
                            </div>
                        ) : (
                            "Add Item"
                        )}
                    </button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddMasterPricingItemModal;