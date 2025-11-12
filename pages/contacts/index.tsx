import React, { useState } from 'react';
import { Input, Button, Switch, Dropdown, Radio, Table } from 'antd';
import {
  IconPencil,
  IconTrash,
  IconPlus,
  IconFilter,
  IconLayoutGrid,
  IconLayoutList,
  IconDownload,
  IconPhone,
  IconMail,
  IconStopwatch,
  IconSignLeft,
  IconMapPin,
  IconFileSpreadsheet,
  IconFileTypeCsv,
} from '@tabler/icons-react';
import LeadDetailsForm from '@/components/leadDetail/forms/LeadDetailsForm';
import TooltipButton from '@/components/common/TooltipButtton';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { contactData } from 'data/sampleData';

const ContactListing = () => {
  const [contacts, setContacts] = useState(contactData);
  const [showActive, setShowActive] = useState(true);
  const [showCustomers, setShowCustomers] = useState(true);
  const [portalAccess, setPortalAccess] = useState('noLogin');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const [actionModal, setActionModal] = useState<{
    type: 'delete' | 'audit' | null;
    contact: { id: number; name: string; phone: string; email: string } | null;
  }>(null);

  const filteredContacts = contacts.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchActive = showActive ? c.active : !c.active;
    return matchSearch && matchActive;
  });

  const toggleActive = checked => {
    setShowActive(checked);
  };

  // Filter Dropdown
  const filterMenu = (
    <div
      className="p-4 bg-white rounded-xl shadow-md w-64"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Show Only Customers</span>
        <Switch checked={showCustomers} onChange={setShowCustomers} />
      </div>

      <div className="text-sm font-semibold mb-2">Customer Portal Access:</div>

      <Radio.Group
        className="flex flex-col gap-2"
        value={portalAccess}
        onChange={e => setPortalAccess(e.target.value)}
      >
        <Radio value="all">All Customers</Radio>
        <Radio value="loginActive">Login Provided (Active)</Radio>
        <Radio value="loginInactive">Login Provided (Inactive)</Radio>
        <Radio value="noLogin">No Login Provided</Radio>
      </Radio.Group>
    </div>
  );

  // Table Columns
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
              setIsEditing(true);
              setModalOpen(true);
            }}
          />
          <TooltipButton
            title="Audit"
            icon={<IconStopwatch size={18} />}
            onClick={() => setActionModal({ type: 'audit', contact })}
          />
          <TooltipButton
            title="Delete"
            icon={<IconTrash size={18} className="!text-red-500" />}
            onClick={() => setActionModal({ type: 'delete', contact })}
          />
        </div>
      ),
      width: '20%',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Contact Listing</h1>

      {/* Top Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Input.Search
          placeholder="Search contacts by name, email, or phone number"
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />

        <div className="flex items-center gap-2">
          <span className={`font-medium ${showActive ? 'text-blue-600' : 'text-gray-400'}`}>
            Active
          </span>
          <Switch checked={showActive} onChange={toggleActive} />
          <span className={`${!showActive ? 'text-blue-600' : 'text-gray-400'}`}>Inactive</span>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-gray-500 text-sm">Total Contacts: {filteredContacts.length}</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button type="primary" icon={<IconPlus size={16} />} onClick={() => setModalOpen(true)}>
            New Contact
          </Button>

          {/* Filter Dropdown */}
          <Dropdown
            dropdownRender={() => filterMenu}
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            trigger={['click']}
          >
            <Button icon={<IconFilter size={16} />} />
          </Dropdown>

          {/* Grid / Table Toggle */}
          {viewMode === 'grid' ? (
            <TooltipButton
              title="Switch to Table View"
              icon={<IconLayoutList size={16} />}
              onClick={() => setViewMode('table')}
            />
          ) : (
            <TooltipButton
              title="Switch to Grid View"
              icon={<IconLayoutGrid size={16} />}
              onClick={() => setViewMode('grid')}
            />
          )}

          {/* export dropdown */}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'export',
                  label: 'Export to XLSX',
                  icon: <IconFileSpreadsheet size={16} />,
                  // method to export the xlsx file using the xl hook
                },
                {
                  key: 'print',
                  label: 'Export to CSV',
                  icon: <IconFileTypeCsv size={16} />,
                  // method to export the csv file need to implement the hook
                },
              ],
            }}
            trigger={['click']}
          >
            <TooltipButton title="Export" icon={<IconDownload size={16} />} />
          </Dropdown>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className="bg-card-color flex flex-col gap-3 rounded-2xl hover:shadow-lg transition-all p-4"
            >
              <div className="flex items-center justify-between w-full">
                <p className="text-gray-800 font-semibold text-base">{contact.name || 'N/A'}</p>
                <TooltipButton
                  title="Edit"
                  icon={<IconPencil size={18} />}
                  onClick={() => {
                    setIsEditing(true);
                    setModalOpen(true);
                  }}
                />
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <IconMapPin size={18} className="text-gray-500" />
                  <span>{contact.address || 'No address provided'}</span>
                </div>
                {/* it will redirect to the linked lead detail page (note: the id will be multiple or the unique need check from the BE) */}
                {/* this icon will get hidden if the lead is not being associated it with any lead */}
                <TooltipButton title="Lead" icon={<IconSignLeft size={18} />} />
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <IconPhone size={18} className="text-gray-500" />
                  <span>{contact.phone || 'No phone available'}</span>
                </div>
                <TooltipButton
                  title="Audit log"
                  icon={<IconStopwatch size={18} />}
                  onClick={() => setActionModal({ type: 'audit', contact })}
                />
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-gray-700">
                  <IconMail size={18} className="text-gray-500" />
                  <span>{contact.email || 'No email available'}</span>
                </div>
                <TooltipButton
                  title="Delete"
                  icon={<IconTrash size={18} className="!text-red-500" />}
                  onClick={() => setActionModal({ type: 'delete', contact })}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={filteredContacts}
          columns={columns}
          pagination={false}
          className="bg-white rounded-xl shadow-sm"
        />
      )}

      {/* Lead Details Modal */}
      <LeadDetailsForm
        open={modalOpen}
        setOpen={setModalOpen}
        onCancel={() => {
          setModalOpen(false);
          setIsEditing(false);
        }}
        showStatus={!!isEditing}
        showContact={false}
        initialValue={isEditing}
      />

      {/* Delete Confirmation */}
      {/* TODO :  Need to add after the action dialog model varients being added refrence leads page delete modal to verify*/}
      {actionModal?.type === 'delete' && (
        <ConfirmationModal
          type="danger"
          open={actionModal?.type === 'delete'}
          onClose={() => setActionModal(null)}
          onConfirm={() => { }}
          title="Delete Contact"
          message="Are you sure you want to delete this contact?"
        />
      )}

      {/* Audit Log Confirmation */}
      {actionModal?.type === 'audit' && (
        <ConfirmationContentModal
          open={actionModal?.type === 'audit'}
          onClose={() => setActionModal(null)}
          onSubmit={() => setActionModal(null)}
          title="Audit Log information"
          content="Are you sure you want to audit this contact?"
          okText="Audit"
        />
      )}
    </div>
  );
};

export default ContactListing;
