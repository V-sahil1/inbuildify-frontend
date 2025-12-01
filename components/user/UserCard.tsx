import {
  IconKey,
  IconLock,
  IconLockOpen2,
  IconMail,
  IconPencil,
  IconPhone,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react';
import TooltipButton from '../common/TooltipButtton';

export const UserCard = ({ user, setModalOpen, setSelectedUser, setDrawerOpen }) => {
  return (
    <div className="bg-card-color rounded-2xl hover:shadow-lg transition-all p-4">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Left: contact details */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="font-semibold text-base">{user.name || 'N/A'}</div>

          <div className=" font-medium text-sm">
            {user.role || 'No address provided'}
          </div>

          <div className="flex items-center gap-2   font-medium text-sm">
            <IconPhone size={18} />
            <span>{user.phone || 'No phone available'}</span>
          </div>

          <div className="flex items-center gap-2  text-sm">
            <IconMail size={18} />
            <span>{user.email || 'No email available'}</span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-col items-end gap-1">
          <TooltipButton
            title="Edit"
            icon={<IconPencil size={18} />}
            onClick={() => {
              setDrawerOpen('create');
              setSelectedUser(user);
            }}
            type="text"
          />

          <TooltipButton
            title="Reset Password"
            icon={<IconKey size={18} />}
            type="text"
            onClick={() => {
              setSelectedUser(user);
              setModalOpen('resetPassword');
            }}
          />

          <TooltipButton
            title={user.lock ? 'UnLock User' : 'Lock User'}
            icon={user.lock ? <IconLock size={18} /> : <IconLockOpen2 size={18} />}
            onClick={() => {
              setSelectedUser(user);
              setModalOpen('lockUser');
            }}
            type="text"
          />

          <TooltipButton
            title={user.status === 'Active' ? 'Inactivate User' : 'Activate User'}
            icon={
              user.status === 'Active' ? <IconUserCheck size={15} /> : <IconUserPlus size={15} />
            }
            onClick={() => {
              setSelectedUser(user);
              setModalOpen('changeStatusUser');
            }}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};
