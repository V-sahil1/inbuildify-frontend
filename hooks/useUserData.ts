import { Status } from "@lib/constants/enum";
import { getUsersThunk } from "@redux/feature/user/userThunk";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";

export const useUsersHook = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.user?.users || []);
  const status = useAppSelector((state) => state.user?.status?.users || Status.IDLE);

  const isLoading = status === Status.PENDING;
  const isError = status === Status.ERROR;
  const isSuccess = status === Status.SUCCESS;

  useEffect(() => {
    if (status === Status.IDLE) {
        dispatch(getUsersThunk())
          .unwrap()
          .catch((err) => {
            setError(err);
          });
      
    }
  }, [status, dispatch]);

  return {
    users,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};
