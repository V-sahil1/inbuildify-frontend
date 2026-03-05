import { useCountryHook } from '@hooks/useCountryHook';
import { useStateHook } from '@hooks/useStateHook';
import { Status } from '@lib/constants/enum';
import {
  addressLine2Rules,
  CityNameRules,
  emailRules,
  leadAddressRules,
  nameRules,
  optionalPhoneRule,
  phoneRules,
} from '@lib/constants/formInputValidations';
import {
  IconChevronLeft,
  IconMail,
  IconPaperclip,
  IconPhone,
  IconPlus,
  IconUserCheck,
} from '@tabler/icons-react';
import { Button, Card, Form, Input, message, Modal, Radio, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';

import { IContact } from '@redux/feature/contacts/contactState';

interface LeadDetailsFormProps {
  open: boolean;
  loading?: boolean;
  isEditing?: boolean;
  initialValues?: Partial<IContact> & Record<string, any>;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void> | void;
  isLinkContact?: boolean;
  showStatus?: boolean;
  showContact?: boolean;
}

const LeadDetailsForm: React.FC<LeadDetailsFormProps> = ({
  open,
  loading = false,
  isEditing = false,
  initialValues = {},
  onCancel,
  onSubmit,
  isLinkContact = false,
  showStatus = false,
  showContact = true,
}) => {
  const [form] = Form.useForm();
  const [showContactForm, setShowContactForm] = useState(false);
  const [hideAddressForm, setHideAddressForm] = useState(true);
  const { countryOptions } = useCountryHook();
  const { stateOptions } = useStateHook();
  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(initialValues);
    }
  }, [isEditing, initialValues, form]);

  const handleAddressToggle = (checked: boolean) => {
    setHideAddressForm(checked);
    form.setFieldsValue({
      address1: undefined,
      address2: undefined,
      city: undefined,
      zip: undefined,
      countryId: undefined,
      stateId: undefined,
    });
  };

  const handleContactClick = () => {
    setShowContactForm(true);
    setHideAddressForm(true);
    form.setFieldsValue({
      name: undefined,
      email: undefined,
      phone: undefined,
      secondary_phone: undefined,
    });
  };

  const handleContactBackClick = () => {
    setShowContactForm(false);
    form.setFieldsValue(initialValues);
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(initialValues);
      setHideAddressForm(true);
    }
  }, [open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      let payload: any = {
        ...values,
        type: showContactForm ? 'add' : 'update',
      };

      if (showContactForm && initialValues && hideAddressForm) {
        payload = {
          ...payload,
          address1: initialValues.address1 || '',
          address2: initialValues.address2 || '',
          city: initialValues.city || '',
          zip: initialValues.zip || '',
          country: initialValues.countryName || '',
          state: initialValues.stateName || '',
        };
      }

      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const { countryId, stateId, ...rest } = payload;
      await onSubmit(showContactForm ? rest : values);
      setShowContactForm(false);
    } catch (err) {
      if (err.errorFields) {
        message.error('Please fill all required fields');
      } else {
        message.error('An error occurred. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    onCancel();
    if (!isEditing) {
      form.resetFields();
    }
    // Ensure when modal is closed and reopened, default (non-contact) form shows
    setShowContactForm(false);
    setHideAddressForm(true);
  };

  return (
    <Modal
      title={
        <div className="flex w-full justify-between">
          <div>
            <h1 className="text-left">Contact Details</h1>
          </div>

          <div className="mr-6 space-x-1">
            {showContact && (
              <>
                {showContactForm ? (
                  <Button
                    type="primary"
                    icon={<IconChevronLeft size={16} />}
                    onClick={handleContactBackClick}
                  >
                    Back
                  </Button>
                ) : (
                  <Button type="primary" icon={<IconPlus size={16} />} onClick={handleContactClick}>
                    Contact
                  </Button>
                )}
              </>
            )}

            {isLinkContact && (
              <Button type="primary" icon={<IconPaperclip size={16} />}>
                Link Contact
              </Button>
            )}
          </div>
        </div>
      }
      open={open}
      onOk={handleOk}
      centered
      onCancel={handleCancel}
      okText={showContactForm ? 'Add' : isEditing ? 'Update' : 'Create'}
      className="p-6 max-w-4xl mx-auto md:min-w-[800px] h-[70vh] flex flex-col"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item label="Name" name="name" rules={nameRules}>
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={emailRules}>
            <Input type="email" placeholder="Enter email" />
          </Form.Item>

          <Form.Item label="Phone" name="phone" rules={phoneRules}>
            <Input
              type="number"
              placeholder="1234567890"
              minLength={10}
              maxLength={15}
              onKeyPress={e => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item label="Secondary Phone" name="secondaryPhone" rules={optionalPhoneRule}>
            <Input
              type="number"
              placeholder="1234567890 (optional)"
              minLength={10}
              maxLength={15}
              onKeyPress={e => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          {showContactForm && (
            <div className="col-span-2">
              <Form.Item
                className="mb-4"
                name="hideAddressForm"
                valuePropName="checked"
                initialValue={true}
              >
                <div className="flex items-center gap-2">
                  <Switch checked={hideAddressForm} onChange={handleAddressToggle} />
                  <span>{hideAddressForm ? 'Show' : 'Hide'} address fields</span>
                </div>
              </Form.Item>
            </div>
          )}

          {!showContactForm || !hideAddressForm ? (
            <>
              <Form.Item
                label="Address 1"
                name={['address', 'addressLine1']}
                rules={leadAddressRules}
              >
                <Input placeholder="Enter address line 1" />
              </Form.Item>

              <Form.Item
                label="Address 2"
                name={['address', 'addressLine2']}
                rules={addressLine2Rules}
              >
                <Input placeholder="Enter address line 2" />
              </Form.Item>

              <Form.Item label="City / Suburb" name={['address', 'city']} rules={CityNameRules}>
                <Input placeholder="Enter city/suburb" />
              </Form.Item>

              <Form.Item
                label="Zip / Postal Code"
                name={['address', 'zipCode']}
                rules={[
                  { required: true, message: 'Please enter postal code' },
                  { max: 4, message: 'Postal code must be at most 4 characters' },
                ]}
              >
                <Input
                  placeholder="Enter zip/postal code"
                  type="number"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Country"
                name={['address', 'countryId']}
                rules={[{ required: true, message: 'Please select country' }]}
              >
                <Select
                  placeholder="Select country"
                  onChange={value => {
                    form.setFieldsValue({ stateId: undefined });
                  }}
                  loading={status === Status.PENDING}
                  options={countryOptions}
                />
              </Form.Item>

              <Form.Item
                label="State / Region"
                name={['address', 'stateId']}
                rules={[{ required: true, message: 'Please select state/region' }]}
              >
                <Select loading={status === Status.PENDING} options={stateOptions} />
              </Form.Item>
              {/* haven't managed in the payload and need to manage int he payload for specifically in the contacts route */}
              {showStatus && (
                <Form.Item
                  label="Status"
                  name="isActive"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Radio.Group
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                  />
                </Form.Item>
              )}
            </>
          ) : (
            <div className="col-span-2 w-full">
              <Card className="w-full rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center">
                  <div className="col-span-1">
                    <h3 className="font-semibold text-[16px]">{initialValues?.name}</h3>
                    <p className="text-gray-600 text-sm">{initialValues?.address?.addressLine1}</p>
                  </div>

                  <div className="col-span-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <IconPhone size={16} className="text-gray-500" />
                        <span className="text-sm">{initialValues?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconMail size={16} className="text-gray-500" />
                        <span className="text-sm">{initialValues?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-end gap-4">
                    <Button
                      type="text"
                      icon={<IconUserCheck size={18} />}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default LeadDetailsForm;
