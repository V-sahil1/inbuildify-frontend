"use client";

import React from "react";
import {
  Form,
  Switch,
  InputNumber,
  Input,
  Button,
  Divider,
  Select,
} from "antd";

export const Quotation: React.FC = () => {
  const [form] = Form.useForm();

  const initialValues = {
    allowNewVersion: false,
    mandatoryContact: false,
    mandatoryDwelling: false,
    mandatorySketch: false,
    mandatoryLandTitle: false,
    enableDwellingSize: false,
    enableBuilderCost: false,
    allowNotes: false,
    allowCostAdjustment: true,
    showNotesByDefault: true,
    allowMultiplePackages: false,
    includeAdditionalItems: false,
    autoApproveQuote: false,
    showDefaultPricelist: false,
    hidePriceToCustomer: false,
    enableEstimatedPriceRange: false,
    estimatedPriceRange: 16.0,
    quotationValidity: 60,
    extendValidity: "",
  };

  const handleSubmit = (values: any) => {
    console.log("✅ Submitted Settings:", values);
  };

  return (
    <div className=" rounded-lg shadow-sm">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        {/* --- Switch Settings Section --- */}
        <Form.Item
          label="Allow 'Save as New Version' Option in Quotation"
          name="allowNewVersion"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Make Contact Details mandatory to Issue Quotation"
          name="mandatoryContact"
          valuePropName="checked"
          extra="When contact details are marked as mandatory, user cannot issue quotation (Preview / Email)."
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Make Dwelling Type as Mandatory"
          name="mandatoryDwelling"
          valuePropName="checked"
          extra="User can only view or add pricelist items in quotation after selecting the dwelling type."
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Make Sketch Number as Mandatory"
          name="mandatorySketch"
          valuePropName="checked"
          extra="Lead cannot be closed won without a Sketch Number for the approved quotation."
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Make Land Title as Mandatory"
          name="mandatoryLandTitle"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Enable Dwelling Size"
          name="enableDwellingSize"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Enable Builder Cost"
          name="enableBuilderCost"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Allow Notes in Quotation"
          name="allowNotes"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Allow Cost Adjustment"
          name="allowCostAdjustment"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Show Notes in Quotation by Default"
          name="showNotesByDefault"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Allow Multiple Packages"
          name="allowMultiplePackages"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Include additional items in Price adjusted list"
          name="includeAdditionalItems"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Auto approve Quote when close sale as Won?"
          name="autoApproveQuote"
          valuePropName="checked"
          extra="Enabling this option will automatically update the quotation status to Approved when closing a lead/opportunity as WON."
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Show default Pricelist in additional items list?"
          name="showDefaultPricelist"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Hide Price to Customer"
          name="hidePriceToCustomer"
          valuePropName="checked"
          extra="The quotations issued by the builders checked below will hide the price of individual variations and facades from their customers."
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Enable Estimated Price Range"
          name="enableEstimatedPriceRange"
          valuePropName="checked"
          extra="When this toggle is enabled, user can view the price range while viewing the quotation in PDF."
        >
          <Switch />
        </Form.Item>

        {/* Conditional Field: Estimated Price Range */}
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) =>
            getFieldValue("enableEstimatedPriceRange") && (
              <Form.Item
                label="Estimated Price Range (%)"
                name="estimatedPriceRange"
              >
                <InputNumber min={0} max={100} />
              </Form.Item>
            )
          }
        </Form.Item>

        <Divider />

        <Form.Item
          label="Quotation Validity (in days)"
          name="quotationValidity"
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Extend Validity from Updated Date"
          name="extendValidity"
          extra="Quotation validity period from the quotation updated date, including weekends and holidays."
        >
          <Input placeholder="No days given" />
        </Form.Item>

        <Divider />

        <div>
          <div className="flex justify-between items-center w-full gap-4">
            <Form.Item
              className="w-full"
              label="Rename send for approval button text"
              name="sendForApprovalButtonText"
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-full"
              label="Default Pricelist"
              name="defaultPricelist"
            >
              <Select
                showSearch
                options={[
                  { value: "base-price", label: "Base Price" },
                  { value: "site-cost", label: "Site cost" },
                ]}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};
