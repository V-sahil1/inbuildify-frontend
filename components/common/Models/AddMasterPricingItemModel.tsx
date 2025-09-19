"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Form, Input, Radio, Checkbox, Select, Modal, message ,Spin} from "antd";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { createCategoryItem, fetchCategories, updateCategoryItem } from "@redux/feature/masterPriceList/masterPriceListThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
// import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { getConditions } from "@redux/feature/floorPlan/floorPlanThunk";
import { enumToReadable } from "@lib/utils/enumToRedable";
import { Status } from "@lib/constants/enum";
import { addPackageItems } from "@redux/feature/package/packageSlice";
import { mapToOptions } from "@lib/utils/rangeAndDwellingObjToOptions";
import SystemRoutes from "@lib/constants/Routes";
import NoDataMessage from "../NoDataMessage"; 

const { TextArea } = Input;
const { Option } = Select;

interface AddMasterPricingItemModalProps {
  open: boolean;
  onClose: any;
  categoryId?: string;
  categoryItem?: any;
  preselectedRange?: string;
  preselectedDwelling?: string;
}

const AddMasterPricingItemModal = ({
    open,
    onClose,
    categoryId,
    categoryItem,
    preselectedRange,
    preselectedDwelling,
  }: AddMasterPricingItemModalProps) => {    
    const [form] = Form.useForm();
    const [costType, setCostType] = useState("INCLUDED");
    const {filters, status} = useAppSelector((state) => state.floorPlan);
    const {range , dwellingType } = useAppSelector((state) => state.types);
    const rangeOptions = mapToOptions(range);
    const dwellingTypeOptions = mapToOptions(dwellingType);
    const { categories , status: mplStatus } = useAppSelector((state) => state.masterPriceList);
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (mplStatus === Status.IDLE) {
        dispatch(fetchCategories());
      }
    }, [dispatch]);

    // New state for button loading
    const [isAddingItem, setIsAddingItem] = useState(false);

    useLayoutEffect(() => {
      if (categoryItem) {
        form.setFieldsValue({
          category_id: categoryItem.categoryId,
          description: categoryItem.description,
          short_description: categoryItem.shortDescription,
          cost_type: categoryItem.costType,
          cost_type_text: categoryItem.costTypeText,
          cost: categoryItem.cost,
          cost_option: categoryItem.costOption,
          show_in_hl_package: categoryItem.showInHlPackage,
          package_only: categoryItem.packageOnly,
          status: categoryItem.status,
          range: categoryItem.rangeName,
          dwelling: categoryItem.dwellingTypeName,
          ...(categoryItem.conditions?.length > 0 && {
            conditions: categoryItem.conditions.map((condition: any) => ({
              name: condition.name,
              range_start: condition.rangeStart,
              range_end: condition.rangeEnd,
            })),
          }),
        });
        setCostType(categoryItem.costType);
      } else {
        form.resetFields();
        setCostType("INCLUDED");
    
        // if provided Pre-fill range and dwelling type only from package modal 
        if (preselectedRange && preselectedDwelling) {
          form.setFieldsValue({
            range: preselectedRange,
            dwelling: preselectedDwelling,
          });
        }
      }
    }, [categoryItem, form, preselectedRange, preselectedDwelling]);

  useEffect(() => {
    if (status.conditions === Status.IDLE) {
      const fetchConditionsData = async () => {
        try {
          await dispatch(getConditions()).unwrap();
        } catch (error) {
          message.error(error);
        }
      };
      fetchConditionsData();
    }
  }, [dispatch, filters, status.conditions]);

  const onFinish = async (values: any) => {
    await form.validateFields();
    try {
      setIsAddingItem(true);

      const payload = {
        ...(categoryId && { category_id: categoryId }),
        ...values,
      };

      if (categoryItem) {
        const res = await dispatch(
        updateCategoryItem({
          payload: values,
          id: categoryItem.categoryItemId,
          })
        ).unwrap();
      } else {
        const response = await dispatch(createCategoryItem(payload)).unwrap();
        if (values.package_only) {
          dispatch(addPackageItems(response));
        }
      }
      message.success("Master Pricing Item added successfully");
      form.resetFields();
      onClose();
    } catch (error) {
      setIsAddingItem(false);
      message.error(error || "Failed to add item.");
    } finally {
      setIsAddingItem(false);
    }
  };

  const onCostTypeChange = (e: any) => {
    const newCostType = e.target.value;
    setCostType(newCostType);
    if (newCostType === "INCLUDED") {
      form.setFieldsValue({ cost: undefined });
      form.setFieldsValue({ cost_option: undefined });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={categoryItem ? "Update Master Pricing Item" : "Add Master Pricing Item"}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width="90%"
      style={{ maxWidth: 800 }}
      // bodyStyle={{ padding: "16px 8px" }}
      className="responsive-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{
          maxWidth: "100%",
          maxHeight: "70vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
        className="responsive-form"
      >
        {/* New Item Category */}
        {!categoryId && (
          <Form.Item
            label="Item Category"
            name="category_id"
            className="form-item-responsive flex-1"
            rules={[{ required: true, message: "Please Select Category" }]}
          >
            <Select placeholder="Please select" style={{ width: "100%" }}>
              {categories?.map((option) => (
                <Option key={option.categoryId} value={option.categoryId}>
                  {option?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Item Description */}
        <Form.Item
          label="Item Description"
          name="description"
          rules={[{ required: true, message: "Please enter item description" }]}
          className="form-item-responsive"
        >
          <TextArea
            rows={4}
            placeholder="Enter item description"
            style={{ width: "100%" }}
            maxLength={1000}
            showCount
          />
        </Form.Item>

        {/* Short Description */}
        <Form.Item
          label="Short Description (Optional)"
          name="short_description"
          className="form-item-responsive"
        >
          <Input
            placeholder="Enter short description"
            style={{ width: "100%" }}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Cost Type */}
          <Form.Item
            label="Cost Type"
            name="cost_type"
            className="form-item-responsive flex-1"
            initialValue="INCLUDED" // Set initial value here
            rules={[{ required: true, message: "Please select cost type" }]}
          >
            <Radio.Group onChange={onCostTypeChange} style={{ width: "100%" }}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Radio value="INCLUDED">Included</Radio>
                <Radio value="FIXED">Fixed</Radio>
                <Radio value="VARIABLE">Variable</Radio>
              </div>
            </Radio.Group>
          </Form.Item>

          {/* Cost Options */}
          {costType === "INCLUDED" ? (
            <Form.Item
              label="Cost type text"
              name="cost_type_text"
              className="form-item-responsive w-full"
              rules={[
                { required: true, message: "Please enter cost type text" },
                {
                  validator: (_: any, value: string) => {
                    // Max 225 characters
                    if (value.length > 225) {
                      return Promise.reject("Cost type text must be at most 225 characters");
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input
                type="string"
                style={{ width: "100%" }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="Cost Options"
              name="cost_option"
              className="form-item-responsive flex-1"
              initialValue="NONE" 
              rules={[{ required: true, message: "Please select cost option" }]}
            >
              <Radio.Group style={{ width: "100%" }}>
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
          rules={[
            { required: costType !== "INCLUDED", message: "Please enter cost" },
          ]}
          className="form-item-responsive"
        >
          <Input
            min={0}
            prefix="$"
            type="number"
            style={{ width: "100%" }}
            disabled={costType === "INCLUDED"}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Range */}
          <Form.Item
            label="Range"
            name="range"
            className="form-item-responsive"
            rules={[{ required: true, message: "Please select range" }]}
          >
            <Select
              placeholder="Please select"
              style={{ width: "100%" }}
              options={rangeOptions}
              disabled={!!preselectedRange} 
              notFoundContent={
                <NoDataMessage
                  label="range type"
                  link={SystemRoutes.DWELLING_AND_RANGE}
                />
              }
            />
          </Form.Item>

          {/* Dwelling Type */}
          <Form.Item
            label="Dwelling Type"
            name="dwelling"
            className="form-item-responsive"
            rules={[{ required: true, message: "Please select dwelling type" }]}
          >
            <Select
              placeholder="Please select"
              style={{ width: "100%" }}
              options={dwellingTypeOptions}
              disabled={!!preselectedDwelling}
              notFoundContent={
                <NoDataMessage
                  label="dwelling type"
                  link={SystemRoutes.DWELLING_AND_RANGE}
                />
              }
            />
          </Form.Item>
        </div>

        <Form.List name="conditions">
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
                    rules={[
                      { required: true, message: "Please select condition" },
                    ]}
                  >
                    <Select placeholder="Please select" className="w-full">
                      {filters?.conditions?.map(
                        (condition: { name: string }) => (
                          <Option key={condition.name} value={condition.name}>
                            {enumToReadable(condition.name)}
                          </Option>
                        )
                      )}
                    </Select>
                  </Form.Item>

                  {/* Range Start */}
                  <Form.Item
                    {...restField}
                    label="Range - Start"
                    name={[name, "range_start"]}
                    rules={[
                      {
                        validator: async (_, value) => {
                          if (value === undefined || value === null) return Promise.resolve();
                  
                          if (value > 100000) {
                            return Promise.reject("Range must not exceed 100,000");
                          }
                          if (value < 0) {
                            return Promise.reject("Range must be greater than 0");
                          }
                  
                          const end = form.getFieldValue(["conditions", name, "range_end"]);
                          if (end !== undefined && value >= end) {
                            return Promise.reject("Range Start must be less than Range End");
                          }
                  
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input min={0} className="w-full" type="number" />
                  </Form.Item>

                  {/* Range End */}
                  <Form.Item
                    {...restField}
                    label="Range - End"
                    name={[name, "range_end"]}
                    rules={[
                      {
                        validator: async (_, value) => {
                          if (value === undefined || value === null) return Promise.resolve();
                  
                          if (value > 100000) {
                            return Promise.reject("Range must not exceed 100,000");
                          }
                          if (value < 0) {
                            return Promise.reject("Range must be greater than 0");
                          }
                          const start = form.getFieldValue(["conditions", name, "range_start"]);
                          if (start !== undefined && value <= start) {
                            return Promise.reject("Range End must be greater than Range Start");
                          }
                  
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input min={0} className="w-full" type="number" />
                  </Form.Item>

                  {/* Minus Button – hidden if only one row */}
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      className="btn-danger flex flex-1 items-center justify-center h-full rounded hover:bg-gray-300"
                      onClick={() => remove(name)}
                    >
                      <IconMinus />
                    </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Status"
            name="status"
            initialValue="ACTIVE"
            className="form-item-responsive"
          >
            <Radio.Group style={{ width: "100%" }} disabled={!categoryId}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Radio value="ACTIVE">Active</Radio>
                <Radio value="INACTIVE">Inactive</Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <div>
            {costType !== "VARIABLE" && (
              <Form.Item
                name="package_only"
                valuePropName="checked"
                className="form-item-responsive"
                initialValue={!categoryId}
              >
                <Checkbox disabled={!categoryId}> Package Only </Checkbox>
              </Form.Item>
            )}
            {/* Show in HL Package */}
            <Form.Item
              name="show_in_hl_package"
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
            className={`btn btn-primary w-full md:w-auto px-8 py-2 text-base ${
              isAddingItem ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isAddingItem}
          >
            {isAddingItem ? (
              <div className="flex items-center justify-center">
                <Spin size="small" />
                <span className="ml-2">
                  {categoryItem ? "Updating..." : "Adding..."}
                </span>
              </div>
            ) : categoryItem ? (
              "Update Item"
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
