import React, { useState } from 'react';
import { Button, Dropdown, Input, Space } from 'antd';
import {
  IconCheck,
  IconEye,
  IconPencil,
  IconX,
  IconDeviceFloppy,
  IconFileTypePdf,
  IconFileTypeXls,
} from '@tabler/icons-react';
import { ConfirmationContentModal } from '../common/ConfirmationContentModal';

interface FooterActionsProps {
  id?: string;
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
  id,
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
  disableAction,
}) => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [sketchNum, setSketchNum] = useState('');
  const previewMenu = [
    { key: 'quotation', label: 'Quotation', icon: <IconFileTypePdf size={15} color="red" /> },
    {
      key: 'quotationSpecification',
      label: 'Quotation With Specification',
      icon: <IconFileTypePdf size={15} color="red" />,
    },
    {
      key: 'preliminaryAgreement',
      label: 'Preliminary Agreement',
      icon: <IconFileTypePdf size={15} color="red" />,
    },
    {
      key: 'quotationBuilderCost',
      label: 'Quotation With Builder Cost',
      icon: <IconFileTypePdf size={15} color="red" />,
    },
    {
      key: 'quotationSpecificationExcel',
      label: 'Quotation With Specification',
      icon: <IconFileTypeXls size={15} color="green" />,
    },
  ];

  const approveContent = (
    <div className="space-y-2">
      <div>
        <p>Quotation Reference No</p>
        <p className="text-blue">{id}</p>
      </div>
      <div>
        <p>Sketch Number</p>
        <Input
          type="number"
          className="max-w-[200px]"
          value={sketchNum}
          onChange={e => setSketchNum(e.target.value)}
        />
      </div>
      <p>Are you sure you want to approve this quatation?</p>
    </div>
  );
  const handlePreview = key => {
    if (key === 'quotation') {
      onPreview();
    }
  };
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
                <Button icon={<IconX size={16} />} onClick={onCancel} disabled={loading}>
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
          <Dropdown
            menu={{
              items: previewMenu,
              onClick: e => {
                handlePreview(e.key);
              },
            }}
          >
            <Button
              icon={<IconEye size={16} />}
              // onClick={onPreview}
              disabled={(disableAction && !isEditMode) || previewLoading}
              loading={previewLoading}
            >
              Preview
            </Button>
          </Dropdown>
          <Button
            type="primary"
            onClick={() => {
              setApproveOpen(true);
            }}
            loading={loading}
          >
            Approve
          </Button>
        </Space>
      </div>

      <div className="flex items-center gap-8">
        {/* <div className="text-sm">
            Expiry date: <span className="font-medium">{expiryDate}</span>
          </div> */}
        <div className="text-2xl font-bold">
          Total: <span className="text-green-600">${total.toLocaleString()}</span>
        </div>
      </div>
      {approveOpen && (
        <ConfirmationContentModal
          open={approveOpen}
          onClose={() => setApproveOpen(false)}
          onSubmit={() => {
            console.log('sketch num', sketchNum);
            setApproveOpen(false);
          }}
          content={approveContent}
          okText="Approve"
          title="Confirmation"
        />
      )}
    </div>
  );
};

export default FooterActions;
