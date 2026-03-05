import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Card,
  List,
  message,
  Popconfirm,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import StageProgress from '@/components/common/StageProgress';
import ConvertLeadModal from '@/components/leadDetail/ConvertLeadModal';
import PropertyDetailsModal from '@/components/leadDetail/PropertyDetailsModal';
import {
  IconBarrierBlock,
  IconEdit,
  IconFileText,
  IconMail,
  IconPhoneCall,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import SystemRoutes from '@lib/constants/Routes';
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
  updateLeadJobThunk,
} from '@redux/feature/lead/leadThunk';
import dayjs from 'dayjs';
import { setQuotationContact, setQuotationProperty } from '@redux/feature/quotation/quotationSlice';
import { getQuotationsByLeadIdThunk } from '@redux/feature/lead/leadThunk';
import LeadQuotations from '@/components/leadDetail/LeadQuotations/LeadQuotations';
import LeadDetailsForm from '@/components/leadDetail/forms/LeadDetailsForm';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { LeadContact } from '@redux/feature/lead/ILeadState';
import { QuotationResponse } from '@redux/feature/quotation/IQuotationState';
import LeadActions from '@/components/leadDetail/LeadActions';
import { Status } from '@lib/constants/enum';
import { LeadSource } from '@/components/leads/LeadSource';
import CloseLeadModal from '@/components/leadDetail/LeadQuotations/CloseLeadModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { deleteQuotation } from '@redux/feature/quotation/quotationThunk';
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

const { TabPane } = Tabs;
export interface Plan {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  area: string;
}

export interface Facade {
  id: string;
  name: string;
  type: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
}

