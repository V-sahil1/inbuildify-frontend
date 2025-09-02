import React, { useState } from "react";
import { Card, Button, Tag, Modal, Divider, Tooltip, message } from "antd";
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
} from "@tabler/icons-react";
import LeadDetailsForm from "./forms/LeadDetailsForm";
import { LeadDetails, PropertyDetails, Plan } from "data/types";
import PropertyDetailsModal from "./PropertyDetailsModal";
import FloorPlanModal from "./FloorPlanModal";
import dayjs from "dayjs";
import FacadeModal from "./FacadeModal";
import { IFacadeState } from "@redux/feature/facade/IFacadeState";
import PackageModal from "./PackageModal";
import { Package } from "@redux/feature/package/IPackageState";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import leadCreateFields from "../formFields/LeadCreateFields";
import { CreateFormModal } from "../common/Models/CreateFormModel";
import { updateLeadThunk } from "@redux/feature/lead/leadThunk";
import { updateQuotationContact } from "@redux/feature/quotation/quotationSlice";

interface InfoCardsProps {
  leadDetails: LeadDetails;
  propertyDetails: any;
  selectedPlan?: Plan;
  selectedFacade?: IFacadeState;
  selectedPackage?: Package;
  onPlanSelect: (plan: Plan) => void;
  onFacadeSelect: (facade: IFacadeState) => void;
  onPackageSelect: (pkg: Package) => void;
  onPropertyUpdate: (property: PropertyDetails) => void;
}

