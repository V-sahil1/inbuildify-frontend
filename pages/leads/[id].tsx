import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, List, message, Result, Spin, Tabs, Tag, Tooltip, Typography } from 'antd';
import StageProgress from '@/components/common/StageProgress';
import ConvertLeadModal from '@/components/leadDetail/ConvertLeadModal';
import PropertyDetailsModal from '@/components/leadDetail/PropertyDetailsModal';
import {
  IconBarrierBlock,
  IconEdit,
  IconFileText,
  IconMail,
  IconPhoneCall,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import SystemRoutes from '@lib/constants/Routes';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createLeadContactThunk,
  getLeadByIdThunk,
  updateLeadContactThunk,
} from '@redux/feature/lead/leadThunk';
// import { RootState } from "@redux/feature/store";
import dayjs from 'dayjs';
import { setQuotationContact, setQuotationProperty } from '@redux/feature/quotation/quotationSlice';
// import { clearLeadDetail } from "@redux/feature/lead/leadSlice";
import { getQuotationsByLeadIdThunk } from '@redux/feature/lead/leadThunk';
import LeadQuotations from '@/components/leadDetail/LeadQuotations/LeadQuotations';
import LeadDetailsForm from '@/components/leadDetail/forms/LeadDetailsForm';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { ILeadContact } from '@redux/feature/lead/ILeadState';
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

