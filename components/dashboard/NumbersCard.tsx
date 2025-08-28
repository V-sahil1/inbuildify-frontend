import { IconUserScan } from "@tabler/icons-react";
import React from "react";

const NumbersCard = ({item}: {item: {title: string, count: number, description: string,icon: React.ReactNode}}) => {
  return (
    <>
      <div className="md:p-6 p-4">
        <div className="flex items-center justify-between gap-5 mb-2">
          <p>{item.title}</p>
          {item.icon}
        </div>
        <div className="flex items-end gap-1 mb-1">
          <span className="inline-block text-[24px]/[30px] font-medium">
            {item.count}
          </span>
        </div>
        {/* <div className="text-font-color-100 text-[14px]/[20px]">
          {item.description}
        </div> */}
      </div>
      <div className="progress mt-auto overflow-hidden h-[4px] bg-border-color rounded-full">
        <div className="progress-bar w-[85%] bg-secondary h-full"></div>
      </div>
    </>
  );
};

export default NumbersCard;
