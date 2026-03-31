import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createLeadPayload, createLeadThunk, getLeadThunk } from '@redux/feature/lead/leadThunk';
import {
  Form,
  message,
  Typography,
  Empty,
  Spin,
  Modal,
  Button,
  Input,
  Select,
  Dropdown,
  Badge,
} from 'antd';
import { Status } from '@lib/constants/enum';
import { useRouter } from 'next/navigation';
import { Lead } from '@redux/feature/lead/ILeadState';
import { IconFilter, IconMail, IconPhone, IconSearch, IconX } from '@tabler/icons-react';
import { timeAgo } from '@lib/utils/timeAgo';
import { enumToReadable } from '@lib/utils/enumToRedable';
import useLeadCreateFields from '@/components/formFields/LeadCreateFields';
import SystemRoutes from '@lib/constants/Routes';
import { clearLeadDetail, setAddInstSourceModal } from '@redux/feature/lead/leadSlice';
import rangeAndDwellingTypeFields from '@/components/formFields/rangeAndDwellingTypeFields';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import {
  createleadSource,
  fetchAllleadSource,
} from '@redux/feature/admin/sales/leadSource/leadSourceThunk';
import { fetchSetting } from '@redux/feature/admin/sales/setting/settingThunk';
import { debouncedURL } from '@lib/utils/debounceURL';

const statusOptions = [
  // Default flow
  { label: 'New', value: 'New' },
  { label: 'Working', value: 'Working' },
  { label: 'Convert', value: 'Convert' },

  // Opportunity flow
  { label: 'Proposal', value: 'Proposal' },
  { label: 'Negotiation', value: 'Negotiation' },
  { label: 'Close', value: 'Close' },
];

