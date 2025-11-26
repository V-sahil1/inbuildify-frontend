import { IconCopy, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Input, Popconfirm, Select, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { FormField } from '../common/Models/ActionDialogModel';
import { debouncedURL } from '@lib/utils/debounceURL';
import { Category } from '@redux/feature/masterPriceList/iMasterPriceListState';

export const PricelistMasterColumn = (
  setModalOpen,
  modalOpen,
  setSelectedPriceMaster,
  locationData,
  selectedPriceMaster,
  categories
) => {
  const [categoryData, setCategoryData] = useState<Category[]>(
    categories.map(i => ({ ...i, status: 'ACTIVE' }))
  );
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['status', 'search'],
    initialValue: { status: 'ACTIVE' },
    shouldSyncURL: false,
  });
  useEffect(() => {
    setCategoryData(categories.map(i => ({ ...i, status: 'ACTIVE' })));
  }, [categories]);

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
                value={filters?.status}
                onChange={value => setParams({ status: value })}
                defaultValue="Active"
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'InActive', value: 'INACTIVE' },
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
            disabled={record.status === 'ACTIVE'}
            title={
              <>
                <p>
                  When you activate the price list, the system will automatically update the order
                  in which this record appears, as well as all the records that come after it.
                </p>
                <p>Are you sure you want to go ahead and activate the price list?</p>
              </>
            }
            onConfirm={() =>
              setCategoryData(prev =>
                prev.map(i => (i.categoryId === record.categoryId ? { ...i, status: 'ACTIVE' } : i))
              )
            }
          >
            <Tooltip title={`${record.status === 'ACTIVE' ? 'Create Pricelist Item' : ''}`}>
              <Button
                size="small"
                type="text"
                className="text-blue"
                icon={<IconPlus size={15} />}
                onClick={() => {
                  record.status === 'ACTIVE' && setModalOpen('ItemCreate');
                }}
              />
            </Tooltip>
          </Popconfirm>
          {record.status === 'ACTIVE' && (
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
                    console.log('record', record);
                    setSelectedPriceMaster(record);
                    setModalOpen('edit');
                  }}
                />
              </Tooltip>

              <Tooltip title="Remove">
                <Popconfirm
                  title="Do you want to inactive price master?"
                  onConfirm={() => {
                    setCategoryData(prev =>
                      prev.map(i =>
                        i.categoryId === record.categoryId ? { ...i, status: 'INACTIVE' } : i
                      )
                    );
                  }}
                  placement="topRight"
                >
                  {' '}
                  <Button
                    size="small"
                    type="text"
                    className="text-blue"
                    icon={<IconTrash size={15} color="red" />}
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
      render: category => (
        <div className="flex justify-between">
          <p>{category}</p>
          <Button size="small" className="text-xs" type="primary">
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
          options: categories.map(i => ({ label: i.name, value: i.categoryId })),
        }
      : { label: 'Pricelist Master', name: 'category', type: 'text' },
    modalOpen === 'Itemcopy' && { label: 'Pricelist Item Name', name: 'name', type: 'text' },
    { label: 'Sort Order', name: 'sort', type: 'number' },
    modalOpen === 'edit' && {
      label: 'Status',
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'InActive', value: 'INACTIVE' },
      ],
    },
    ['create', 'edit'].includes(modalOpen) && {
      label: 'Show in view list',
      name: 'viewList',
      type: 'switch',
    },
    ['create', 'edit'].includes(modalOpen) &&
      locationData.length > 0 && {
        label: 'Location',
        name: 'location',
        type: 'select',
        options: locationData.map(i => ({ label: i.location, value: i.location })),
      },
  ];

  function handleSubmit(values) {
    console.log('category submit--', values);
    selectedPriceMaster
      ? modalOpen === 'edit'
        ? // edit price master
          setCategoryData(prev =>
            prev.map(i =>
              i.categoryId === selectedPriceMaster.categoryId
                ? {
                    ...i,
                    name: values.category,
                    status: values.status,
                    sort: values.sort,
                  }
                : i
            )
          )
        : // copy price master
          setCategoryData(prev => [
            ...prev,
            { ...selectedPriceMaster, categoryId: '2', name: values.category, sort: values.sort },
          ])
      : // new pricemaster -> todo:new price master should be added in sidebar category
        setCategoryData(prev => [
          ...prev,
          {
            categoryId: '1',
            name: values.category,
            description: values.category,
            items: null,
            createdAt: '',
            updatedAt: '',
            isExpanded: false,
            loadingItems: false,
            status: 'ACTIVE',
            sort: values.sort,
          },
        ]);
  }
  return {
    Mastercolumn,
    suggestedMasterColumn,
    suggestedData: categoryData,
    categoryData: categoryData?.filter(i => i.status === filters.status),
    masterFields: masterFields?.filter(Boolean) as FormField[],
    setCategoryData,
    priceMasterSubmit: handleSubmit,
  };
};
