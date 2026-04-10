import React, { useState } from 'react';
import { Card, Button, Tooltip, message, Popconfirm } from 'antd';
import {
  IconUser,
  IconHome,
  IconFileText,
  IconEdit,
  IconGift,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBedFlat,
  IconBath,
  IconCar,
  IconForklift,
  IconTrash,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { PropertyDetails } from 'data/types';
import PropertyDetailsModal from './PropertyDetailsModal';
import FloorPlanModal from './FloorPlanModal';
import dayjs from 'dayjs';
import FacadeModal from './FacadeModal';
import { IFacadeState } from '@redux/feature/facade/IFacadeState';
import PackageModal from './PackageModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { clearStandardFilter, clearUpgradeFilter } from '@redux/feature/facade/facadeSlice';
import {
  createContact,
  fetchAllContact,
  updateContact,
} from '@redux/feature/contacts/contactThunk';
import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';
import { deleteQuotationPackageThunk } from '@redux/feature/quotation/quotationThunk';
import { Package } from '@redux/feature/package/IPackageState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import {
  createLeadContactMapThunk,
  deleteLeadContactMapThunk,
} from '@redux/feature/lead/leadThunk';
import { LeadLinkContactModel } from '../common/Models/LeadLinkContactModel';
import { IContact } from '@redux/feature/contacts/contactState';
import LeadContactModel from '../common/Models/LeadContactModel';
import { LeadContact } from '@redux/feature/lead/ILeadState';
import StructuralEngineerListModal from '../common/Models/StructuralEngineerListModal';
import { MdEngineering } from 'react-icons/md';
interface InfoCardsProps {
  propertyDetails?: any;
  selectedPlan?: IFloorPlanState;
  selectedFacade?: IFacadeState;
  selectedPackage?: Package;
  selectedStructuralEngineer?: any;
  onPlanSelect: (plan: IFloorPlanState) => void;
  onFacadeSelect: (facade: IFacadeState) => void;
  onPackageSelect: (pkg: Package) => void;
  onStructuralEngineerSelect: (engineer: any) => void;
  onPropertyUpdate: (property: PropertyDetails) => void;
  isReadOnly?: boolean;
  filters?: Record<string, string>;
}

