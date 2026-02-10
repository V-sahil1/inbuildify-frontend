import {
  IconPlus,
  IconSearch,
  IconUser,
  IconUserCheck,
  IconX,
} from '@tabler/icons-react';
import { Button, Input, message, Popconfirm, Switch } from 'antd';
import TooltipButton from '../common/TooltipButton';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { ISupplierType, SupplierMapping } from '@redux/feature/supplier/ISupplierState';
import {
  createSupplierTypeMapping,
  deleteSupplierTypeMapping,
  updateSupplierTypeMapping,
} from '@redux/feature/supplier/supplierThunk';
import { useState } from 'react';

export const SupplierMappingColumn = (
  supplierType: SupplierMapping[],
  selectedType: ISupplierType
) => {
  const dispatch = useAppDispatch();
  const [assignToNewAndExistingChecklist, setAssignToNewAndExistingChecklist] = useState(false);
  const { suppliers } = useAppSelector(state => state.supplier);

  const addSupplier = async (data: SupplierMapping) => {
    try {
      await dispatch(createSupplierTypeMapping(data)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to add supplier');
    }
  };

  const removeSupplier = async (supplierTypeId: string, id: string) => {
    try {
      await dispatch(deleteSupplierTypeMapping({ supplierTypeId, id })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to remove supplier');
    }
  };

  const updateSupplier = async id => {
    try {
      await dispatch(updateSupplierTypeMapping({ id, assignToNewAndExistingChecklist })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to update supplier');
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-3">
          <Input placeholder="Search Supplier..." prefix={<IconSearch size={16} />} />
        </div>
      ),
      dataIndex: 'companyName',
      width: '70%',
    },
    {
      render: (record: SupplierMapping) => {
        const item = supplierType?.find(i => i.supplierId === record.supplierId);
        return !!item ? (
          <>
            {item?.isRecommended ? (
              <Button type="text" size="small" icon={<IconUserCheck size={16} />} />
            ) : (
              <Popconfirm
                title="Are you sure you want to make this supplier as Recommended Supplier?"
                description={
                  <div>
                    <Switch
                      checked={assignToNewAndExistingChecklist}
                      onChange={checked => setAssignToNewAndExistingChecklist(checked)}
                    />
                    <p>
                      Note: If this supplier is mapped to a type, it will automatically be assigned
                      to the related checklists.
                    </p>
                  </div>
                }
                onConfirm={() => updateSupplier(item?.id)}
              >
                <TooltipButton
                  title="Recommend"
                  size="small"
                  type="text"
                  icon={<IconUser size={16} />}
                />
              </Popconfirm>
            )}
            <Popconfirm
              title="Are you sure you want to remove this item?"
              onConfirm={() => removeSupplier(item.supplierTypeId, item.id)}
            >
              <TooltipButton
                type="text"
                size="small"
                title="Remove"
                icon={<IconX size={16} color="red" />}
              />
            </Popconfirm>
          </>
        ) : (
          <Popconfirm
            title="Are you sure you want to add this item?"
            onConfirm={() =>
              addSupplier({
                supplierId: record.supplierId,
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

  return { columns, data: suppliers };
};
