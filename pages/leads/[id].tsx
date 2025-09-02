import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Input, List, message, Space, Tag, Tooltip, Typography } from "antd";
import StageProgress from "@/components/common/StageProgress";
import ConvertLeadModal from "@/components/leadDetail/ConvertLeadModal";
import PropertyDetailsModal from "@/components/leadDetail/PropertyDetailsModal";
import {
  IconBarrierBlock,
  IconCopy,
  IconCopyCheck,
  IconEdit,
  IconFileText,
  IconMail,
  IconPhone,
  IconPhoneCall,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import SystemRoutes from "@lib/constants/Routes";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import {
  getLeadByIdThunk,
  updateLeadThunk,
} from "@redux/feature/lead/leadThunk";
import { RootState } from "@redux/feature/store";
import dayjs from "dayjs";
import {
  setQuotationContact,
  setQuotationProperty,
} from "@redux/feature/quotation/quotationSlice";
import { clearLeadDetail } from "@redux/feature/lead/leadSlice";
import { getQuotationsByLeadIdThunk } from "@redux/feature/lead/leadThunk";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import leadCreateFields from "@/components/formFields/LeadCreateFields";

const { Text } = Typography;
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
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector((state: RootState) => state.lead);
  const contact = (leadDetail as any)?.contact ?? {};
  const propertyFromSlice = (leadDetail as any)?.property ?? {};
  const leadId = router.query.id as string | undefined;
  const createdQuotations = (leadDetail as any)?.createdQuotations ?? {};

  const latestLeadDetailRef = useRef<any>(null);

  const mappedLeadDetail = {
    ...leadDetail?.contact,
    leadSource: leadDetail?.contact?.lead_source,
  };
  useEffect(() => {
    latestLeadDetailRef.current = leadDetail;
  }, [leadDetail]);

  useEffect(() => {
    if (leadId) {
      dispatch(getLeadByIdThunk(leadId));
      dispatch(getQuotationsByLeadIdThunk({ leadId, page: 1, limit: 25 }));
    }
  }, [router.query.id, dispatch]);

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

  const handleEditLeadSubmit = async (values: any) => {
    const { email, ...details } = values;
    try {
      setLoading(true);
      await dispatch(updateLeadThunk({ id: leadId, details }))
        .unwrap()
        .then(() => {
          setIsEditLeadModalVisible(false);
        });
      message.success("Lead updated successfully");
    } catch (err) {
      message.error(err || "Failed to update lead");
    } finally {
      setLoading(false);
    }
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

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-3">
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
        
        <div className="flex items-center gap-2">
          <Text ><IconPhone /></Text>
          <Text>{contact.name}</Text>
        </div>
        <div className="flex items-center gap-2">
          <Text ><IconMail /></Text>
          <Text>{contact.email}</Text>
        </div>
        <div className="flex items-center gap-2">
          <Text ><IconPhone /></Text>
          <Text>{contact.phone}</Text>
        </div>
      </div> */}

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
          <h2 className="font-semibold text-lg">{contact.name ?? "-"}</h2>
          <p className="text-sm">
            {contact.lead_source || "Lead Source not provided"}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <IconPhoneCall className="w-4 h-4" />
            <span className="text-sm">{contact.phone ?? "-"}</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <IconMail className="w-4 h-4" />
            <span className="text-sm">{contact.email ?? "-"}</span>
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
          {
            (propertyFromSlice.address1 || propertyFromSlice.citySuburb || propertyFromSlice.stateRegion || propertyFromSlice.zipPostalCode) ? (
              <>
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 rounded-lg">
                <IconBarrierBlock />
                <p className="text-sm text-gray-500 text-center">No property details added yet</p>
                <p className="text-xs text-gray-400 mt-1">Add property information to get started</p>
              </div>
            )
          }
        </Card>

        {/* Quotation Card */}
        {isOpportunity && <Card>
          <div className="flex flex-col justify-between">
            <Link
              href={SystemRoutes.QUOTATION_CREATE(leadId)}
              className="text-theme-blue text-sm"
            >
              Create Quotation
            </Link>
            <div className="max-h-[200px] my-2 overflow-y-auto">
                <List
                  dataSource={createdQuotations.quotations}
                  locale={{
                    emptyText: (
                      <div className="flex flex-col items-center justify-center p-6">
                        <IconFileText />
                        <p className=" text-sm text-gray-500 text-center">No quotations found</p>
                        <p className="text-xs text-gray-400 mt-1">Create a quotation to get started</p>
                      </div>
                    ),
                  }}
                  renderItem={(quotation: any) => (
                    <List.Item key={quotation.quotation_id}>
                      <Space size="middle">
                        <Tooltip title={quotation.quotation_id}>
                          <Text type="secondary">{quotation.quotation_id.slice(0, 13)}</Text>
                        </Tooltip>
                        <Tag color={quotation.lead_status === "Open" ? "blue" : "green"}>{quotation.lead_status}</Tag>
                        <Text>${quotation.items.reduce((sum: number, item: any) => sum + item.total, 0)}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
            </div>
          </div>
        </Card>}
      </div>

      <ConvertLeadModal
        visible={isConvertModalVisible}
        onCancel={handleConvertCancel}
        leadId={router.query.id as string}
      />

      <CreateFormModal
        open={isEditLeadModalVisible}
        title="Lead"
        onCancel={() => setIsEditLeadModalVisible(false)}
        onSubmit={handleEditLeadSubmit}
        loading={loading}
        isEditing={true}
        initialValues={mappedLeadDetail}
        fields={leadCreateFields({ isEmailDisable: true })}
      />

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