const InfoCards: React.FC<InfoCardsProps> = ({
  propertyDetails,
  selectedPlan,
  selectedFacade,
  selectedPackage,
  selectedStructuralEngineer,
  onPlanSelect,
  onFacadeSelect,
  onPackageSelect,
  onStructuralEngineerSelect,
  onPropertyUpdate,
  isReadOnly,
  filters,
}) => {
  const { quoteDetails, items } = useAppSelector(state => state.quotation);
  const [modalOpen, setModalOpen] = useState<
    | 'property'
    | 'floorPlan'
    | 'facade'
    | 'package'
    | 'linkContact'
    | 'contact'
    | 'structuralEngineer'
    | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const { contact } = useAppSelector(state => state.contact);
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector(state => state.lead);
  const isSelectionDisabled = !filters?.range || !filters?.dwellingType;
  const isPackageSelectionDisabled = !quoteDetails?.structuralEngineer || isSelectionDisabled;
  const isStructuralEngineerDisabled = !selectedPlan || !selectedFacade || isSelectionDisabled;
  const disabledMessage = isSelectionDisabled
    ? 'Please select both Range and Dwelling Type first'
    : !quoteDetails?.structuralEngineer
      ? 'Please select a Structural Engineer first'
      : !selectedPlan || !selectedFacade
        ? 'Please select both Plan and Facade first'
        : '';
  const handleEditLeadSubmit = async (selectedContact: LeadContact | null, values: LeadContact) => {
    try {
      if (!!selectedContact) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, selectedContact);
        if (!isUpdated) {
          setModalOpen(null);
          setLoading(false);
          return;
        }
        const res = await dispatch(
          updateContact({ id: selectedContact.contactId || '', data: updatedFields })
        ).unwrap();
        message.success('Contact updated successfully');
      } else {
        const res = await dispatch(createContact(values)).unwrap();
        await dispatch(
          createLeadContactMapThunk({
            leadsId: leadDetail?.lead?.leadsId,
            contactId: res.usersId,
          })
        ).unwrap();
        message.success('Contact saved successfully');
      }
      setModalOpen(null);
      setLoading(false);
    } catch (error) {
      message.error(error || 'Failed to save contact');
    }
  };

  const handleDeletePackage = async (versionId: string, pkgId: string) => {
    try {
      if (!versionId) {
        message.error('Quotation version ID is required to delete package');
        return;
      }
      await dispatch(deleteQuotationPackageThunk({ versionId, pkgId })).unwrap();
      message.success('Package deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete package');
    }
  };

  const handleDeleteStructuralEngineer = async (versionId: string, engineerId: string) => {
    try {
      if (!versionId) {
        message.error('Quotation version ID is required to delete structural engineer');
        return;
      }
      // await dispatch(deleteQuotationStructuralEngineerThunk({ versionId, engineerId })).unwrap();
      message.success('Structural engineer deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete structural engineer');
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

  const saveContactLink = async () => {
    if (!selectedContact) return;

    try {
      setLoading(true);
      await dispatch(
        createLeadContactMapThunk({
          leadsId: leadDetail?.lead?.leadsId || '',
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
  const handleDeleteContact = async (id: string) => {
    try {
      await dispatch(deleteLeadContactMapThunk(id));
      message.success('Contact removed successfully');
    } catch (error) {
      message.error(error || 'Failed to remove lead contact');
    }
  };
  console.log("quoteDetails", quoteDetails);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-3">
      {/* Lead Details Card */}
      <Card
        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={!isReadOnly ? () => setModalOpen('contact') : undefined}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconUser className="text-blue-500" />
            <span className="font-medium text-font-color">Lead Details</span>
          </div>
          <Tooltip title="Edit">
            {!isReadOnly && <IconEdit className="text-gray-400 text-sm" />}
          </Tooltip>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-font-color">{quoteDetails?.leadContacts?.[0]?.name}</div>
          <div className="flex items-center text-sm text-font-color-100">
            <IconPhone size={14} className="mr-1 text-font-color-100" />
            {quoteDetails?.leadContacts?.[0]?.phone || 'N/A'}
          </div>
          <div className="flex items-center text-sm text-font-color-100">
            <IconMail size={14} className="mr-1 text-font-color-100" />
            {quoteDetails?.leadContacts?.[0]?.email || 'N/A'}
          </div>
          {quoteDetails?.leadContacts?.[0]?.address?.addressLine1 && (
            <div className="flex items-start text-sm text-font-color-100">
              <IconMapPin size={14} className="mr-1 mt-0.5 text-font-color-100 flex-shrink-0" />
              <span className="line-clamp-2">
                {quoteDetails?.leadContacts?.[0]?.address?.addressLine1 || 'Not provided'}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card
        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={!isReadOnly ? () => setModalOpen('property') : undefined}
      >
        <div className="flex items-center gap-2 mb-3">
          <IconHome className="text-green-500" />
          <span className="font-medium text-font-color">Property Details</span>
          <Tooltip>{!isReadOnly && <IconEdit className="text-gray-400 ml-auto" />}</Tooltip>
        </div>
        {quoteDetails?.property?.city &&
          quoteDetails?.property?.stateName &&
          quoteDetails?.property?.zipCode ? (
          <div className="space-y-2">
            <div className="font-semibold text-font-color">
              {quoteDetails?.property?.addressLine1}
            </div>
            <div className="text-sm text-font-color">
              {[
                quoteDetails?.property?.city,
                quoteDetails?.property?.stateName,
                quoteDetails?.property?.zipCode,
              ]
                .filter(Boolean)
                .join(', ')}
            </div>
            <div className="text-sm text-font-color-100">
              Title :{' '}
              {quoteDetails?.property?.titleDate
                ? dayjs(quoteDetails?.property?.titleDate).format('DD-MM-YYYY')
                : ''}
            </div>
            <div className="text-sm text-font-color-100">
              Type: {quoteDetails?.property?.landType ?? ''}
            </div>
            {quoteDetails?.property?.widthM && quoteDetails?.property?.depthM && (
              <div className="text-sm text-font-color-100">
                W: {quoteDetails?.property?.widthM || ''}
                {quoteDetails?.property?.widthM ? 'm' : ''} D: x chr
                {quoteDetails?.property?.depthM || ''}
                {quoteDetails?.property?.depthM ? 'm' : ''} Total:{' '}
                {quoteDetails?.property?.totalSizeM2 || ''}
                {quoteDetails?.property?.totalSizeM2 ? ' m²' : ''}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Button type="primary" size="middle">
              Please Fill Property Details
            </Button>
          </div>
        )}
      </Card>
      {/* Select Plan Card */}
      <div className="flex gap-4 flex-col">
        <Tooltip
          title={isSelectionDisabled ? 'Please select both Range and Dwelling Type first' : ''}
        >
          <Card
            className={`shadow-sm transition-shadow ${isSelectionDisabled ? 'opacity-70' : 'hover:shadow-md cursor-pointer'}`}
            onClick={
              !isSelectionDisabled && !isReadOnly ? () => setModalOpen('floorPlan') : undefined
            }
          >
            {selectedPlan ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <IconFileText className="text-purple-500" />
                  <span className="font-medium text-font-color">{selectedPlan.name}</span>
                  <Tooltip title="Edit">
                    {!isReadOnly && <IconEdit className="text-gray-400 ml-auto" />}
                  </Tooltip>
                </div>

                <div className="flex justify-between w-full gap-2">
                  <Tooltip title="Bedrooms">
                    <div className="flex flex-col items-center text-gray-400 w-full">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <IconBedFlat size={20} />
                      </div>
                      <span className="text-sm">{selectedPlan?.beds || 0}</span>
                    </div>
                  </Tooltip>
                  <Tooltip title="Bathrooms">
                    <div className="flex flex-col items-center text-gray-400 w-full">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <IconBath size={20} />
                      </div>
                      <span className="text-sm">{selectedPlan?.baths || 0}</span>
                    </div>
                  </Tooltip>

                  <Tooltip title="Car Park">
                    <div className="flex flex-col items-center text-gray-400 w-full">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <IconCar size={20} />
                      </div>
                      <span className="text-sm">{selectedPlan?.carpark || 0}</span>
                    </div>
                  </Tooltip>
                  <Tooltip title="Garage Area">
                    <div className="flex flex-col items-center text-gray-400 w-full">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <IconForklift size={20} />
                      </div>
                      <span className="text-sm">{selectedPlan?.garageArea || 0}</span>
                    </div>
                  </Tooltip>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Button type="primary" size="middle" disabled={isSelectionDisabled}>
                  Select Plan
                </Button>
              </div>
            )}
          </Card>
        </Tooltip>
        <Tooltip
          title={isSelectionDisabled ? 'Please select both Range and Dwelling Type first' : ''}
        >
          <Card
            className={`shadow-sm transition-shadow ${isSelectionDisabled ? 'opacity-70' : 'hover:shadow-md cursor-pointer'}`}
            onClick={!isSelectionDisabled && !isReadOnly ? () => setModalOpen('facade') : undefined}
          >
            {selectedFacade ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <IconFileText className="text-purple-500" />
                  <span className="font-medium text-font-color">{selectedFacade?.name}</span>
                  <Tooltip title="Edit">
                    {!isReadOnly && <IconEdit className="text-gray-400 ml-auto" />}
                  </Tooltip>
                </div>
                <div className="space-y-2"></div>
              </>
            ) : (
              <div className="text-center py-4">
                <Button type="primary" size="middle" disabled={isSelectionDisabled}>
                  Select Facade
                </Button>
              </div>
            )}
          </Card>
        </Tooltip>
      </div>

      <div className="flex gap-4 flex-col">
        {/* Select Structural Engineer */}
        <Tooltip
          title={
            isStructuralEngineerDisabled ? 'Please select a Structural Engineer first' : undefined
          }
        >
          <div
            className={`shadow-sm transition-shadow bg-card-color rounded-lg border border-border-color p-6 ${isStructuralEngineerDisabled ? 'opacity-70' : 'hover:shadow-md cursor-pointer'}`}
            onClick={
              !isStructuralEngineerDisabled && !isReadOnly
                ? () => setModalOpen('structuralEngineer')
                : undefined
            }
          >
            {!!quoteDetails?.structuralEngineer ? (
              <>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <MdEngineering className="text-blue-500 shrink-0" />
                    <span className="font-medium text-font-color">
                      {quoteDetails?.structuralEngineer?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isReadOnly && (
                      <>
                        <Tooltip title="Change Structural Engineer">
                          <IconEdit
                            className="text-gray-500 cursor-pointer hover:text-blue-500"
                            size={15}
                            onClick={e => {
                              e.stopPropagation();
                              setModalOpen('structuralEngineer');
                            }}
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xl font-extrabold text-green-600 text-end">
                  {quoteDetails?.structuralEngineer?.price
                    ? `$${quoteDetails?.structuralEngineer?.price}`
                    : 'Price not set'}
                </p>
              </>
            ) : (
              <div className="flex justify-center items-center h-full py-4">
                <Button
                  type="primary"
                  size="middle"
                  disabled={isStructuralEngineerDisabled}
                  onClick={() => setModalOpen('structuralEngineer')}
                >
                  Select Structural Engineer
                </Button>
              </div>
            )}
          </div>
        </Tooltip>

        {/* Select Package Card */}
        <Tooltip title={isPackageSelectionDisabled ? disabledMessage : undefined}>
          <div
            className={`shadow-sm transition-shadow bg-card-color rounded-lg border border-border-color p-6 ${isPackageSelectionDisabled ? 'opacity-70' : 'hover:shadow-md cursor-pointer'}`}
            onClick={
              !isPackageSelectionDisabled && !isReadOnly ? () => setModalOpen('package') : undefined
            }
          >
            {!!selectedPackage ? (
              <>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <IconGift className="text-red-500" />
                    <span className="font-medium text-font-color">{selectedPackage?.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isReadOnly && (
                      <Popconfirm
                        title="Are you sure you want to remove this package?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={e => {
                          e.stopPropagation();
                          handleDeletePackage(
                            quoteDetails?.quotationVersionId,
                            selectedPackage.packageId
                          );
                        }}
                      >
                        <IconTrash
                          className="text-red-500 ml-auto"
                          size={15}
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        />
                      </Popconfirm>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  {/* Warning icon for package cost mismatch */}
                  {selectedPackage &&
                    quoteDetails?.package?.packageId === selectedPackage.packageId &&
                    items.some(item => item.isPackageCostMismatch) && (
                      <Tooltip title="Warning: Package cost or item mismatch from current">
                        <IconAlertTriangle size={16} className="text-yellow-500 cursor-help" />
                      </Tooltip>
                    )}
                  <p className="text-xl font-extrabold text-green-600 text-end">
                    ${selectedPackage?.cost}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-full py-4">
                <Button type="primary" size="middle" disabled={isPackageSelectionDisabled}>
                  Select Package
                </Button>
              </div>
            )}
          </div>
        </Tooltip>
      </div>

      {modalOpen === 'property' && (
        <PropertyDetailsModal
          visible={modalOpen === 'property'}
          onCancel={() => setModalOpen(null)}
          initialValues={leadDetail?.property}
        />
      )}

      {/* Edit Lead Details Modal */}
      {modalOpen === 'contact' && (
        <LeadContactModel
          open={modalOpen === 'contact'}
          onCancel={() => setModalOpen(null)}
          contacts={leadDetail?.contacts}
          onLinkContact={handleOpenContactModal}
          onDeleteContact={handleDeleteContact}
          onSaveContact={handleEditLeadSubmit}
        />
      )}

      {modalOpen === 'floorPlan' && (
        <FloorPlanModal
          visible={modalOpen === 'floorPlan'}
          onCancel={() => setModalOpen(null)}
          onSave={onPlanSelect}
          selectedPlan={selectedPlan}
        />
      )}

      {modalOpen === 'facade' && (
        <FacadeModal
          visible={modalOpen === 'facade'}
          onCancel={() => {
            setModalOpen(null);
            dispatch(clearStandardFilter());
            dispatch(clearUpgradeFilter());
          }}
          onSave={data => {
            onFacadeSelect(data as IFacadeState);
            dispatch(clearStandardFilter());
            dispatch(clearUpgradeFilter());
          }}
          selectedFacade={selectedFacade}
        />
      )}
      {/* Structural Engineer List Modal */}
      {modalOpen === 'structuralEngineer' && (
        <StructuralEngineerListModal
          visible={modalOpen === 'structuralEngineer'}
          onCancel={() => setModalOpen(null)}
          onAssign={onStructuralEngineerSelect}
          selectedStructuralEngineer={selectedStructuralEngineer}
        />
      )}

      {/* Package Selection Modal */}
      {modalOpen === 'package' && (
        <PackageModal
          visible={modalOpen === 'package'}
          onCancel={() => setModalOpen(null)}
          onSave={onPackageSelect}
          selectedPackage={selectedPackage}
          onSelect={onPackageSelect}
          filters={filters}
        />
      )}
      {modalOpen === 'linkContact' && (
        <LeadLinkContactModel
          open={modalOpen === 'linkContact'}
          onCancel={() => {
            setModalOpen(null);
            setSelectedContact(null);
          }}
          handleContactSelect={contact => setSelectedContact(contact)}
          selectedContact={selectedContact}
          saveContactLink={saveContactLink}
          loading={loading}
        />
      )}
    </div>
  );
};

export default InfoCards;
