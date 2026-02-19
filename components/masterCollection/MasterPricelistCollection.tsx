import { Input, Select, Table, Tag } from 'antd';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useEffect } from 'react';
import { PricelistItemFtechParams } from '@redux/feature/masterPriceList/iMasterPriceListState';
import {
  fetchCategoryItems,
  fetchPricelistMaster,
} from '@redux/feature/masterPriceList/masterPriceListThunk';
import { message } from 'antd';
import { Status } from '@lib/constants/enum';

export const MasterPricelistCollection = ({ filters, setParams }) => {
  const { priceListItems, pagination, priceMaster, status } = useAppSelector(
    state => state.masterPriceList
  );
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 10;
  const pricelistOptions = priceMaster?.map(i => ({ label: i.name, value: i.priceListId }));
  const fetchPriceListItemsData = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      const params: PricelistItemFtechParams = {
        page,
        limit,
      };
      // params.price_list_id = filters?.name;
      params.item_description = filters?.description || undefined;
      params.uom = filters?.uom || undefined;
      params.price = filters?.cost || undefined;
      params.cost_type = filters?.costType || undefined;
      params.cost_option = filters?.costOption || undefined;
      params.range_id = filters?.range || undefined;
      params.dwelling_type_id = filters?.dwellingType || undefined;

      dispatch(fetchCategoryItems(params)).unwrap();
    } catch (error) {
      message.error(error.message);
    }
  };
  const fetchPricelistMasterData = async () => {
    try {
      await dispatch(fetchPricelistMaster({})).unwrap();
    } catch (error) {
      message.error(error);
    }
  };
  useEffect(() => {
    fetchPriceListItemsData();
    // if (status.priceMaster === Status.IDLE) {
    //   fetchPricelistMasterData();
    // }
  }, [filters, currentPage]);

  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Price List Name </span>
          <Select
            options={pricelistOptions}
            // value={filters?.name}
            // onChange={value => setParams({ name: value })}
          />
        </div>
      ),
      dataIndex: 'priceList',
      key: 'priceList',
      width: 150,
      render: priceList => priceList?.name,
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Item Description</span>
          <Input
            value={filters?.description}
            onChange={e => setParams({ description: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">UOM</span>
          <Input value={filters?.uom} onChange={e => setParams({ uom: e.target.value })} />
        </div>
      ),
      dataIndex: 'uom',
      key: 'uom',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Cost</span>
          <Input
            type="number"
            value={filters?.cost}
            onChange={e => setParams({ cost: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'cost',
      key: 'cost',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Cost Type</span>
          <Select
            options={[
              { label: 'Fixed', value: 'Fixed' },
              { label: 'Included', value: 'Included' },
              { label: 'Variable', value: 'Variable' },
            ]}
            value={filters?.costType}
            onChange={value => setParams({ costType: value })}
          />
        </div>
      ),
      dataIndex: 'costType',
      key: 'costType',
      width: 150,
      render: costType => <Tag color="gray">{costType}</Tag>,
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Cost Option</span>
          <Select
            options={[
              { label: 'All', value: 'none' },
              { label: 'TBA', value: 'tba' },
              { label: 'TBC', value: 'tbc' },
            ]}
            value={filters?.costOption}
            onChange={value => setParams({ costOption: value })}
          />
        </div>
      ),
      dataIndex: 'costOption',
      key: 'costOption',
      width: 150,
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={priceListItems}
      pagination={{
        current: pagination?.currentPage,
        pageSize: pagination?.limit,
        total: pagination?.totalRecords,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange: page => {
          setCurrentPage(page);
        },
      }}
    />
  );
};
