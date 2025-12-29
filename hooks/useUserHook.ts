import { Status } from '@lib/constants/enum';
import { getUsersThunk } from '@redux/feature/user/userThunk';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { user } from '@redux/feature/user/UserState';

export const useUsersHook = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const users = useAppSelector(state => state.user?.users || []);
  const status = useAppSelector(state => state.user?.status?.users || Status.IDLE); 
  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getUsersThunk())
        .unwrap()
        .catch(err => {
          setError(err);
        });
    }
  }, [status, dispatch]);

 const userOptions = useMemo(() => {
     return users.map((role: user) => ({
       label: role.name,
       value: role.usersId
     }));
   }, [users]);

  return {
    userOptions,
    isLoading: status === Status.PENDING,   
    error:status === Status.ERROR,
  };
};
