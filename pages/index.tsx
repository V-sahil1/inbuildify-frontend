import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createLeadPayload,
  createLeadThunk,
  getLeadThunk,
} from '@redux/feature/lead/leadThunk';
import { message, Typography, Empty, Spin, Modal } from 'antd';
import { CreateFormModal } from '@/components/common/Models/CreateFormModel';
import { Status } from '@lib/constants/enum';
import { useRouter } from 'next/navigation';
import { Lead } from '@redux/feature/lead/ILeadState';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { timeAgo } from '@lib/utils/timeAgo';
import { enumToReadable } from '@lib/utils/enumToRedable';
import useLeadCreateFields from '@/components/formFields/LeadCreateFields';
import SystemRoutes from '@lib/constants/Routes';
import { setAddInstSourceModal } from '@redux/feature/lead/leadSlice';
import rangeAndDwellingTypeFields from '@/components/formFields/rangeAndDwellingTypeFields';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { createleadSource } from '@redux/feature/admin/sales/leadSource/leadSourceThunk';
const Leads = () => {
  const { leads, status } = useAppSelector(state => state.lead);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const addInstSourceModal = useAppSelector(state => state.lead.addInstSourceModal);
  const [openLeadCreateModal, setOpenLeadCreateModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingLeadData, setPendingLeadData] = useState<createLeadPayload | null>(null);
  const [loading, setLoading] = useState({ leadLoading: false, leadSourceLoading: false });
  
  const leadCreateFields = useLeadCreateFields({ isEmailDisable: false });

  async function fetchData() {
    try {
      await dispatch(getLeadThunk()).unwrap();
    }
    catch (error) {
      message.error(error || 'Failed to fetch leads');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setLoading({ ...loading, leadLoading: true });
      setPendingLeadData(values);
      await dispatch(createLeadThunk(pendingLeadData || values)).unwrap();
      message.success('Lead created successfully');
      setOpenLeadCreateModal(false);
      setShowConflictModal(false);
    } catch (error) {
      if (error?.isConflict) {
        setPendingLeadData({ ...values, forceCreate: true });
        setShowConflictModal(true);
      } else {
        message.error(error || 'Failed to create lead');
      }
    } finally {
      setLoading({ ...loading, leadLoading: false });
    }
  };

  const handleAddLeadSourceSubmit = async (values) => {
    try {
      setLoading({ ...loading, leadSourceLoading: true });
      await dispatch(createleadSource({ name: values.name })).unwrap();
      message.success('Lead source created successfully');
      setOpenLeadCreateModal(true);
    } catch (error) {
      message.error(error || 'Failed to create lead source');
    } finally {
      dispatch(setAddInstSourceModal(false));
      setLoading({ ...loading, leadSourceLoading: false });
    }
  };
  const handleOpenModal = () => {
    setOpenLeadCreateModal(true);
  };
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Typography.Title level={4} style={{ margin: 0, color: 'var(--font-color)' }}>
          Leads
        </Typography.Title>
        <button
          className="btn large bg-[var(--primary)] cursor-pointer text-white"
          onClick={handleOpenModal}
        >
          Create
        </button>
      </div>
      {status.leads === Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>
      ) : leads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead: Lead) => (
            <div
              key={lead.leadsId}
              onClick={() => {
                if (lead.status === 'CANCELLED') return;
                else if (lead.status === 'JOB') router.push(`${SystemRoutes.JOB}/${lead.leadsId}`);
                else router.push(`${SystemRoutes.LEADS}/${lead.leadsId}`);
              }}
              className={`rounded-2xl border border-border-color shadow-sm p-6 ${lead.status === 'CANCELLED'
                ? 'opacity-60 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-xl hover:scale-[1.02]'
                } 
                transition-all duration-200 bg-card-color flex flex-col`}
            >
              {/* Header with Tag on Top Right */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{lead.name}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${lead.status === 'IN_PROGRESS'
                    ? 'bg-purple-100 text-purple-700'
                    : lead.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : lead.status === 'JOB'
                        ? 'bg-fuchsia-300 text-fuchsia-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {enumToReadable(lead.status)}
                </span>
              </div>

              {/* Contact Info */}
              <div className=" flex-1 space-y-2 mb-4">
                <p className="flex items-center text-sm ">
                  <IconPhone size={16} className="mr-2 text-gray-400" />
                  {lead.phone ? lead.phone : 'N/A'}
                </p>
                <p className="flex items-center text-sm ">
                  <IconMail size={16} className="mr-2 text-gray-400" />
                  {lead.email ? lead.email : 'N/A'}
                </p>
                <p className="text-xs">
                  Source: {lead.leadSourceName ? enumToReadable(lead.leadSourceName) : 'N/A'}
                </p>
              </div>

              {/* Footer with dates */}
              <div className="flex border-t border-gray-100 pt-3 gap-4 text-xs text-gray-400">
                <p className="flex-1 truncate" title={`Created: ${timeAgo(lead.createdAt)}`}>
                  Created: {timeAgo(lead.createdAt)}
                </p>
                <p className="flex-1 truncate" title={`Updated: ${timeAgo(lead.updatedAt)}`}>
                  Updated: {timeAgo(lead.updatedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          description={
            <span className="text-gray-500">
              No Leads found. Create your first Lead to get started.
            </span>
          }
          className="pt-100"
        />
      )}

      {openLeadCreateModal && <ActionDialogmodel
        title="Lead"
        open={openLeadCreateModal}
        loading={loading.leadLoading}
        onCancel={() => setOpenLeadCreateModal(false)}
        onSubmit={handleSubmit}
        fields={leadCreateFields}
      />}
      {addInstSourceModal && <ActionDialogmodel
        title="LeadSource"
        open={addInstSourceModal}
        loading={loading.leadSourceLoading}
        onCancel={() => {
          dispatch(setAddInstSourceModal(false));
          setOpenLeadCreateModal(true);
        }}
        onSubmit={handleAddLeadSourceSubmit}
        fields={rangeAndDwellingTypeFields()}
      />}

      {showConflictModal && <Modal
        title="Email Already Exists"
        open={showConflictModal}
        onOk={handleSubmit}
        onCancel={() => {
          setShowConflictModal(false);
          setPendingLeadData(null)
        }}
        confirmLoading={loading.leadLoading}
        okText="Create Anyway"
        cancelText="Cancel"
        centered
      >
        <p>
          A lead with this email already exists.
          Do you want to create a new lead with the same email anyway?
        </p>
      </Modal>}
    </div>
  );
};

export default Leads;
