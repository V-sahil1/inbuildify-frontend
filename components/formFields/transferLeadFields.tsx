import { Status } from '@lib/constants/enum';
import { CreateFormField } from '@/components/common/Models/CreateFormModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { getUsersThunk } from '@redux/feature/user/userThunk';
import NoDataMessage from '../common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import { optionalNotesRule } from '@lib/constants/formInputValidations';

export type ContractorFormField = Omit<CreateFormField, 'type'> & {
  type?: 'email' | 'phone' | 'select' | 'textarea';
};

const useTransferLeadFields = (): readonly ContractorFormField[] => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state?.auth);
  const { users, status } = useAppSelector(state => state?.user);
  const [isLoading, setIsLoading] = useState(false);
  const fetchUsers = useCallback(async () => {
    if (isLoading || status.users.fetch !== Status.IDLE) return;
    setIsLoading(true);
    try {
      await dispatch(getUsersThunk({})).unwrap();
    } catch {
      message.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, isLoading, status.users]);

  useEffect(() => {
    fetchUsers();
  }, [status.users]);

  const assigneeOptions = users.reduce(
    (acc, u) => {
      if (u.email !== user?.email) {
        acc.push({ label: u?.name, value: u?.usersId });
      }
      return acc;
    },
    [] as { label: string; value: string }[]
  );

  return [
    {
      label: 'Assignee',
      name: 'assignee_id',
      type: 'select',
      options: assigneeOptions,
      placeholder: 'Select assignee',
      notFoundContent: <NoDataMessage label="user" link={SystemRoutes.USERS} />,
      rules: [
        {
          required: true,
          message: 'Please select assignee',
        },
      ],
    },
    {
      label: 'Notes',
      name: 'notes',
      type: 'textarea',
      placeholder: 'Enter notes',
      rules: optionalNotesRule,
    },
  ] as const;
};

export default useTransferLeadFields;
