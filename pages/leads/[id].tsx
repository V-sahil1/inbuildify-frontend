import { useEffect, useMemo, useState } from 'react';
import { Button, message, Spin, Tabs } from 'antd';
import StageProgress from '@/components/common/StageProgress';
import ConvertLeadModal from '@/components/leadDetail/ConvertLeadModal';
import PropertyDetailsModal from '@/components/leadDetail/PropertyDetailsModal';
import { IconMail, IconPhone, IconPlus, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createLeadInvoiceThunk,
  createLeadJobThunk,
  deleteLeadContactMapThunk,
  deleteLeadJobThunk,
  getBusinessContactByIdThunk,
  getLeadByIdThunk,
  getLeadContactMapThunk,
  getLeadInvoiceThunk,
  getLeadJobThunk,
  getLeadProperty,
  updateLeadJobThunk,
} from '@redux/feature/lead/leadThunk';
import { LeadQuotation } from '@/components/leads/LeadQuotationPage';
import LeadDetailsForm from '@/components/leadDetail/forms/LeadDetailsForm';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { Quotation } from '@redux/feature/quotation/IQuotationState';
import LeadActions from '@/components/leadDetail/LeadActions';
import { Status } from '@lib/constants/enum';
import { LeadSource } from '@/components/leads/LeadSource';
import CloseLeadModal from '@/components/leadDetail/LeadQuotations/CloseLeadModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { deleteQuotationThunk, getQuotationThunk } from '@redux/feature/quotation/quotationThunk';
import { removeQuotation } from '@redux/feature/lead/leadSlice';
import DepositModel from '@/components/common/Models/DepositModel';
import ActivityCard from '@/components/common/ActivityCard';
import { EmailData, filterTabs } from 'data/activityData';
import FileExplorer from '@/components/common/FileExplorer';
import { sdriveRootFolders } from '../../data/sdriveData';
import {
  createContact,
  fetchAllContact,
  updateContact,
} from '@redux/feature/contacts/contactThunk';
import { IContact } from '@redux/feature/contacts/contactState';
import { createLeadContactMapThunk } from '@redux/feature/lead/leadThunk';
import { LeadLinkContactModel } from '@/components/common/Models/LeadLinkContactModel';
import { JobFormModel } from '@/components/common/Models/JobFormModel';
import { TableDrawer } from '@/components/common/TableDrawer';
import { LeadDepositColumn } from '@/components/table-columns/LeadDepositColumn';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { LeadContactPage } from '@/components/leads/LeadContact';
import { LeadPropertyPage } from '@/components/leads/LeadPropertyPage';
import LeadQuotations from '@/components/leadDetail/LeadQuotations/LeadQuotations';

const { TabPane } = Tabs;

