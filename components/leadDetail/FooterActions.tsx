import React, { useState } from 'react';
import { Button, Dropdown, Input, Space, message } from 'antd';
import { IconEye, IconFileTypePdf, IconFileTypeXls } from '@tabler/icons-react';
import { ConfirmationContentModal } from '../common/ConfirmationContentModal';
import { ActionDialogmodel } from '../common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import CustomSectionModal from '../common/CustomSectionModal';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import {
  approveQuotation,
  createQuotationCustomSection,
  deleteQuotationCustomSection,
  updateQuotationCustomSection,
} from '@redux/feature/quotation/quotationThunk';
import { Status } from '@lib/constants/enum';
import { useRouter } from 'next/navigation';
import SystemRoutes from '@lib/constants/Routes';

interface FooterActionsProps {
  id?: string;
  versionNo?: number;
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
  onCreateNewVersion?: () => void;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  id,
  versionNo,
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
  onCreateNewVersion,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { quoteDetails, customSections, status } = useAppSelector(state => state.quotation);
  const [modalOpen, setModalOpen] = useState<'approval' | 'save' | 'custom' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sketchNum, setSketchNum] = useState('');
  const [validationError, setValidationError] = useState('');
  const previewMenu = [
    { key: 'quotation', label: 'Quotation', icon: <IconFileTypePdf size={15} color="red" /> },
    // {
    //   key: 'quotationSpecification',
    //   label: 'Quotation With Specification',
    //   icon: <IconFileTypePdf size={15} color="red" />,
    // },
    // {
    //   key: 'preliminaryAgreement',
    //   label: 'Preliminary Agreement',
    //   icon: <IconFileTypePdf size={15} color="red" />,
    // },
    // {
    //   key: 'quotationBuilderCost',
    //   label: 'Quotation With Builder Cost',
    //   icon: <IconFileTypePdf size={15} color="red" />,
    // },
    // {
    //   key: 'quotationSpecificationExcel',
    //   label: 'Quotation With Specification',
    //   icon: <IconFileTypeXls size={15} color="green" />,
    // },
  ];

  const onSaveMenu = [
    // { key: 'newVersion', label: 'New Version' },
    { key: 'template', label: 'Template' },
  ];

  const approveContent = (
    <div className="space-y-2">
      <div>
        <p>Quotation Reference No</p>
        <p className="text-blue">
          {id} {!!versionNo && 'V' + versionNo}
        </p>
      </div>
      <div>
        <p>Sketch Number</p>
        <Input
          onWheel={e => e.currentTarget.blur()}
          onKeyPress={e => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          min={0}
          max={99999999}
          className="max-w-[200px]"
          value={sketchNum}
          onChange={e => {
            const value = e.target.value;
            // Check if value exceeds max limit
            const numValue = parseInt(value) || 0;
            if (numValue <= 99999999) {
              setSketchNum(value);
              setValidationError('');
            } else {
              setValidationError('Maximum sketch number is 99999999');
            }
          }}
        />
        {validationError && (
          <div className="text-red-500 text-sm mt-1">
            {validationError}
          </div>
        )}
      </div>
      <p>Are you sure you want to approve this quatation?</p>
    </div>
  );

  const handlePreview = key => {
    if (key === 'quotation') {
      onPreview();
    }
  };

  const handleCustomSectionSave = async (values: File, id: string) => {
    try {
      if (!!id) {
        const formData = formDataGenerator({
          fileUrl: values,
        });
        await dispatch(updateQuotationCustomSection({ data: formData, id })).unwrap();
        message.success('Custom section updated successfully!');
      } else {
        const formData = formDataGenerator({
          quotationVersionId: quoteDetails?.quotationVersionId,
          fileUrl: values,
          sortOrder: quoteDetails?.customSections?.length + 1 || 1,
        });
        await dispatch(createQuotationCustomSection(formData)).unwrap();
        message.success('Custom section saved successfully!');
      }
    } catch (error) {
      message.error(error || 'Failed to save custom section');
    }
  };

  const handleCustomSectionDelete = async (id: string) => {
    try {
      await dispatch(deleteQuotationCustomSection(id)).unwrap();
      message.success('Custom section deleted successfully!');
    } catch (error) {
      message.error(error || 'Failed to delete custom section');
    }
  };

  const handleQuotationApproval = async () => {
    try {
      setIsLoading(true);
      const payload = {
        isApprove: true,
        sketchNumber: Number(sketchNum),
      }
      const res = await dispatch(approveQuotation({ versionId: quoteVersionId, payload })).unwrap();
      if (res) {
        message.success('Quotation approved successfully!');
        setModalOpen(null);
        router.back()
      }
    } catch (error) {
      message.error(error || 'Failed to approve quotation');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Space>
          {/* <Dropdown
            menu={{
              items: onSaveMenu,
              onClick: e => {
                e.key === 'newVersion' && setModalOpen('save');
              },
            }}
            placement="top"
          >
            <Button disabled={disableAction}>Save As</Button>
          </Dropdown> */}
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
            // loading={loading}
            disabled={disableAction}
          >
            Approve
          </Button>
          {/* <Button type="primary" onClick={() => {}} disabled={disableAction}>
            Email
          </Button> */}
          <Dropdown
            menu={{
              items: previewMenu,
              onClick: e => {
                handlePreview(e.key);
              },
            }}
            placement='top'
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
            // loading={loading}
            disabled={disableAction}
          >
            Custom Section
          </Button>
          <Button type="primary" disabled={disableAction} onClick={()=>router.back()}>
            View Opprtunity
          </Button>
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
          onSubmit={handleQuotationApproval}
          content={approveContent}
          okText="Approve"
          loading={isLoading}
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
        <CustomSectionModal
          open={modalOpen === 'custom'}
          onClose={() => setModalOpen(null)}
          onSubmit={handleCustomSectionSave}
          onDelete={handleCustomSectionDelete}
          data={customSections || []}
          title="Property Documents"
          message="Custom Section Attachment will be attached along with quotation Pdf"
          loading={status.customSection === Status.PENDING}
        />
      )}
    </div>
  );
};

export default FooterActions;
