import { Badge, Button, Input, message, Select, Tag, Tooltip } from 'antd';
import DwellingTypeSelect from '../common/custom-selects/DwellingTypeSelect';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconDeviceIpadDollar, IconPlus, IconRotate, IconTrash } from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import { createPackage, updatePackage } from '@redux/feature/package/packageThunk';
import TooltipButton from '../common/TooltipButton';

export const PackageColumn = ({
  filters,
  setParams,
  setDrawerOpen,
  setSelectedPackage,
  selectedPackage,
}) => {
  const dispatch = useAppDispatch();

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
      render: (_, record) => (
        <div>
          <p>{record.name}</p>
          {record?.packageGroup?.map(i => (
            <Tag key={i}>{i.name}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Cost</span>
          <Input
            type="number"
            value={filters.cost}
            onChange={e => setParams({ cost: e.target.value })}
          />
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
      render: (_, record) => (record.allowAddItemFromPricelist ? 'Yes' : 'No'),
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
      render: (_, record) => (record.allowRemovePackageItems ? 'Yes' : 'No'),
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Sort Order</span>
          <Input
            type="number"
            value={filters.sort}
            onChange={e => setParams({ sort: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'sortOrder',
      key: 'sortOrder',
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
      dataIndex: 'range',
      key: 'range',
      width: 150,
      render: range => range?.map(i => <Tag key={i}>{i.name}</Tag>),
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
      render: dwellingType => dwellingType?.map(i => <Tag key={i}>{i.name}</Tag>),
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
          <p>{record.status ? 'Active' : 'Inactive'}</p>
          <div className="flex gap-2">
            {record.status ? (
              <TooltipButton
                title="InActive"
                icon={<IconTrash size={15} color="red" />}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedPackage(record);
                  setDrawerOpen('delete');
                }}
              />
            ) : (
              <TooltipButton
                title="Activate"
                icon={<IconPlus size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedPackage(record);
                  setDrawerOpen('delete');
                }}
              />
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
  const handlePackageStatus = async () => {
    try {
      await dispatch(
        updatePackage({ id: selectedPackage.packageId, data: { status: !selectedPackage.status } })
      ).unwrap();
      message.success('Package status updated successfully');
      setSelectedPackage(null);
      setDrawerOpen(null);
    } catch (error) {
      message.error(error || 'Failed to update package status');
    }
  };

  const handlePackageSubmit = async (values: any) => {
    try {
      if (selectedPackage) {
        await dispatch(updatePackage({ id: selectedPackage.packageId, data: values })).unwrap();
        message.success('Package updated successfully');
      } else {
        await dispatch(createPackage(values)).unwrap();
        message.success('Package created successfully');
      }
      setSelectedPackage(null);
      setDrawerOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save package');
    }
  };
  return {
    column,
    handlePackageSubmit,
    handlePackageStatus,
  };
};
