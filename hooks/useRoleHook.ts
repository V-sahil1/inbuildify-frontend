import { useEffect, useMemo, useState } from 'react';
import { Role } from '@redux/feature/admin/role/IRoleState';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchRole } from '@redux/feature/admin/role/roleThunk';
import { Status } from '@lib/constants/enum';

export const useRoleHook = () => {
  const dispatch = useAppDispatch();
  const { role, status } = useAppSelector(state => state.role);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && status !== Status.SUCCESS) {
      dispatch(fetchRole());
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized, status]);

  const roleOptions = useMemo(() => {
    return role.map((role: Role) => ({
      label: role.name,
      value: role.roleId
    }));
  }, [role]);

  return {
    roleOptions,
    isLoading: status === Status.PENDING,
    error: status === Status.ERROR ? 'Failed to load roles' : null
  };
};