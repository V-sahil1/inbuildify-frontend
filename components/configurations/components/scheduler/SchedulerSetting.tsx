'use client';

import React, { useState } from 'react';
import { Select, Typography, Card } from 'antd';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useUsersHook } from '@hooks/useUserData'; // ✅ import hook

const { Option } = Select;
const { Text } = Typography;

export default function SchedulerSetting() {
  const { users } = useUsersHook(); // ✅ Get users from hook

  const [replyReceivers, setReplyReceivers] = useState<string[]>([]);
  const [tempUsers, setTempUsers] = useState<string[]>(replyReceivers);
  const [selectMode, setSelectMode] = useState(false);

  const handleConfirm = () => {
    setReplyReceivers(tempUsers);
    setSelectMode(false);
  };

  const handleCancel = () => {
    setTempUsers(replyReceivers);
    setSelectMode(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-5">
        <div className="flex gap-[5%] items-center mb-1">
          <Text strong className="text-base text-font-color">
            Receiver of Emails When Someone Replies to Scheduler Emails.
          </Text>

          {!selectMode ? (
            <button
              className=" px-4 py-1 border-b-2 rounded w-[200px] text-sm text-left"
              onClick={() => setSelectMode(true)}
            >
              Choose user
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Select
                mode="multiple"
                className="w-[320px]"
                placeholder="Choose Users"
                value={tempUsers}
                onChange={v => setTempUsers(v)}
                autoFocus
                options={users.map((u: any) => ({
                  label: u.name,
                  value: u.usersId,
                }))}
              />

              <button onClick={handleConfirm}>
                <IconCheck size={22} className="text-theme-green cursor-pointer" />
              </button>

              <button onClick={handleCancel}>
                <IconX size={22} className="text-danger cursor-pointer" />
              </button>
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
