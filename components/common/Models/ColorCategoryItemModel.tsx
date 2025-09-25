"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  Radio,
  Modal,
  message,
  Row,
  Col,
  Switch,
  Button,
  Upload,
  UploadFile,
} from "antd";
import { useAppDispatch } from "@hooks/redux";
import {
  createColourSubCategoryItem,
  updateColourSubCategoryItem,
} from "@redux/feature/color/colorThunk";
import { formDataGenerator } from "@lib/utils/formDataGenerator";
import { SubCategoryItem } from "@redux/feature/color/iColourState";
import {
  nameRules,
  optionalNotesRule,
} from "@lib/constants/formInputValidations";

interface ColorCategoryItemModalProps {
  open: boolean;
  onClose: any;
  categoryId?: string;
  selectedColorSubCategoryId?: string;
  categoryItem?: SubCategoryItem;
}

const ColorCategoryItemModel = ({
  open,
  onClose,
  selectedColorSubCategoryId,
  categoryItem,
}: ColorCategoryItemModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const onFinish = async (values: any) => {
    await form.validateFields();
    const { costType, ...restValues } = values;
    if (!categoryItem) {
      restValues.colorSubCategoryId = selectedColorSubCategoryId;
    }
    restValues.image = values?.image[0]?.originFileObj;
    if (costType === "standard") {
      restValues.standard = true;
    } else {
      restValues.upgrade = true;
    }
    const formData = formDataGenerator(restValues);

    try {
      setLoading(true);
      if (categoryItem) {
        await dispatch(
          updateColourSubCategoryItem({
            id: categoryItem.colorItemId,
            data: formData,
          })
        ).unwrap();
        message.success("Sub category item updated successfully");
      } else {
        await dispatch(createColourSubCategoryItem(formData)).unwrap();
        message.success("Sub category item created successfully");
      }
    } catch (error) {
      message.error(error || "Failed to create sub category item");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const initialValues = categoryItem
    ? {
        ...categoryItem,
        costType: categoryItem.standard ? "standard" : "upgrade",
        image: categoryItem.image
          ? [
              {
                uid: "-1",
                name: "current-image",
                status: "done",
                url: categoryItem.image,
                thumbUrl: categoryItem.image,
              } as UploadFile,
            ]
          : undefined,
      }
    : {};
  return (
    <Modal
      title={
        categoryItem ? "Update Sub category Item" : "Add Sub category Item"
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width="90%"
      centered
      style={{ maxWidth: 800 }}
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
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Item Name" rules={nameRules}>
              <Input placeholder="Enter item name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Item Code"
              rules={[{ required: true, message: "Please enter item code" }]}
            >
              <Input
                maxLength={100}
                minLength={1}
                placeholder="Enter item code"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: Item Code + Cost Type */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="units" label="Units">
              <Input
                maxLength={100}
                minLength={1}
                placeholder="Enter units"
                type="number"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="image"
              label="Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload
                name="image"
                listType="picture"
                multiple={false}
                maxCount={1}
                beforeUpload={() => false}
              >
                <Button>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* <Col span={12}>
    <Form.Item name="supplier" label="Supplier">
      <Select placeholder="Enter supplier name" options={assigneeOptions}/>
    </Form.Item>
  </Col> */}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="costType"
              label="Cost Type"
              rules={[{ required: true, message: "Please select cost type" }]}
            >
              <Radio.Group>
                <Radio value="standard">Standard</Radio>
                <Radio value="upgrade">Upgrade</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="highlightNotesOnPdf"
              label="Highlight notes on PDF"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="notes" label="Notes" rules={optionalNotesRule}>
              <Input.TextArea rows={3} placeholder="Enter notes" />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row>
          <Col span={24} className="text-right">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ColorCategoryItemModel;
