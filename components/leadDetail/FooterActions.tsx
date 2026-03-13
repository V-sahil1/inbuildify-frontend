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
import { ActionDialogmodel } from '../common/Models/ActionDialogModel';

interface FooterActionsProps {
  id?: string;
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
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  onCreateNewVersion?: () => void;
  handleCustomSection?: (values: any) => void;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  id,
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
  hasUnsavedChanges = false,
  onSaveChanges,
  onCreateNewVersion,
  handleCustomSection,
}) => {
  const [modalOpen, setModalOpen] = useState<'approval' | 'save' | 'custom' | null>(null);
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

  const onSaveMenu = [
    { key: 'newVersion', label: 'New Version' },
    { key: 'template', label: 'Template' },
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
          <Dropdown
            menu={{
              items: onSaveMenu,
              onClick: e => {
                e.key === 'newVersion' && setModalOpen('save');
              },
            }}
            placement="top"
          >
            <Button disabled={disableAction}>Save As</Button>
          </Dropdown>
          {/* {quoteVersionId ? (
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
          )} */}
          <Button
            type="primary"
            onClick={() => {
              setModalOpen('approval');
            }}
            loading={loading}
            disabled={disableAction}
          >
            Approve
          </Button>
          <Button type="primary" onClick={() => {}} loading={loading} disabled={disableAction}>
            Email
          </Button>
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
              disabled={disableAction || previewLoading}
              loading={previewLoading}
            >
              Preview
            </Button>
          </Dropdown>
          <Button
            type="primary"
            onClick={() => {
              setModalOpen('custom');
            }}
            loading={loading}
            disabled={disableAction}
          >
            Custom Section
          </Button>
          <Button
            type="primary"
            loading={loading}
            disabled={disableAction}
          >
            View Opprtunity
          </Button>

          {hasUnsavedChanges && onSaveChanges && (
            <Button
              type="primary"
              icon={<IconDeviceFloppy size={16} />}
              onClick={onSaveChanges}
              loading={loading}
              disabled={disableAction}
            >
              Save Changes
            </Button>
          )}
        </Space>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold">
          Total: <span className="text-green-600">${total.toLocaleString()}</span>
        </div>
      </div>
      {modalOpen === 'approval' && (
        <ConfirmationContentModal
          open={modalOpen === 'approval'}
          onClose={() => setModalOpen(null)}
          onSubmit={() => {
            console.log('sketch num', sketchNum);
            setModalOpen(null);
          }}
          content={approveContent}
          okText="Approve"
          title="Confirmation"
        />
      )}

      {modalOpen === 'save' && (
        <ConfirmationContentModal
          open={modalOpen === 'save'}
          onClose={() => setModalOpen(null)}
          onSubmit={() => {
            onCreateNewVersion();
            setModalOpen(null);
          }}
          content="Are you sure you want to create new version?"
          title="Confirmation"
          okText="Yes"
        />
      )}

      {modalOpen === 'custom' && (
        <ActionDialogmodel
          title="Custom Section"
          open={modalOpen === 'custom'}
          onCancel={() => setModalOpen(null)}
          onSubmit={values => {
            handleCustomSection(values);
          }}
          fields={[
            {
              label: 'attachFiles',
              name: 'attachFiles',
              type: 'image',
              extra: 'Custom Section Attachment will be attached along with quotation Pdf',
            },
          ]}
        />
      )}
    </div>
  );
};

export default FooterActions;
