import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Empty, Spin } from 'antd';
import {
  createPackage,
  fetchPackages,
  updatePackage,
  deletePackage,
} from '@redux/feature/package/packageThunk';
import { Status } from '@lib/constants/enum';
import { CreateFormModal } from '@/components/common/Models/CreateFormModel';
import { packageFields } from '@/components/formFields/packageFields';
import { RootState } from '@redux/feature/store';
import { PackageItem } from '@/components/package/PackageItem';
import { Package as IPackage } from '@redux/feature/package/IPackageState';
import { message } from 'antd';
import AddMasterPricingItemModal from '@/components/common/Models/AddMasterPricingItemModel';
import { setAddInstItemModal } from '@redux/feature/package/packageSlice';

const Package = () => {
  const dispatch = useAppDispatch();
  const packages = useAppSelector((state: RootState) => state.package.packages);
  const getAllStatus = useAppSelector((state: RootState) => state.package.status.packages);
  const itemStatus = useAppSelector((state: RootState) => state.package.status.item);
  const { addInstItemModal } = useAppSelector((state: RootState) => state.package);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState<IPackage | null>(null);
  const [formValues, setFormValues] = useState<{ range?: string; dwelling?: string }>({}); // For Diabling Select of items based on range and dwelling type

  useEffect(() => {
    if (getAllStatus === Status.IDLE) {
      dispatch(fetchPackages(undefined)).unwrap();
    }
  }, [dispatch, getAllStatus]);

  const handleOpenModal = () => {
    setFormValues({});
    setEditingPackage(null);
    setIsModalVisible(true);
  };

  const handleCreatePackage = async (values: any) => {
    // const { range, dwelling, ...payload } = values; //Removed range and dwelling from payload
    try {
      if (editingPackage) {
        const categoryId = values.categoryItemIds?.map((item: any) =>
          item.value ? item.value : item
        );
        await dispatch(
          updatePackage({ id: editingPackage.packageId, ...values, categoryItemIds: categoryId })
        ).unwrap();
        message.success('Package updated successfully');
      } else {
        await dispatch(createPackage(values)).unwrap();
        message.success('Package created successfully');
      }
      setIsModalVisible(false);
      setEditingPackage(null);
    } catch (error) {
      console.error('Error saving package:', error);
      message.error(error || 'Failed to save package');
    }
  };

  const handleEditPackage = (pkg: IPackage) => {
    const mappedPackage = {
      ...pkg,
      categoryItemIds: pkg.categoryItems?.map(item => {
        return {
          label: item.desc,
          value: item.id,
        };
      }),
    };
    // Set the selected values for range and dwelling when editing
    if (pkg.rangeId && pkg.dwellingTypeId) {
      setFormValues({
        range: pkg.rangeId[0] || '',
        dwelling: pkg.dwellingTypeId[0] || '' ,
      });
    }

    setEditingPackage(mappedPackage);
    setIsModalVisible(true);
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      await dispatch(deletePackage(packageId)).unwrap();
      message.success('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      message.error(error?.response?.data?.message || 'Failed to delete package');
    }
  };

  const renderContent = () => {
    if (getAllStatus === Status.PENDING || getAllStatus === Status.IDLE) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      );
    }

    if (!packages || packages.length === 0) {
      return (
        <Empty
          description={
            <span className="text-gray-500">
              No packages found. Create your first package to get started.
            </span>
          }
          className="py-12"
        />
      );
    }

    return (
      <div className="space-y-4">
        {packages?.map(pkg => (
          <PackageItem
            key={pkg.packageId}
            pkg={pkg}
            onEdit={handleEditPackage}
            onDelete={handleDeletePackage}
            isDeleting={itemStatus === Status.PENDING}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px]/[30px] font-bold text-var(--font-color)">Package Management</h2>
        <button
          className="btn large bg-[var(--primary)] cursor-pointer text-white"
          onClick={handleOpenModal}
          disabled={getAllStatus === Status.PENDING}
        >
          Add
        </button>
      </div>

      {renderContent()}

      <CreateFormModal
        title={editingPackage ? 'Package' : 'New Package'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPackage(null);
          setFormValues({});
        }}
        onSubmit={handleCreatePackage}
        fields={packageFields(formValues)}
        loading={itemStatus === Status.PENDING}
        initialValues={editingPackage || {}}
        isEditing={!!editingPackage}
        onValuesChange={(allValues, form) => {
          const changedValues: { range?: string; dwelling?: string } = {};
          if (formValues.range !== allValues.range) {
            changedValues.range = allValues.range;
          }
          if (formValues.dwelling !== allValues.dwelling) {
            changedValues.dwelling = allValues.dwelling;
          }

          if (changedValues.range || changedValues.dwelling) {
            // Clear the items selection using form.setFieldsValue
            form.setFieldsValue({ categoryItemIds: [] });
            // Also update the local formValues state to reflect the change
            setFormValues({ ...allValues, categoryItemIds: [] });
          } else {
            setFormValues(allValues);
          }
        }}
      />

      {addInstItemModal && (
        <AddMasterPricingItemModal
          open={addInstItemModal}
          onClose={() => dispatch(setAddInstItemModal(false))}
          // preselectedRange={formValues?.range}
          // preselectedDwelling={formValues?.dwelling}
        />
      )}
    </div>
  );
};
export default Package;
