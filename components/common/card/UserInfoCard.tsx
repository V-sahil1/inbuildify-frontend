import {
  IconArrowsDiagonal,
  IconMail,
  IconPhone,
  IconUserCheck,
} from "@tabler/icons-react";
import { Button } from "antd";

export const UserInfoCard = ({
  initialValues,
  showUserIcon = true,
  showExpandIcon = true,
}: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center p-4">
      <div className="col-span-1">
        <h3 className="font-semibold text-[16px]">{initialValues?.name}</h3>
        <p className="text-gray-600 text-sm">{initialValues?.address}</p>
      </div>

      <div className="col-span-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <IconPhone size={16} className="text-gray-500" />
            <span className="text-sm">{initialValues?.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconMail size={16} className="text-gray-500" />
            <span className="text-sm">{initialValues?.email}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col  col-span-1 items-end gap-2">
        {showUserIcon && (
          <Button
            type="text"
            icon={<IconUserCheck size={18} />}
            className="text-blue-600 hover:text-blue-800"
          />
        )}
        {showExpandIcon && (
          <Button
            type="text"
            icon={<IconArrowsDiagonal size={18} />}
            className="text-blue-600 hover:text-blue-800"
          />
        )}
      </div>
    </div>
  );
};
