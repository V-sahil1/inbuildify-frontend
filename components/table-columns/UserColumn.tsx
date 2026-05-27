import {
  IconKey,
  IconLock,
  IconLockOpen2,
  IconPencil,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react';
import TooltipButton from '../common/TooltipButton';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createUserThunk,
  resetUserPasswordThunk,
  updateUserLockThunk,
  updateUserLoginIdThunk,
  updateUserStatusThunk,
  updateUserThunk,
} from '@redux/feature/user/userThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const UserColumn = (
  setModalOpen,
  setSelectedUser,
  setDrawerOpen,
  selectedUser,
  currentUserRoleId?: string
) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => {
        return record.address.addressLine1;
      },
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
      dataIndex: 'roleName',
      key: 'roleName',
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
                setDrawerOpen('resetPassword');
                setSelectedUser(record);
              }}
            />

            <TooltipButton
              title={record.isLocked ? 'UnLock User' : 'Lock User'}
              type="text"
              icon={record.isLocked ? <IconLock size={15} /> : <IconLockOpen2 size={15} />}
              onClick={() => {
                setModalOpen('lockUser');
                setSelectedUser(record);
              }}
            />

            <TooltipButton
              title={record.isActive ? 'Inactivate User' : 'Activate User'}
              type="text"
              icon={record.isActive ? <IconUserCheck size={15} /> : <IconUserPlus size={15} />}
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
  async function handleSubmit(values) {
    try {
      const { photo, signature } = values;
      let photoFile = photo || null;
      let signatureFile = signature || null;
      if (photo && photo.length > 0) {
        photoFile = photo[0].originFileObj || photoFile;
      }
      if (signature && signature.length > 0) {
        signatureFile = signature[0].originFileObj || signatureFile;
      }

      if (selectedUser) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, selectedUser);
        if (!isUpdated) {
          setDrawerOpen(null);
          setModalOpen(null);
          setSelectedUser(null);
          return;
        }
        const formData = formDataGenerator({
          ...updatedFields,
          photo: photoFile,
          signature: signatureFile,
        });
        await dispatch(updateUserThunk({ data: formData, id: selectedUser.usersId })).unwrap();
        message.success('User updated sucessfully');
      } else {
        const createPayload = {
          ...values,
          photo: photoFile,
          signature: signatureFile,
          companyId: user?.companyId
        };
        if (!createPayload.roleId && currentUserRoleId) {
          createPayload.roleId = currentUserRoleId;
        }
        const formData = formDataGenerator(createPayload);
        await dispatch(createUserThunk(formData)).unwrap();
        message.success('User created sucessfully');
      }
      setDrawerOpen(null);
      setModalOpen(null);
      setSelectedUser(null);
    } catch (error) {
      message.error(error || 'Failed to save user');
    }
  }

  async function handleLock() {
    try {
      await dispatch(updateUserLockThunk({ id: selectedUser.usersId, type: 'user' })).unwrap();
      message.success('User locked/unlocked sucessfully');
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to lock/unlock user');
    }
  }

  async function handleStatus() {
    try {
      await dispatch(updateUserStatusThunk(selectedUser.usersId)).unwrap();
      message.success('User updated sucessfully');
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to update user');
    }
  }

  async function handleLoginId(values) {
    try {
      await dispatch(
        updateUserLoginIdThunk({ data: values, id: selectedUser.usersId, type: 'user' })
      ).unwrap();
      message.success('User login id updated sucessfully');
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to update user login id');
    }
  }

  async function handleResetPassword(values) {
    try {
      await dispatch(
        resetUserPasswordThunk({ data: values, id: selectedUser.usersId, type: 'user' })
      ).unwrap();
      message.success('User password updated sucessfully');
      setDrawerOpen(null);
    } catch (error) {
      message.error(error || 'Failed to update user password');
    }
  }
  return {
    column,
    userSubmit: handleSubmit,
    handleLock,
    handleStatus,
    handleLoginId,
    handleResetPassword,
  };
};
