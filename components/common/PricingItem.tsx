import { enumToReadable } from "@lib/utils/enumToRedable";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Tag, Tooltip } from "antd";

interface PricingItemProps {
  item: any;
  handleClick: (action: string, categoryItem: string) => void;
}

export const PricingItem = ({ item, handleClick }: PricingItemProps) => {
  return (
    <div
      key={item.categoryItemId}
      className="flex items-center gap-4 p-4 border border-border-color rounded-lg hover:border-gray-300 bg-gray-50 text-font-color"
    >
      <div className="flex-1  items-center justify-between">
        <div className="mb-2 font-medium flex gap-10 text-[16px] break-all">
          <Tooltip title={item?.shortDescription || item?.description}> <p className="line-clamp-2"> {item?.shortDescription || item?.description} </p></Tooltip>
        </div>
        <div className="flex gap-3">
          {item?.costType && (
            <Tag color="yellow" className="text-[10px]">
              <p>{item?.costType}</p>
            </Tag>
          )}
          {item?.dwellingTypeName && item?.dwellingTypeName !== "NONE" && (
            <Tag color="blue" className="text-[10px]">
              <p>{enumToReadable(item?.dwellingTypeName).toUpperCase()}</p>
            </Tag>
          )}
          {item?.costOption && item?.costOption !== "NONE" && (
            <Tag color="red" className="text-[10px]">
              <p>{enumToReadable(item?.costOption).toUpperCase()}</p>
            </Tag>
          )}
          {item?.status && item?.status !== "NONE" && (
            <Tag color="purple" className="text-[10px]">
              <p>{enumToReadable(item?.status).toUpperCase()}</p>
            </Tag>
          )}
          {item.showInHlPackage &&
            item?.rangeName &&
            item?.rangeName !== "NONE" && (
              <Tag color="orange" className="text-[10px]">
                <p>{enumToReadable(item?.rangeName).toUpperCase()}</p>
              </Tag>
            )}
        </div>
      </div>

      <div className="flex gap-4">
        <button className="rounded-md p-1 group" onClick={() => handleClick("edit", item)}>
          <IconEdit
            size={20}
            className="text-font-color group-hover:text-blue"
          />
        </button>
        <button className="rounded-md p-1 group" onClick={() => handleClick("delete", item)}>
          <IconTrash
            size={20}
            className="text-font-color group-hover:text-red-500"
          />
        </button>
      </div>
    </div>
  );
};
