import { Status } from '@lib/constants/enum';
import { fetchAllUserGroup } from '@redux/feature/userGroup/userGroupThunk';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { userGroup } from '@redux/feature/userGroup/IUserGroupState';
import { message } from 'antd';

export const useUserGroupHook = (type: boolean = true) => {
  const dispatch = useAppDispatch();
  const { userGroups, status } = useAppSelector(state => state.userGroup);

  const fetchUserGroupData = async () => {
    try {
      dispatch(fetchAllUserGroup()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch user groups');
    }
  };
  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchUserGroupData();
    }
  }, [status.fetch]);

  const userGroupOptions = useMemo(() => {
    return userGroups
      .filter(i => i.isActive === type)
      .map((group: userGroup) => ({
        label: group.name,
        value: group.userGroupId,
      }));
  }, [userGroups]);

  return {
    userGroupOptions,
    isLoading: status.fetch === Status.PENDING,
    error: status.fetch === Status.ERROR,
  };
};
