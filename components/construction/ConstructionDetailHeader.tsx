import { IconBell, IconDots, IconInfoSmall, IconMail, IconPhone } from '@tabler/icons-react';
import { Button, Popover, Tag } from 'antd';
import ETSdrawer from './ETSdrawer';
import { useState } from 'react';

const data = {
  name: 'Murthy Test',
  address: 'Lot 678,23232,VIC,2323',
  phone: '123456787',
  email: 'abc@gmail.com',
};
const ConstructionDetailHeader = () => {
  const [etsDrawerOpen, setETSDrawerOpen] = useState(false);
  const popOverContent = (
    <div className="p-3">
      <p className="my-2">{data.name}</p>
      <p className="my-2">{data.address}</p>
      <p className="flex gap-1 my-2">
        <IconPhone size={15} />
        {data.phone}
      </p>
      <p className="flex gap-1 my-2">
        <IconMail size={15} />
        {data.email}
      </p>
    </div>
  );
  return (
    <>
      <div className="flex justify-between text-sm m-3 w-full">
        <div className="border-l-2 pl-2 cursor-pointer">
          <Popover content={popOverContent}>
            <div className="text-base font-semibold text-blue">{data.name}</div>
            <div>{data.address}</div>
          </Popover>
        </div>
        {/* <div className=" border-l-2 pl-2">
                    <div>156 days</div>
                    <div className="mt-1"><Tag color="blue" className="flex items-center ">Estimated<IconInfoSmall /></Tag></div>
                </div> */}
        <div className="border-l-2 pl-2 cursor-pointer" onClick={() => setETSDrawerOpen(true)}>
          <div className="text-blue">0.00%</div>
          <div className="mt-1">
            <Tag color="red">ETS</Tag>
          </div>
        </div>
        <div className="flex pl-2 gap-2 ">
          <Button className="text-xs">
            {' '}
            Defect <div className="rounded-full w-4 h-4 bg-primary text-white">2</div>
          </Button>
          {/* <Button size="small" className="text-xs">Show Date</Button> */}
          <Button className="text-xs">View Job</Button>
          <Button icon={<IconBell size={15} />} />
          <Button icon={<IconDots size={15} />} />
        </div>
      </div>
      <ETSdrawer title="ETS" open={etsDrawerOpen} onCancel={() => setETSDrawerOpen(false)} />
    </>
  );
};
export default ConstructionDetailHeader;
