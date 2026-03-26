import React, { useEffect, useState } from 'react';
import { Input, Button, Switch, Dropdown, Radio, Table, message } from 'antd';
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
import TooltipButton from '@/components/common/TooltipButton';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import AssociatedEntitiesList from '@/components/common/AssociatedEntitiesList';
import { debouncedURL } from '@lib/utils/debounceURL';
import { ContactList } from '@lib/utils/Reports/contact/ContactList';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllContact } from '@redux/feature/contacts/contactThunk';
import { IContact } from '@redux/feature/contacts/contactState';
import { ContactColumn } from '@/components/table-columns/ContactColumn';
import { CustomFilterButtons } from '@/components/common/CustomFilterButtons';

const ContactListing = () => {
  const dispatch = useAppDispatch();
  const { contact } = useAppSelector(state => state.contact);
  const [showCustomers, setShowCustomers] = useState(true);
  const [portalAccess, setPortalAccess] = useState('noLogin');
  const { setParams, filters, instantFilters } = debouncedURL({
    delay: 500,
    filtersKey: ['search', 'status'],
    initialValue: { status: '' },
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [modalOpen, setModalOpen] = useState<'delete' | 'filter' | 'audit' | 'create' | null>(null);
  const { columns, handleContactSubmit, handleContactDelete } = ContactColumn({
    setSelectedContact,
    setModalOpen,
    selectedContact,
  });

  useEffect(() => {
    fetchContactData();
  }, [filters]);

  const fetchContactData = async () => {
    try {
      const params = {
        search: filters?.search || undefined,
        is_active: filters?.status !== '' ? filters?.status === 'Active' : undefined,
      };
      await dispatch(fetchAllContact(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Contacts');
    }
  };

  // Filter Dropdown
  const filterMenu = (
    <div className="p-4 bg-white rounded-xl shadow-md w-64" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Show Only Customers</span>
        <Switch checked={showCustomers} onChange={setShowCustomers} />
      </div>

      <div className="text-sm font-semibold mb-2">Customer Portal Access:</div>

      <Radio.Group
        className="flex flex-col gap-2"
        value={portalAccess}
        onChange={e => setPortalAccess(e.target.value)}
        options={[
          { label: 'All Customers', value: 'all' },
          { label: 'Login Provided (Active)', value: 'loginActive' },
          { label: 'Login Provided (Inactive)', value: 'loginInactive' },
          { label: 'No Login Provided', value: 'noLogin' },
        ]}
      />
    </div>
  );
  return (
    <div className="p-6 max-h-[100vh] overflow-y-hidden ">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Contact Listing</h1>

        {/* Top Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Input.Search
            placeholder="Search contacts by name, email, or phone number"
            allowClear
            value={instantFilters?.search}
            onChange={e => setParams({ search: e.target.value })}
            className="w-full md:w-1/2"
          />

          <CustomFilterButtons
            filterButtons={['Active', 'InActive']}
            activeTab={instantFilters.status}
            setActiveTab={value => setParams({ status: value })}
          />

          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-sm">Total Contacts: {contact?.length}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="primary"
              icon={<IconPlus size={16} />}
              onClick={() => setModalOpen('create')}
            >
              New Contact
            </Button>

            {/* Filter Dropdown */}
            <Dropdown
              dropdownRender={() => filterMenu}
              open={modalOpen === 'filter'}
              onOpenChange={() => setModalOpen(prev => (prev === 'filter' ? null : 'filter'))}
              trigger={['click']}
            >
              <Button icon={<IconFilter size={16} />} />
            </Dropdown>
          </div>

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
                  key: 'excel',
                  label: 'Export to XLSX',
                  icon: <IconFileSpreadsheet size={16} />,
                },
                {
                  key: 'csv',
                  label: 'Export to CSV',
                  icon: <IconFileTypeCsv size={16} />,
                },
              ],
              onClick: e => ContactList(e.key, contact),
            }}
            trigger={['click']}
          >
            <TooltipButton title="Export" icon={<IconDownload size={16} />} />
          </Dropdown>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
          {contact &&
            contact?.map(contact => (
              <div
                key={contact.usersId}
                className="bg-card-color rounded-2xl hover:shadow-lg transition-all p-4"
              >
                <div className="flex items-center justify-between gap-4 w-full">
                  {/* Left: contact details */}
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="text-gray-800 font-semibold text-base">
                      {contact.name || 'N/A'}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <IconMapPin size={18} />
                      <span>{contact?.address?.addressLine1 || 'No address provided'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-800 font-medium text-sm">
                      <IconPhone size={18} />
                      <span>{contact?.phone || 'No phone available'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <IconMail size={18} />
                      <span>{contact?.email || 'No email available'}</span>
                    </div>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex flex-col items-end gap-1">
                    <TooltipButton
                      title="Edit"
                      icon={<IconPencil size={18} />}
                      onClick={() => {
                        setSelectedContact(contact);
                        setModalOpen('create');
                      }}
                      type="text"
                    />
                    {/* it will redirect to the linked lead detail page (note: the id will be multiple or the unique need check from the BE) */}
                    {/* this icon will get hidden if the lead is not being associated it with any lead */}
                    <TooltipButton title="Lead" icon={<IconSignLeft size={18} />} type="text" />

                    <TooltipButton
                      title="Audit log"
                      icon={<IconStopwatch size={18} />}
                      onClick={() => setModalOpen('audit')}
                      type="text"
                    />

                    <TooltipButton
                      title="Delete"
                      icon={<IconTrash size={18} className="!text-red-500" />}
                      onClick={() => {
                        setSelectedContact(contact);
                        setModalOpen('delete');
                      }}
                      type="text"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={contact}
          columns={columns}
          pagination={false}
          className="bg-white rounded-xl shadow-sm"
        />
      )}

      {/* Lead Details Modal */}
      <LeadDetailsForm
        open={modalOpen === 'create'}
        onCancel={() => {
          setModalOpen(null);
          setSelectedContact(null);
        }}
        showStatus={!!selectedContact}
        showContact={false}
        isEditing={!!selectedContact}
        initialValues={selectedContact}
        onSubmit={handleContactSubmit}
      />

      <ActionDialogmodel
        open={modalOpen === 'delete'}
        onCancel={() => {
          setModalOpen(null);
        }}
        title="Confirm Deletion"
        headerMessage={
          <div className="space-y-2 text-sm">
            <span className="text-gray-400">
              The below associated details of this contact will also be deleted:
            </span>
            {selectedContact && (
              <div className="max-h-64 overflow-y-auto px-3 py-2 mb-2 custom-scrollbar">
                <div className="font-bold text-font-color mb-1">
                  {selectedContact.usersId} - {selectedContact.name}
                </div>
                <AssociatedEntitiesList />
              </div>
            )}
          </div>
        }
        isEditing={true}
        variant="danger"
        fields={[
          {
            name: 'comments',
            label: 'Notes',
            type: 'textarea',
            placeholder: 'Enter notes...',
            extra: `Are you sure you want to delete the contact${selectedContact ? ` \'${selectedContact.name}\'` : ''}?`,
          },
        ]}
        onSubmit={handleContactDelete}
        submitButtonText="Confirm"
      />

      {/* Audit Log Confirmation */}
      {modalOpen === 'audit' && (
        <ConfirmationContentModal
          open={modalOpen === 'audit'}
          onClose={() => setModalOpen(null)}
          onSubmit={() => {}}
          title="Audit Log information"
          content="Are you sure you want to audit this contact?"
          okText="Audit"
        />
      )}
    </div>
  );
};

export default ContactListing;
