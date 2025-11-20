import { Input, Select, Tag } from 'antd';

export const MasterCollectionColumn = ({ filters, setParams }) => {
  const masterCollectionData = [
    {
      id: '1',
      name: 'Base Price',
      description: 'Base Price for single storey [units] sq',
      uom: 'Sq',
      cost: 10000.0,
      costType: 'Fixed',
      costOption: '',
    },
    {
      id: '2',
      name: 'Bricks',
      description: 'Base Price for single storey [units] sq',
      uom: 'Sq',
      cost: 9400.0,
      costType: 'Variable',
      costOption: '',
    },
  ];
  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Price List Name </span>
          <Select
            options={[{ label: 'All', value: 'all' }]}
            value={filters?.name}
            onChange={value => setParams({ name: value })}
          />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 150,
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
      dataIndex: 'description',
      key: 'description',
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
          <Input value={filters?.cost} onChange={e => setParams({ cost: e.target.value })} />
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
              { label: 'Fixed', value: 'FIXED' },
              { label: 'Included', value: 'INCLUDED' },
              { label: 'Variable', value: 'VARIABLE' },
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
              { label: 'All', value: 'all' },
              { label: 'TBA', value: 'TBA' },
              { label: 'TBC', value: 'TBC' },
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
  return { columns, masterCollectionData };
};
