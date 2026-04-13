import { IconMail, IconPhone } from '@tabler/icons-react';

interface UserContentProps {
  name?: string;
  address?: string;
  phone?: string | null;
  email?: string | null;
}

export const UserContent = ({ name, address, phone, email }: UserContentProps) => {
  return (
    <div className="space-y-2">
      {name && <p>{name}</p>}
      {address && <p>{address}</p>}
      {phone && (
        <p className="flex items-center gap-1">
          <IconPhone size={15} />
          {phone}
        </p>
      )}
      {email && (
        <p className="flex items-center gap-1">
          <IconMail size={15} />
          {email}
        </p>
      )}
    </div>
  );
};
