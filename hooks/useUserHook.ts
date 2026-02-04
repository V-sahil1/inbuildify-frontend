import { Status } from '@lib/constants/enum';
import { getUsersThunk } from '@redux/feature/user/userThunk';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { user } from '@redux/feature/user/UserState';
import { message } from 'antd';

export const useUsersHook = (verified: boolean = true) => {
  const dispatch = useAppDispatch();
  const { users, status } = useAppSelector(state => state.user);

  const getUsers = async () => {
    try {
      await dispatch(getUsersThunk()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch users');
    }
  };
  useEffect(() => {
    if (status.users === Status.IDLE) {
      getUsers();
    }
  }, [status.users]);

  const userOptions = useMemo(() => {
    if (!users || users.length === 0) {
      return [];
    }
    return users
      .filter(i => i.isActive === verified)
      .map((role: user) => ({
        label: role.name,
        value: role.usersId,
      }));
  }, [users, verified]);

  return {
    userOptions,
    isLoading: status.users === Status.PENDING,
    error: status.users === Status.ERROR,
  };
};
