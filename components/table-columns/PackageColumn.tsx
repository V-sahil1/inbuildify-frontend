import { message } from 'antd';
import { createPackage, updatePackage } from '@redux/feature/package/packageThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useAppDispatch } from '@hooks/redux';

export const PackageColumn = ({ setDrawerOpen, setSelectedPackage, selectedPackage }) => {
  const dispatch = useAppDispatch();
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['name', 'cost', 'add', 'remove', 'sort', 'label', 'dwellingType', 'status'],
    initialValue: { status: '', add: 'all', remove: 'all', dwellingType: 'all', label: 'all' },
  });
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

  const handlePackageSubmit = async values => {
    try {
      if (selectedPackage) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, selectedPackage);
        if (!isUpdated) {
          setSelectedPackage(null);
          setDrawerOpen(null);
          return;
        }
        await dispatch(
          updatePackage({ id: selectedPackage.packageId, data: updatedFields })
        ).unwrap();
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
    handlePackageSubmit,
    handlePackageStatus,
    debouncedUpdateURL,
    filters,
  };
};
