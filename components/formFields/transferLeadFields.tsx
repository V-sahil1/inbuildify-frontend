import { Status } from "@lib/constants/enum";
import { CreateFormField } from "@/components/common/Models/CreateFormModel";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { useEffect } from "react";
import { message } from "antd";
import { getUsersThunk } from "@redux/feature/user/userThunk";
import NoDataMessage from "../common/NoDataMessage";
import SystemRoutes from "@lib/constants/Routes";
import { optionalNotesRule } from "@lib/constants/formInputValidations";

export type ContractorFormField = Omit<CreateFormField, "type"> & {
  type?: "email" | "phone" | "select" | "textarea";
};

const useTransferLeadFields = (): readonly ContractorFormField[] => {
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.auth.user);
  const { users, status } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(getUsersThunk()).unwrap();
      } catch {
        message.error("Failed to fetch users");
      }
    };

    if (status === Status.IDLE) {
      fetchUsers();
    }
  }, [dispatch, status]);

  const assigneeOptions = users.reduce((acc, user) => {
    if (user.email !== email) {
      acc.push({ label: user.name, value: user.usersId });
    }
    return acc;
  }, [] as { label: string; value: string }[]);

  return [
    {
      label: "Assignee",
      name: "assignee_id",
      type: "select",
      options: assigneeOptions,
      placeholder: "Select assignee",
      notFoundContent: <NoDataMessage label="user" link={SystemRoutes.USERS} />,
      rules: [
        {
          required: true,
          message: "Please select assignee",
        },
      ],
    },
    {
      label: "Notes",
      name: "notes",
      type: "textarea",
      placeholder: "Enter notes",
      rules: optionalNotesRule,
    },
  ] as const;
};

export default useTransferLeadFields;
