import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input, Dropdown, Button } from 'antd';
import { IconDotsVertical, IconExternalLink } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import SystemRoutes from '@lib/constants/Routes';
import { Maintenance } from '@redux/feature/maintenance/IMaintenanceState';
import AssignSupervisorDropdown from '../construction/assignSupervisorModal';
import AssigneeSelect from '../common/custom-selects/AssigneeSelect';
import DateFilterDropdown from '../common/custom-selects/DateFilterDropdown';
import ConfirmationModal from '../common/ConfirmationModal';
import { ActionDialogmodel } from '../common/Models/ActionDialogModel';

type DateRange = [Dayjs, Dayjs] | null;

const ALL_MAINTENANCE_STATUSES = [
  { key: 'readyformaintenance', label: 'Ready For Maintenance' },
  { key: 'undermaintenance', label: 'Under Maintenance' },
  { key: 'completed', label: 'Completed' },
];

interface UseMaintenanceTableLogicProps {
  handleSupervisorAssign: (jobId: string, newSupervisor: string) => void;
  handleExport?: (jobId: string) => void;
  handleStatusChange: (jobId: string, newStatusKey: string) => void;
  handleRevertToConstruction?: (jobId: string) => void;
}

export const useMaintenanceTableLogic = ({
  handleSupervisorAssign,
  handleExport,
  handleRevertToConstruction,
  handleStatusChange,
}: UseMaintenanceTableLogicProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    id: searchParams.get('id') || '',
    customerName: searchParams.get('customerName') || '',
    jobAddress: searchParams.get('jobAddress') || '',
    startDate: null as DateRange,
    endDate: null as DateRange,
    assignee: searchParams.get('assignee') || '',
  });

  const [selectedStatus, setSelectedStatus] = useState<{
    jobId: string;
    statusKey: string;
    statusLabel: string;
  } | null>(null);
  const [isStatusChangeModalVisible, setIsStatusChangeModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isRevertModalVisible, setIsRevertModalVisible] = useState(false);

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: typeof filters) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) params.set(key, typeof value === 'string' ? value : '');
          else params.delete(key);
        });
        router.replace(`${pathname}?${params.toString()}`);
      }, 400),
    [pathname, router, searchParams]
  );

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters(prev => {
        const newFilters = { ...prev, ...updates };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const handleRevert = () => {
    if (selectedJobId && handleRevertToConstruction) {
      handleRevertToConstruction(selectedJobId);
      setIsRevertModalVisible(false);
      setSelectedJobId(null);
    }
  };

  const handleCancelRevert = () => {
    setIsRevertModalVisible(false);
    setSelectedJobId(null);
  };

  const handleStatusChangeConfirm = () => {
    if (selectedStatus) {
      handleStatusChange(selectedStatus.jobId, selectedStatus.statusKey);
      setIsStatusChangeModalVisible(false);
      setSelectedStatus(null);
    }
  };

  const handleCancelStatusChange = () => {
    setIsStatusChangeModalVisible(false);
    setSelectedStatus(null);
  };

  const maintenanceColumns = useMemo(() => {
    return [
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Reference ID</span>
            <Input
              placeholder="Search ID"
              value={filters.id}
              onChange={e => handleFilterChange({ id: e.target.value })}
            />
          </div>
        ),
        dataIndex: 'id',
        key: 'id',
        width: 150,
        render: (id: number) => <span className="font-semibold">{id}</span>,
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Customer Name</span>
            <Input
              placeholder="Search Customer"
              value={filters.customerName}
              onChange={e => handleFilterChange({ customerName: e.target.value })}
            />
          </div>
        ),
        dataIndex: 'customerName',
        key: 'customerName',
        width: 180,
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Job Address</span>
            <Input
              placeholder="Search Address"
              value={filters.jobAddress}
              onChange={e => handleFilterChange({ jobAddress: e.target.value })}
            />
          </div>
        ),
        dataIndex: 'jobAddress',
        key: 'jobAddress',
        width: 220,
      },
      {
        title: (
          <div className="flex flex-col">
            <div className="font-semibold">Start Date</div>
            <DateFilterDropdown
              onFilter={(type, dates) => {
                handleFilterChange({ ...filters, startDate: dates });
              }}
              onClear={() => handleFilterChange({ ...filters, startDate: null })}
            />
          </div>
        ),
        dataIndex: 'startDate',
        key: 'startDate',
        width: 160,
        render: (date: string) =>
          dayjs(date, 'DD-MM-YYYY').isValid()
            ? dayjs(date, 'DD-MM-YYYY').format('DD-MM-YYYY')
            : date,
      },
      {
        title: (
          <div className="flex flex-col">
            <div className="font-semibold">End Date</div>
            <DateFilterDropdown
              onFilter={(type, dates) => {
                handleFilterChange({ ...filters, endDate: dates });
              }}
              onClear={() => handleFilterChange({ ...filters, endDate: null })}
            />
          </div>
        ),
        dataIndex: 'endDate',
        key: 'endDate',
        width: 160,
        render: (date: string) =>
          dayjs(date, 'DD-MM-YYYY').isValid()
            ? dayjs(date, 'DD-MM-YYYY').format('DD-MM-YYYY')
            : date,
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Site Supervisor</span>
            <AssigneeSelect
              value={filters.assignee}
              onChange={value => handleFilterChange({ assignee: value })}
            />
          </div>
        ),
        dataIndex: 'siteSupervisor',
        key: 'siteSupervisor',
        width: 180,
        render: (supervisor: string, record: Maintenance) => {
          const currentStatusKey = record.status.toLowerCase();

          const statusChangeItems = ALL_MAINTENANCE_STATUSES.filter(
            item => item.key !== currentStatusKey
          ).map(item => ({
            key: item.key,
            label: item.label,
          }));

          const handleMenuClick = (e: any) => {
            const statusItem = ALL_MAINTENANCE_STATUSES.find(item => item.key === e.key);
            if (statusItem) {
              setSelectedStatus({
                jobId: record.id.toString(),
                statusKey: statusItem.key,
                statusLabel: statusItem.label,
              });
              setIsStatusChangeModalVisible(true);
              return;
            }

            if (e.key === 'revert') {
              setSelectedJobId(record.id.toString());
              setIsRevertModalVisible(true);
            }
            if (e.key === 'export') {
              handleExport?.(record.id.toString());
            }
          };

          const actionMenu = {
            items: [
              {
                key: 'changestatusto_header',
                label: 'Change status to:',
                type: 'group' as const,
                children: statusChangeItems,
              },

              { type: 'divider' as const },
              { key: 'revert', label: 'Revert to Construction' },
              { type: 'divider' as const },
              { key: 'export', label: 'Export' },
            ],
            onClick: handleMenuClick,
          };

          return (
            <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <AssignSupervisorDropdown
                assignedSupervisor={supervisor}
                onAssign={newSupervisor =>
                  handleSupervisorAssign(record.id.toString(), newSupervisor)
                }
              />
              <div className="flex gap-2">
                <Dropdown menu={actionMenu}>
                  <Button type="text" icon={<IconDotsVertical size={22} />} />
                </Dropdown>
                <Button
                  type="text"
                  className="hover:text-primary"
                  icon={<IconExternalLink size={22} />}
                  onClick={e => {
                    e.stopPropagation();
                    window.open(`/${SystemRoutes.CONSTRUCTION}/${record.id}`, '_blank');
                  }}
                />
              </div>
            </div>
          );
        },
      },
    ];
  }, [filters, handleFilterChange, handleSupervisorAssign, handleExport]);

  const RevertModal = () => (
    <ConfirmationModal
      open={isRevertModalVisible}
      onConfirm={handleRevert}
      onClose={handleCancelRevert}
      type="warning"
      message={
        <div className="felx felx-col">
          <p>
            Reverting this record will delete all information added after moved to construction.
            once deleted, you can't retrieve back the details.
          </p>
          <p>Are you sure you want to Revert to constuction?</p>
        </div>
      }
      confirmText="Revert"
      cancelText="Cancel"
      maxWidth="md"
    />
  );

  const StatusChangeModal = () => {
    if (!selectedStatus) return null;
    return (
      <ActionDialogmodel
        open={isStatusChangeModalVisible}
        onCancel={handleCancelStatusChange}
        title={`Move to ${selectedStatus.statusLabel}`}
        isEditing={true}
        fields={[
          {
            name: 'comments',
            label: 'Comments',
            type: 'textarea' as const,
            placeholder: 'Enter comments...',
          },
        ]}
        onSubmit={handleStatusChangeConfirm}
        submitButtonText="confirm"
      />
    );
  };

  return {
    filters,
    handleFilterChange,
    maintenanceColumns,
    selectedStatus,
    isStatusChangeModalVisible,
    selectedJobId,
    isRevertModalVisible,
    StatusChangeModal,
    RevertModal,
  };
};
