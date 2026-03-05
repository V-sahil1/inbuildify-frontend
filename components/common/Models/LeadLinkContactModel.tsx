import { useContactHook } from '@hooks/useContactHook';
import { Button, Modal, Select } from 'antd';

export const LeadLinkContactModel = ({
  open,
  onCancel,
  handleContactSelect,
  selectedContact,
  saveContactLink,
  loading,
}) => {
  const { contactOptions, contact } = useContactHook();
  return (
    <Modal
      title="Select Contact"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={saveContactLink}
          loading={loading}
          disabled={!selectedContact}
        >
          Save
        </Button>,
      ]}
      width={600}
    >
      <Select
        showSearch
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="Search and select a contact"
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={contactOptions}
        onChange={value => {
          const selectedContact = contact.find(c => c.usersId === value);
          if (selectedContact) {
            handleContactSelect(selectedContact);
          }
        }}
      />

      {selectedContact && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-2">Selected Contact Details:</h4>
          <div className="space-y-1">
            <p>
              <strong>Name:</strong> {selectedContact.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedContact.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedContact.phone || 'N/A'}
            </p>
            <p>
              <strong>Address:</strong> {selectedContact.addressLine1}, {selectedContact.city}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};