function App() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { leadDetail, status } = useAppSelector(state => state.lead);
  const { contact } = useAppSelector(state => state.contact);
  const [modalOpen, setModalOpen] = useState<
    | 'closeLead'
    | 'convert'
    | 'contact'
    | 'property'
    | 'invoice'
    | 'linkContact'
    | 'job'
    | 'deposit'
    | null
  >(null);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const isOpportunity = !['New', 'Working'].includes(leadDetail?.lead?.status || '');
  const title = isOpportunity ? 'Opportunity' : 'Lead';
  const leadId = router.query.id as string | undefined;
  const createdQuotations: Quotation[] = leadDetail?.createdQuotations?.quotations || [];
  const { columns } = LeadDepositColumn();
  // const isJob = useMemo(() => leadDetail?.lead?.status === "JOB", [leadDetail]);

  useEffect(() => {
    if (leadId) {
      fetchData();
    }
  }, [leadId]);

  // const primaryContact = contacts;

  // useEffect(() => {
  //   return () => {
  //     if (primaryContact && isLoggedIn) {
  //       const latest = latestLeadDetailRef.current;
  //       const property = (latest as any)?.property ?? null;
  //       dispatch(setQuotationContact(contacts));
  //       dispatch(setQuotationProperty(leadDetail?.property));
  //     }
  //   };
  // }, [dispatch, primaryContact, isLoggedIn]);

  async function fetchData() {
    try {
      await dispatch(getLeadByIdThunk(leadId)).unwrap();
      await Promise.all([
        dispatch(getBusinessContactByIdThunk(leadId)).unwrap(),
        dispatch(getLeadContactMapThunk(leadId)).unwrap(),
        dispatch(getLeadInvoiceThunk(leadId)).unwrap(),
        dispatch(getLeadJobThunk(leadId)).unwrap(),
        dispatch(getQuotationThunk(leadId)).unwrap(),
        dispatch(getLeadProperty(leadId)).unwrap(),
      ]);
    } catch (err) {
      message.error(err || 'Failed to fetch lead details');
    }
  }

  const handleConvertClick = () => {
    setModalOpen('convert');
  };

  const handleConvertCancel = () => {
    setModalOpen(null);
  };

  const handleEditLeadSubmit = async values => {
    try {
      const { type, ...rest } = values;
      if (type === 'update') {
        const { isUpdated, updatedFields } = getUpdatedFields(rest, leadDetail?.contacts?.[0]);
        if (!isUpdated) {
          setModalOpen(null);
          return;
        }
        const res = await dispatch(
          updateContact({ id: leadDetail?.contacts?.[0]?.contactId || '', data: updatedFields })
        ).unwrap();
        message.success('Contact updated successfully');
      } else {
        const res = await dispatch(createContact(rest)).unwrap();
        await dispatch(
          createLeadContactMapThunk({
            leadsId: leadId!,
            contactId: res.usersId,
          })
        ).unwrap();
        message.success('Contact saved successfully');
      }
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save contact');
    }
  };

  const handleOpenContactModal = async () => {
    setModalOpen('linkContact');
    if (contact.length === 0) {
      try {
        await dispatch(fetchAllContact({})).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch contacts');
      }
    }
  };

  const handleContactSelect = (selectedContact: IContact) => {
    setSelectedContact(selectedContact);
  };

  const saveContactLink = async () => {
    if (!selectedContact) return;

    try {
      setLoading(true);
      await dispatch(
        createLeadContactMapThunk({
          leadsId: leadId!,
          contactId: selectedContact.usersId,
        })
      ).unwrap();
      message.success('Contact linked successfully');
      setModalOpen(null);
      setSelectedContact(null);
    } catch (err) {
      message.error(err || 'Failed to link contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedQuotationId) return;
    try {
      setIsDeleting(true);
      await dispatch(deleteQuotationThunk(selectedQuotationId))
        .unwrap()
        .then(() => dispatch(removeQuotation(selectedQuotationId)));
      message.success('Quotation deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedQuotationId(null);
    } catch (err) {
      message.error(err || 'Failed to delete quotation');
    } finally {
      setIsDeleting(false);
    }
  };

  const steps = useMemo(() => {
    if (isOpportunity) {
      return [
        {
          key: 'Proposal',
          label: 'Proposal',
          color: 'bg-green-500',
          textColor: 'text-white',
          onClick: () => {},
        },
        {
          key: 'Negotiation',
          label: 'Negotiation',
          color: 'bg-yellow-300',
          textColor: 'text-black',
          onClick: () => {},
        },
        {
          key: 'Close',
          label: 'Close',
          color: 'bg-gray-200',
          textColor: 'text-black',
          onClick: () => {},
        },
      ];
    }
    return [
      {
        key: 'New',
        label: 'New',
        color: 'bg-green-500',
        textColor: 'text-black',
        onClick: () => {},
      },
      {
        key: 'Working',
        label: 'Working',
        color: 'bg-yellow-300',
        textColor: 'text-black',
        onClick: () => {},
      },
      {
        key: 'Convert',
        label: 'Convert',
        color: 'bg-gray-200',
        textColor: 'text-black',
        onClick: handleConvertClick,
      },
    ];
  }, [isOpportunity]);

  if (status.leads === Status.PENDING) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  // if (isJob) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Result
  //         status="403"
  //         // title="Access Restricted"
  //         subTitle="This lead has already been converted to a job and is no longer accessible from this page."
  //         extra={<Link href="/job">Go to Jobs</Link>}
  //       />
  //     </div>
  //   );
  // }

  const handleSubmit = async values => {
    try {
      if (!!leadDetail?.job) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, leadDetail?.job);
        if (!isUpdated) {
          message.info('No changes detected to save');
          return;
        }
        await dispatch(
          updateLeadJobThunk({ data: updatedFields, id: leadDetail?.job?.jobFormId })
        ).unwrap();
        message.success('Job Detail created successfully');
      } else {
        await dispatch(createLeadJobThunk({ ...values, leadsId: leadId })).unwrap();
        message.success('Job Detail created successfully');
      }
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save job detail');
    }
  };

  const handleDeleteJobDetail = async () => {
    try {
      await dispatch(deleteLeadJobThunk(leadDetail?.job?.jobFormId)).unwrap();
      message.success('Job detail deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete job detail');
    }
  };

  const handleInvoiceSubmit = async values => {
    try {
      await dispatch(createLeadInvoiceThunk({ ...values, leadsId: leadId })).unwrap();
      message.success('Invoice Detail created successfully');
      setModalOpen('deposit');
    } catch (error) {
      message.error(error || 'Failed to save invoice detail');
    }
  };

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4">
      <div className="col-span-3 lg:col-span-3">
        <div className="m-3 ">
          <StageProgress
            title={title}
            id={leadDetail?.lead?.slugId}
            status={enumToReadable(leadDetail?.lead?.status)}
            steps={steps}
            activeStep={
              isOpportunity ? leadDetail?.lead?.opportunityStatus : leadDetail?.lead?.status
            }
            lead={leadDetail}
            showOptions={true}
            quotations={createdQuotations}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-3">
          <div className="flex items-center border border-border-color bg-card-color">
            <Button icon={<IconUser size={20} />} type="text" />
            <p className="pl-2 border-border-color border-l-2">{leadDetail?.lead?.name}</p>
          </div>
          <div className="flex items-center border border-border-color bg-card-color">
            <Button icon={<IconMail size={20} />} type="text" />
            <p className="pl-2 border-border-color border-l-2">{leadDetail?.lead?.email}</p>
          </div>
          <div className="flex items-center border border-border-color bg-card-color">
            <Button icon={<IconPhone size={20} />} type="text" />
            <p className="pl-2 border-border-color border-l-2">{leadDetail?.lead?.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-3">
          {/* Contact Card */}

          <LeadContactPage
            setModalOpen={setModalOpen}
            handleOpenContactModal={handleOpenContactModal}
          />

          {/* Property Card */}
          <LeadPropertyPage
            setModalOpen={setModalOpen}
            handleDeleteJobDetail={handleDeleteJobDetail}
          />

          {/* Quotation Card */}
          {!!leadDetail?.property && (
            <LeadQuotation
              leadId={leadId}
              setModalOpen={setModalOpen}
              createdQuotations={createdQuotations}
              setSelectedQuotationId={setSelectedQuotationId}
              setShowDeleteConfirm={setShowDeleteConfirm}
            />
          )}
        </div>

        <div className="m-3">
          <Tabs
            defaultActiveKey="action"
            type="card"
            tabBarStyle={{ margin: '0px', marginRight: '10px' }}
            tabBarGutter={10}
            size="large"
          >
            {/* Action Tab */}
            <TabPane tab="Action" key="action" className="border border-border-color border-t-0">
              <LeadActions leadId={leadId} />
            </TabPane>
            <TabPane tab="Document" key="Document">
              <div className="w-full">
                <FileExplorer
                  rootFolders={sdriveRootFolders}
                  enableSearch={true}
                  onSearchChange={query => console.log('Search:', query)}
                  enableMultiSelect={true}
                  onDelete={items => console.log('Delete items:', items)}
                  enableAddFolder={true}
                  onAddFolder={parentId => console.log('Add folder to parent:', parentId)}
                  enableAddFile={true}
                  onAddFile={parentId => console.log('Add file to parent:', parentId)}
                  enableShare={true}
                  onShare={items => console.log('Share items:', items)}
                  enableExport={true}
                  onExport={items => console.log('Export items:', items)}
                />
              </div>
            </TabPane>
            <TabPane tab="Quotations" key="quotations">
              <LeadQuotations />
            </TabPane>
            <TabPane tab="Activity" key="Activity">
              <ActivityCard data={EmailData} tabs={filterTabs} />
            </TabPane>
          </Tabs>
        </div>
        {/* <LeadSpecifications /> */}
        <ConvertLeadModal
          visible={modalOpen === 'convert'}
          onCancel={handleConvertCancel}
          leadId={router.query.id as string}
        />

        <LeadDetailsForm
          open={modalOpen === 'contact'}
          onCancel={() => setModalOpen(null)}
          onSubmit={handleEditLeadSubmit}
          loading={loading}
          isEditing={!!leadDetail?.contacts?.[0]}
          initialValues={leadDetail?.contacts?.[0]}
          isLinkContact={true}
          handleOpenContactModal={handleOpenContactModal}
        />

        {/* Property Details Modal */}
        {modalOpen === 'property' && (
          <PropertyDetailsModal
            visible={modalOpen === 'property'}
            onCancel={() => setModalOpen(null)}
            initialValues={leadDetail?.property}
          />
        )}
        <CloseLeadModal
          isModalOpen={modalOpen === 'closeLead'}
          setIsModalOpen={() => setModalOpen(null)}
          leadData={leadDetail?.lead}
          quotations={createdQuotations}
        />
      </div>
      <div className="col-span-3  lg:col-span-1 ">
        <LeadSource />
      </div>
      <ConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => handleDelete()}
        message="Are you sure you want to delete this Quatation?"
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        maxWidth="sm"
      />

      <DepositModel
        visible={modalOpen === 'invoice'}
        title="Capture Deposit"
        onCancel={() => (!!leadDetail?.job ? setModalOpen('deposit') : setModalOpen(null))}
        onSubmit={handleInvoiceSubmit}
      />
      <JobFormModel
        open={modalOpen === 'job'}
        onClose={() => setModalOpen(null)}
        onSubmit={handleSubmit}
        isEditing={!!leadDetail?.job}
        initialValues={leadDetail?.job}
      />
      <LeadLinkContactModel
        open={modalOpen === 'linkContact'}
        onCancel={() => {
          setModalOpen(null);
          setSelectedContact(null);
        }}
        handleContactSelect={handleContactSelect}
        selectedContact={selectedContact}
        saveContactLink={saveContactLink}
        loading={loading}
      />
      {modalOpen === 'deposit' && (
        <TableDrawer
          width={700}
          open={modalOpen === 'deposit'}
          onClose={() => {
            setModalOpen(null);
          }}
          title="Deposit"
          table={[{ columns, data: leadDetail?.invoice }]}
        >
          <div className="text-center">
            <Button type="primary" onClick={() => setModalOpen('invoice')}>
              <IconPlus size={15} />
              Capture Deposit
            </Button>
          </div>
        </TableDrawer>
      )}
    </div>
  );
}

export default App;
