import { enumToReadable } from "@lib/utils/enumToRedable";
import {
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { Tag } from "antd";
export const PricingItem = ({ item }: any) => {
  return    (
    <div
      key={item.categoryItemId}
      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 bg-card-color text-font-color"
    >
      <div className="flex-1  items-center justify-between">
        <div className="mb-2 font-medium flex gap-10 text-[16px]">
          {item?.shortDescription || item?.description}
        </div>
        <div className="flex gap-3">
          {item?.costType && (
            <Tag color="yellow">
              <p>{item?.costType}</p>
            </Tag>
          )}
          {item?.dwellingTypeName && item?.dwellingTypeName !== "NONE" && (
            <Tag color="blue">
              <p>{enumToReadable(item?.dwellingTypeName).toUpperCase()}</p>
            </Tag>
          )}
          {item?.costOption && item?.costOption !== "NONE" &&(
            <Tag color="red">
              <p>{enumToReadable(item?.costOption).toUpperCase()}</p>
            </Tag>
          )}
          {item?.status && item?.status !== "NONE" && (
            <Tag color="purple">
              <p>{enumToReadable(item?.status).toUpperCase()}</p>
            </Tag>
          )}
          {item?.rangeName && item?.rangeName !== "NONE" &&(
            <Tag color="orange">
                <p>{enumToReadable(item?.rangeName).toUpperCase()}</p>
            </Tag>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button className="rounded-md p-1 group">
          <IconEdit
            size={20}
            className="text-font-color group-hover:text-blue"
          />
        </button>
        <button className="rounded-md p-1 group">
          <IconTrash
            size={20}
            className="text-font-color group-hover:text-red-500"
          />
        </button>
      </div>
    </div>
  );
};
