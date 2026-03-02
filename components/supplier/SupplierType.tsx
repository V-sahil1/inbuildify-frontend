import React, { useEffect, useState } from 'react';
import { TableDrawer } from '@/components/common/TableDrawer';
import { useSupplierTypeColumns } from '@/components/table-columns/SupplierTypeColumns';
import { ConfirmationContentModal } from '../common/ConfirmationContentModal';
import { ISupplierType } from '@redux/feature/supplier/ISupplierState';
import { SupplierMappingColumn } from '../table-columns/SupplierMappingColumn';
import { Button, message } from 'antd';
import { SupplierChecklistColumn } from '../table-columns/SupplierChecklistColumn';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchAllSupplierChecklist,
  fetchAllSupplierType,
  fetchAllSupplierTypeMapping,
} from '@redux/feature/supplier/supplierThunk';
import { debouncedURL } from '@lib/utils/debounceURL';
import { toggleChecklistExpand, toggleSupplierExpand } from '@redux/feature/supplier/supplierSlice';

interface SupplierTypeProps {
  open: boolean;
  onClose: () => void;
}

const SupplierType: React.FC<SupplierTypeProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { supplierType, status } = useAppSelector(state => state.supplier);
  const [confirmMode, setConfirmMode] = useState<'delete' | 'inactive' | null>(null);
  const [selectedType, setSelectedType] = useState<ISupplierType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<'checklist' | 'supplier' | null>(null);
  const [selectAll, setSelectAll] = useState<'checklist' | 'supplier' | null>(null);

  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    delay: 500,
    filtersKey: ['name', 'isActive'],
    initialValue: { isActive: '' },
    shouldSyncURL: false,
  });
  const { columns, handleDeleteConfirm, editingRow } = useSupplierTypeColumns(
    setSelectedType,
    setConfirmMode,
    setDrawerOpen,
    selectedType,
    setSelectAll,
    setParams,
    filters
  );
  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);
  const { columns: supplierColumns, data: supplierData } = SupplierMappingColumn(
    supplierType.find(type => type.supplierTypeId === selectedType?.supplierTypeId)?.suppliers,
    selectedType
  );
  const { columns: checklistColumns, data: checklistData } = SupplierChecklistColumn(
    supplierType.find(type => type.supplierTypeId === selectedType?.supplierTypeId)?.checklists,
    selectedType
  );

  useEffect(() => {
    fetchSupplierType();
  }, [filters]);

  useEffect(() => {
    fetchSupplierChecklist();
    fetchSupplierMapping();
  }, [status.supplierType.fetch]);

  const fetchSupplierType = async () => {
    try {
      const params = {
        is_active: filters.isActive !== '' ? filters.isActive === 'true' : undefined,
        name: filters?.name || undefined,
      };
      await dispatch(fetchAllSupplierType(params)).unwrap();
    } catch (error) {
      message.error('Failed to fetch supplier type');
    }
  };

  const fetchSupplierChecklist = async () => {
    try {
      supplierType?.map(async type => {
        if (!type.isChecklistExpand) {
          dispatch(toggleChecklistExpand(type.supplierTypeId));
          await dispatch(fetchAllSupplierChecklist(type.supplierTypeId)).unwrap();
        }
      });
    } catch (error) {
      message.error('Failed to fetch supplier checklist');
    }
  };

  const fetchSupplierMapping = async () => {
    try {
      supplierType?.map(async type => {
        if (!type.isSupplierExpand) {
          dispatch(toggleSupplierExpand(type.supplierTypeId));
          await dispatch(fetchAllSupplierTypeMapping(type.supplierTypeId)).unwrap();
        }
      });
    } catch (error) {
      message.error('Failed to fetch supplier mapping');
    }
  };
  const dataSource = editingRow && editingRow.isNew ? [editingRow, ...supplierType] : supplierType;

  return (
    <>
      <TableDrawer
        open={open}
        onClose={onClose}
        title="Supplier Type / Group"
        width="60%"
        table={[{ columns, data: dataSource }]}
      />
      {!!confirmMode && (
        <ConfirmationContentModal
          open={!!confirmMode}
          onClose={() => {
            setSelectedType(null);
            setConfirmMode(null);
          }}
          title="Confirm Deletion"
          okText={confirmMode === 'delete' ? 'Delete' : 'Inactive'}
          onSubmit={handleDeleteConfirm}
          content={
            confirmMode === 'delete' ? (
              <div className="text-center flex flex-col gap-4 my-4">
                <p className="text-lg">
                  Type : <strong>{selectedType?.name}</strong>
                </p>
                <p>Are you sure you want to delete this {selectedType?.name}?</p>
              </div>
            ) : (
              <div className="text-center flex flex-col gap-4">
                <p className="text-lg">
                  Type : <strong>{selectedType?.name}</strong>
                </p>
                <p className="text-primary">
                  This {selectedType?.name} has been used in existing supplier.
                </p>
                <p className="text-primary">
                  This {selectedType?.name} can't be deleted. Please inactivate the
                  {selectedType?.name} if not required.
                </p>
                <p>Are you sure you want to inactivate this {selectedType?.name}?</p>
              </div>
            )
          }
        />
      )}
      {drawerOpen === 'supplier' && (
        <TableDrawer
          open={drawerOpen === 'supplier'}
          onClose={() => {
            setDrawerOpen(null);
            setSelectAll(null);
          }}
          title={'Suppliers for ' + selectedType?.name}
          width="50%"
          table={[
            {
              columns: supplierColumns,
              data:
                selectAll === 'supplier'
                  ? supplierData
                  : supplierType
                    .find(type => type.supplierTypeId === selectedType?.supplierTypeId)
                    ?.suppliers?.map(i =>
                      supplierData.find(c => c?.supplierId === i?.supplierId)
                    ),
            },
          ]}
        >
          <div className="flex gap-2">
            <Button
              type={!!selectAll ? 'primary' : 'default'}
              onClick={() => setSelectAll('supplier')}
            >
              Show All
            </Button>
            <Button type={!!selectAll ? 'default' : 'primary'} onClick={() => setSelectAll(null)}>
              Selected Suppliers
            </Button>
          </div>
        </TableDrawer>
      )}

      {drawerOpen === 'checklist' && (
        <TableDrawer
          open={drawerOpen === 'checklist'}
          onClose={() => {
            setDrawerOpen(null);
            setSelectAll(null);
          }}
          title={'Checklists for ' + selectedType?.name}
          width="50%"
          table={[
            {
              columns: checklistColumns,
              data:
                selectAll === 'checklist'
                  ? checklistData
                  : supplierType
                    ?.find(i => i?.supplierTypeId === selectedType?.supplierTypeId)
                    ?.checklists?.map(i =>
                      checklistData.find(
                        c => c?.constructionChecklistId === i?.constructionChecklistId
                      )
                    ),
            },
          ]}
        >
          <div className="flex gap-2">
            <Button
              type={!!selectAll ? 'primary' : 'default'}
              onClick={() => setSelectAll('checklist')}
            >
              Show All
            </Button>
            <Button type={!!selectAll ? 'default' : 'primary'} onClick={() => setSelectAll(null)}>
              Selected Suppliers
            </Button>
          </div>
        </TableDrawer>
      )}
    </>
  );
};

export default SupplierType;
