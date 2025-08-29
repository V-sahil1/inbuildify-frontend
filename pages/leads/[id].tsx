import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Input, Modal } from "antd";
import StageProgress from "@/components/common/StageProgress";
import ConvertLeadModal from "@/components/leadDetail/ConvertLeadModal";
import PropertyDetailsModal from "@/components/leadDetail/PropertyDetailsModal";
import LeadDetailsForm from "@/components/leadDetail/forms/LeadDetailsForm";
import {
  IconEdit,
  IconMail,
  IconPhone,
  IconPhoneCall,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import SystemRoutes from "@lib/constants/Routes";
import { LeadDetails } from "@/pages/leads/data/types";
import { leadDetails as sampleLeadDetails } from "@/pages/leads/data/sampleData";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { getLeadByIdThunk } from "@redux/feature/lead/leadThunk";
import { RootState } from "@redux/feature/store";
import dayjs from "dayjs";
import { setQuotationContact, setQuotationProperty } from "@redux/feature/quotation/quotationSlice";
import { clearLeadDetail } from "@redux/feature/lead/leadSlice";

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
  const searchParams = useSearchParams();
  const isOpportunity = searchParams.get("type") === "opportunity";
  const title = isOpportunity ? "Opportunity" : "Lead";
  const [isConvertModalVisible, setIsConvertModalVisible] = useState(false);
  const [isEditLeadModalVisible, setIsEditLeadModalVisible] = useState(false);
  const [isPropertyModalVisible, setIsPropertyModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lead, setLead] = useState<LeadDetails>(sampleLeadDetails);
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector((state: RootState) => state.lead);
  const contact = (leadDetail as any)?.contact ?? {};
  const propertyFromSlice = (leadDetail as any)?.property ?? {};
  const leadId = router.query.id as string | undefined;

  const latestLeadDetailRef = useRef<any>(null);
  useEffect(() => {
    latestLeadDetailRef.current = leadDetail;
  }, [leadDetail]);

  useEffect(() => {
    if (leadId) {
      dispatch(getLeadByIdThunk(leadId));
    }
  }, [router.query.id, dispatch]);

  // Save to quotation and clear lead detail on unmount only
  useEffect(() => {
    return () => {
      const latest = latestLeadDetailRef.current;
      const contact = (latest as any)?.contact ?? null;
      const property = (latest as any)?.property ?? null;
      dispatch(setQuotationContact(contact));
      dispatch(setQuotationProperty(property));
      dispatch(clearLeadDetail());
    };
  }, [dispatch]);

  const handleConvertClick = () => {
    setIsConvertModalVisible(true);
  };

  const handleConvertCancel = () => {
    setIsConvertModalVisible(false);
  };

  const steps = useMemo(() => {
    if (isOpportunity) {
      return [
        {
          key: "proposal",
          label: "Proposal",
          color: "bg-green-500",
          textColor: "text-white",
          onClick: () => {},
        },
        {
          key: "negotiation",
          label: "Negotiation",
          color: "bg-yellow-300",
          textColor: "text-black",
          onClick: () => {},
        },
        {
          key: "close",
          label: "Close",
          color: "bg-gray-200",
          textColor: "text-black",
          onClick: () => {},
        },
      ];
    }
    return [
      {
        key: "new",
        label: "New",
        color: "bg-green-500",
        textColor: "text-white",
        onClick: () => {},
      },
      {
        key: "working",
        label: "Working",
        color: "bg-yellow-300",
        textColor: "text-black",
        onClick: handleConvertClick,
      },
      {
        key: "convert",
        label: "Convert",
        color: "bg-gray-200",
        textColor: "text-black",
        onClick: handleConvertClick,
      },
    ];
  }, [isOpportunity]);

  return (
    <div className="flex flex-col">
      <div className="m-3 ">
        <StageProgress
          title={title}
          id="MYH00492"
          status="Open"
          steps={steps}
          activeStep={isOpportunity ? "proposal" : "convert"}
          lead={leadDetail}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-3">
        <Input
          value={contact.name}
          prefix={<IconUser />}
          readOnly
          className="rounded-md w-full"
        />
        <Input
          value={contact.email}
          prefix={<IconMail />}
          readOnly
          className="rounded-md w-full"
        />
        <Input
          value={contact.phone}
          readOnly
          prefix={<IconPhone />}
          className="rounded-md w-full"
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
          <h2 className="font-semibold text-lg">{contact.name ?? ""}</h2>
          <p className="text-sm text-gray-600">
            {lead.address || "Address not provided"}
          </p>

          <div className="flex items-center gap-2 mt-2 text-gray-700">
            <IconPhoneCall className="w-4 h-4" />
            <span className="text-sm">{contact.phone ?? ""}</span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-gray-700">
            <IconMail className="w-4 h-4" />
            <span className="text-sm">{contact.email ?? ""}</span>
          </div>
        </Card>

        {/* Property Card */}
        <Card className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
              Property
            </span>
            <IconEdit
              className="text-gray-400 text-sm cursor-pointer hover:text-gray-600"
              onClick={() => setIsPropertyModalVisible(true)}
            />
          </div>
          <h2 className="font-semibold text-lg">
            {propertyFromSlice.address1 ?? ""}
          </h2>
          <p className="text-sm text-gray-600">
            {[
              propertyFromSlice.citySuburb,
              propertyFromSlice.stateRegion,
              propertyFromSlice.zipPostalCode,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div className="text-sm text-gray-600 mt-2">
            <p>
              Title :{" "}
              {propertyFromSlice?.titleDate
                ? dayjs(propertyFromSlice.titleDate).format("DD-MM-YYYY")
                : ""}
            </p>
            <p>Type : {propertyFromSlice.landType ?? ""}</p>
            <p>
              W: {propertyFromSlice.widthM || ""}
              {propertyFromSlice.widthM ? "m" : ""} D:{" "}
              {propertyFromSlice.depthM || ""}
              {propertyFromSlice.depthM ? "m" : ""} Total:{" "}
              {propertyFromSlice.totalSizeM2 || ""}
              {propertyFromSlice.totalSizeM2 ? " m²" : ""}
            </p>
          </div>

          <a href="#" className="text-theme-blue text-sm mt-2 inline-block">
            Additional Fields
          </a>
        </Card>

        {/* Actions Card */}
       {isOpportunity && <Card>
          <div className="flex flex-col justify-between">
            <Link
              href={SystemRoutes.QUOTATION_CREATE(leadId)}
              className="text-theme-blue text-sm"
            >
              Create Quotation
            </Link>
            {/* <a href="#" className="text-theme-blue text-sm mt-2">
              Capture Deposit
            </a> */}
          </div>
        </Card>}
      </div>

      <ConvertLeadModal
        visible={isConvertModalVisible}
        onCancel={handleConvertCancel}
        leadId={router.query.id as string}
      />

      {/* Edit Lead Details Modal */}
      <Modal
        title="Edit Lead Details"
        open={isEditLeadModalVisible}
        onCancel={() => setIsEditLeadModalVisible(false)}
        footer={null}
        width={600}
        centered
        className="bg-card-color"
      >
        <LeadDetailsForm
          initialValues={lead}
          onSave={(values) => {
            setIsSubmitting(true);
            setTimeout(() => {
              setLead(values);
              setIsSubmitting(false);
              setIsEditLeadModalVisible(false);
            }, 300);
          }}
          onCancel={() => setIsEditLeadModalVisible(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        visible={isPropertyModalVisible}
        onCancel={() => setIsPropertyModalVisible(false)}
        onSave={() => setIsPropertyModalVisible(false)}
        initialValues={propertyFromSlice}
      />
    </div>
  );
}

export default App;
