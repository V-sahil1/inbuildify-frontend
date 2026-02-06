import { Status } from '@lib/constants/enum';
import { getUsersThunk } from '@redux/feature/user/userThunk';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { message } from 'antd';
import { IUser } from '@redux/feature/user/UserState';

export const useUsersHook = (verified: boolean = true) => {
  const dispatch = useAppDispatch();
  const { users, status } = useAppSelector(state => state.user);

  const getUsers = async () => {
    try {
      await dispatch(getUsersThunk({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch users');
    }
  };
  useEffect(() => {
    if (status.users.fetch === Status.IDLE) {
      getUsers();
    }
  }, [status.users]);

  const userOptions = useMemo(() => {
    if (!users || users.length === 0) {
      return [];
    }
    return users
      .filter(i => i.isActive === verified)
      .map((user: IUser) => ({
        label: user.name,
        value: user.usersId,
      }));
  }, [users, verified]);

  return {
    userOptions,
    isLoading: status.users.fetch === Status.PENDING,
    error: status.users.fetch === Status.ERROR,
  };
};
