import { IconLink, IconLocationShare, IconMail, IconShare3 } from '@tabler/icons-react';
import { Tag } from 'antd';

const ConstructionActivityCard = ({ activity }) => {
  return (
    <div className="flex gap-6 items-start m-2 ">
      <div>
        <div>{activity.date}</div>
        <div className="text-xs text-font-color-100 text-right">{activity.time}</div>
      </div>
      <div className="rounded-full w-[20px] h-[20px] flex items-center justify-center bg-primary text-white z-10">
        <IconMail size={15} />
      </div>
      <div className="flex  justify-between bg-body-color p-3 w-full">
        <div className="">
          <div>{activity.title}</div>
          <div>{activity.address}</div>
          <div className="flex gap-1 items-center text-blue">
            Murthy
            <IconLocationShare size={15} />
          </div>
        </div>
        <div className="flex gap-1">
          {activity.email}
          <div>
            <Tag color="green">{activity.status}</Tag>
          </div>
        </div>
        <div className="flex items-start gap-1">
          {' '}
          {activity.isAttachment && <IconLink className="text-blue" size={15} />}{' '}
          <IconShare3 size={15} />
        </div>
      </div>
    </div>
  );
};
export default ConstructionActivityCard;
