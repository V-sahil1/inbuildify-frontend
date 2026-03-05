import { debouncedURL } from '@lib/utils/debounceURL';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Input, message, Popconfirm, Select } from 'antd';
import { useEffect, useState } from 'react';
import { FormField } from '../common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createLocation, fetchLocation, updateLocation } from '@redux/feature/common/commonThunk';

export const PricelistLocationColumn = (setModalOpen, setSelectedLocation, selectedLocation) => {
  const dispatch = useAppDispatch();
  const { locations, status } = useAppSelector(state => state.common);

  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['status', 'search'],
    initialValue: { status: 'active' },
    shouldSyncURL: false,
  });
  const fetchLocations = async () => {
    try {
      const res = await dispatch(fetchLocation({ status: filters.status === 'active' })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch price master');
    }
  };
  useEffect(() => {
    fetchLocations();
  }, [filters]);
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
                value={instantFilters?.status}
                onChange={value => setParams({ status: value })}
                defaultValue="Active"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'InActive', value: 'inactive' },
                ]}
                className="min-w-[100px]"
              />
            }
            value={instantFilters.search}
            onChange={e => setParams({ search: e.target.value })}
            placeholder="Search Items"
          />
        </>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 600,
    },
    {
      title: (
        <Button
          disabled={filters.status === 'inactive'}
          type="primary"
          onClick={() => setModalOpen('createLocation')}
        >
          New
        </Button>
      ),
      render: (_, record) =>
        filters.status === 'active' ? (
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
                    The location ${record.name} can't be deleted. If you no longer require this
                    location, please consider inactivating it, as it has been used in existing
                    quotations, pricelist items, facade and floorplan.
                  </p>
                  <p>Are you sure you want to proceed with inactivation?</p>
                </div>
              }
              okText="InActive"
              onConfirm={() => {
                handleStatus(!record.status);
              }}
            >
              <Button
                type="text"
                color="red"
                icon={<IconTrash size={15} />}
                onClick={() => setSelectedLocation(record)}
              />
            </Popconfirm>
          </div>
        ) : (
          <Popconfirm
            title="Do you want to active location?"
            onConfirm={() => {
              handleStatus(!record.status);
            }}
            placement="topRight"
          >
            <Button
              type="text"
              className="text-blue"
              icon={<IconPlus size={15} />}
              onClick={() => setSelectedLocation(record)}
            />
          </Popconfirm>
        ),
    },
  ];
  async function handleSubmit(values) {
    try {
      selectedLocation
        ? await dispatch(
            updateLocation({
              data: { ...values, status: values.status === 'active' },
              id: selectedLocation.locationId,
            })
          ).unwrap()
        : await dispatch(
            createLocation({ ...values, status: values.status === 'active' })
          ).unwrap();
      message.success('Location saved successfully');
      setSelectedLocation(null);
    } catch (error) {
      message.error(error || 'Failed to save location');
    }
  }
  async function handleStatus(status: boolean) {
    try {
      await dispatch(
        updateLocation({ data: { status: status }, id: selectedLocation.locationId })
      ).unwrap();
      message.success('Location updated successfully');
      setSelectedLocation(null);
    } catch (error) {
      message.error(error || 'Failed to save location');
    }
  }
  const locationFormFields: FormField[] = [
    { label: 'Name', name: 'name', type: 'text' },
    {
      label: 'Status',
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'InActive', value: 'inactive' },
      ],
    },
  ];
  return {
    column,
    data: locations,
    locationFormFields,
    locationSubmit: handleSubmit,
  };
};
