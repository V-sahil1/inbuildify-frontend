'use client';

import React, { useState } from 'react';
import { Button, Dropdown, message, Popover, Tag } from 'antd';
import { IconDots } from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import {
  leadConvertThunk,
  leadDeleteThunk,
  transferLeadThunk,
} from '@redux/feature/lead/leadThunk';
import { useRouter } from 'next/navigation';
import { CreateFormModal } from './Models/CreateFormModel';
import ConfirmationModal from './ConfirmationModal';
import transferLeadFields from '../formFields/transferLeadFields';
import CloseLeadModal from '../leadDetail/LeadQuotations/CloseLeadModal';
import { Quotation } from '@redux/feature/quotation/IQuotationState';
import SystemRoutes from '@lib/constants/Routes';
import { HeaderContent } from './HeaderContent';
import ConvertLeadModal from '../leadDetail/ConvertLeadModal';

type Step = {
  key: string;
  label: string;
  color: string;
  textColor?: string;
  onClick?: (key: string) => void;
};

type StageProgressProps = {
  id?: string;
  title: string;
  status?: string;
  steps: Step[];
  activeStep?: string;
  lead?: any;
  showOptions?: boolean;
  idClassName?: string;
  quotations?: Quotation[];
  data?: {
    builder?: string;
    leadSource?: string;
    assignedTask?: { label: string; value: string; status: string }[];
  };
  actions?: { key: string; label: string }[];
};

