'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { Button, Table, Tag, Avatar, message, Popconfirm, Input } from 'antd';
import { SchedulerSettingsForm } from './SchedulerSettingsForm';
import { useUsersHook } from '@hooks/useUserHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllScheduleEmail, updateScheduleEmail, updateScheduleEmailActive } from '@redux/feature/admin/scheduler/schedularEmail/scheduleEmailThunk';
import { Status } from '@lib/constants/enum';
import { ScheduleEmail } from '@redux/feature/admin/scheduler/schedularEmail/ischeduleEmailState';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

// Create initials from name
const initials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

export const EmailScheduler = () => {
  const { userOptions } = useUsersHook();
  const [data, setData] = useState<ScheduleEmail[]>([]);
  const [openSchedulerForm, setOpenSchedulerForm] = useState<ScheduleEmail | null>(null);
  const [searchValue, setSearchValue] = useState('');
  
  const dispatch = useAppDispatch();
  const { scheduleEmail, status } = useAppSelector(state => state.schedular.scheduleEmail);

  const handleFetch = useCallback(async () => {
    try {
      await dispatch(fetchAllScheduleEmail()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch schedule emails');
    }
  }, [dispatch]);

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      handleFetch();
    }
  }, [status.fetch]);

  useEffect(() => {
    if (scheduleEmail && scheduleEmail.length > 0) {
      setData(scheduleEmail);
    }
  }, [scheduleEmail]);

  const getUserName = useCallback((id: string) => {
    const user = userOptions?.find((u: any) => u.value === id);
    return user?.label || id;
  }, [userOptions]);

  const handleActivateScheduler = useCallback(async (record: ScheduleEmail) => {
    if (status.update === Status.PENDING) return;
    
    try {
      await dispatch(updateScheduleEmailActive(record.schedulerEmailId)).unwrap();
      message.success('Scheduler activated successfully');
    } catch (error) {
      message.error(error || 'Failed to activate scheduler');
    }
  }, [dispatch, status.update]);

  const handleDeactivateScheduler = useCallback(async (record: ScheduleEmail) => {
    if (status.update === Status.PENDING) return;
    
    try {
      await dispatch(updateScheduleEmailActive(record.schedulerEmailId)).unwrap();
      message.success('Scheduler deactivated successfully');
    } catch (error) {
      message.error(error || 'Failed to deactivate scheduler');
    }
  }, [dispatch, status.update]);

  const filteredData = useMemo(() => {
    return data.filter(
      item =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.messageBody.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  const handleSave = useCallback(async (updatedRow: ScheduleEmail) => {
    if (status.update === Status.PENDING) return;
    
    try {
      const formData = formDataGenerator(updatedRow);
      
      await dispatch(updateScheduleEmail({ 
        data: formData, 
        schedulerEmailId: openSchedulerForm.schedulerEmailId 
      })).unwrap();
      
      message.success('Scheduler settings saved successfully');
      setOpenSchedulerForm(null);
    } catch (error) {
      message.error(error || 'Failed to update scheduler settings');
    }
  }, [dispatch, openSchedulerForm, status.update]);

  const filterOptions = useMemo(() => [
    { type: 'All', label: 'All', count: data.length },
    { type: 'Standard', label: 'Standard', count: 2 },
    { type: 'Nonscheduled', label: 'Non Scheduled', count: data.filter(d => !d.isActive).length },
  ], [data]);

  const columns = [
    {
      title: (
        <div className="flex gap-[10%]">
          <span>Name</span>
          <Input
            size="small"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="w-[140px]"
            placeholder="Search..."
          />
        </div>
      ),
      key: 'name',
      width: '40%',
      render: (_: any, record: any) => (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">{record.name}</p>
          <p className="text-xs text-gray-600">{record.messageBody || 'No description available'}</p>

          <div className="flex gap-2 mt-1">
            {record.isActive ? (
              <>
                <Tag color="green">Scheduled</Tag>
                {record.frequency && <Tag color="blue">{record.frequency}</Tag>}
              </>
            ) : (
              <Tag color="red">Not Scheduled</Tag>
            )}
          </div>
        </div>
      ),
    },

    {
      title: 'Targeted Recipients',
      width: '25%',
      render: (_: any, r: any) => {
        if (!r.isActive) return;
        if (r.sendToAllActiveUsers) return 'Send to all users';

        if (Array.isArray(r.notificationRecipientUsers) && r.notificationRecipientUsers.length) {
          return (
            <div className="flex gap-2">
              {r.notificationRecipientUsers.map((id: string, i: number) => {
                const name = getUserName(id);
                return (
                  <Avatar key={i} className="bg-gray-400 text-white text-xs">
                    {initials(name)}
                  </Avatar>
                );
              })}
            </div>
          );
        }
        return;
      },
    },

    {
      title: 'Exclude Recipients',
      width: '20%',
      render: (_: any, r: any) =>
        r.isActive && r.sendToAllActiveUsers && Array.isArray(r.excludeRecipients) && r.excludeRecipients.length ? (
          <div className="flex gap-2">
            {r.excludeRecipients.map((id: string, i: number) => {
              const name = getUserName(id);
              return (
                <Avatar key={i} className="bg-gray-400 text-white text-xs">
                  {initials(name)}
                </Avatar>
              );
            })}
          </div>
        ) : (
          <span className="text-gray-400"></span>
        ),
    },

    {
      title: 'Action',
      width: '15%',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          {record.isActive ? (
            <>
              <Button 
                onClick={() => setOpenSchedulerForm(record)}
                disabled={status.update === Status.PENDING}
              >
                <IconEdit size={18} />
              </Button>

              <Popconfirm
                title="Deactivate scheduler?"
                description="Are you sure you want to deactivate this scheduler?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDeactivateScheduler(record)}
                disabled={status.update === Status.PENDING}
              >
                <Button 
                  danger 
                  loading={status.update === Status.PENDING}
                  disabled={status.update === Status.PENDING}
                >
                  <IconTrash size={18} />
                </Button>
              </Popconfirm>
            </>
          ) : (
            <Popconfirm
              title="Activate scheduler?"
              description="Are you sure you want to activate this scheduler?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleActivateScheduler(record)}
              disabled={status.update === Status.PENDING}
            >
              <Button 
                loading={status.update === Status.PENDING}
                disabled={status.update === Status.PENDING}
              >
                <IconPlus size={18} />
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {openSchedulerForm ? (
        <SchedulerSettingsForm
          data={openSchedulerForm}
          onCancel={() => setOpenSchedulerForm(null)}
          onSave={handleSave}
          isSubmitting={status.update === Status.PENDING}
        />
      ) : (
        <>
          <h1 className="text-lg font-semibold">
            The following job emails are available to be scheduled as per your requirement
          </h1>

          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={() => {}}
            isActionShow={false}
            isCountShow={true}
          />

          <Table 
            columns={columns} 
            dataSource={filteredData} 
            rowKey="schedulerEmailId"
            pagination={false}
            loading={status.fetch === Status.PENDING}
          />
        </>
      )}
    </div>
  );
};
