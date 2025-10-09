import { useAppDispatch, useAppSelector } from "@hooks/redux";
import CustomSelect from "./CustomSelect";
import { useEffect, useState } from "react";
import { message } from "antd";
import { getUsersThunk } from "@redux/feature/user/userThunk";
interface AssigneeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
}

const AssigneeSelect: React.FC<AssigneeSelectProps> = ({
  value,
  onChange,
  width,
}) => {
  const { user } = useAppSelector((state) => state?.auth);
  const { users, status } = useAppSelector((state) => state?.user);
  const [Users, setUsers] = useState(users || null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await dispatch(getUsersThunk()).unwrap();
        setUsers(Users);
      } catch (error) {
        message.error(error);
      }
    }
      fetchUsers();
  }, [dispatch, status]);

  const assigneeOptions = Users.reduce((acc, u) => {
    if (u.email !== user?.email) {
      acc.push({ label: u?.name, value: u?.usersId, role: u?.role });
    }
    return acc;
  }, [] as { label: string; value: string; role?: string[] }[]);
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={assigneeOptions}
      placeholder="Assignee"
      width={width}
    />
  );
};

export default AssigneeSelect;