const StageProgress: React.FC<StageProgressProps> = ({
  id,
  title,
  status,
  steps,
  activeStep,
  lead,
  showOptions = false,
  idClassName,
  quotations,
  data,
  actions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<
    'closeLead' | 'delete' | 'transfer' | 'opportunity' | 'lead' | null
  >(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'WON' | 'LOST' | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const leadTransferFields = transferLeadFields();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleWinClick = () => {
    setModalType('WON');
    setIsModalOpen('closeLead');
  };

  const handleLoseClick = () => {
    setModalType('LOST');
    setIsModalOpen('closeLead');
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    switch (action) {
      case 'transfer':
        setIsModalOpen('transfer');

        break;
      case 'delete':
        setIsModalOpen('delete');
        break;
      case 'onhold':
        break;
      case 'blocklist':
        break;
      case 'referanceid':
        break;
      case 'convertToLead':
        setIsModalOpen('lead');
        break;
      case 'convertToOpprtunity':
        setIsModalOpen('opportunity');
        break;
      case 'sendwelcomelatter':
        break;
      case 'sendwelcomeemail':
        break;
      default:
        break;
    }
  };

  const handleTransferSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await dispatch(
        transferLeadThunk({
          leadId: lead.lead.leadId,
          ...values,
        })
      ).unwrap();
      message.success('Lead transferred successfully');
    } catch (err) {
      message.error(err || 'Failed to transfer lead');
    } finally {
      setLoading(false);
      setIsModalOpen(null);
    }
  };

  const handleDelete = async (leadId: string) => {
    try {
      setLoading(true);
      await dispatch(leadDeleteThunk(leadId)).unwrap();
      message.success('Lead deleted successfully');
      router.push(`/`);
    } catch (err) {
      setLoading(false);
      message.error(err || 'Failed to delete lead');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToLead = async (leadId: string) => {
    try {
      setLoading(true);
      await dispatch(leadConvertThunk(leadId)).unwrap();
      message.success('Lead converted successfully');
      setIsModalOpen(null);
    } catch (err) {
      setLoading(false);
      message.error(err || 'Failed to convert lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 min-w-[300px] ">
      <div className="flex flex-col gap-2">
        {/* Info */}
        <Popover content={data ? <HeaderContent id={id} data={data} /> : null}>
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="font-medium">
              {title} <span className="text-secondary">{id && `- ${id}`}</span>
            </span>
            {status && (
              <Tag color="cyan" className="rounded-md">
                {status}
              </Tag>
            )}
          </div>
        </Popover>
        {/* Step Progress */}
        <div className="flex w-full">
          {steps.map((step, index) => {
            const isActive = activeStep === step.key;
            const isLast = index === steps.length - 1;
            const idx = steps.findIndex(i => i.key === activeStep);
            return (
              <div
                key={step.key}
                onClick={() =>
                  step.key === 'Convert' && idx === steps.length - 1 && step.onClick?.(step.key)
                }
                className={`
                flex-1 text-center py-2 select-none 
                ${isActive || index < idx ? `${step.textColor} ${step.color}` : 'text-black bg-gray-200'}
                transition-colors
                ${index > 0 ? '-ml-3' : ''}
                ${step.key === 'Convert' && idx === steps.length - 1 && 'cursor-pointer'}
                relative
              `}
                style={{
                  zIndex: steps.length - index,
                  clipPath: !isLast
                    ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    : 'none',
                }}
              >
                <span className="whitespace-nowrap px-4">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {lead?.lead?.status === 'JOB' && (
          <Button
            type="primary"
            className="btn rounded-md p-1"
            onClick={() => router.push(`${SystemRoutes.JOB}/${lead?.lead?.leadsId}`)}
          >
            view job
          </Button>
        )}
        {
          // lead?.lead?.status === 'COMPLETED'
          showOptions && (
            <>
              <button className="btn btn-success rounded-md p-1" onClick={handleWinClick}>
                Won
              </button>
              <button
                className="btn bg-red-500 rounded-md p-1 text-white"
                onClick={handleLoseClick}
              >
                Lost
              </button>
            </>
          )
        }
        {showOptions && (
          <Dropdown
            open={dropdownVisible}
            onOpenChange={open => setDropdownVisible(open)}
            placement="bottomRight"
            trigger={['click']}
            dropdownRender={() => (
              <div className="bg-white shadow-lg rounded-md border border-gray-200 w-56">
                <div className="py-1">
                  {actions
                    .filter(
                      action => action.key !== 'converttolead' || lead?.lead?.status !== 'NEW'
                    )
                    .map(action => (
                      <button
                        key={action.key}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                        onClick={() => {
                          handleActionSelect(action.key);
                          setDropdownVisible(false);
                        }}
                      >
                        <span>{action.label}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          >
            <button
              className={`btn border ${
                dropdownVisible ? 'border-red-500 bg-red-50' : 'border-red-500'
              } rounded-md p-1`}
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              <IconDots stroke={2} className="text-red-500" />
            </button>
          </Dropdown>
        )}
      </div>
      {/* <Modal
        title={modalType === "WON" ? "Won" : modalType === "LOST" ? "Lost" : ""}
        open={isModalOpen === 'closeLead'}
        onCancel={() => {
          setIsModalOpen(null);
          setModalType(null);
        }}
        centered
        okButtonProps={{ loading }}
        onOk={() => {
          document.getElementById("reasonFormSubmit")?.click();
        }}
      >
        <Form
          id="reasonForm"
          layout="vertical"
          form={form}
          onFinish={handleSubmit}

        >
          <Form.Item
            name="message"

            label={modalType === "WON" ? "Comment" : "Lost Reason"}
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <TextArea rows={4} style={{resize:'none'}} showCount maxLength={500} />
          </Form.Item>

          <button id="reasonFormSubmit" type="submit" hidden />
        </Form>
      </Modal> */}

      {isModalOpen === 'transfer' && (
        <CreateFormModal
          title="Transfer Lead"
          open={isModalOpen === 'transfer'}
          loading={loading}
          onCancel={() => {
            setSelectedAction(null);
            setIsModalOpen(null);
          }}
          submitButtonText="Transfer"
          isEditing={!!lead?.lead?.assignee?.id}
          initialValues={{
            assignee_id: {
              value: lead?.lead?.assignee?.id,
              label: lead?.lead?.assignee?.name,
            },
          }}
          onSubmit={handleTransferSubmit}
          fields={leadTransferFields}
        />
      )}

      {isModalOpen === 'closeLead' && (
        <CloseLeadModal
          isModalOpen={isModalOpen === 'closeLead'}
          setIsModalOpen={() => setIsModalOpen(null)}
          active={modalType}
          leadData={lead?.lead}
          quotations={quotations}
        />
      )}

      {['delete', 'lead'].includes(isModalOpen) && (
        <ConfirmationModal
          open={['delete', 'lead'].includes(isModalOpen)}
          type={selectedAction === 'delete' ? 'danger' : 'warning'}
          loading={loading}
          onClose={() => {
            setIsModalOpen(null);
          }}
          onConfirm={() => {
            if (selectedAction === 'delete') {
              handleDelete(lead?.lead?.leadsId);
            } else if (selectedAction === 'converttolead') {
              handleConvertToLead(lead?.lead?.leadsId);
            }
          }}
          message={
            selectedAction === 'delete'
              ? 'Are you sure you want to delete this lead?'
              : 'Are you sure you want to convert this to a lead?'
          }
        />
      )}
      {isModalOpen === 'opportunity' && (
        <ConvertLeadModal
          visible={isModalOpen === 'opportunity'}
          onCancel={() => setIsModalOpen(null)}
          leadId={lead?.lead?.leadsId as string}
        />
      )}
    </div>
  );
};

export default StageProgress;
