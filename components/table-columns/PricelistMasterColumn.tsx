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
import { Status } from '@lib/constants/enum';
import { priceMasterRules } from '@lib/constants/formInputValidations';

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
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['isActive', 'search'],
    initialValue: { isActive: 'active' },
    shouldSyncURL: false,
  });

  const fetchPriceMaster = async () => {
    try {
      const res = await dispatch(fetchPricelistMaster({})).unwrap();
      await dispatch(fetchPricelistMaster({ is_suggested: true })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch price master');
    }
  };
  useEffect(() => {
    if (status.priceMaster === Status.IDLE) {
      fetchPriceMaster();
    }
  }, [status.priceMaster]);

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
                value={instantFilters?.isActive}
                onChange={value => setParams({ isActive: value })}
                defaultValue="active"
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
        name: 'priceListId',
        type: 'select',
        options: priceMaster.map(i => ({ label: i.name, value: i.priceListId })),
        rules: [{ required: true, message: 'Please select a pricelist master' }],
      }
      : {
        label: 'Pricelist Master',
        name: 'name',
        type: 'text',
        rules: priceMasterRules,
      },
    modalOpen === 'Itemcopy' && {
      label: 'Pricelist Item Name',
      name: 'itemDescription',
      type: 'text',
      rules: [{ required: true, message: 'Please enter pricelist item name' }],
    },
    {
      label: 'Sort Order',
      name: 'sortOrder',
      type: 'number',
      rules: [
        { required: true, message: 'Please enter sort order' },
        { max: 100000, message: 'Sort order must not be greater than 100000' },
        { min: 1, message: 'Sort order must be a positive number' },
        {
          validator: (_, value) => {
            const num = Number(value);
            if (value !== undefined && value !== null && value !== '') {
              if (!Number.isInteger(num) || num <= 0) {
                return Promise.reject('Sort order must be a positive number');
              }
              const maxSort = modalOpen === 'edit' ? priceMaster.length : priceMaster.length + 1;
              if (num > maxSort) {
                return Promise.reject(
                  `Sort order must not be greater than ${maxSort}`
                );
              }
            }
            return Promise.resolve();
          },
        },
      ],
    },
    modalOpen === 'edit' && {
      label: 'Status',
      name: 'isActive',
      type: 'radio',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'InActive', value: 'inactive' },
      ],
      rules: [{ required: true, message: 'Please select status' }],
    },
    ['create', 'edit'].includes(modalOpen) && {
      label: 'Show in view list',
      name: 'showInViewList',
      type: 'switch',
    },
    // ['create', 'edit'].includes(modalOpen) &&
    //   locationOptions.length > 0 && {
    //     label: 'Location',
    //     name: 'location',
    //     type: 'select',
    //     options: locationOptions,
    //   },
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
              payload: { ...values, isActive: values.isActive === 'active' },
              id: selectedPriceMaster.priceListId,
            })
          ).unwrap()
          : // copy price master
          () => { }
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
    categoryData: priceMaster.filter(
      i =>
        i.isActive === (filters?.isActive === 'active') &&
        i.name.toLowerCase().includes(instantFilters.search?.toLowerCase() || '')
    ),
    masterFields: masterFields?.filter(Boolean) as FormField[],
    priceMasterSubmit: handleSubmit,
    handlePriceMasterStatus,
  };
};
