'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dropdown, Input, List, message } from 'antd';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getUsersThunk } from '@redux/feature/user/userThunk';
import { Status } from '@lib/constants/enum';

const AssignSupervisorDropdown = ({ onAssign, assignedSupervisor }) => {
  const { users, status } = useAppSelector(state => state.user);
  const { email } = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const fetchuserData = async () => {
    try {
      await dispatch(getUsersThunk({})).unwrap();
    } catch (error) {
      message.error(error || 'failed to fetch the users');
    }
  };

  useEffect(() => {
    if (status.users.fetch === Status.IDLE) {
      fetchuserData();
    }
  }, [status]);

  const realAssigneeOptions = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        if (user.email !== email) {
          acc.push({ label: user.name, value: user.usersId });
        }
        return acc;
      },
      [] as { label: string; value: string }[]
    );
  }, [users, email]);

  const filteredOptions = realAssigneeOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cleanedSupervisor = (assignedSupervisor || '').toString().trim();

  const isAssigned =
    cleanedSupervisor &&
    cleanedSupervisor.length > 1 &&
    cleanedSupervisor !== 'All' &&
    cleanedSupervisor !== 'Unassigned';

  const iconComponent = isAssigned ? (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm cursor-pointer transition-all duration-150 hover:bg-gray-300"
      title={`Change Supervisor: ${cleanedSupervisor}`}
    >
      {cleanedSupervisor.charAt(0).toUpperCase()}
    </div>
  ) : (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-gray-400 text-gray-700 font-semibold text-sm cursor-pointertransition-all duration-150 hover:bg-gray-100 hover:border-primary"
      title="Assign Supervisor"
    >
      <IconPlus size={18} />
    </div>
  );

  const dropdownContent = (
    <div className="w-64 bg-white rounded-md shadow-md p-2" onClick={e => e.stopPropagation()}>
      <div className="font-semibold mb-2 text-blue-600">Assign Site Supervisor</div>
      <Input
        placeholder="Search supervisor"
        prefix={<IconSearch size={16} />}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <div className="max-h-64 overflow-y-auto">
        <List
          dataSource={filteredOptions}
          renderItem={option => (
            <div
              key={option.value}
              onClick={() => {
                onAssign(option.label);
                setOpen(false);
                setSearchTerm('');
              }}
              className={`px-3 py-2 rounded cursor-pointer hover:bg-gray-100 ${
                assignedSupervisor === option.label ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              {option.label}
            </div>
          )}
        />
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      open={open}
      onOpenChange={val => setOpen(val)}
      placement="bottomRight"
    >
      <div onClick={e => e.stopPropagation()}>{iconComponent}</div>
    </Dropdown>
  );
};

export default AssignSupervisorDropdown;
