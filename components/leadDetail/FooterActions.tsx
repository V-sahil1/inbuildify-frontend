import React from "react";
import { Button, Space } from "antd";
import {
  IconCheck,
  IconEye,
} from "@tabler/icons-react";

interface FooterActionsProps {
  expiryDate?: string;
  total: number;
  onApprove: () => void;
  onPreview: () => void;
  loading: boolean;
  previewLoading: boolean;
  disableAction: boolean;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  expiryDate,
  total,
  onApprove,
  onPreview,
  loading,
  previewLoading,
  disableAction
}) => {
  return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Space>
            <Button
              icon={<IconCheck />}
              onClick={onApprove}
              loading={loading}
              disabled={disableAction}
            >
              Create Quotation
            </Button>
            <Button icon={<IconEye />} onClick={onPreview} disabled={disableAction || previewLoading} loading={previewLoading}>
              Preview
            </Button>
          </Space>
        </div>

        <div className="flex items-center gap-8">
          {/* <div className="text-sm">
            Expiry date: <span className="font-medium">{expiryDate}</span>
          </div> */}
          <div className="text-2xl font-bold">
            Total:{" "}
            <span className="text-green-600">${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
  );
};

export default FooterActions;