const InfoCards: React.FC<InfoCardsProps> = ({
  leadDetails,
  propertyDetails,
  selectedPlan,
  selectedFacade,
  selectedPackage,
  onPlanSelect,
  onFacadeSelect,
  onPackageSelect,
  onPropertyUpdate,
}) => {
  const [propertyModalVisible, setPropertyModalVisible] = useState(false);
  const [floorPlanModalVisible, setFloorPlanModalVisible] = useState(false);
  const [facadeModalVisible, setFacadeModalVisible] = useState(false);
  const [packageModalVisible, setPackageModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const [activeContactIndex, setActiveContactIndex] = useState<number | null>(
    null
  );
  const { selectedFilters } = useAppSelector((state) => state.quotation);
  const mappedLeadDetail = {
    ...leadDetails,
    leadSource: leadDetails?.lead_source,
  };
  
  const handleEditLeadSubmit = async (values: any) => {
    const { email, ...details } = values;
    try {
      setLoading(true);
      const response = await dispatch(
        updateLeadThunk({ id: leadDetails.lead_id, details })
      ).unwrap();

      dispatch(updateQuotationContact(response));
      message.success("Lead updated successfully");
      setEditModalVisible(false);
    } catch (err) {
      message.error(err || "Failed to update lead");
    } finally {
      setLoading(false);
    }
  };
  const isSelectionDisabled =
    !selectedFilters?.range || !selectedFilters?.dwelling_type;
  const disabledMessage = isSelectionDisabled
    ? "Please select both Range and Dwelling Type first"
    : "";
  const [contacts, setContacts] = useState<
    Array<{
      name: string;
      email: string;
      phone: string;
      type: string;
    }>
  >([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3">
      {/* Lead Details Card */}
      <Card
        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setEditModalVisible(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconUser className="text-blue-500" />
            <span className="font-medium text-font-color">Lead Details</span>
          </div>
          <IconEdit className="text-gray-400 text-sm" />
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-font-color">{leadDetails?.name}</div>
          <div className="flex items-center text-sm text-font-color-100">
            <IconPhone size={14} className="mr-1 text-font-color-100" />
            {leadDetails?.phone || "Not provided"}
          </div>
          <div className="flex items-center text-sm text-font-color-100">
            <IconMail size={14} className="mr-1 text-font-color-100" />
            {leadDetails?.email || "Not provided"}
          </div>
          {leadDetails?.address && (
            <div className="flex items-start text-sm text-font-color-100">
              <IconMapPin
                size={14}
                className="mr-1 mt-0.5 text-font-color-100 flex-shrink-0"
              />
              <span className="line-clamp-2">{leadDetails?.address || "Not provided"}</span>
            </div>
          )}
        </div>

        {/* Contacts Section */}
        {contacts.length > 0 && (
          <div className="mt-4">
            <Divider className="my-3" />
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className={`p-2 rounded hover:bg-gray-50 ${activeContactIndex === index ? "bg-blue-50" : ""
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveContactIndex(
                      activeContactIndex === index ? null : index
                    );
                  }}
                >
                  <div className="font-medium text-font-color">
                    {contact?.name}
                  </div>
                  <div className="text-xs text-font-color-100">{contact?.type}</div>
                  {activeContactIndex === index && (
                    <div className="mt-1 text-xs space-y-1">
                      <div className="text-font-color-100">{contact?.email}</div>
                      <div className="text-font-color-100">{contact?.phone}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* <Button
          type="text"
          size="small"
          icon={<IconPlus size={14} />}
          className="mt-3 text-blue-500 hover:!text-blue-600 flex items-center text-xs"
          onClick={(e) => {
            e.stopPropagation();
            setContacts([
              ...contacts,
              {
                name: "New Contact",
                email: "",
                phone: "",
                type: "Secondary",
              },
            ]);
            setActiveContactIndex(contacts.length);
          }}
        >
          Add Contact
        </Button> */}
      </Card>

      <Card
        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setPropertyModalVisible(true)}
      >
        <div className="flex items-center gap-2 mb-3">
          <IconHome className="text-green-500" />
          <span className="font-medium text-font-color">Property Details</span>
          <IconEdit className="text-gray-400 ml-auto" />
        </div>
        {
        propertyDetails?.address1 &&propertyDetails?.citySuburb && propertyDetails?.stateRegion && propertyDetails?.zipPostalCode ? (
            <div className="space-y-2">
              <div className="font-semibold text-font-color">
                {propertyDetails?.address1}
              </div>
              <div className="text-sm text-font-color">
                {[
                  propertyDetails?.citySuburb,
                  propertyDetails?.stateRegion,
                  propertyDetails?.zipPostalCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>
              <div className="text-sm text-font-color-100">
                Title :{" "}
                {propertyDetails?.titleDate ? dayjs(propertyDetails?.titleDate).format("DD-MM-YYYY") : ""}
              </div>
              <div className="text-sm text-font-color-100">
                Type: {propertyDetails?.landType ?? ""}
              </div>
              {propertyDetails?.widthM && propertyDetails?.depthM && (
                <div className="text-sm text-font-color-100">
                  W: {propertyDetails?.widthM || ""}
                  {propertyDetails?.widthM ? "m" : ""} D:{" "}x chr
                  {propertyDetails?.depthM || ""}
                  {propertyDetails?.depthM ? "m" : ""} Total:{" "}
                  {propertyDetails?.totalSizeM2 || ""}
                  {propertyDetails?.totalSizeM2 ? " m²" : ""}
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
            onClick={!isSelectionDisabled ? () => setFloorPlanModalVisible(true) : undefined}
          >
            {selectedPlan ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <IconFileText className="text-purple-500" />
                <span className="font-medium text-font-color">
                  {selectedPlan.name}
                </span>
                <IconEdit className="text-gray-400 ml-auto" />
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
                  <span className="text-sm">{selectedPlan?.bath || 0}</span>
                </div>
                <div className="flex flex-col items-center text-gray-400 w-full">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <IconCar size={20} />
                  </div>
                  <span className="text-sm">{selectedPlan?.carPark || 0}</span>
                </div>
                <div className="flex flex-col items-center text-gray-400 w-full">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <IconForklift size={20} />
                  </div>
                  <span className="text-sm">{selectedPlan?.garage || 0}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Button
                type="primary"
                size="middle"
                disabled={isSelectionDisabled}
              >
                Select Plan
              </Button>
            </div>
          )}
        </Card>
        </Tooltip>
        <Tooltip title={disabledMessage}>
          <Card
            className={`shadow-sm transition-shadow ${isSelectionDisabled ? 'opacity-70' : 'hover:shadow-md cursor-pointer'}`}
            onClick={!isSelectionDisabled ? () => setFacadeModalVisible(true) : undefined}
          >
          {selectedFacade ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <IconFileText className="text-purple-500" />
                <span className="font-medium text-font-color">
                  {selectedFacade?.name}
                </span>
                <IconEdit className="text-gray-400 ml-auto" />
              </div>
              <div className="space-y-2">
                  {/* <div className="font-semibold text-center text-font-color"> */}
                  {/* @ts-ignore */}
                  {/* {selectedFacade?.name || selectedFacade?.facade?.name || "-"}
                </div> */}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Button
                type="primary"
                size="middle"
                disabled={isSelectionDisabled}
              >
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
          onClick={!isSelectionDisabled ? () => setPackageModalVisible(true) : undefined}
        >
        {selectedPackage ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <IconGift className="text-red-500" />
              <span className="font-medium text-font-color">
                {selectedPackage?.name}
              </span>
              <IconEdit className="text-gray-400 ml-auto" />
            </div>
            <div className="space-y-2">
                {/* <div className="font-semibold text-font-color">Package (1)</div> */}
                {/* <div className="font-medium text-blue-600">
                {selectedPackage?.name}
              </div> */}
              <div className="text-lg font-bold text-green-600">
                ${selectedPackage?.amount}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <Button
              type="primary"
              size="middle"
              disabled={isSelectionDisabled}
            >
              Select Package
            </Button>
          </div>
        )}
      </Card>
      </Tooltip>

      <PropertyDetailsModal
        visible={propertyModalVisible}
        onCancel={() => setPropertyModalVisible(false)}
        onSave={onPropertyUpdate}
        initialValues={propertyDetails}
      />

      {/* Edit Lead Details Modal */}
      {/* <Modal
        title="Edit Lead Details"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
        centered
        className="bg-card-color"
      >
        <LeadDetailsForm
          initialValues={leadDetails}
          onSave={(values) => {
            setIsSubmitting(true);
            // Here you would typically make an API call to update the lead
            setTimeout(() => {
              setIsSubmitting(false);
              setEditModalVisible(false);
              // Update the lead details in the parent component
              // onLeadUpdate(values);
            }, 1000);
          }}
          onCancel={() => setEditModalVisible(false)}
          isSubmitting={isSubmitting}
        />
      </Modal> */}

      <CreateFormModal
        open={editModalVisible}
        title="Lead"
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleEditLeadSubmit}
        loading={loading}
        isEditing={true}
        initialValues={mappedLeadDetail}
        fields={leadCreateFields({ isEmailDisable: true })}
      />

      <FloorPlanModal
        visible={floorPlanModalVisible}
        onCancel={() => setFloorPlanModalVisible(false)}
        onSave={onPlanSelect}
        selectedPlan={selectedPlan}
      />
      <FacadeModal
        visible={facadeModalVisible}
        onCancel={() => setFacadeModalVisible(false)}
        onSave={onFacadeSelect}
        selectedFacade={selectedFacade}
      />
      {/* Package Selection Modal */}
      <PackageModal
        visible={packageModalVisible}
        onCancel={() => setPackageModalVisible(false)}
        onSave={onPackageSelect}
        selectedPackage={selectedPackage}
        onSelect={onPackageSelect}
      />
    </div>
  );
};

export default InfoCards;
