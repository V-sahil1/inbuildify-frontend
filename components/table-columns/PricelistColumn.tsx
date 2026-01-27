import { Input, message, Popconfirm, Select, Tag } from 'antd';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconCopy, IconPlus, IconRotate, IconTrash } from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import { updateCategoryItem } from '@redux/feature/masterPriceList/masterPriceListThunk';
import TooltipButton from '../common/TooltipButton';

export const PricelistColumn = (
  filters,
  setParams,
  setDrawerOpen,
  setModalOpen,
  setSelectedPricelist,
  selectedPricelist
) => {
  const dispatch = useAppDispatch();
  const columns = [
    {
      title: (
        <>
          <span>Item Description</span>
          <Input
            value={filters?.description}
            onChange={e => setParams({ description: e.target.value })}
          />
        </>
      ),
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      render: (_, record) => (
        <>
          <span>{record.itemDescription}</span>
          <div className="flex gap-2 items-center">
            {record.priceList && <Tag color="purple">{record.priceList.name}</Tag>}
            {record.builderCost && <Tag color="blue">Buider Cost ${record.builderCost}</Tag>}
            {record.uom && <Tag color="orange">{record.uom}</Tag>}
            {record.costType && <Tag color="orange">{record.costType}</Tag>}
          </div>
        </>
      ),
    },
    {
      title: (
        <>
          <span>Price</span>
          <Input
            type="number"
            value={filters?.price}
            onChange={e => setParams({ price: e.target.value })}
          />
        </>
      ),
      dataIndex: 'cost',
      key: 'cost',
      render: cost => cost && <span>${cost}</span>,
    },
    {
      title: (
        <>
          <span>Cost Option</span>
          <Select
            value={filters?.costOption}
            onChange={value => setParams({ costOption: value })}
            className="w-full"
            options={[
              { label: 'All', value: 'none' },
              { label: 'TBA', value: 'tba' },
              { label: 'TBC', value: 'tbc' },
            ]}
          />
        </>
      ),
      dataIndex: 'costOption',
      key: 'costOption',
      render: (_, record) => (
        <div className="flex gap-2">
          {record.costType && <Tag color="gray">{record.costType}</Tag>}
          {record.costType !== 'Included' && record.costOption && (
            <Tag color="orange">{record.costOption}</Tag>
          )}
        </div>
      ),
    },
    {
      title: (
        <>
          <span>Sort Order</span>
          <Input
            type="number"
            value={filters?.sort}
            onChange={e => setParams({ sort: e.target.value })}
          />
        </>
      ),
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: (
        <>
          <span>Status</span>
          <StatusSelect
            activeInactive={true}
            value={filters?.status}
            onChange={value => setParams({ status: value })}
          />
        </>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <span>{record.status}</span>
          <div className="flex">
            <TooltipButton
              title="Copy"
              type="text"
              icon={<IconCopy size={15} />}
              onClick={e => {
                e.stopPropagation();
                setSelectedPricelist(record);
                setModalOpen('Itemcopy');
              }}
            />

            {record.status === 'active' ? (
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
                  icon={<IconTrash color="red" size={15} />}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedPricelist(record);
                  }}
                />
              </Popconfirm>
            ) : (
              <TooltipButton
                title="Active"
                type="text"
                icon={<IconPlus size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setModalOpen('activePricelist');
                  setSelectedPricelist(record);
                }}
              />
            )}
            <TooltipButton
              title="Quotation History"
              type="text"
              icon={<IconRotate size={15} />}
              onClick={e => {
                e.stopPropagation();
                setDrawerOpen('quotation');
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  async function handleActivateItem() {
    try {
      await dispatch(
        updateCategoryItem({
          payload: { status: selectedPricelist?.status === 'active' ? 'inactive' : 'active' },
          id: selectedPricelist?.priceListItemId,
        })
      ).unwrap();
      message.success('Pricelist status updated successfully');
      setSelectedPricelist(null);
    } catch (error) {
      message.error(error || 'Failed to update pricelist status ');
    }
  }
  //copy pricelist item
  function handleSubmit(values) {
    setDrawerOpen(null);
  }
  return {
    columns,
    handlePricelistSubmit: handleSubmit,
    handleActivateItem,
  };
};
