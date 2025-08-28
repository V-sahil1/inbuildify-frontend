import React, { useState } from "react";
import { Card, Button, Tag, Modal, Divider } from "antd";
import {
  IconUser,
  IconHome,
  IconFileText,
  IconEdit,
  IconBuilding,
  IconGift,
  IconPlus,
  IconMail,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";
import LeadDetailsForm from "./forms/LeadDetailsForm";
import {
  LeadDetails,
  PropertyDetails,
  Plan,
  Facade,
  Package,
} from "@/pages/leads/data/types";
import PropertyDetailsModal from "./PropertyDetailsModal";
import FloorPlanModal from "./FloorPlanModal";
import dayjs from "dayjs";
import FacadeModal from "./FacadeModal";

interface InfoCardsProps {
  leadDetails: LeadDetails;
  propertyDetails: any;
  selectedPlan?: Plan;
  selectedFacade?: Facade;
  selectedPackage?: Package;
  availableFacades: Facade[];
  availablePackages: Package[];
  onPlanSelect: (plan: Plan) => void;
  onFacadeSelect: (facade: Facade) => void;
  onPackageSelect: (pkg: Package) => void;
  onPropertyUpdate: (property: PropertyDetails) => void;
}

const InfoCards: React.FC<InfoCardsProps> = ({
  leadDetails,
  propertyDetails,
  selectedPlan,
  selectedFacade,
  selectedPackage,
  availableFacades,
  availablePackages,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeContactIndex, setActiveContactIndex] = useState<number | null>(
    null
  );
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

        <Button
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
        </Button>
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
      </Card>
      {/* Select Plan Card */}
      <div className="flex gap-4 flex-col">
        <Card
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setFloorPlanModalVisible(true)}
        >
          <div className="flex items-center gap-2 mb-3">
            <IconFileText className="text-purple-500" />
            <span className="font-medium text-font-color">Select Plan</span>
            <IconEdit className="text-gray-400 ml-auto" />
          </div>
          {selectedPlan ? (
            <div className="space-y-2">
              <div className="font-semibold text-font-color">
                {selectedPlan.name}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Button type="dashed" size="small">
                Select Plan
              </Button>
            </div>
          )}
        </Card>
        <Card
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setFacadeModalVisible(true)}
        >
          <div className="flex items-center gap-2 mb-3">
            <IconFileText className="text-purple-500" />
            <span className="font-medium text-font-color">Select Facade</span>
            <IconEdit className="text-gray-400 ml-auto" />
          </div>
          {selectedFacade ? (
            <div className="space-y-2">
              <div className="font-semibold text-font-color">
                {selectedFacade.name}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Button type="dashed" size="small">
                Select Facade
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Select Package Card */}
      <Card
        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setPackageModalVisible(true)}
      >
        <div className="flex items-center gap-2 mb-3">
          <IconGift className="text-red-500" />
          <span className="font-medium text-font-color">Select Package</span>
          <IconEdit className="text-gray-400 ml-auto" />
        </div>
        {selectedPackage ? (
          <div className="space-y-2">
            <div className="font-semibold text-font-color">Package (1)</div>
            <div className="font-medium text-blue-600">
              {selectedPackage.name}
            </div>
            <div className="text-lg font-bold text-green-600">
              ${selectedPackage.price.toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Button type="dashed" size="small">
              Select Package
            </Button>
          </div>
        )}
      </Card>

      <PropertyDetailsModal
        visible={propertyModalVisible}
        onCancel={() => setPropertyModalVisible(false)}
        onSave={onPropertyUpdate}
        initialValues={propertyDetails}
      />

      {/* Edit Lead Details Modal */}
      <Modal
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
            console.log("Saving lead details:", values);
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
      </Modal>

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
      <Modal
        title="Select Package"
        centered
        open={packageModalVisible}
        onCancel={() => setPackageModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPackageModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            className="bg-blue-600"
            onClick={() => {
              if (selectedPackage) {
                onPackageSelect(selectedPackage);
                setPackageModalVisible(false);
              }
            }}
            disabled={!selectedPackage}
          >
            Save Changes
          </Button>
        ]}
        width={800}
        className="package-selection-modal"
      >
        <div className="flex h-[500px] border rounded-lg overflow-hidden ">
          {/* Left side - Package List */}
          <div className="w-1/3 border-r overflow-y-auto bg-gray-50">
            <div className="p-4 border-b bg-white">
              <h3 className="text-lg font-semibold text-font-color">Available Packages</h3>
            </div>
            <div className="divide-y">
              {availablePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedPackage?.id === pkg.id ? 'bg-blue-50' : ''
                    }`}
                  onClick={() => onPackageSelect(pkg)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={selectedPackage?.id === pkg.id}
                      onChange={() => { }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="ml-3">
                      <div className="font-medium text-font-color">{pkg.name}</div>
                      <div className="text-sm text-font-color-100">
                        ${pkg.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Package Details */}
          <div className="w-2/3 overflow-y-auto p-6">
            {selectedPackage ? (
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedPackage.name}</h2>
                <div className="text-3xl font-bold text-green-600 mb-6">
                  ${selectedPackage.price.toLocaleString()}
                </div>

                {selectedPackage.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 mb-6">{selectedPackage.description}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Included Items</h3>
                  <div className="space-y-3">
                    {selectedPackage.items?.length ? (
                      selectedPackage.items.map((item) => (
                        <div key={item.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                          <div className="ml-4 text-sm text-gray-500 whitespace-nowrap">
                            {item.quantity && (
                              <span>
                                {item.quantity} {item.unit || 'unit'}{item.quantity > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No items included in this package.</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Click 'Save Changes' to select this package or 'Cancel' to close without changes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a package to view details</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InfoCards;
