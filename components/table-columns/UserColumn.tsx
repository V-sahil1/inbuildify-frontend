import { exportToExcel } from '@lib/utils/exportToExcel';
import {
  IconKey,
  IconLock,
  IconLockOpen2,
  IconPencil,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react';
import { userData } from 'data/userData';
import { useState } from 'react';
import TooltipButton from '../common/TooltipButton';

export const UserColumn = (setModalOpen, setSelectedUser, setDrawerOpen, selectedUser) => {
  const [users, setUserData] = useState(userData);

  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address1',
      key: 'address1',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      render: (_, record) => {
        return (
          <div className="flex justify-between">
            <TooltipButton
              type="text"
              title="Edit"
              icon={<IconPencil size={15} />}
              onClick={() => {
                setDrawerOpen('create');
                setSelectedUser(record);
              }}
            />

            <TooltipButton
              title="Reset Password"
              type="text"
              icon={<IconKey size={15} />}
              onClick={() => {
                setModalOpen('resetPassword');
                setSelectedUser(record);
              }}
            />

            <TooltipButton
              title={record.lock ? 'UnLock User' : 'Lock User'}
              type="text"
              icon={record.lock ? <IconLock size={15} /> : <IconLockOpen2 size={15} />}
              onClick={() => {
                setModalOpen('lockUser');
                setSelectedUser(record);
              }}
            />

            <TooltipButton
              title={record.status === 'Active' ? 'Inactivate User' : 'Activate User'}
              type="text"
              icon={
                record.status === 'Active' ? (
                  <IconUserCheck size={15} />
                ) : (
                  <IconUserPlus size={15} />
                )
              }
              onClick={() => {
                setModalOpen('changeStatusUser');
                setSelectedUser(record);
              }}
            />
          </div>
        );
      },
    },
  ];
  function handleSubmit(values) {
    selectedUser
      ? setUserData(prev =>
          prev.map(i => (i.loginId === selectedUser.loginId ? { ...i, ...values } : i))
        )
      : setUserData(prev => [...prev, { ...values, status: 'Active' }]);
    setDrawerOpen(null);
    setModalOpen(null);
    setSelectedUser(null);
  }

  function handleClose() {
    setDrawerOpen(null);
    setModalOpen(null);
    setSelectedUser(null);
  }

  const handleExport = data => {
    const column = {
      name: 'Name',
      loginId: 'Login Id',
      email: 'Email',
      phone: 'Phone',
      initials: 'Initials',
      builders: 'Builders',
      role: 'Role',
      reportingTo: 'Reporting To',
      joiningDate: 'Joining Date',
      dob: 'Date Of Birth',
      designation: 'Designation',
      secondaryPhone: 'Secondary Phone',
      remarks: 'Remarks',
      consultant_bio: 'Consultant Bio',
      image: 'Photo',
      signature: 'Signature',
      address1: 'Address1',
      status: 'Status',
      lock: 'Lock',
      country: 'Country',
      state: 'State',
      address2: 'Address2',
      city: 'City',
      zipcode: 'Zip Code',
    };
    exportToExcel({
      data,
      fileName: 'UserList',
      sheetName: 'UserList',
      columnHeaders: column,
    });
  };

  return { column, users, userSubmit: handleSubmit, handleExport, handleClose };
};