const { Text } = Typography;
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConvertModalVisible, setIsConvertModalVisible] = useState(false);
  const [isEditLeadModalVisible, setIsEditLeadModalVisible] = useState(false);
  const [isPropertyModalVisible, setIsPropertyModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector(state => state.lead);
  const status = useAppSelector(state => state.lead.status.leadById);
  const isLoggedIn = useAppSelector(state => state.auth.isAuthenticated);

  const isOpportunity = leadDetail?.lead?.status !== 'NEW';
  const title = isOpportunity ? 'Opportunity' : 'Lead';
  const contacts: ILeadContact[] = leadDetail?.contacts;
  const propertyFromSlice = leadDetail?.property;
  const leadId = router.query.id as string | undefined;
  const createdQuotations: QuotationResponse[] = leadDetail?.createdQuotations?.quotations || [];
  const latestLeadDetailRef = useRef<any>(null);
  // const isJob = useMemo(() => leadDetail?.lead?.status === "JOB", [leadDetail]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);

  useEffect(() => {
    latestLeadDetailRef.current = leadDetail;
  }, [leadDetail]);

  useEffect(() => {
    if (leadId) {
      async function fetchData() {
        await dispatch(getLeadByIdThunk(leadId));
        await dispatch(getQuotationsByLeadIdThunk({ leadId, page: 1, limit: 25 }));
      }
      fetchData();
    }
  }, [router.query.id, dispatch]);

  const primaryContact = contacts?.find(
    (cont: ILeadContact) => cont.leadsContactId === leadDetail?.lead?.leadContactId
  );

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

  const handleConvertClick = () => {
    setIsConvertModalVisible(true);
  };

  const handleConvertCancel = () => {
    setIsConvertModalVisible(false);
  };

  const handleEditLeadSubmit = async (values: any) => {
    const { type, hideAddressForm, ...details } = values;
    try {
      setLoading(true);
      if (type === 'update') {
        await dispatch(
          updateLeadContactThunk({
            id: primaryContact?.leadsContactId,
            details,
          })
        ).unwrap();
        message.success('Lead updated successfully');
      } else {
        await dispatch(createLeadContactThunk({ id: leadId, details })).unwrap();
        message.success('Lead contact created successfully');
      }
      setIsEditLeadModalVisible(false);
    } catch (err) {
      message.error(err || 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  const closeLeadModal = () => {
    setIsModalOpen(true);
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
          onClick: () => { },
        },
        {
          key: 'negotiation',
          label: 'Negotiation',
          color: 'bg-yellow-300',
          textColor: 'text-black',
          onClick: () => { },
        },
        {
          key: 'close',
          label: 'Close',
          color: 'bg-gray-200',
          textColor: 'text-black',
          onClick: () => { },
        },
      ];
    }
    return [
      {
        key: 'new',
        label: 'New',
        color: 'bg-green-500',
        textColor: 'text-white',
        onClick: () => { },
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

  if (status === Status.PENDING) {
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
          <Card className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded">
                Contact
              </span>
              <IconEdit
                className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
                onClick={() => setIsEditLeadModalVisible(true)}
              />
            </div>
            <h2 className="font-semibold text-lg">{primaryContact?.name ?? '-'}</h2>
            <p className="text-sm">
              {enumToReadable(leadDetail?.lead?.leadSource) || 'Lead Source not provided'}
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

          {/* Property Card */}
          <Card className="relative">
            <div className="flex items-center justify-between mb-3">
              {leadDetail?.lead?.status === 'NEW' && propertyFromSlice?.zipPostalCode === null ? (
                <div className="flex items-center justify-center h-full p-4 w-full">
                  <Card className="text-center h-full my-auto">
                    <button
                      className="text-sm text-blue-600 underline hover:text-blue-800 transition-colors"
                      onClick={() => setIsPropertyModalVisible(true)}
                    >
                      Add property details
                    </button>
                    {/* <p className="text-sm text-gray-600 mt-2">Add Job details</p> */}
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
                    onClick={() => setIsPropertyModalVisible(true)}
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
              leadDetail?.lead?.status !== 'NEW' && (
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
          {leadDetail?.lead?.status === 'NEW' ? (
            <Card className="flex flex-col items-center justify-center p-6 rounded-lg">
              <Link
                href={SystemRoutes.QUOTATION_CREATE(leadId)}
                className="text-sm text-gray-500 text-center underline"
              >
                Create Quotation
              </Link>
              <p
                className="text-sm text-gray-500 text-center underline mt-2 cursor-pointer"
                onClick={() => setIsDepositModalVisible(true)}
              >
                Capture deposit
              </p>
            </Card>
          ) : (
            leadDetail?.lead?.status !== 'NEW' && (
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
                  onSearchChange={(query) => console.log('Search:', query)}
                  enableMultiSelect={true}
                  onDelete={(items) => console.log('Delete items:', items)}
                  enableAddFolder={true}
                  onAddFolder={(parentId) => console.log('Add folder to parent:', parentId)}
                  enableAddFile={true}
                  onAddFile={(parentId) => console.log('Add file to parent:', parentId)}
                  enableShare={true}
                  onShare={(items) => console.log('Share items:', items)}
                  enableExport={true}
                  onExport={(items) => console.log('Export items:', items)}
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
          visible={isConvertModalVisible}
          onCancel={handleConvertCancel}
          leadId={router.query.id as string}
        />

        <LeadDetailsForm
          open={isEditLeadModalVisible}
          onCancel={() => setIsEditLeadModalVisible(false)}
          onSubmit={handleEditLeadSubmit}
          loading={loading}
          isEditing={true}
          initialValues={{
            ...primaryContact,
            secondary_phone: primaryContact?.secondaryPhone,
          }}
        />

        {/* Property Details Modal */}
        <PropertyDetailsModal
          visible={isPropertyModalVisible}
          onCancel={() => setIsPropertyModalVisible(false)}
          onSave={() => setIsPropertyModalVisible(false)}
          initialValues={propertyFromSlice}
        />
        <CloseLeadModal
          isModalOpen={isModalOpen}
          setIsModalOpen={() => setIsModalOpen(false)}
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
        visible={isDepositModalVisible}
        title="Capture Deposit"
        onCancel={() => setIsDepositModalVisible(false)}
        onSubmit={values => {
          console.log('Updated deposit:', values);
          setIsDepositModalVisible(false);
        }}
      />
    </div>
  );
}

export default App;
