import React from "react";
import { Button, Space } from "antd";
import {
  IconDeviceFloppy, // Save
  IconCheck, // Check
  IconMail, // Mail
  IconEye, // Eye / View
  IconFileSearch, // File Search
} from "@tabler/icons-react";

interface FooterActionsProps {
  expiryDate: string;
  total: number;
  onSaveAs: () => void;
  onApprove: () => void;
  onEmail: () => void;
  onPreview: () => void;
  onViewOpportunity: () => void;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  expiryDate,
  total,
  onSaveAs,
  onApprove,
  onEmail,
  onPreview,
  onViewOpportunity,
}) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Space>
            <Button
              icon={<IconDeviceFloppy />}
              onClick={onSaveAs}
              className="bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
            >
              Save as
            </Button>
            <Button
              icon={<IconCheck />}
              onClick={onApprove}
              className="bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600"
            >
              Approve
            </Button>
            <Button icon={<IconMail />} onClick={onEmail}>
              Email
            </Button>
            <Button icon={<IconEye/>} onClick={onPreview}>
              Preview
            </Button>
            <Button icon={<IconFileSearch />} onClick={onViewOpportunity}>
              View Opportunity
            </Button>
          </Space>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-sm text-gray-600">
            Expiry date: <span className="font-medium">{expiryDate}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            Total:{" "}
            <span className="text-green-600">${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterActions;
