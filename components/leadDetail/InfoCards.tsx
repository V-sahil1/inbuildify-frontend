import React, { useState } from 'react';
import { Card, Button, Tag, Modal, Divider, Tooltip, message } from 'antd';
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
} from '@tabler/icons-react';
import { PropertyDetails } from 'data/types';
import PropertyDetailsModal from './PropertyDetailsModal';
import FloorPlanModal from './FloorPlanModal';
import dayjs from 'dayjs';
import FacadeModal from './FacadeModal';
import { IFacadeState } from '@redux/feature/facade/IFacadeState';
import PackageModal from './PackageModal';
import { Package } from '@redux/feature/package/IPackageState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createLeadContactThunk, updateLeadContactThunk } from '@redux/feature/lead/leadThunk';
import LeadDetailsForm from './forms/LeadDetailsForm';
import { setQuotationContact } from '@redux/feature/quotation/quotationSlice';
import { clearStandardFilter, clearUpgradeFilter } from '@redux/feature/facade/facadeSlice';
import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';

interface InfoCardsProps {
  propertyDetails: any;
  selectedPlan?: IFloorPlanState;
  selectedFacade?: IFacadeState;
  selectedPackage?: Package;
  onPlanSelect: (plan: IFloorPlanState) => void;
  onFacadeSelect: (facade: IFacadeState) => void;
  onPackageSelect: (pkg: Package) => void;
  onPropertyUpdate: (property: PropertyDetails) => void;
  isReadOnly?: boolean;
  filters?: Record<string, string>;
}

