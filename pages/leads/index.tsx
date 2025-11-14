import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Table, Input, Button, Space, Dropdown, Switch } from 'antd';
import { IconFilter, IconDownload, IconUpload, IconTrash, IconShare3 } from '@tabler/icons-react';
import type { ColumnsType } from 'antd/es/table';
import { exportToExcel } from '@lib/utils/exportToExcel';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import SourceSelect from '@/components/common/custom-selects/SourceSelect';
import RatingSelect from '@/components/common/custom-selects/RatingSelect';
import { getLeadThunk } from '@redux/feature/lead/leadThunk';
import { Status } from '@lib/constants/enum';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { ILead } from '@redux/feature/lead/ILeadState';
import TooltipButton from '@/components/common/TooltipButtton';
import SystemRoutes from '@lib/constants/Routes';
import CustomAvtar from '@/components/common/CustomAvtar';
import Link from 'next/link';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import AssociatedEntitiesList from '@/components/common/AssociatedEntitiesList';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { debouncedURL } from '@lib/utils/debounceURL';

const LeadPage: React.FC = () => {
  const router = useRouter();
  const [showBlocked, setShowBlocked] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { leads } = useAppSelector(state => state.lead);
  const { leads: leadLoading } = useAppSelector(state => state.lead.status);
  const dispatch = useAppDispatch();
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: [
      'refrenceId',
      'name',
      'propertyAddress',
      'source',
      'rating',
      'created',
      'updated',
      'assignedTo',
    ],
  });
  useEffect(() => {
    async function fetchData() {
      if (leadLoading === Status.IDLE) {
        await dispatch(getLeadThunk()).unwrap();
      }
    }
    if (leadLoading === Status.IDLE || leadLoading === Status.ERROR) {
      fetchData();
    }
  }, [dispatch, leadLoading]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExport = (data: ILead[]) => {
    const column = {
      name: 'Name',
      refrenceId: 'Refrence ID',
      propertyAddress: 'Property Address',
      source: 'Source',
      rating: 'Rating',
      created: 'Created',
      updated: 'Updated',
      assignedTo: 'Assignee',
    };
    exportToExcel({
      data,
      fileName: 'Leads',
      sheetName: 'Leads',
      columnHeaders: column,
    });
  };

  const getFilterTitle = (filter: string) => {
    const titles: Record<string, string> = {
      all: 'All Leads',
      leads: 'Leads',
      opportunities: 'Opportunities',
      closedWon: 'Closed Won',
      closedLost: 'Closed Lost',
      onHold: 'On Hold',
    };
    return titles[filter] || 'Leads';
  };

  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
    setCurrentFilter(selectedType);
    // You can call your API or set state here
  };

  const columns: ColumnsType<ILead> = [
    {
      title: (
        <div>
          <span>Refrence ID</span>
          <Input
            value={filters.refrenceId}
            onChange={e => setParams({ refrenceId: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'slugId',
      key: 'slugId',
      width: 250,
    },
    {
      title: (
        <div>
          <span>Name</span>
          <Input value={filters.name} onChange={e => setParams({ name: e.target.value })} />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: (
        <div>
          <span>Property Address</span>
          <Input
            value={filters.propertyAddress}
            onChange={e =>
              setParams({
                propertyAddress: e.target.value,
              })
            }
          />
        </div>
      ),
      dataIndex: 'propertyAddress',
      key: 'propertyAddress',
      width: 200,
    },
    {
      title: (
        <div>
          <span>Source</span>
          <SourceSelect value={filters.source} onChange={value => setParams({ source: value })} />
        </div>
      ),
      dataIndex: 'leadSource',
      key: 'leadSource',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Rating</span>
          <RatingSelect value={filters.rating} onChange={value => setParams({ rating: value })} />
        </div>
      ),
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Created</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              setParams({ created: dateString });
            }}
            onClear={() => {
              console.log('Cleared date filter');
              setParams({ created: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Updated</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              setParams({ updated: dateString });
            }}
            onClear={() => {
              console.log('Cleared date filter');
              setParams({ updated: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div>
          <span>Assignee</span>
          <AssigneeSelect
            value={filters.assignedTo}
            onChange={value => setParams({ assignedTo: value })}
          />
        </div>
      ),
      dataIndex: 'assignee',
      key: 'assignee',
      width: 200,
      render: assignee => (
        <div className="flex justify-between items-center">
          <CustomAvtar label={assignee?.name} />
          <Link
            href="#"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <IconShare3 size={15} className="cursor-pointer text-blue" />
          </Link>
        </div>
      ),
    },
  ];
  type FilterType = 'all' | 'leads' | 'opportunities' | 'closedWon' | 'closedLost' | 'onHold';
  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: 'all', label: 'All', count: leads.length },
    { type: 'leads', label: 'Leads', count: leads.length },
    {
      type: 'opportunities',
      label: 'Opportunities',
      count: leads.length,
    },
    { type: 'closedWon', label: 'Closed Won', count: leads.length },
    { type: 'closedLost', label: 'Closed Lost', count: leads.length },
    { type: 'onHold', label: 'On Hold', count: leads.length },
  ];

  const handleOpenDeleteModal = () => setIsDeleteModalVisible(true);
  const handleCancelDelete = () => setIsDeleteModalVisible(false);
  const handleDeleteConfirm = (fields: { comments: string }) => {
    setIsDeleteModalVisible(false);
  };

  const selectedLeads = leads.filter(lead => selectedRowKeys.includes(lead.leadId));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{getFilterTitle(currentFilter)}</h1>
        <div>
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />
        </div>
        <Space>
          <Button>Total Records: {leads.length}</Button>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <Space>
                      <Switch checked={showBlocked} onChange={val => setShowBlocked(val)} />
                      <span>Show Blocklisted Leads</span>
                    </Space>
                  ),
                },
              ],
            }}
          >
            <TooltipButton title="Filter" icon={<IconFilter />} />
          </Dropdown>
          <Space>
            <TooltipButton title="Delete" icon={<IconTrash />} onClick={handleOpenDeleteModal} />
            <TooltipButton
              title="Import"
              icon={<IconUpload />}
              onClick={() => handleExport(leads)}
            />
            <TooltipButton
              title="Export"
              icon={<IconDownload />}
              onClick={() => handleExport(leads)}
            />
          </Space>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={leads}
        rowKey="leadId"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        onRow={record => ({
          onClick: () => {
            router.push(`${SystemRoutes.LEADS}/${record.leadId}`);
          },
          style: { cursor: 'pointer' },
        })}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <ActionDialogmodel
        open={isDeleteModalVisible}
        onCancel={handleCancelDelete}
        title="Delete Confirmation"
        headerMessage={
          <div className="space-y-2 text-sm">
            <span className="text-gray-400">
              The below associated details of the selected {getFilterTitle(currentFilter)} will also
              be <br /> deleted:
            </span>
            <div className="max-h-64 overflow-y-auto px-3 py-2 mb-2 custom-scrollbar">
              {selectedLeads.length > 0 ? (
                <div className="space-y-4">
                  {selectedLeads.map((lead, idx) => (
                    <div key={lead.leadId}>
                      <div className="font-bold text-font-color mb-1">
                        {idx + 1}. {lead.slugId} - {lead.name}
                      </div>
                      <AssociatedEntitiesList />
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">No leads selected</span>
              )}
            </div>
          </div>
        }
        isEditing={true}
        fields={[
          {
            name: 'comments',
            label: 'Notes',
            type: 'textarea',
            placeholder: 'Enter notes...',
            extra: `Are you sure you want to delete the ${getFilterTitle(currentFilter)}?`,
          },
        ]}
        onSubmit={handleDeleteConfirm}
        submitButtonText="Confirm"
      />
    </div>
  );
};

export default LeadPage;
