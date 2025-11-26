import { debouncedURL } from '@lib/utils/debounceURL';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Input, Popconfirm, Select } from 'antd';
import { useEffect, useState } from 'react';
import { FormField } from '../common/Models/ActionDialogModel';

export const PricelistLocationColumn = (setModalOpen, setSelectedLocation, selectedLocation) => {
  const [data, setData] = useState([
    { id: '1', location: 'Melbourne', status: 'InActive' },
    { id: '2', location: 'Melbourne West', status: 'InActive' },
    { id: '3', location: 'Melbourne North', status: 'Active' },
  ]);
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['status', 'search'],
    initialValue: { status: 'Active' },
    shouldSyncURL: false,
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const column = [
    {
      title: (
        <>
          <Input
            addonBefore={
              <Select
                value={filters?.status}
                onChange={value => setParams({ status: value })}
                defaultValue="Active"
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'InActive', value: 'InActive' },
                ]}
                className="min-w-[100px]"
              />
            }
            value={filters.search}
            onChange={e => setParams({ search: e.target.value })}
            placeholder="Search Items"
          />
        </>
      ),
      dataIndex: 'location',
      key: 'location',
      width: 600,
    },
    {
      title: (
        <Button
          disabled={filters.status === 'InActive'}
          type="primary"
          onClick={() => setModalOpen('createLocation')}
        >
          New
        </Button>
      ),
      render: (_, record) =>
        filters.status === 'Active' ? (
          <div className="flex items-center gap-2">
            <Button
              type="text"
              className="text-blue"
              icon={<IconPencil size={15} />}
              onClick={() => {
                setSelectedLocation(record);
                setModalOpen('createLocation');
              }}
            />
            <Popconfirm
              styles={{ root: { width: 350 } }}
              title={
                <div className="text-center">
                  <p className="text-red-500">
                    The location Melbourne can't be deleted. If you no longer require this location,
                    please consider inactivating it, as it has been used in existing quotations,
                    pricelist items, facade and floorplan.
                  </p>
                  <p>Are you sure you want to proceed with inactivation?</p>
                </div>
              }
              okText="InActive"
              onConfirm={() => {
                setData(prev =>
                  prev.map(i => (i.id === record.id ? { ...i, status: 'InActive' } : i))
                );
              }}
            >
              {' '}
              <Button type="text" color="red" icon={<IconTrash size={15} />} />
            </Popconfirm>
          </div>
        ) : (
          <Popconfirm
            title="Do you want to active location?"
            onConfirm={() =>
              setData(prev => prev.map(i => (i.id === record.id ? { ...i, status: 'Active' } : i)))
            }
            placement="topRight"
          >
            <Button type="text" className="text-blue" icon={<IconPlus size={15} />} />
          </Popconfirm>
        ),
    },
  ];
  function handleSubmit(values) {
    selectedLocation
      ? setData(prev => prev.map(i => (i.id === selectedLocation.id ? { ...values, id: i.id } : i)))
      : setData(prev => [
          ...prev,
          { ...values, id: Math.floor(Math.random() * 100000).toString() },
        ]);
  }

  const locationFormFields: FormField[] = [
    { label: 'Name', name: 'location', type: 'text' },
    {
      label: 'Status',
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'InActive', value: 'InActive' },
      ],
    },
  ];
  return {
    column,
    data: data.filter(i => i.status === filters.status),
    locationdata: data.filter(i => i.status === 'Active'),
    locationFormFields,
    locationSubmit: handleSubmit,
  };
};
