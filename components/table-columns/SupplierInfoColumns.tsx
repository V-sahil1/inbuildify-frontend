import React, { useState } from 'react';
import { Button } from 'antd';
import { IconPlus } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { supplierInfoFields } from '@/components/formFields/supplierInfo';

export interface SupplierContact {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
}

export const useSupplierContactColumns = () => {
  const [contacts, setContacts] = useState<SupplierContact[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleCancelContactModal = () => {
    setIsContactModalOpen(false);
  };

  const handleSaveContact = (values: {
    name?: string;
    email?: string;
    phone?: string;
    type?: string;
  }) => {
    setContacts(prev => [
      ...prev,
      {
        id: Date.now(),
        name: values.name || '',
        email: values.email || '',
        phone: values.phone || '',
        type: values.type || '',
      },
    ]);
    setIsContactModalOpen(false);
  };

  const columns = [
    {
      title: 'Contact Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '35%',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: '20%',
    },
    {
      title: (
        <div className="flex justify-between">
          <p>Type</p>
          <Button type="primary" size="small" onClick={handleOpenContactModal}>
            <IconPlus /> Contact
          </Button>
        </div>
      ),
      dataIndex: 'type',
      key: 'type',
      width: '20%',
    },
  ];

  const ContactModal = (
    <ActionDialogmodel
      title="Add Contact"
      open={isContactModalOpen}
      onCancel={handleCancelContactModal}
      onSubmit={handleSaveContact}
      submitButtonText="Save"
      fields={supplierInfoFields()}
    />
  );

  return {
    columns,
    contacts,
    ContactModal,
  };
};
