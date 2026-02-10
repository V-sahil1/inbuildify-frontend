import { Input, message, Popconfirm, Select, Tag } from 'antd';
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import TooltipButton from '../common/TooltipButton';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllConstructionChecklist } from '@redux/feature/admin/construction/constructionChecklist/constructionChecklistThunk';
import { useEffect } from 'react';
import { SupplierChecklist } from '@redux/feature/supplier/ISupplierState';
import {
  createSupplierChecklist,
  deleteSupplierChecklist,
} from '@redux/feature/supplier/supplierThunk';
import { ISupplierType } from '@redux/feature/supplier/ISupplierState';
import { useBuildersHook } from '@hooks/useBuildersHook';
import { debouncedURL } from '@lib/utils/debounceURL';

export const SupplierChecklistColumn = (
  supplierChecklist: SupplierChecklist[],
  selectedType: ISupplierType
) => {
  const { checklist } = useAppSelector(state => state.construction.constructionChecklist);
  const dispatch = useAppDispatch();
  const { builderOptions } = useBuildersHook();
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    delay: 500,
    filtersKey: ['name', 'builder'],
    shouldSyncURL: false,
  });
  useEffect(() => {
    fetchChecklist();
  }, [filters]);

  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const fetchChecklist = async () => {
    try {
      const params = {
        name: filters?.name || undefined,
        builder: filters?.builder || undefined,
      };
      await dispatch(fetchAllConstructionChecklist(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch supplier checklist');
    }
  };
  const addChecklist = async (data: SupplierChecklist) => {
    try {
      await dispatch(createSupplierChecklist(data)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to add supplier');
    }
  };

  const removeChecklist = async (supplierTypeId: string, id: string) => {
    try {
      await dispatch(deleteSupplierChecklist({ id, supplierTypeId })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to remove supplier');
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-3">
          <Input
            addonBefore={
              <Select
                options={[{ value: '', label: 'All' }, ...(builderOptions || [])]}
                onChange={value => setParams({ builder: value })}
              />
            }
            placeholder="Search Checklist..."
            prefix={<IconSearch size={16} />}
            onChange={e => setParams({ name: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'name',
      width: '70%',
      render: (_, record) => {
        return (
          <>
            <p>{record.name}</p>
            <div className="flex gap-2">
              <Tag color="blue">{record?.constructionStage?.name}</Tag>
              <Tag color="green">{record?.constructionType?.name}</Tag>
            </div>
          </>
        );
      },
    },
    {
      render: record => {
        const item = supplierChecklist?.find(
          i => i.constructionChecklistId === record.constructionChecklistId
        );

        return !!item ? (
          <Popconfirm
            title="Are you sure you want to remove this item?"
            onConfirm={() => removeChecklist(item.supplierTypeId, item.id)}
          >
            <TooltipButton
              type="text"
              size="small"
              title="Remove"
              icon={<IconX size={16} color="red" />}
            />
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Are you sure you want to add this item?"
            onConfirm={() =>
              addChecklist({
                constructionChecklistId: record.constructionChecklistId,
                supplierTypeId: selectedType?.supplierTypeId,
              })
            }
          >
            <TooltipButton type="text" size="small" title="Add" icon={<IconPlus size={16} />} />
          </Popconfirm>
        );
      },
    },
  ];
  return {
    columns,
    data: checklist,
  };
};
