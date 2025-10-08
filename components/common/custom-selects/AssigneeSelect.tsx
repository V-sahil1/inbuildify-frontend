import { useAppDispatch, useAppSelector } from '@hooks/redux';
import CustomSelect from './CustomSelect';
import { useEffect } from 'react';
import { message } from 'antd';
import { getUsersThunk } from '@redux/feature/user/userThunk';
import { Status } from '@lib/constants/enum';

interface AssigneeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  width?: number | string;
}

const AssigneeSelect: React.FC<AssigneeSelectProps> = ({ 
  value, 
  onChange,
  width = 120 
}) => {
      const { user } = useAppSelector((state) => state?.auth);
      const { users, status } = useAppSelector((state) => state?.user);
      const dispatch = useAppDispatch();
      useEffect(()=>{
        async function fetchUsers(){
          try{
            await dispatch(getUsersThunk()).unwrap();
          }
          catch(error){
            message.error(error)
          }
        }
        if(status.users === Status.IDLE){
          fetchUsers();
        }
      },[dispatch,status])

      const assigneeOptions = users.reduce((acc, u) => {
    if (u.email !== user?.email) {
      acc.push({ label: u?.name, value: u?.usersId });
    }
    return acc;
  }, [] as { label: string; value: string }[]);
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