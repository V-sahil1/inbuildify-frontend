import React, { useState, useMemo, useEffect } from 'react';
import type { MenuProps } from 'antd';
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Form,
  Input,
  message,
  Popconfirm,
  Radio,
  Select,
  Switch,
  Tag,
  Upload,
} from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchRole } from '@redux/feature/admin/role/roleThunk';
import { Status } from '@lib/constants/enum';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import RichTextEditor from '@/components/common/rich-text-editor/RichTextEditor';
import { createQuotationFormatThunk } from '@redux/feature/quotation-format/quotationFormatThunk';


interface QuotationFormatDetailsProps {
  startInEdit?: boolean;
  quotationFormatData?: any;
}

const QuotationFormatDetails: React.FC<QuotationFormatDetailsProps> = ({ startInEdit, quotationFormatData }) => {
  const dispatch = useAppDispatch();
  const { role, status } = useAppSelector(state => state.role);
  const roleOptions = role.map(item => ({
    label: item.name,
    value: item.roleId,
  }));

  const [isEditing, setIsEditing] = useState(!!startInEdit);
  const [form] = Form.useForm();
  const [footerColumnsState, setFooterColumnsState] = useState<number>(0);
  const [footerContents, setFooterContents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [assetFlags, setAssetFlags] = useState<{
    watermark: boolean;
    defaultFacade: boolean;
    draftBackground: boolean;
  }>({ watermark: false, defaultFacade: false, draftBackground: false });
  const [imageFiles, setImageFiles] = useState<{
    watermark: File | null;
    defaultFacade: File | null;
    draftBackground: File | null;
  }>({ watermark: null, defaultFacade: null, draftBackground: null });

  const fetchRoleData = async () => {
    try {
      await dispatch(fetchRole()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch role');
    }
  };

  useEffect(() => {
    if (status === Status.IDLE) {
      fetchRoleData();
    }
  }, [status]);

  // Initialize form with API data when available
  React.useEffect(() => {
    if (quotationFormatData && !isEditing) {
      const data = quotationFormatData;
      form.setFieldsValue({
        builderName: data.builderInfo?.name || '',
        formatName: data.formatName || '',
        status: data.status ? 'active' : 'inactive',
        makeDefault: data.makeDefault || false,
        showAccount: data.showAccount || 'builder_account',
        showExel: data.showExcel || false,
        hideLogoFirstPage: data.hideLogoFirstPage || false,
        showJobAddress: data.showJobAddress,
        customFooter: data.customFooter,
        draftBackground: data.draftBackground,
        hideWatermarkFirstPage: data.hideLogoFirstPage || false,
        includePackage: data.includePackagePriceList || false,
        logoAlignment: data.logoAlignment
          ? data.logoAlignment.charAt(0).toUpperCase() + data.logoAlignment.slice(1).toLowerCase()
          : '',
        logoWidth: data.logoSizeWidth || '',
        logoHeight: data.logoSizeHeight || '',
        logoPadding: data.logoPadding || '',
        labelLogoWidth: data.labelLogoSizeWidth || '',
        labelLogoHeight: data.labelLogoSizeHeight || '',
        showQuotationWithBuilderDetailed: data.showQuotationWithBuilderDetailed || false,
      });

      // Set asset flags based on API data
      setAssetFlags({
        watermark: !!data.watermark,
        defaultFacade: !!data.defaultFacade,
        draftBackground: !!data.draftBackground,
      });
    }
  }, [quotationFormatData, isEditing, form]);

  // Create dynamic display columns based on API data
  const displayColumns = useMemo(() => {
    if (!quotationFormatData) {
      return [
        [
          { label: 'Builder Name', value: 'My Home' },
          { label: 'Logo Alignment', value: 'Left' },
          { label: 'Logo Size', value: 'Standard' },
          { label: 'Logo Padding', value: 'Normal' },
          { label: 'Show Job Address in Quotation Footer', value: 'No' },
          { label: 'Label Logo Size', value: 'Default' },
          { label: 'Custom Footer', value: 'No' },
        ],
        [
          { label: 'Format Name', value: 'Quotation' },
          { label: 'Show Account', value: 'Builder Account' },
          { label: 'Hide logo from first page', value: 'No' },
          { label: 'Water Mark', value: <button className="text-primary">Preview</button> },
          { label: 'Default Facade', value: '' },
          { label: 'Draft Background', value: <button className="text-primary">Preview</button> },
          { label: 'Hide watermark / background from first page', value: 'No' },
        ],
        [
          { label: 'Status', value: <Tag color="green">Active</Tag> },
          { label: 'Default', value: 'Yes' },
          { label: 'Include Package in Price List', value: 'Yes' },
          { label: 'ShowExcel', value: 'No' },
          { label: 'Roles Can View', value: 'Select Role' },
        ],
      ];
    }

    const data = quotationFormatData;

    const formatColumn1 = [
      { label: 'Builder Name', value: data.builderInfo?.name || '' },
      { label: 'Logo Alignment', value: data.logoAlignment || 'Left' },
      { label: 'Logo Size', value: `${data.logoSizeWidth || ''} x ${data.logoSizeHeight || ''}` },
      { label: 'Logo Padding', value: data.logoPadding || 'Normal' },
      { label: 'Show Job Address in Quotation Footer', value: data.showJobAddress ? 'Yes' : 'No' },
      { label: 'Label Logo Size', value: `${data.labelLogoSizeWidth || ''} x ${data.labelLogoSizeHeight || ''}` },
      { label: 'Custom Footer', value: data.customFooter ? 'Yes' : 'No' },
    ];

    const formatColumn2 = [
      { label: 'Format Name', value: data.formatName || '' },
      { label: 'Show Account', value: data.showAccount || 'Builder Account' },
      { label: 'Hide logo from first page', value: data.hideLogoFirstPage ? 'Yes' : 'No' },
      { label: 'Water Mark', value: data.watermark ? <button className="text-primary">Preview</button> : '' },
      { label: 'Default Facade', value: data.defaultFacade ? <button className="text-primary">Preview</button> : '' },
      { label: 'Draft Background', value: data.draftBackground ? <button className="text-primary">Preview</button> : '' },
      { label: 'Hide watermark / background from first page', value: data.hideWatermarkFirstPage ? 'Yes' : 'No' },
    ];

    const formatColumn3 = [
      { label: 'Status', value: <Tag color={data.status ? 'green' : 'red'}>{data.status ? 'Active' : 'Inactive'}</Tag> },
      { label: 'Default', value: data.makeDefault ? 'Yes' : 'No' },
      { label: 'Include Package in Price List', value: data.includePackagePriceList ? 'Yes' : 'No' },
      { label: 'Show Quotation with Builder details', value: data.showQuotationWithBuilderDetailed ? 'Yes' : 'No' },
      { label: 'ShowExcel', value: data.showExcel ? 'Yes' : 'No' },
      { label: 'Roles Can View', value: data.roles?.map((r: any) => r.name).join(', ') || 'Select Role' },
    ];

    return [formatColumn1, formatColumn2, formatColumn3];
  }, [quotationFormatData]);

  const handleEditClick = () => {

    setFooterColumnsState(0);
    setFooterContents([]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      // TODO: integrate with API or parent state
      console.log('Save quotation format details', values);
      const response = await dispatch(createQuotationFormatThunk(values)).unwrap();
      if (response.success) {
        message.success('Quotation format created successfully');
        setIsEditing(false);
      }
    }
    catch (error) {
      message.error(error || 'Failed to save quotation format details');
    }
    finally {
      setLoading(false);
    }
  };

  const customFooterEnabled = Form.useWatch('customFooter', form);
  const draftBackgroundEnabled = Form.useWatch('draftBackground', form);
  const selectedShowAccount = Form.useWatch('showAccount', form);
  const footerColumns = footerColumnsState || 0;

  const setAssetFlag = (key: 'watermark' | 'defaultFacade' | 'draftBackground', value: boolean, file?: File) => {
    setAssetFlags(prev => ({ ...prev, [key]: value }));
    if (file) {
      setImageFiles(prev => ({ ...prev, [key]: file }));
    } else if (!value) {
      setImageFiles(prev => ({ ...prev, [key]: null }));
    }
  };

  const footerMenuItems: MenuProps['items'] = [
    { key: '1', label: 'Single column' },
    { key: '2', label: 'Two column' },
    { key: '3', label: 'Three column' },
  ];

  const updateFooterContent = (index: number, value: string) => {
    const nextContents = Array.from({ length: footerColumns || 1 }, (_, i) =>
      i === index ? value : footerContents[i] || ''
    );
    setFooterContents(nextContents);
    form.setFieldsValue({ footerContent: nextContents });
  };

  const footerMenu: MenuProps = {
    items: footerMenuItems,
    onClick: ({ key }) => {
      const cols = Number(key);
      form.setFieldsValue({ footerColumns: cols });
      setFooterColumnsState(cols);
      const nextContents = Array.from({ length: cols }, (_, i) => footerContents[i] || '');
      setFooterContents(nextContents);
      form.setFieldsValue({ footerContent: nextContents });
    },
  };

  return (
    <div className="p-4 mb-4">
      <div className="flex justify-between items-center">
        <span className="font-bold">Format Details</span>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              Save
            </Button>
          </div>
        ) : (
          <Button type="link" icon={<IconEdit size={16} />} onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </div>
      <Divider className="my-2" />

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-font-color">
          {displayColumns.map((col, colIndex) => (
            <div key={colIndex} className="space-y-3">
              {col.map(item => (
                <div key={item.label} className="flex justify-between gap-4">
                  <span className="font-semibold">{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-font-color">
            <div className="space-y-3">
              <Form.Item label="Builder Name" name="builderName" className="mb-0">
                <Select options={[{ label: 'My Home', value: 'My Home' }]} />
              </Form.Item>
              <Form.Item label="Logo Alignment" name="logoAlignment" className="mb-0">
                <Select
                  options={[
                    { label: 'Left', value: 'Left' },
                    { label: 'Center', value: 'Center' },
                    { label: 'Right', value: 'Right' },
                  ]}
                />
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item label="Logo Width" name="logoSizeWidth" className="mb-0">
                  <Input />
                </Form.Item>
                <Form.Item label="Logo Height" name="logoSizeHeight" className="mb-0">
                  <Input />
                </Form.Item>
              </div>
              <Form.Item label="Logo Padding" name="logoPadding" className="mb-0">
                <Input />
              </Form.Item>
              <Form.Item name="showJobAddress" valuePropName="checked" className="mb-0">
                <Checkbox>Show Job Address in Quotation Footer</Checkbox>
              </Form.Item>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item label="Label Logo Width" name="labelLogoSizeWidth" className="mb-0">
                  <Input />
                </Form.Item>
                <Form.Item label="Label Logo Height" name="labelLogoSizeHeight" className="mb-0">
                  <Input />
                </Form.Item>
              </div>
              <div>
                <div className="flex items-end gap-4">
                  <Form.Item
                    label="Custom Footer"
                    name="customFooter"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Switch />
                  </Form.Item>
                  {customFooterEnabled && (
                    <div className="flex items-center gap-4">
                      <Dropdown menu={footerMenu} trigger={['click']}>
                        <Button type="link" className="!p-0 text-primary">
                          + Footer Row
                        </Button>
                      </Dropdown>
                    </div>
                  )}
                </div>
                {customFooterEnabled && (
                  <div className="mt-2 space-y-2">
                    {customFooterEnabled && footerColumnsState > 0 && (
                      <div>
                        <div className="flex items-center justify-between gap-4">
                          <Form.Item label="Columns" name="footerColumnCount" className="mb-0 w-24">
                            <Select
                              options={[
                                { label: '1', value: 1 },
                                { label: '2', value: 2 },
                                { label: '3', value: 3 },
                              ]}
                              onChange={value => {
                                form.setFieldsValue({ footerColumns: value });
                                setFooterColumnsState(value);
                                const nextContents = Array.from(
                                  { length: value },
                                  (_, i) => footerContents[i] || ''
                                );
                                setFooterContents(nextContents);
                                form.setFieldsValue({ footerContent: nextContents });
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Background Color"
                            name="footerBgColor"
                            className="mb-0 flex-1"
                          >
                            <Input type="color" className="w-30 h-10 p-0" />
                          </Form.Item>

                          <Popconfirm
                            title="Delete custom footer"
                            description="Are you sure you want to delete this custom footer?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => {
                              form.setFieldsValue({
                                footerColumns: undefined,
                                footerBgColor: undefined,
                                footerContent: undefined,
                              });
                              setFooterColumnsState(0);
                              setFooterContents([]);
                            }}
                          >
                            <Button type="text" danger icon={<IconTrash size={18} />} />
                          </Popconfirm>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <Form.Item label="Format Name" name="formatName" className="mb-0">
                <Input />
              </Form.Item>
              <div>
                <Form.Item label="Show Account" name="showAccount" className="mb-0">
                  <Select
                    options={[
                      { label: 'Builder Account', value: 'builder_account' },
                      { label: 'Company Account', value: 'company_account' },
                    ]}
                    onChange={(value) => {
                      form.setFieldsValue({ showAccount: value });
                    }}
                  />
                  <div className="flex">
                    <Form.Item name="showExcel" valuePropName="checked" className="mb-0">
                      <Checkbox>Show Exel</Checkbox>
                    </Form.Item>
                    <Form.Item name="hideLogoFirstPage" valuePropName="checked" className="mb-0">
                      <Checkbox>Hide logo from first page</Checkbox>
                    </Form.Item>
                  </div>
                </Form.Item>
              </div>
              <Form.Item label="Water Mark" className="mb-0">
                {assetFlags.watermark && imageFiles.watermark ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={URL.createObjectURL(imageFiles.watermark)}
                      alt="Watermark"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Button
                      type="link"
                      className="!p-0"
                      onClick={() => setAssetFlag('watermark', false)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Upload
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      setAssetFlag('watermark', true, file);
                      return false;
                    }}
                    accept="image/*"
                  >
                    <Button type="primary" size="small">
                      Upload
                    </Button>
                  </Upload>
                )}
              </Form.Item>
              <Form.Item label="Default Facade" className="mb-0">
                {assetFlags.defaultFacade && imageFiles.defaultFacade ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={URL.createObjectURL(imageFiles.defaultFacade)}
                      alt="Default Facade"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Button
                      type="link"
                      className="!p-0"
                      onClick={() => setAssetFlag('defaultFacade', false)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Upload
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      setAssetFlag('defaultFacade', true, file);
                      return false;
                    }}
                    accept="image/*"
                  >
                    <Button type="primary" size="small">
                      Upload
                    </Button>
                  </Upload>
                )}
              </Form.Item>
              <Form.Item label="Draft Background" className="mb-0">
                <Form.Item
                  name="draftBackground"
                  valuePropName="checked"
                  className="mb-0 inline-block mr-2"
                >
                  <Switch />
                </Form.Item>

                {draftBackgroundEnabled && (
                  <>
                    {assetFlags.draftBackground && imageFiles.draftBackground ? (
                      <div className="flex items-center gap-2 ml-2">
                        <img
                          src={URL.createObjectURL(imageFiles.draftBackground)}
                          alt="Draft Background"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <Button
                          type="link"
                          className="!p-0"
                          onClick={() => setAssetFlag('draftBackground', false)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Upload
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={(file) => {
                          setAssetFlag('draftBackground', true, file);
                          return false;
                        }}
                        accept="image/*"
                      >
                        <Button type="primary" size="small" className="ml-2">
                          Upload
                        </Button>
                      </Upload>
                    )}

                    <Form.Item
                      name="hideWatermark"
                      valuePropName="checked"
                      className="mb-0 mt-2"
                    >
                      <Checkbox>Hide watermark / background from first page</Checkbox>
                    </Form.Item>
                  </>
                )}
              </Form.Item>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <Form.Item label="Status" name="status" className="mb-0">
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="makeDefault" valuePropName="checked" className="mb-0">
                <Checkbox>Make Default</Checkbox>
              </Form.Item>
              <Form.Item name="includePackagePriceList" valuePropName="checked" className="mb-0">
                <Checkbox>Include Package in Price List</Checkbox>
              </Form.Item>
              {selectedShowAccount === 'company_account' && (
                <Form.Item
                  name="showQuotationWithBuilderDetailed"
                  valuePropName="checked"
                  className="mb-0"
                >
                  <Checkbox>Show Quotation with Builder details</Checkbox>
                </Form.Item>
              )}
              <Form.Item label="Role" name="role" className="mb-0">
                <Select placeholder="Select Roles" options={roleOptions} />
              </Form.Item>
            </div>
          </div>

          {customFooterEnabled && footerColumnsState > 0 && (
            <Form.Item name="footerContent" className="mb-0 mt-4">
              <div
                className={`grid gap-2 ${footerColumns === 3
                  ? 'grid-cols-3'
                  : footerColumns === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-1'
                  }`}
              >
                {Array.from({ length: footerColumns || 1 }).map((_, idx) => (
                  <div key={idx} className="space-y-1 w-[450px]">
                    <RichTextEditor
                      value={footerContents[idx] || ''}
                      onChange={val => updateFooterContent(idx, val)}
                      maxHeight="180px"
                      placeholder="Enter footer content"
                    />
                  </div>
                ))}
              </div>
            </Form.Item>
          )}
        </Form>
      )}
    </div>
  );
};

export default QuotationFormatDetails;
