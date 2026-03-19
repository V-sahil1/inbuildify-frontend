import { useCountryHook } from '@hooks/useCountryHook';
import { useStateHook } from '@hooks/useStateHook';
import {
  addressLine2Rules,
  CityNameRules,
  emailRules,
  leadAddressRules,
  nameRules,
  optionalPhoneRule,
  phoneRules,
} from '@lib/constants/formInputValidations';
import { LeadContact } from '@redux/feature/lead/ILeadState';
import {
  IconChevronDown,
  IconChevronUp,
  IconLink,
  IconMail,
  IconPhone,
  IconPlus,
  IconTrash,
  IconUserCheck,
  IconX,
} from '@tabler/icons-react';
import { Button, Card, Form, Input, message, Modal, Select } from 'antd';
import { useState, useMemo, useEffect } from 'react';

interface LeadContactModelProps {
  open: boolean;
  onCancel: () => void;
  contacts: LeadContact[];
  loading?: boolean;
  onSaveContact?: (contact: LeadContact, values: LeadContact) => Promise<void>;
  onDeleteContact?: (contactId: string) => Promise<void>;
  onLinkContact?: () => void;
  maxContacts?: number;
}

const LeadContactModel: React.FC<LeadContactModelProps> = ({
  open,
  onCancel,
  contacts = [],
  loading = false,
  onSaveContact,
  onDeleteContact,
  onLinkContact,
  maxContacts = 2,
}) => {
  const [form] = Form.useForm();
  const [selectedContact, setSelectedContact] = useState<LeadContact | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(true);
  const { countryOptions } = useCountryHook();
  const { stateOptions } = useStateHook();
  const formFields = useMemo(
    () => ({
      name: { label: 'Name', rules: nameRules, name: 'name' },
      email: { label: 'Email', rules: emailRules, name: 'email' },
      phone: { label: 'Phone', rules: phoneRules, name: 'phone' },
      secondaryPhone: {
        label: 'Secondary Phone',
        rules: optionalPhoneRule,
        name: 'secondaryPhone',
      },
      addressLine1: {
        label: 'Address 1',
        rules: leadAddressRules,
        name: ['address', 'addressLine1'],
      },
      addressLine2: {
        label: 'Address 2',
        rules: addressLine2Rules,
        name: ['address', 'addressLine2'],
      },
      city: { label: 'City / Suburb', rules: CityNameRules, name: ['address', 'city'] },
      zipCode: {
        label: 'Zip / Postal Code',
        rules: [
          { required: true, message: 'Please enter postal code' },
          { max: 4, message: 'Postal code must be at most 4 characters' },
        ],
        name: ['address', 'zipCode'],
      },
      countryId: {
        label: 'Country',
        rules: [{ required: true, message: 'Please select country' }],
        name: ['address', 'countryId'],
      },
      stateId: {
        label: 'State / Region',
        rules: [{ required: true, message: 'Please select state/region' }],
        name: ['address', 'stateId'],
      },
    }),
    [
      nameRules,
      emailRules,
      phoneRules,
      optionalPhoneRule,
      leadAddressRules,
      addressLine2Rules,
      CityNameRules,
      countryOptions,
      stateOptions,
    ]
  );

  // Reusable Form Component
  const ContactForm: React.FC<{
    form: any;
    formFields: any;
    submitText: string;
    onSubmit: () => void;
    onCancel: () => void;
    loading?: boolean;
    showAddressFields?: boolean;
    initialValues?: any;
  }> = ({
    form,
    formFields,
    submitText,
    onSubmit,
    onCancel,
    loading = false,
    showAddressFields = true,
    initialValues,
  }) => {
    const renderFormField = (fieldKey: string) => {
      const field = formFields[fieldKey];
      const isAddressField =
        fieldKey.includes('address') ||
        fieldKey === 'city' ||
        fieldKey === 'zipCode' ||
        fieldKey === 'countryId' ||
        fieldKey === 'stateId';

      // Don't render address fields if showAddressFields is false
      if (!showAddressFields && isAddressField) {
        return null;
      }

      return (
        <Form.Item
          key={fieldKey}
          label={field.label}
          name={field.name}
          rules={field.rules}
          initialValue={initialValues?.[field.name]}
        >
          {fieldKey.includes('phone') || fieldKey === 'zipCode' ? (
            <Input
              type="number"
              placeholder={
                fieldKey === 'zipCode'
                  ? 'Enter zip/postal code'
                  : `1234567890${fieldKey === 'secondaryPhone' ? ' (optional)' : ''}`
              }
              minLength={10}
              maxLength={fieldKey === 'zipCode' ? 4 : 15}
              onKeyPress={e => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          ) : fieldKey === 'email' ? (
            <Input type="email" placeholder="Enter email" />
          ) : fieldKey === 'countryId' || fieldKey === 'stateId' ? (
            <Select
              placeholder={fieldKey === 'countryId' ? 'Select country' : 'Select state/region'}
              onChange={
                fieldKey === 'countryId'
                  ? (value: any) => {
                      form.setFieldsValue({ stateId: undefined });
                    }
                  : undefined
              }
              options={fieldKey === 'countryId' ? countryOptions : stateOptions}
            />
          ) : (
            <Input placeholder={`Enter ${field.label.toLowerCase()}`} />
          )}
        </Form.Item>
      );
    };

    return (
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(formFields).map(key => (
            <div key={key}>{renderFormField(key)}</div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onCancel} icon={<IconX size={16} />}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={onSubmit}
            loading={loading}
            icon={<IconUserCheck size={16} />}
          >
            {submitText}
          </Button>
        </div>
      </Form>
    );
  };

  useEffect(() => {
    if (contacts.length === 1) {
      setSelectedContact(contacts[0]);
      form.setFieldsValue({
        ...contacts[0],
        address: contacts[0].address || {},
      });
    }
  }, [contacts, form]);

  const toggleCard = (contact: LeadContact) => {
    if (selectedContact?.id === contact.id) {
      setSelectedContact(null);
    } else {
      setSelectedContact(contact);
      form.setFieldsValue({
        ...contact,
        address: contact.address || {},
      });
    }
  };

  const handleAddContact = () => {
    setShowAddForm(true);
    setSelectedContact(null);
    setShowAddressFields(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setSelectedContact(null);
    setShowAddForm(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (showAddForm && !showAddressFields && contacts.length > 0) {
        values.address = contacts[0].address || {};
      }
      onSaveContact(selectedContact, values);
      setSelectedContact(null);
    } catch (error) {
      message.error('Failed to update contact');
    }
  };

  if (contacts?.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No contacts available</p>
      </div>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      width={800}
      title={
        <div className="flex w-full justify-between items-center !pr-4">
          <span>Lead Contacts</span>
          {contacts.length < maxContacts && (
            <div className="flex gap-2">
              {showAddForm ? (
                <Button icon={<IconLink size={16} />} onClick={onLinkContact}>
                  Link Contact
                </Button>
              ) : (
                <Button type="primary" icon={<IconPlus size={16} />} onClick={handleAddContact}>
                  Add Contact
                </Button>
              )}
            </div>
          )}
        </div>
      }
      footer={false}
    >
      {/* Add Contact Form */}
      {showAddForm && (
        <div className="mb-6">
          <Card className="w-full rounded-lg shadow-sm">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add New Contact</h3>
              {contacts[0]?.address?.addressLine1 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showAddressFields}
                    onChange={e => setShowAddressFields(e.target.checked)}
                    className="mr-2"
                  />
                  <span>{showAddressFields ? 'Hide' : 'Show'} address fields</span>
                </div>
              )}
            </div>
            <ContactForm
              form={form}
              formFields={formFields}
              submitText="Add Contact"
              onSubmit={handleSave}
              onCancel={handleCancel}
              loading={loading}
              showAddressFields={showAddressFields}
            />
          </Card>
        </div>
      )}

      {/* Existing Contact Cards */}
      {!showAddForm &&
        contacts.slice(0, maxContacts).map((contact, index) => (
          <Card
            key={contact.id || index}
            className="w-full rounded-lg shadow-sm transition-all duration-200 mb-3"
          >
            {/* Contact Card Header */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center justify-between cursor-pointer"
              onClick={() => toggleCard(contact)}
            >
              <div className="col-span-1">
                <h3 className="font-semibold text-[16px]">{contact.name}</h3>
                <p className="text-gray-600 text-sm">{contact.address?.addressLine1}</p>
              </div>

              <div className="col-span-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <IconPhone size={16} className="text-gray-500" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMail size={16} className="text-gray-500" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-1 flex gap-2 items-center justify-end">
                {index > 0 && (
                  <div className="flex justify-end gap-2">
                    <Button
                      type="text"
                      icon={<IconTrash size={18} />}
                      className="text-red-600 hover:text-red-800"
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteContact(contact?.id || '');
                      }}
                      loading={loading}
                    />
                  </div>
                )}
                <div className="flex justify-end">
                  {selectedContact?.id === contact.id ? (
                    <IconChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <IconChevronDown size={20} className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Edit Form - Expanded Content */}
            {selectedContact?.id === contact.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ContactForm
                  form={form}
                  formFields={formFields}
                  submitText="Update Contact"
                  onSubmit={handleSave}
                  onCancel={handleCancel}
                  loading={loading}
                  showAddressFields={true}
                  initialValues={contact}
                />
              </div>
            )}
          </Card>
        ))}
    </Modal>
  );
};

export default LeadContactModel;
