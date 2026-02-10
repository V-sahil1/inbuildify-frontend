import React, { useState, useEffect } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { supplierInfoFields } from '@/components/formFields/supplierInfo';
import { SupplierContact } from '@redux/feature/supplier/ISupplierState';
import TooltipButton from '../common/TooltipButton';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createSupplierContact,
  updateSupplierContact,
  deleteSupplierContact,
} from '@redux/feature/supplier/supplierThunk';

export const useSupplierContactColumns = (isEditing?: boolean, supplierId?: string) => {
  const dispatch = useAppDispatch();
  const { suppliers } = useAppSelector(state => state.supplier);
  const [contacts, setContacts] = useState<SupplierContact[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<SupplierContact | null>(null);

  useEffect(() => {
    if (isEditing && supplierId) {
      const supplier = suppliers.find(s => s.supplierId === supplierId);
      if (supplier?.contacts) {
        setContacts(supplier.contacts);
      }
    }
  }, [isEditing, supplierId, suppliers]);

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
    setEditingContact(null);
  };

  const handleCancelContactModal = () => {
    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  const handleEdit = (record: SupplierContact) => {
    setEditingContact(record);
    setIsContactModalOpen(true);
  };

  const handleDelete = async (record: SupplierContact) => {
    try {
      if (isEditing && record.supplierContactId) {
        await dispatch(
          deleteSupplierContact({ id: record.supplierContactId, supplierId })
        ).unwrap();
        message.success('Contact deleted successfully');
      } else {
        setContacts(prev =>
          prev.filter(item => item.supplierContactId !== record.supplierContactId)
        );
      }
    } catch (error) {
      message.error(error || 'Failed to delete contact');
    }
  };

  const handleSaveContact = async (values: SupplierContact) => {
    try {
      if (isEditing) {
        if (editingContact?.supplierContactId) {
          await dispatch(
            updateSupplierContact({
              supplierContactId: editingContact.supplierContactId,
              data: values,
            })
          ).unwrap();
          message.success('Contact updated successfully');
        } else {
          await dispatch(createSupplierContact({ ...values, supplierId })).unwrap();
          message.success('Contact created successfully');
        }
      } else {
        const newContact: SupplierContact = {
          supplierContactId: new Date().toString(),
          supplierId: '',
          contactName: values?.contactName || '',
          email: values?.email || '',
          phone: values?.phone || '',
          contactType: values?.contactType || '',
        };
        setContacts(prev => [...prev, newContact]);
      }
      setIsContactModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      message.error(error || 'Failed to save contact');
    }
  };

  const columns = [
    {
      title: 'Contact Name',
      dataIndex: 'contactName',
      key: 'contactName',
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
      dataIndex: 'contactType',
      key: 'contactType',
      width: '20%',
    },
    {
      render: (_, record) => {
        return (
          <div className="flex gap-2">
            <TooltipButton
              title="Edit"
              type="text"
              size="small"
              icon={<IconEdit size={16} />}
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Are you sure you want to delete this contact?"
              onConfirm={() => handleDelete(record)}
            >
              <TooltipButton
                title="Delete"
                type="text"
                size="small"
                icon={<IconTrash size={16} />}
              />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const ContactModal = isContactModalOpen && (
    <ActionDialogmodel
      title={editingContact ? 'Edit Contact' : 'Add Contact'}
      open={isContactModalOpen}
      onCancel={handleCancelContactModal}
      onSubmit={handleSaveContact}
      submitButtonText="Save"
      fields={supplierInfoFields()}
      isEditing={!!editingContact}
      initialValues={editingContact || undefined}
    />
  );

  return {
    columns,
    contacts,
    ContactModal,
  };
};
