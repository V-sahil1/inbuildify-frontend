import React from "react";
import { Button, Space } from "antd";
import { IconCheck, IconEye, IconPencil, IconX, IconDeviceFloppy } from "@tabler/icons-react";

interface FooterActionsProps {
  expiryDate?: string;
  total: number;
  quoteVersionId?: string;
  isEditMode: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onPreview: () => void;
  loading: boolean;
  previewLoading: boolean;
  disableAction: boolean;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  expiryDate,
  total,
  quoteVersionId,
  isEditMode,
  onEdit,
  onCancel,
  onSave,
  onPreview,
  loading,
  previewLoading,
  disableAction
}) => {
  return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Space>
            {quoteVersionId ? (
              isEditMode ? (
                <>
                  <Button
                    type="primary"
                    icon={<IconDeviceFloppy size={16} />}
                    onClick={onSave}
                    loading={loading}
                    disabled={disableAction}
                  >
                    Save Changes
                  </Button>
                  <Button
                    icon={<IconX size={16} />}
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  icon={<IconPencil size={16} />}
                  onClick={onEdit}
                  disabled={disableAction}
                >
                  Modify Quotation
                </Button>
              )
            ) : (
              <Button
                type="primary"
                icon={<IconCheck size={16} />}
                onClick={onSave}
                loading={loading}
                disabled={disableAction}
              >
                Create Quotation
              </Button>
            )}
            <Button 
              icon={<IconEye size={16} />} 
              onClick={onPreview} 
              disabled={(disableAction && !isEditMode) || previewLoading} 
              loading={previewLoading}
            >
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
