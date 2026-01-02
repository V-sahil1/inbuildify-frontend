import { useEffect, useMemo, useState } from 'react';
import { Role } from '@redux/feature/admin/role/IRoleState';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchRole } from '@redux/feature/admin/role/roleThunk';
import { Status } from '@lib/constants/enum';

export const useRoleHook = () => {
  const dispatch = useAppDispatch();
  const { role, status } = useAppSelector(state => state.role);

  async function fetchRoles() {
    try {
      await dispatch(fetchRole()).unwrap();
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }
  useEffect(() => {
    if (status === Status.IDLE) {
      fetchRoles();
    }
  }, [status]);

  const roleOptions = useMemo(() => {
    if (!role || !Array.isArray(role)) return [];
    return role.map((roleItem: Role) => ({
      label: roleItem.name,
      value: roleItem.roleId,
    }));
  }, [role]);

  return {
    roleOptions,
    isLoading: status === Status.PENDING,
    error: status === Status.ERROR ? 'Failed to load roles' : null,
  };
};
