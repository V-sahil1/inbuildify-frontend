import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Input } from "antd";
import StageProgress from "@/components/common/StageProgress";
import ConvertLeadModal from "@/components/leadDetail/ConvertLeadModal";
import {
  IconMail,
  IconPhone,
  IconPhoneCall,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import SystemRoutes from "@lib/constants/Routes";

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
  const searchParams = useSearchParams();
  const isQuotation = searchParams.get("type") === "quotation";
  const title = isQuotation ? "Opportunity" : "Lead";
  const [isConvertModalVisible, setIsConvertModalVisible] = useState(false);

  const handleConvertClick = () => {
    setIsConvertModalVisible(true);
  };

  const handleConvertCancel = () => {
    setIsConvertModalVisible(false);
  };

  const steps = useMemo(() => {
    if (isQuotation) {
      return [
        {
          key: "proposal",
          label: "Proposal",
          color: "bg-green-500",
          textColor: "text-white",
          onClick: () => { },
        },
        {
          key: "negotiation",
          label: "Negotiation",
          color: "bg-yellow-300",
          textColor: "text-black",
          onClick: () => { },
        },
        {
          key: "close",
          label: "Close",
          color: "bg-gray-200",
          textColor: "text-black",
          onClick: () => { },
        },
      ];
    }
    return [
      {
        key: "new",
        label: "New",
        color: "bg-green-500",
        textColor: "text-white",
        onClick: () => { },
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
  }, [isQuotation]);

  return (
    <div className="flex flex-col">
      <div className="max-w-sm m-3">
        <StageProgress
          title={title}
          id="MYH00492"
          status="Open"
          steps={steps}
          activeStep={isQuotation ? "proposal" : "convert"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-3">
        <Input
          value={"Test user"}
          prefix={<IconUser />}
          readOnly
          className="rounded-md w-full"
        />
        <Input
          value={"asdasd@sd.asd"}
          prefix={<IconMail />}
          readOnly
          className="rounded-md w-full"
        />
        <Input
          value={"Test user"}
          readOnly
          prefix={<IconPhone />}
          className="rounded-md w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-3">
        {/* Contact Card */}
        <Card className="relative">
          <span className="absolute -top-3 left-3 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded">
            Contact
          </span>
          <h2 className="font-semibold text-lg">Yash Murthy</h2>
          <p className="text-sm text-gray-600">
            45 Tallis Cct, Truganina, Victoria, 3029
          </p>

          <div className="flex items-center gap-2 mt-2 text-gray-700">
            <IconPhoneCall className="w-4 h-4" />
            <span className="text-sm">0406166590</span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-gray-700">
            <IconMail className="w-4 h-4" />
            <span className="text-sm">yashmurthy@insimplify.com.au</span>
          </div>
        </Card>

        {/* Property Card */}
        <Card className="relative">
          <span className="absolute -top-3 left-3 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
            Property
          </span>
          <h2 className="font-semibold text-lg">Lot 234</h2>
          <p className="text-sm text-gray-600">Tarneit, Victoria, 3029</p>

          <div className="text-sm text-gray-600 mt-2">
            <p>Title : 13-07-2023 (Estimated)</p>
            <p>Type : Regular</p>
          </div>

          <a href="#" className="text-theme-blue text-sm mt-2 inline-block">
            Additional Fields
          </a>
        </Card>

        {/* Actions Card */}
        <Card>
          <div className="flex flex-col justify-between">
            <Link
              href={SystemRoutes.QUOTATION_CREATE}
              className="text-theme-blue text-sm"
            >
              Create Quotation
            </Link>
            <a href="#" className="text-theme-blue text-sm mt-2">
              Capture Deposit
            </a>
          </div>
        </Card>
      </div>

      <ConvertLeadModal
        visible={isConvertModalVisible}
        onCancel={handleConvertCancel}
        leadId="your-lead-id" // Replace with actual lead ID
      />
    </div>
  );
}

export default App;
