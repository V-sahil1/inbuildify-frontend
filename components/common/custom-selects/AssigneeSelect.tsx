import { useAppDispatch, useAppSelector } from "@hooks/redux";
import CustomSelect from "./CustomSelect";
import { useEffect, useState } from "react";
import { message } from "antd";
import { getUsersThunk } from "@redux/feature/user/userThunk";
import { user } from "@redux/feature/user/UserState";
import { CustomSelectOption, CustomSelectProps } from "types/common.types";

const AssigneeSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  width,
}) => {
  const { user } = useAppSelector((state) => state?.auth);
  const [users, setUsers] = useState<user[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(getUsersThunk()).unwrap();
        setUsers(response.data || []);
      } catch (error) {
        message.error(error instanceof Error ? error.message : "Failed to fetch users");
      }
    };

    fetchUsers();
  }, [dispatch]);

  const assigneeOptions = users.reduce((acc, u) => {
    if (u.email !== user?.email) {
      acc.push({ 
        label: u?.name || 'Unnamed User', 
        value: u?.usersId || '',
        role: u?.role 
      });
    }
    return acc;
  }, [] as CustomSelectOption[]);

  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={assigneeOptions}
      placeholder="Assignee"
      width={width}
      showSearch
      optionFilterProp="label"
      filterOption={(input, option) =>
        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export default AssigneeSelect;