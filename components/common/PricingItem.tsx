import { enumToReadable } from '@lib/utils/enumToRedable';
import { IconCopy, IconEdit, IconPlus, IconRotate, IconTrash } from '@tabler/icons-react';
import { Popconfirm, Tag, Tooltip } from 'antd';
import TooltipButton from './TooltipButton';
import { IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';

interface PricingItemProps {
  item: any;
  handleClick?: (action: string, categoryItem: string) => void;
  setSelectedPricelist?: (pricelist: IPriceListItem) => void;
  setModalOpen?: (
    open:
      | 'copy'
      | 'create'
      | 'edit'
      | 'Itemcopy'
      | 'ItemCreate'
      | 'activePricelist'
      | 'import'
      | 'createLocation'
  ) => void;
  setDrawerOpen?: (
    open: 'create' | 'quotation' | 'copy' | 'location' | 'master' | 'edit' | null
  ) => void;
  handleActivateItem?: () => void;
  handleFetchItemCondition?: (item: IPriceListItem) => void;
  isEditable?: boolean;
}

export const PricingItem = ({
  item,
  handleClick,
  setSelectedPricelist,
  setModalOpen,
  setDrawerOpen,
  handleActivateItem,
  handleFetchItemCondition,
  isEditable = true,
}: PricingItemProps) => {
  return (
    <div
      key={item.categoryItemId}
      className="flex items-center gap-4 p-4 border border-border-color rounded-lg hover:border-gray-300 bg-card-color text-font-color"
    >
      <div className="flex-1  items-center justify-between">
        <div className="mb-2  flex gap-10 text-[18px] break-all">
          <p className="line-clamp-2 font-bold"> {item?.name} </p>
        </div>
        <div className="mb-2 font-medium flex gap-10 text-[16px] break-all">
          <Tooltip title={item?.itemDescription ?? item?.shortDescription}>
            <p className="line-clamp-2"> {item?.itemDescription ?? item?.shortDescription} </p>
          </Tooltip>
        </div>
        {item?.timespent && <p>Time spent: {item?.timespent} days</p>}
        <div className="flex gap-3">
          {item?.costType && (
            <Tag color="yellow" className="text-[10px]">
              <p>{item?.costType}</p>
            </Tag>
          )}
          {item?.dwellingType &&
            item?.dwellingType?.length > 0 &&
            item?.dwellingType?.map(i => (
              <Tag color="blue" className="text-[10px]">
                {i.name}
              </Tag>
            ))}
          {item?.costOption && item?.costOption !== 'NONE' && (
            <Tag color="red" className="text-[10px]">
              <p>{enumToReadable(item?.costOption).toUpperCase()}</p>
            </Tag>
          )}
          {item?.status && item?.status !== 'NONE' && (
            <Tag color="purple" className="text-[10px]">
              <p>{enumToReadable(item?.status).toUpperCase()}</p>
            </Tag>
          )}
          {item?.range &&
            item?.range?.length > 0 &&
            item?.range?.map(i => (
              <Tag color="orange" className="text-[10px]">
                {i.name}
              </Tag>
            ))}
        </div>
      </div>

      {isEditable && (
        <div className="flex gap-4">
          <TooltipButton
            title="Copy"
            type="text"
            icon={<IconCopy size={18} />}
            onClick={e => {
              e.stopPropagation();
              setSelectedPricelist(item);
              setModalOpen('Itemcopy');
            }}
          />
          <TooltipButton
            title="Edit"
            type="text"
            icon={<IconEdit size={18} />}
            onClick={e => {
              e.stopPropagation();
              setModalOpen('ItemCreate');
              setSelectedPricelist(item);
              handleFetchItemCondition(item);
            }}
          />
          {item.status === 'active' ? (
            <Popconfirm
              title="Do you want to InActivate pricelist item?"
              okText="InActive"
              onCancel={e => e.stopPropagation()}
              onConfirm={e => {
                e.stopPropagation();
                handleActivateItem();
              }}
              placement="topRight"
            >
              <TooltipButton
                title="InActive"
                type="text"
                icon={<IconTrash color="red" size={18} />}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedPricelist(item);
                }}
              />
            </Popconfirm>
          ) : (
            <TooltipButton
              title="Active"
              type="text"
              icon={<IconPlus size={18} />}
              onClick={e => {
                e.stopPropagation();
                setModalOpen('activePricelist');
                setSelectedPricelist(item);
              }}
            />
          )}
          <TooltipButton
            title="Quotation History"
            type="text"
            icon={<IconRotate size={18} />}
            onClick={e => {
              e.stopPropagation();
              setDrawerOpen('quotation');
            }}
          />
        </div>
      )}
    </div>
  );
};
