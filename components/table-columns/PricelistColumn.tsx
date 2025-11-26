import { Button, Input, message, Popconfirm, Select, Tag, Tooltip } from 'antd';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconCopy, IconPlus, IconRotate, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@hooks/redux';
import { fetchCategoryItems } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { Item } from '@redux/feature/masterPriceList/iMasterPriceListState';

export const pricelistData = [
  {
    id: '1',
    category: 'Base Price',
    description: 'Base Price for single storey [units] sq',
    uom: 'Sq',
    price: 10000.0,
    costType: 'Fixed',
    costOption: 'TBA',
    sort: 12,
    status: 'Active',
    builderCost: 2453.0,
  },
  {
    id: '2',
    category: 'Bricks',
    description: 'Base Price for single storey [units] sq',
    uom: 'Sq',
    price: 9400.0,
    costType: 'Variable',
    sort: 2,
    status: 'InActive',
    builderCost: 2453.0,
  },
];
export const PricelistColumn = (
  filters,
  setParams,
  setDrawerOpen,
  setModalOpen,
  setSelectedPricelist,
  selectedPricelist,
  categories
) => {
  const [priceLists, setPriceLists] = useState<Item[]>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchAllCategoryItems = async () => {
      try {
        const responses = await Promise.all(
          categories.map(async cat => {
            return dispatch(
              fetchCategoryItems({
                categoryId: cat.categoryId,
              })
            ).unwrap();
          })
        );
        setPriceLists(responses.map(i => i.items).flat());
      } catch (error) {
        message.error(error || 'Failed to fetch category items');
      }
    };

    if (categories.length > 0) {
      fetchAllCategoryItems();
    }
  }, [categories.length]);

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
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => (
        <>
          <span>{record.description}</span>
          <div className="flex gap-2 items-center">
            {record.category && <Tag color="purple">{record.category}</Tag>}
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
      dataIndex: 'price',
      key: 'price',
      render: price => price && <span>${price}</span>,
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
              { label: 'All', value: 'all' },
              { label: 'TBA', value: 'TBA' },
              { label: 'TBC', value: 'TBC' },
            ]}
          />
        </>
      ),
      dataIndex: 'costOption',
      key: 'costOption',
      render: (_, record) => (
        <div className="flex gap-2">
          {record.costType && <Tag color="gray">{record.costType}</Tag>}
          {record.costOption && <Tag color="orange">{record.costOption}</Tag>}
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
      dataIndex: 'sort',
      key: 'sort',
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
            <Tooltip title="Copy">
              <Button
                className="text-blue"
                type="text"
                icon={<IconCopy size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedPricelist(record);
                  setModalOpen('Itemcopy');
                }}
              />
            </Tooltip>

            {record.status === 'ACTIVE' ? (
              <Popconfirm
                title="Do you want to InActivate pricelist item?"
                okText="InActive"
                onCancel={e => e.stopPropagation()}
                onConfirm={e => {
                  e.stopPropagation();
                  setPriceLists(prev =>
                    prev.map(i =>
                      i.categoryItemId === record.categoryItemId ? { ...i, status: 'INACTIVE' } : i
                    )
                  );
                }}
                placement="topRight"
              >
                <Tooltip title="InActive">
                  <Button
                    type="text"
                    icon={<IconTrash color="red" size={15} />}
                    onClick={e => e.stopPropagation()}
                  />
                </Tooltip>
              </Popconfirm>
            ) : (
              <Tooltip title="Active">
                <Button
                  type="text"
                  className="text-blue"
                  icon={<IconPlus size={15} />}
                  onClick={e => {
                    e.stopPropagation();
                    setModalOpen('activePricelist');
                    setSelectedPricelist(record);
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="Quotation History">
              {' '}
              <Button
                className="text-blue"
                type="text"
                icon={<IconRotate size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setDrawerOpen('quotation');
                }}
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  function handleSubmit(values) {
    selectedPricelist
      ? // copy pricelist
        setPriceLists(prev => [
          ...prev,
          {
            ...selectedPricelist,
            categoryItemId: Math.floor(Math.random() * 1000000).toString(),
            categoryId: values.category,
            description: values.name,
            sortOrder: values.sort,
          },
        ])
      : //new pricelist
        setPriceLists(prev => [
          ...prev,
          {
            categoryItemId: Math.floor(Math.random() * 100000).toString(),
            category: values.pricelistMaster,
            description: values.shortDescription,
            uom: values.uom,
            price: values.cost,
            costType: values.costType,
            costOption: values.costOptions,
            sort: values.sort,
            status: values.status,
            builderCost: values.builderCost,
          },
        ]);
    setDrawerOpen(null);
  }

  function handleActivateItem() {
    setPriceLists(prev =>
      prev.map(i =>
        i.categoryItemId === selectedPricelist.categoryItemId ? { ...i, status: 'ACTIVE' } : i
      )
    );
  }
  return {
    columns,
    priceLists,
    handlePricelistSubmit: handleSubmit,
    handleActivateItem,
  };
};
