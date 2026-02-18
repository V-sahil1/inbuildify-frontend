'use client';

import React, { useEffect } from 'react';
import { Form, Switch, InputNumber, Input, Button, Divider, Select, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import {
  fetchQuotationSetting,
  updateQuotationSetting,
} from '@redux/feature/admin/sales/quotation/quotationThunk';
import { quotationSetting } from '@redux/feature/admin/sales/quotation/IQuotationState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import NoDataMessage from '@/components/common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import { fetchPricelistMaster } from '@redux/feature/masterPriceList/masterPriceListThunk';

export const Quotation: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { quotationSetting, status } = useAppSelector(state => state.sales.quotation);
  const { priceMaster, status: priceMasterStatus } = useAppSelector(state => state.masterPriceList);
  const isDisabled = status.update === Status.PENDING;
  const pricelistOptions =
    priceMaster &&
    priceMaster.map(item => ({
      label: item.name,
      value: item.priceListId,
    }));
  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchData();
    }
    if (priceMasterStatus.priceMaster === Status.IDLE) {
      getPriceclist();
    }
    if (quotationSetting) {
      form.setFieldsValue(quotationSetting);
    }
  }, [status.fetch, priceMasterStatus.priceMaster]);
  async function fetchData() {
    try {
      await dispatch(fetchQuotationSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch quotation settings');
    }
  }
  async function getPriceclist() {
    try {
      await dispatch(fetchPricelistMaster({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch price list');
    }
  }

  const handleSubmit = async (values: quotationSetting) => {
    try {
      const { isUpdated, updatedFields } = getUpdatedFields<quotationSetting>(
        values,
        quotationSetting
      );
      if (!isUpdated) {
        message.info('No changes detected');
        return;
      }
      await dispatch(
        updateQuotationSetting({ data: updatedFields, id: quotationSetting?.quotationSettingsId })
      ).unwrap();
      message.success('Quotation settings updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update quotation settings');
    }
  };

  return (
    <div className=" rounded-lg shadow-sm">
      <Form
        form={form}
        layout="vertical"
        initialValues={quotationSetting}
        onFinish={handleSubmit}
        disabled={isDisabled}
      >
        {/* --- Switch Settings Section --- */}
        <Form.Item
          label="Allow 'Save as New Version' Option in Quotation"
          name="allowSaveAsNewVersion"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Make Contact Details mandatory to Issue Quotation"
          name="mandatoryContactDetails"
          valuePropName="checked"
          extra={
            <p className="text-font-color-400">
              When contact details are marked as mandatory, user cannot issue quotation (Preview /
              Email).
            </p>
          }
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Make Dwelling Type as Mandatory"
          name="mandatoryDwellingType"
          valuePropName="checked"
          extra={
            <p className="text-font-color-400">
              User can only view or add pricelist items in quotation after selecting the dwelling
              type.
            </p>
          }
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Make Sketch Number as Mandatory"
          name="mandatorySketchNumber"
          valuePropName="checked"
          extra={
            <p className="text-font-color-400">
              Lead cannot be closed won without a Sketch Number for the approved quotation.
            </p>
          }
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

        <Form.Item label="Enable Dwelling Size" name="enableDwellingSize" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Enable Builder Cost" name="enableBuilderCost" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Allow Notes in Quotation" name="allowNotes" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Allow Cost Adjustment" name="allowCostAdjustment" valuePropName="checked">
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
          name="includeAdditionalItemsInPriceAdjustedList"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Auto approve Quote when close sale as Won?"
          name="autoApproveOnSalesWon"
          valuePropName="checked"
          extra={
            <p className="text-font-color-400">
              Enabling this option will automatically update the quotation status to Approved when
              closing a lead/opportunity as WON.
            </p>
          }
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Show default Pricelist in additional items list?"
          name="showDefaultPricelistInAdditionalItems"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Hide Price to Customer"
          name="hidePriceToCustomer"
          valuePropName="checked"
          extra={
            <p className="text-font-color-400">
              The quotations issued by the builders checked below will hide the price of individual
              variations and facades from their customers.
            </p>
          }
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Enable Estimated Price Range"
          name="enableEstimatedPriceRange"
          valuePropName="checked"
          extra={
            <p className="text-font-color-400">
              When this toggle is enabled, user can view the price range while viewing the quotation
              in PDF.
            </p>
          }
        >
          <Switch />
        </Form.Item>

        {/* Conditional Field: Estimated Price Range */}
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) =>
            getFieldValue('enableEstimatedPriceRange') && (
              <Form.Item
                label="Estimated Price Range (%)"
                name="estimatedPriceRange"
                rules={[
                  { required: true, message: 'Please enter estimated price range' },
                  {
                    type: 'number',
                    min: 0,
                    max: 100,
                    message: 'Estimated price range must be between 1 and 100',
                  },
                ]}
              >
                <InputNumber min={0} max={100} disabled={isDisabled} />
              </Form.Item>
            )
          }
        </Form.Item>

        <Divider />

        <Form.Item
          label="Quotation Validity (in days)"
          name="quotationValidityDays"
          rules={[
            { required: true, message: 'Please enter quotation validity days' },
            {
              type: 'number',
              min: 1,
              max: 365,
              message: 'Quotation validity days must be between 1 and 365',
            },
          ]}
        >
          <InputNumber min={0} disabled={isDisabled} />
        </Form.Item>

        <Form.Item
          label="Extend Validity from Updated Date"
          name="extendValidityFromUpdatedDate"
          extra={
            <p className="text-font-color-400">
              Quotation validity period from the quotation updated date, including weekends and
              holidays.
            </p>
          }
          rules={[{ required: true, message: 'Please enter extend validity from updated date' }]}
        >
          <Input placeholder="No days given" disabled={isDisabled} />
        </Form.Item>

        <Divider />

        <div>
          <div className="flex justify-between items-center w-full gap-4">
            <Form.Item
              className="w-full"
              label="Rename send for approval button text"
              name="renameSendForApprovalButton"
              rules={[
                { required: true, message: 'Please enter rename send for approval button text' },
              ]}
            >
              <Input disabled={isDisabled} />
            </Form.Item>
            <Form.Item
              className="w-full"
              label="Default Pricelist"
              name="defaultPricelistId"
              rules={[{ required: true, message: 'Please select default pricelist' }]}
            >
              <Select
                showSearch
                options={pricelistOptions}
                disabled={isDisabled}
                notFoundContent={<NoDataMessage label="Pricelist" link={SystemRoutes.PRICELIST} />}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit" loading={isDisabled}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};