const relativeDateOptions = [
  { label: 'Last 15 Minutes', value: 'last_15_minutes' },
  { label: 'Last 1 Hour', value: 'last_1_hour' },
  { label: 'Last 2 Hours', value: 'last_2_hours' },
  { label: 'Last 24 Hours', value: 'last_24_hours' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'Last 15 Days', value: 'last_15_days' },
  { label: 'Last 30 Days', value: 'last_30_days' },
];
const Leads = () => {
  const { leads, status } = useAppSelector(state => state.lead);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const addInstSourceModal = useAppSelector(state => state.lead.addInstSourceModal);
  const { setting, status: settingStatus } = useAppSelector(state => state.sales.setting);
  const { leadSource, status: leadSourceStatus } = useAppSelector(state => state.sales.leadSource);
  const [openLeadCreateModal, setOpenLeadCreateModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingLeadData, setPendingLeadData] = useState<createLeadPayload | null>(null);
  const [loading, setLoading] = useState({ leadLoading: false, leadSourceLoading: false });
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const { debouncedUpdateURL, setParams, filters, instantFilters, resetParams } = debouncedURL({
    filtersKey: ['search', 'status', 'createdAt', 'leadSource'],
    shouldSyncURL: false,
  });

  const [leadForm] = Form.useForm();
  const leadCreateFields = useLeadCreateFields({ isEmailDisable: false }, leadForm);

  async function fetchData(isParam: boolean = true) {
    try {
      const params = {
        search: filters.search || undefined,
        lead_source_id: filters.leadSource || undefined,
        created_at: filters.createdAt || undefined,
        status: filters.status || undefined,
      };
      await dispatch(
        getLeadThunk(isParam ? params : { search: filters.search || undefined })
      ).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch leads');
    }
  }
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  
  useEffect(() => {
    dispatch(clearLeadDetail());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [filters?.search]);

  useEffect(() => {
    if (settingStatus.fetch === Status.IDLE) {
      fetchSalesSetting();
    }
  }, [settingStatus.fetch]);

  async function getLeadSources() {
    try {
      await dispatch(fetchAllleadSource({})).unwrap();
    } catch (error) {
      message.error(error || 'failed to fetch the Lead sources');
    }
  }

  useEffect(() => {
    if (leadSourceStatus.fetch === Status.IDLE) {
      getLeadSources();
    }
  }, [leadSourceStatus.fetch]);

  const fetchSalesSetting = async () => {
    try {
      await dispatch(fetchSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Sales Setting');
    }
  };

  const handleSubmit = async values => {
    try {
      setLoading({ ...loading, leadLoading: true });
      setPendingLeadData(values);
      await dispatch(createLeadThunk(showConflictModal ? pendingLeadData : values)).unwrap();
      message.success('Lead created successfully');
      setOpenLeadCreateModal(false);
      setShowConflictModal(false);
    } catch (error) {
      if (error?.isConflict && setting?.allowDuplicateLeads) {
        setPendingLeadData({ ...values, forceCreate: true });
        setShowConflictModal(true);
      } else {
        message.error(error?.message || error || 'Failed to create lead');
      }
    } finally {
      setLoading({ ...loading, leadLoading: false });
    }
  };

  const handleAddLeadSourceSubmit = async values => {
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

  const leadFilterMenu = () => (
    <div className="min-w-[300px] p-4 bg-white rounded-lg shadow-lg border">
      <h3 className="text-sm mb-4 font-semibold text-gray-700">Filter Leads</h3>

      {/* Status Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2 items-center">
        <p className="col-span-2 text-sm font-medium">Status</p>
        <Select
          value={instantFilters?.status}
          onChange={value => setParams({ status: value })}
          placeholder="Select status"
          className="w-full col-span-4"
          options={statusOptions}
          allowClear
        />
      </div>
      {/* Lead Source Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2  items-center">
        <p className=" col-span-2 text-sm font-medium">Lead Source</p>
        <Select
          value={instantFilters?.leadSource}
          onChange={value => setParams({ leadSource: value })}
          placeholder="Select lead source"
          className="w-full col-span-4"
          allowClear
        >
          {leadSource?.map((source: any) => (
            <Select.Option key={source.leadSourceId} value={source.leadSourceId}>
              {source.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      {/* Created At Filter */}
      <div className="mb-4 grid grid-cols-6 gap-2  items-center">
        <p className="col-span-2 text-sm font-medium">Created At</p>
        <Select
          value={instantFilters?.createdAt}
          onChange={value => setParams({ createdAt: value })}
          placeholder="Select date"
          className="w-full col-span-4"
          options={relativeDateOptions}
          allowClear
        />
      </div>

      {/* Filter Actions */}
      <div className="flex gap-2 pt-2 justify-end">
        <Button
          size="small"
          onClick={() => {
            setFilterDropdownOpen(false);
            setParams({ status: '', createdAt: '', leadSource: '' });
            fetchData(false);
          }}
        >
          Clear All
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setFilterDropdownOpen(false);
            fetchData();
          }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Typography.Title level={4} style={{ margin: 0, color: 'var(--font-color)' }}>
          Leads
        </Typography.Title>
        <div className="flex items-center gap-2">
          <Input
            prefix={<IconSearch size={15} className="text-gray-400" />}
            placeholder="Search..."
            value={instantFilters?.search}
            onChange={e => setParams({ search: e.target.value })}
          />
          <Dropdown
            open={filterDropdownOpen}
            onOpenChange={setFilterDropdownOpen}
            trigger={['click']}
            dropdownRender={leadFilterMenu}
          >
            <Badge dot={filters.status || filters.createdAt || filters.leadSource ? true : false}>
              <IconFilter className="text-primary" />
            </Badge>
          </Dropdown>
          <Button type="primary" className="cursor-pointer" onClick={handleOpenModal}>
            Create
          </Button>
        </div>
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
              className={`rounded-2xl border border-border-color shadow-sm p-6 ${
                lead.status === 'CANCELLED'
                  ? 'opacity-60 cursor-not-allowed'
                  : 'cursor-pointer hover:shadow-xl hover:scale-[1.02]'
              } 
                transition-all duration-200 bg-card-color flex flex-col`}
            >
              {/* Header with Tag on Top Right */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{lead.name}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                    lead.status === 'IN_PROGRESS'
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

      {openLeadCreateModal && (
        <ActionDialogmodel
          title="Lead"
          open={openLeadCreateModal}
          loading={loading.leadLoading}
          onCancel={() => setOpenLeadCreateModal(false)}
          onSubmit={handleSubmit}
          fields={leadCreateFields}
          form={leadForm}
        />
      )}
      {addInstSourceModal && (
        <ActionDialogmodel
          title="LeadSource"
          open={addInstSourceModal}
          loading={loading.leadSourceLoading}
          onCancel={() => {
            dispatch(setAddInstSourceModal(false));
            setOpenLeadCreateModal(true);
          }}
          onSubmit={handleAddLeadSourceSubmit}
          fields={rangeAndDwellingTypeFields()}
        />
      )}

      {showConflictModal && (
        <Modal
          title="Email Already Exists"
          open={showConflictModal}
          onOk={handleSubmit}
          onCancel={() => {
            setShowConflictModal(false);
            setPendingLeadData(null);
          }}
          confirmLoading={loading.leadLoading}
          okText="Create Anyway"
          cancelText="Cancel"
          centered
        >
          <p>
            A lead with this email already exists. Do you want to create a new lead with the same
            email anyway?
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Leads;