const InfoCards: React.FC<InfoCardsProps> = ({
  propertyDetails,
  selectedPlan,
  selectedFacade,
  selectedPackage,
  onPlanSelect,
  onFacadeSelect,
  onPackageSelect,
  onPropertyUpdate,
  isReadOnly,
  filters,
}) => {
  const [modalOpen, setModalOpen] = useState<
    'property' | 'floorPlan' | 'facade' | 'package' | null
  >(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector(state => state.lead);
  const handleEditLeadSubmit = async (values: any) => {
    const { type, hideAddressForm, ...details } = values;
    try {
      setLoading(true);
      if (type === 'update') {
        const response = await dispatch(
          updateLeadContactThunk({
            id: leadDetail?.contacts?.contactId,
            details,
          })
        ).unwrap();
        message.success('Lead updated successfully');
        dispatch(setQuotationContact(response));
      } else {
        await dispatch(createLeadContactThunk({ id: leadDetail?.lead?.leadsId, details })).unwrap();
        message.success('Lead contact created successfully');
      }
    } catch (err) {
      message.error(err || 'Failed to update lead');
    } finally {
      setEditModalVisible(false);
      setLoading(false);
    }
  };
  const isSelectionDisabled = !filters?.range || !filters?.dwellingType;
  const disabledMessage = isSelectionDisabled
    ? 'Please select both Range and Dwelling Type first'
    : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3">
      {/* Lead Details Card */}
      <Card
        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={!isReadOnly ? () => setEditModalVisible(true) : undefined}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconUser className="text-blue-500" />
            <span className="font-medium text-font-color">Lead Details</span>
          </div>
          {!isReadOnly && <IconEdit className="text-gray-400 text-sm" />}
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-font-color">{leadDetail?.contacts?.name}</div>
          <div className="flex items-center text-sm text-font-color-100">
            <IconPhone size={14} className="mr-1 text-font-color-100" />
            {leadDetail?.contacts?.phone || 'N/A'}
          </div>
          <div className="flex items-center text-sm text-font-color-100">
            <IconMail size={14} className="mr-1 text-font-color-100" />
            {leadDetail?.contacts?.email || 'N/A'}
          </div>
          {leadDetail?.contacts?.address?.addressLine1 && (
            <div className="flex items-start text-sm text-font-color-100">
              <IconMapPin size={14} className="mr-1 mt-0.5 text-font-color-100 flex-shrink-0" />
              <span className="line-clamp-2">
                {leadDetail?.contacts?.address?.addressLine1 || 'Not provided'}
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
          {!isReadOnly && <IconEdit className="text-gray-400 ml-auto" />}
        </div>
        {propertyDetails?.address1 &&
        propertyDetails?.citySuburb &&
        propertyDetails?.stateRegion &&
        propertyDetails?.zipPostalCode ? (
          <div className="space-y-2">
            <div className="font-semibold text-font-color">{propertyDetails?.address1}</div>
            <div className="text-sm text-font-color">
              {[
                propertyDetails?.citySuburb,
                propertyDetails?.stateRegion,
                propertyDetails?.zipPostalCode,
              ]
                .filter(Boolean)
                .join(', ')}
            </div>
            <div className="text-sm text-font-color-100">
              Title :{' '}
              {propertyDetails?.titleDate
                ? dayjs(propertyDetails?.titleDate).format('DD-MM-YYYY')
                : ''}
            </div>
            <div className="text-sm text-font-color-100">
              Type: {propertyDetails?.landType ?? ''}
            </div>
            {propertyDetails?.widthM && propertyDetails?.depthM && (
              <div className="text-sm text-font-color-100">
                W: {propertyDetails?.widthM || ''}
                {propertyDetails?.widthM ? 'm' : ''} D: x chr
                {propertyDetails?.depthM || ''}
                {propertyDetails?.depthM ? 'm' : ''} Total: {propertyDetails?.totalSizeM2 || ''}
                {propertyDetails?.totalSizeM2 ? ' m²' : ''}
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
        <Tooltip title={disabledMessage}>
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
                  {!isReadOnly && <IconEdit className="text-gray-400 ml-auto" />}
                </div>

                <div className="flex justify-between w-full gap-2">
                  <div className="flex flex-col items-center text-gray-400 w-full">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <IconBedFlat size={20} />
                    </div>
                    <span className="text-sm">{selectedPlan?.beds || 0}</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-400 w-full">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <IconBath size={20} />
                    </div>
                    <span className="text-sm">{selectedPlan?.baths || 0}</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-400 w-full">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <IconCar size={20} />
                    </div>
                    <span className="text-sm">{selectedPlan?.carpark || 0}</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-400 w-full">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <IconForklift size={20} />
                    </div>
                    <span className="text-sm">{selectedPlan?.garageArea || 0}</span>
                  </div>
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
        <Tooltip title={disabledMessage}>
          <Card
            className={`shadow-sm transition-shadow ${isSelectionDisabled ? 'opacity-70' : 'hover:shadow-md cursor-pointer'}`}
            onClick={!isSelectionDisabled && !isReadOnly ? () => setModalOpen('facade') : undefined}
          >
            {selectedFacade ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <IconFileText className="text-purple-500" />
                  <span className="font-medium text-font-color">{selectedFacade?.name}</span>
                  {!isReadOnly && <IconEdit className="text-gray-400 ml-auto" />}
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

      {/* Select Package Card */}
      <Tooltip title={disabledMessage}>
        <Card
          className={`shadow-sm transition-shadow ${isSelectionDisabled ? 'opacity-70' : 'hover:shadow-md cursor-pointer'}`}
          onClick={!isSelectionDisabled && !isReadOnly ? () => setModalOpen('package') : undefined}
        >
          {selectedPackage ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <IconGift className="text-red-500" />
                <span className="font-medium text-font-color">{selectedPackage?.name}</span>
                {!isReadOnly && <IconEdit className="text-gray-400 ml-auto" />}
              </div>
              <div className="space-y-2">
                {/* <div className="font-semibold text-font-color">Package (1)</div> */}
                {/* <div className="font-medium text-blue-600">
                {selectedPackage?.name}
              </div> */}
                <div className="text-lg font-bold text-green-600">${selectedPackage?.amount}</div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Button type="primary" size="middle" disabled={isSelectionDisabled}>
                Select Package
              </Button>
            </div>
          )}
        </Card>
      </Tooltip>

      {modalOpen === 'property' && (
        <PropertyDetailsModal
          visible={modalOpen === 'property'}
          onCancel={() => setModalOpen(null)}
          onSave={onPropertyUpdate}
          initialValues={propertyDetails}
        />
      )}

      {/* Edit Lead Details Modal */}
      {editModalVisible && (
        <LeadDetailsForm
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onSubmit={handleEditLeadSubmit}
          loading={loading}
          isEditing={true}
          initialValues={leadDetail?.contacts}
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
    </div>
  );
};

export default InfoCards;
