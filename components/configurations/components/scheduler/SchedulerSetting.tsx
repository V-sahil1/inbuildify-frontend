'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Select, Typography, Card, message, Button } from 'antd';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useUsersHook } from '@hooks/useUserHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchSchedularSetting, updateSchedularSetting } from '@redux/feature/admin/scheduler/schedularSetting/schedularSettingThunk';
import { Status } from '@lib/constants/enum';
const { Text } = Typography;

export default function SchedulerSetting() {
  const { userOptions } = useUsersHook();
  const [replyReceivers, setReplyReceivers] = useState<string[]>([]);
  const { receiverOfReplies, status } = useAppSelector(state => state.schedular.schedularSetting);
  const [tempUsers, setTempUsers] = useState<string[]>(receiverOfReplies);
  const [selectMode, setSelectMode] = useState(false);
  const dispatch = useAppDispatch();

  const handleFetch = useCallback(async () => {
    try {
      await dispatch(fetchSchedularSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch schedular setting');
    }
  }, [dispatch]);

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      handleFetch();
    }
  }, [status.fetch]);

  useEffect(() => {
    if (receiverOfReplies) {
      setReplyReceivers(receiverOfReplies);
      setTempUsers(receiverOfReplies);
    }
  }, [receiverOfReplies]);

  const handleConfirm = useCallback(async () => {
    if (status.update === Status.PENDING) return;
    
    try {
      await dispatch(updateSchedularSetting({ receiverOfReplies: tempUsers })).unwrap();
      setReplyReceivers(tempUsers);
      setSelectMode(false);
      message.success('Scheduler settings updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update scheduler settings');
    }
  }, [dispatch, tempUsers, status.update]);

  const handleCancel = () => {
    setTempUsers(replyReceivers);
    setSelectMode(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex gap-[5%] items-center mb-1">
          <Text strong className="text-base text-font-color">
            Receiver of Emails When Someone Replies to Scheduler Emails.
          </Text>

          {!selectMode ? (
            <Button
              className="w-[200px] text-left"
              onClick={() => setSelectMode(true)}
              disabled={status.fetch === Status.PENDING}
            >
              Choose user
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Select
                mode="multiple"
                className="w-[320px]"
                placeholder="Choose Users"
                value={tempUsers}
                onChange={v => setTempUsers(v)}
                autoFocus
                options={userOptions}
              />

              <Button 
                onClick={handleConfirm}
                disabled={status.update === Status.PENDING}
                loading={status.update === Status.PENDING}
                type="text"
                icon={status.update !== Status.PENDING && <IconCheck size={22} className="text-theme-green cursor-pointer" />}
              >
                {status.update === Status.PENDING ? 'Saving...' : ''}
              </Button>

              <Button 
                onClick={handleCancel}
                disabled={status.update === Status.PENDING}
                type="text"
                icon={<IconX size={22} className="text-danger cursor-pointer" />}
              />
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 mt-1 text-font-color-100 text-sm">
          <span>
            When someone replies to a scheduler email, the selected user(s) will receive those
            replies.
          </span>
        </div>
      </Card>
    </div>
  );
}
