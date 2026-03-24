import {
  IconMail,
  IconPencil,
  IconPhone,
  IconSignLeft,
  IconStopwatch,
  IconTrash,
} from '@tabler/icons-react';
import TooltipButton from '../common/TooltipButton';
import { message } from 'antd';
import { useAppDispatch } from '@hooks/redux';
import { createContact, deleteContact, updateContact } from '@redux/feature/contacts/contactThunk';
import { IContact } from '@redux/feature/contacts/contactState';

export const ContactColumn = ({ setSelectedContact, setModalOpen, selectedContact }) => {
  const dispatch = useAppDispatch();

  const handleContactSubmit = async values => {
    try {
      const { type, ...rest } = values;
      if (selectedContact) {
        await dispatch(updateContact({ data: rest, id: selectedContact.usersId })).unwrap();
        message.success('Contact created successfully');
      } else {
        await dispatch(createContact(rest)).unwrap();
        message.success('Contact created successfully');
      }
      setModalOpen(null);
      setSelectedContact(null);
    } catch (error) {
      message.error(error || 'Failed to save contact');
    }
  };

  const handleContactDelete = async () => {
    try {
      await dispatch(deleteContact(selectedContact.usersId)).unwrap();
      message.success('Contact deleted successfully');
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to delete contact');
    }
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <span className="font-semibold text-gray-800">{text}</span>,
      width: '20%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '30%',
      render: address => address.addressLine1,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: text => (
        <div className="flex items-center gap-2">
          <IconPhone size={16} className="text-gray-500" />
          {text}
        </div>
      ),
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: text => (
        <div className="flex items-center gap-2">
          <IconMail size={16} className="text-gray-500" />
          {text}
        </div>
      ),
      width: '15%',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, contact) => (
        <div className="flex items-center gap-2">
          <TooltipButton
            title="Edit"
            icon={<IconPencil size={16} />}
            onClick={() => {
              setSelectedContact(contact);
              setModalOpen('create');
            }}
          />
          <TooltipButton title="Lead" icon={<IconSignLeft size={18} />} type="text" />
          <TooltipButton
            title="Audit"
            icon={<IconStopwatch size={16} />}
            onClick={() => {
              setSelectedContact(contact);
              setModalOpen('audit');
            }}
          />
          <TooltipButton
            title="Delete"
            icon={<IconTrash size={16} className="!text-red-500" />}
            onClick={() => {
              setSelectedContact(contact);
              setModalOpen('delete');
            }}
          />
        </div>
      ),
      width: '20%',
    },
  ];
  return { columns, handleContactSubmit, handleContactDelete };
};
