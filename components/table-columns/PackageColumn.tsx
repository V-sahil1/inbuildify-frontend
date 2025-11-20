import { Badge, Button, Input, Select, Tooltip } from 'antd';
import DwellingTypeSelect from '../common/custom-selects/DwellingTypeSelect';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconDeviceIpadDollar, IconRotate, IconTrash } from '@tabler/icons-react';

export const PackageColumn = ({ filters, setParams, setDrawerOpen }) => {
  const packageData = [
    {
      id: '1',
      name: 'Premium Package',
      cost: 10000.0,
      add: 'Yes',
      remove: 'No',
      sort: 1,
      label: '',
      dwellingType: 'Single Story',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Summer Pack',
      cost: 10000.0,
      add: 'Yes',
      remove: 'No',
      sort: 4,
      label: '',
      dwellingType: 'Single Story',
      status: 'InActive',
    },
  ];
  const column = [
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Package Name</span>
          <Input value={filters.name} onChange={e => setParams({ name: e.target.value })} />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Cost</span>
          <Input type='number' value={filters.cost} onChange={e => setParams({ cost: e.target.value })} />
        </div>
      ),
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Add</span>
          <Select
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            value={filters.add}
            onChange={value => setParams({ add: value })}
          />
        </div>
      ),
      dataIndex: 'add',
      key: 'add',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Remove</span>
          <Select
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            value={filters.remove}
            onChange={value => setParams({ remove: value })}
          />
        </div>
      ),
      dataIndex: 'remove',
      key: 'remove',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Sort Order</span>
          <Input type='number' value={filters.sort} onChange={e => setParams({ sort: e.target.value })} />
        </div>
      ),
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Label</span>
          <Select
            options={[{ label: 'All', value: 'all' }]}
            value={filters.label}
            onChange={value => setParams({ label: value })}
          />
        </div>
      ),
      dataIndex: 'label',
      key: 'label',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Dwelling Type</span>
          <DwellingTypeSelect
            value={filters.dwellingType}
            onChange={value => setParams({ dwellingType: value })}
          />
        </div>
      ),
      dataIndex: 'dwellingType',
      key: 'dwellingType',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Status</span>
          <StatusSelect
            value={filters.status}
            onChange={value => setParams({ status: value })}
            activeInactive={true}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <div className="grid grid-cols-2 gap-2 mr-2">
          <p>{record.status}</p>
          <div className="flex gap-2">
            {record.status === 'Active' && (
              <Tooltip title="InActive package">
                <Button
                  size="small"
                  type="text"
                  onClick={e => {
                    e.stopPropagation();
                    setDrawerOpen('delete');
                  }}
                  icon={<IconTrash size={15} color="red" />}
                />
              </Tooltip>
            )}
            <Tooltip title="Map Priceist">
              <Badge size="small" count={4}>
                <Button
                  size="small"
                  type="text"
                  className="text-blue"
                  onClick={e => {
                    e.stopPropagation();
                    setDrawerOpen('pricelist');
                  }}
                  icon={<IconDeviceIpadDollar size={15} />}
                />
              </Badge>
            </Tooltip>

            <Tooltip title="Quotation History">
              <Button
                size="small"
                type="text"
                className="text-blue"
                onClick={e => {
                  e.stopPropagation();
                  setDrawerOpen('quotation');
                }}
                icon={<IconRotate size={15} />}
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];
  return {
    column,
    packageData,
  };
};