function App() {
  const router = useRouter();
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
  const dispatch = useAppDispatch();
  const { leadDetail, status } = useAppSelector(state => state.lead);
  const { contact } = useAppSelector(state => state.contact);
  const isLoggedIn = useAppSelector(state => state.auth.isAuthenticated);
  const isOpportunity = leadDetail?.lead?.status !== 'New';
  const title = isOpportunity ? 'Opportunity' : 'Lead';
  const contacts: LeadContact = leadDetail?.contacts;
  const propertyFromSlice = leadDetail?.property;
  const leadId = router.query.id as string | undefined;
  const createdQuotations: QuotationResponse[] = leadDetail?.createdQuotations?.quotations || [];
  const latestLeadDetailRef = useRef<any>(null);
  const { columns } = LeadDepositColumn();
  // const isJob = useMemo(() => leadDetail?.lead?.status === "JOB", [leadDetail]);

  useEffect(() => {
    latestLeadDetailRef.current = leadDetail;
  }, [leadDetail]);

  useEffect(() => {
    if (leadId) {
      fetchData();
    }
  }, [router.query.id, dispatch, status.leads]);

  const primaryContact = contacts;

  useEffect(() => {
    return () => {
      if (primaryContact && isLoggedIn) {
        const latest = latestLeadDetailRef.current;
        const property = (latest as any)?.property ?? null;
        dispatch(setQuotationContact(primaryContact));
        dispatch(setQuotationProperty(property));
      }
    };
  }, [dispatch, primaryContact, isLoggedIn]);

  async function fetchData() {
    try {
      await dispatch(getLeadByIdThunk(leadId)).unwrap();
      await dispatch(getBusinessContactByIdThunk(leadId)).unwrap();
      await dispatch(getLeadContactMapThunk(leadId)).unwrap();
      await dispatch(getLeadInvoiceThunk(leadId)).unwrap();
      await dispatch(getLeadJobThunk(leadId)).unwrap();
      await dispatch(getQuotationsByLeadIdThunk({ leadId, page: 1, limit: 25 })).unwrap();
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
      if (leadDetail?.contacts) {
        const res = await dispatch(
          updateContact({ id: leadDetail?.contacts?.contactId, data: values })
        ).unwrap();
        message.success('Contact updated successfully');
      } else {
        const res = await dispatch(createContact(values)).unwrap();
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
      fetchData(); // Refresh the data to show the linked contact
    } catch (err) {
      message.error(err || 'Failed to link contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    try {
      await dispatch(deleteLeadContactMapThunk(leadDetail?.contacts?.id));
      message.success('Contact removed successfully');
    } catch (error) {
      message.error('Failed to remove lead contact');
    }
  };

  const handleDelete = async () => {
    if (!selectedQuotationId) return;
    try {
      setIsDeleting(true);
      await dispatch(deleteQuotation(selectedQuotationId))
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
          key: 'proposal',
          label: 'Proposal',
          color: 'bg-green-500',
          textColor: 'text-white',
          onClick: () => {},
        },
        {
          key: 'negotiation',
          label: 'Negotiation',
          color: 'bg-yellow-300',
          textColor: 'text-black',
          onClick: () => {},
        },
        {
          key: 'close',
          label: 'Close',
          color: 'bg-gray-200',
          textColor: 'text-black',
          onClick: () => {},
        },
      ];
    }
    return [
      {
        key: 'new',
        label: 'New',
        color: 'bg-green-500',
        textColor: 'text-white',
        onClick: () => {},
      },
      {
        key: 'working',
        label: 'Working',
        color: 'bg-yellow-300',
        textColor: 'text-black',
        onClick: handleConvertClick,
      },
      {
        key: 'convert',
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
            activeStep={isOpportunity ? 'proposal' : 'convert'}
            lead={leadDetail}
            showOptions={true}
            quotations={createdQuotations}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-3">
          {/* Contact Card */}

          {!leadDetail.contacts ? (
            <Card className="flex flex-col items-center justify-center p-6 rounded-lg">
              <p onClick={() => setModalOpen('contact')} className="cursor-pointer">
                Create Contact
              </p>
              <p
                className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                onClick={handleOpenContactModal}
              >
                Link Contact
              </p>
            </Card>
          ) : (
            <Card className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded">
                  Contact
                </span>
                <div className="flex gap-2 items-center">
                  <IconEdit
                    className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
                    onClick={() => setModalOpen('contact')}
                    size={15}
                  />
                  <Popconfirm title="Are you sure you want to delete lead contact?">
                    <IconTrash
                      className="text-red-400 text-sm cursor-pointer hover:text-red-600"
                      onClick={e => {
                        handleDeleteContact();
                      }}
                      size={15}
                    />
                  </Popconfirm>
                </div>
              </div>
              <h2 className="font-semibold text-lg">{primaryContact?.name ?? '-'}</h2>
              <p className="text-sm">
                {enumToReadable(leadDetail?.lead?.leadSourceName) || 'Lead Source not provided'}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <IconPhoneCall className="w-4 h-4" />
                <span className="text-sm">{primaryContact?.phone ?? 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <IconMail className="w-4 h-4" />
                <span className="text-sm">{primaryContact?.email ?? 'N/A'}</span>
              </div>
            </Card>
          )}

          {/* Property Card */}
          <Card className="relative">
            <div className="flex items-center justify-between mb-3">
              {leadDetail?.lead?.status === 'New' || propertyFromSlice?.zipPostalCode === null ? (
                <div className="flex items-center justify-center h-full p-4 w-full">
                  <Card className="text-center h-full my-auto">
                    <button
                      className="text-sm text-blue-600 underline hover:text-blue-800 transition-colors"
                      onClick={() => setModalOpen('property')}
                    >
                      Add property details
                    </button>
                    <div className="flex items-center gap-2 mt-2">
                      <p
                        className="text-sm text-gray-600 cursor-pointer"
                        onClick={() => setModalOpen('job')}
                      >
                        Add Job details
                      </p>
                      {!!leadDetail?.job && (
                        <Popconfirm
                          title="Are you sure you want to delete job detail?"
                          onConfirm={handleDeleteJobDetail}
                        >
                          <Button
                            size="small"
                            type="text"
                            icon={<IconTrash color="red" size={16} />}
                          />
                        </Popconfirm>
                      )}
                    </div>
                  </Card>
                </div>
              ) : (
                <>
                  {' '}
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                    Property
                  </span>
                  <IconEdit
                    className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
                    onClick={() => setModalOpen('property')}
                  />
                </>
              )}
            </div>
            {propertyFromSlice?.address1 ||
            propertyFromSlice?.citySuburb ||
            propertyFromSlice?.stateRegion ||
            propertyFromSlice?.zipPostalCode ? (
              <>
                <Tooltip title={propertyFromSlice?.address1}>
                  <Typography.Title
                    className="font-semibold !text-lg"
                    ellipsis={{ rows: 2, symbol: '...' }}
                  >
                    {propertyFromSlice?.address1 ?? ''}
                  </Typography.Title>
                </Tooltip>
                <p className="text-sm text-gray-600">
                  {[
                    propertyFromSlice?.citySuburb,
                    propertyFromSlice?.stateRegion,
                    propertyFromSlice?.zipPostalCode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>

                <div className="text-sm text-gray-600 mt-2">
                  <p>
                    Title :{' '}
                    {propertyFromSlice?.titleDate
                      ? dayjs(propertyFromSlice?.titleDate).format('DD-MM-YYYY')
                      : ''}
                  </p>
                  <p>Type : {propertyFromSlice?.landType ?? ''}</p>
                  <p>
                    W: {propertyFromSlice?.widthM || ''}
                    {propertyFromSlice?.widthM ? 'm' : ''} D: {propertyFromSlice?.depthM || ''}
                    {propertyFromSlice?.depthM ? 'm' : ''} Total:{' '}
                    {propertyFromSlice?.totalSizeM2 || ''}
                    {propertyFromSlice?.totalSizeM2 ? ' m²' : ''}
                  </p>
                </div>
              </>
            ) : (
              leadDetail?.lead?.status !== 'New' && (
                <div className="flex flex-col items-center justify-center p-6 rounded-lg">
                  <IconBarrierBlock />
                  <p className="text-sm text-gray-500 text-center">No property details added yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add property information to get started
                  </p>
                </div>
              )
            )}
          </Card>

          {/* Quotation Card */}
          {leadDetail?.lead?.status === 'Convert' ? (
            <Card className="flex flex-col items-center justify-center p-6 rounded-lg">
              <Link
                href={SystemRoutes.QUOTATION_CREATE(leadId)}
                className="text-sm text-gray-500 text-center underline"
              >
                Create Quotation
              </Link>
              <p
                className="text-sm text-gray-500 text-center underline mt-2 cursor-pointer"
                onClick={() => setModalOpen('invoice')}
              >
                Capture deposit
              </p>
            </Card>
          ) : (
            leadDetail?.lead?.status !== 'New' && (
              <Card>
                <div className="flex flex-col justify-between">
                  <Link
                    href={SystemRoutes.QUOTATION_CREATE(leadId)}
                    className="text-theme-blue text-sm"
                  >
                    Create Quotation
                  </Link>
                  <div className="max-h-[200px] my-2 overflow-y-auto">
                    <List
                      dataSource={createdQuotations || []}
                      locale={{
                        emptyText: (
                          <div className="flex flex-col items-center justify-center p-6">
                            <IconFileText />
                            <p className=" text-sm text-gray-500 text-center">
                              No quotations found
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Create a quotation to get started
                            </p>
                          </div>
                        ),
                      }}
                      renderItem={(quotation: any) => (
                        <List.Item
                          key={quotation?.quotationId}
                          onClick={() => {
                            return router.push(
                              `/quotation/${quotation?.versions[0]?.quotationVersionId}`
                            );
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="flex items-center justify-between w-full overflow-hidden">
                            <div className="flex items-center space-x-4">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                {createdQuotations.indexOf(quotation) + 1}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  <span className=" text-sm text-gray-500">
                                    {quotation?.slugId?.slice(0, 13)}...
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Tag
                                    color={quotation?.lead?.status === 'Open' ? 'blue' : 'green'}
                                    className="m-0"
                                  >
                                    {enumToReadable(quotation?.leadStatus)}
                                  </Tag>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Total Amount</div>
                              <div className="text-lg font-semibold text-gray-900">
                                ${Number(quotation?.totalAmount || 0)}
                              </div>
                            </div>
                            <div className="hover:text-red-500">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setSelectedQuotationId(quotation?.quotationId);
                                  setShowDeleteConfirm(true);
                                }}
                              >
                                <IconTrash size={20} />
                              </button>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </Card>
            )
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
            <TabPane tab="Action" key="action" className="border border-t-0">
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
          isEditing={!!leadDetail?.contacts}
          initialValues={{
            ...primaryContact,
            secondary_phone: primaryContact?.secondaryPhone,
          }}
        />

        {/* Property Details Modal */}
        <PropertyDetailsModal
          visible={modalOpen === 'property'}
          onCancel={() => setModalOpen(null)}
          onSave={() => setModalOpen(null)}
          initialValues={propertyFromSlice}
        />
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
