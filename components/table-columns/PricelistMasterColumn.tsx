import { IconCopy, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Input, message, Popconfirm, Select, Tooltip } from 'antd';
import { useEffect } from 'react';
import { FormField } from '../common/Models/ActionDialogModel';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createPricelistMaster,
  fetchPricelistMaster,
  updatePricelistMaster,
  updateSuggestedPricelistMaster,
} from '@redux/feature/masterPriceList/masterPriceListThunk';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';

export const PricelistMasterColumn = (
  setModalOpen,
  modalOpen,
  setSelectedPriceMaster,
  selectedPriceMaster
) => {
  const dispatch = useAppDispatch();
  const { priceMaster, suggestedPriceMaster, status } = useAppSelector(
    state => state.masterPriceList
  );

  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['isActive', 'search'],
    initialValue: { isActive: 'active' },
    shouldSyncURL: false,
  });

  const fetchPriceMaster = async () => {
    try {
      const res = await dispatch(
        fetchPricelistMaster({ is_active: filters.isActive === 'active' })
      ).unwrap();
      await dispatch(fetchPricelistMaster({ is_suggested: true })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch price master');
    }
  };
  useEffect(() => {
    fetchPriceMaster();
  }, [filters]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const Mastercolumn = [
    {
      title: (
        <div>
          <Input
            addonBefore={
              <Select
                value={filters?.isActive}
                onChange={value => setParams({ isActive: value })}
                defaultValue="active"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'InActive', value: 'inactive' },
                ]}
                className="min-w-[100px]"
              />
            }
            value={filters.search}
            onChange={e => setParams({ search: e.target.value })}
            placeholder="Search Items"
          />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 600,
    },
    {
      title: (
        <div className="text-center">
          <Button
            disabled={filters.status === 'INACTIVE'}
            type="primary"
            onClick={() => {
              setModalOpen('create');
            }}
          >
            New
          </Button>
        </div>
      ),
      render: (_, record) => (
        <div className="flex">
          <Popconfirm
            styles={{ root: { width: 350 } }}
            disabled={record.isActive}
            title={
              <>
                <p>
                  When you activate the price list, the system will automatically update the order
                  in which this record appears, as well as all the records that come after it.
                </p>
                <p>Are you sure you want to go ahead and activate the price list?</p>
              </>
            }
            onConfirm={() => handlePriceMasterStatus()}
          >
            <Tooltip title={`${record.isActive ? 'Create Pricelist Item' : ''}`}>
              <Button
                size="small"
                type="text"
                className="text-blue"
                icon={<IconPlus size={15} />}
                onClick={() => {
                  record.isActive ? setModalOpen('ItemCreate') : setSelectedPriceMaster(record);
                }}
              />
            </Tooltip>
          </Popconfirm>
          {record.isActive && (
            <div className="flex">
              <Tooltip title="Copy">
                <Button
                  size="small"
                  type="text"
                  className="text-blue"
                  onClick={() => {
                    setSelectedPriceMaster(record);
                    setModalOpen('copy');
                  }}
                  icon={<IconCopy size={15} />}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  size="small"
                  type="text"
                  className="text-blue"
                  icon={<IconPencil size={15} />}
                  onClick={() => {
                    setSelectedPriceMaster(record);
                    setModalOpen('edit');
                  }}
                />
              </Tooltip>

              <Tooltip title="Remove">
                <Popconfirm
                  title="Do you want to inactive price master?"
                  onConfirm={() => {
                    handlePriceMasterStatus();
                  }}
                  placement="topRight"
                >
                  <Button
                    size="small"
                    type="text"
                    className="text-blue"
                    icon={<IconTrash size={15} color="red" />}
                    onClick={() => setSelectedPriceMaster(record)}
                  />
                </Popconfirm>
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
  ];
  const suggestedMasterColumn = [
    {
      title: 'Suggested Price List Master',
      dataIndex: 'name',
      key: 'name',
      width: 600,
      render: (_, record) => (
        <div className="flex justify-between">
          <p>{record.name}</p>
          <Button
            size="small"
            className="text-xs"
            type="primary"
            onClick={() => {
              handleAddSuggestedPriceMaster(record.priceListId);
            }}
          >
            Add
          </Button>
        </div>
      ),
    },
  ];
  const masterFields: FormField[] = [
    modalOpen === 'Itemcopy'
      ? {
          label: 'Pricelist Master',
          name: 'category',
          type: 'select',
          options: priceMaster.map(i => ({ label: i.name, value: i.priceListId })),
        }
      : { label: 'Pricelist Master', name: 'name', type: 'text' },
    modalOpen === 'Itemcopy' && { label: 'Pricelist Item Name', name: 'name', type: 'text' },
    { label: 'Sort Order', name: 'sortOrder', type: 'number' },
    modalOpen === 'edit' && {
      label: 'Status',
      name: 'isActive',
      type: 'radio',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'InActive', value: 'inactive' },
      ],
    },
    ['create', 'edit'].includes(modalOpen) && {
      label: 'Show in view list',
      name: 'showInViewList',
      type: 'switch',
    },
    ['create', 'edit'].includes(modalOpen) &&
      locationOptions.length > 0 && {
        label: 'Location',
        name: 'location',
        type: 'select',
        options: locationOptions,
      },
  ];

  async function handleAddSuggestedPriceMaster(id) {
    try {
      await dispatch(updateSuggestedPricelistMaster(id)).unwrap();
      message.success('Suggested price master added successfully');
    } catch (error) {
      message.error(error || 'Failed to add suggested price master');
    }
  }

  async function handlePriceMasterStatus() {
    const payload = { isActive: !selectedPriceMaster?.isActive };
    try {
      await dispatch(
        updatePricelistMaster({ payload, id: selectedPriceMaster.priceListId })
      ).unwrap();
      message.success('Price master status updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update price master status');
    }
  }

  async function handleSubmit(values) {
    try {
      selectedPriceMaster
        ? modalOpen === 'edit'
          ? // edit price master
            await dispatch(
              updatePricelistMaster({
                payload: { isActive: values.isActive === 'active' },
                id: selectedPriceMaster.priceListId,
              })
            ).unwrap()
          : // copy price master
            () => {}
        : // new pricemaster
          await dispatch(createPricelistMaster(values)).unwrap();

      message.success('Price master saved successfully');
      setModalOpen(false);
    } catch (error) {
      message.error(error || 'Failed to save price master');
    }
  }
  return {
    Mastercolumn,
    suggestedMasterColumn,
    suggestedData: suggestedPriceMaster,
    categoryData: priceMaster,
    masterFields: masterFields?.filter(Boolean) as FormField[],
    priceMasterSubmit: handleSubmit,
  };
};
