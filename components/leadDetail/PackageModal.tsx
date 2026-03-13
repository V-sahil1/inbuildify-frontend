import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Empty } from 'antd';
import { fetchPackages } from '@redux/feature/package/packageThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Package } from '@redux/feature/package/IPackageState';
import { useRouter } from 'next/navigation';
import SystemRoutes from '@lib/constants/Routes';
import Loading from '../common/Loading';
import { QuotationPackage } from '@redux/feature/quotation/IQuotationState';
interface PackageModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (pkg: Package[]) => void;
  selectedPackage?: Package[];
  onSelect: (pkg: Package[]) => void;
  filters?: Record<string, string>;
}

const PackageModal: React.FC<PackageModalProps> = ({
  visible,
  onCancel,
  onSave,
  selectedPackage,
  filters,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const packages = useAppSelector((state: RootState) => state.package.packages);
  const getAllStatus = useAppSelector((state: RootState) => state.package.status.packages);
  // local temp selection for multiple packages
  const [tempSelectedPackages, setTempSelectedPackages] = useState<Package[]>(
    selectedPackage || []
  );
  const { selectedFilters } = useAppSelector(state => state.quotation);
  const [loading, setLoading] = useState(true);

  // Helper function to handle package selection/deselection
  const handlePackageToggle = async (pkg: Package) => {
    setTempSelectedPackages(prev => {
      const isSelected = prev.some(p => p.packageId === pkg.packageId);
      if (isSelected) {
        return prev.filter(p => p.packageId !== pkg.packageId);
      } else {
        // Convert Package to QuotationPackage
        const quotationPackage: Package = {
          packageId: pkg.packageId,
          name: pkg.name,
          cost: pkg.cost,
        };
        return [...prev, quotationPackage];
      }
    });
  };
  useEffect(() => {
    const fetchPackagesData = async () => {
      try {
        setLoading(true);
        const params = {
          range_id: selectedFilters.range,
          dwelling_type_id: selectedFilters.dwellingType,
        };
        // Make sure to pass the filters when fetching packages
        await dispatch(fetchPackages(params)).unwrap();
      } catch (e) {
        message.error(e || 'Failed to fetch packages');
      } finally {
        setLoading(false);
      }
    };

    // Always fetch packages when modal opens or filters change
    if (visible) {
      fetchPackagesData();
    }
  }, [dispatch, visible, selectedFilters]);
  // Reset temp selection whenever modal opens
  useEffect(() => {
    if (visible) {
      setTempSelectedPackages(selectedPackage || []);
    }
  }, [visible, selectedPackage]);

  return (
    <Modal
      title="Select Package"
      centered
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          className="bg-blue-600"
          onClick={() => {
            if (tempSelectedPackages.length > 0) {
              // // For now, save the first selected package (can be modified for multiple)
              const selectedPkg = tempSelectedPackages[tempSelectedPackages.length - 1];
              // dispatch(setQuotationPackage(selectedPkg));
              onSave(tempSelectedPackages);
              onCancel();
            }
          }}
          disabled={tempSelectedPackages.length === 0}
        >
          Save {tempSelectedPackages.length > 0 ? `(${tempSelectedPackages.length})` : ''}
        </Button>,
      ]}
      width={800}
    >
      <div className="flex h-[500px] border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full p-6">
            <Loading type="primary" />
          </div>
        ) : (
          <>
            {packages?.length > 0 ? (
              <>
                {/* Left side - Package List */}
                <div className="w-1/3 border-r overflow-y-auto">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-font-color">Available Packages</h3>
                  </div>
                  <div className="divide-y">
                    {packages?.map(pkg => {
                      const isSelected = tempSelectedPackages.some(
                        p => p.packageId === pkg.packageId
                      );
                      return (
                        <div
                          key={pkg.packageId}
                          className={`p-4 cursor-pointer transition-colors hover:bg-body-color ${
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handlePackageToggle(pkg)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              checked={isSelected}
                              readOnly
                            />
                            <div className="ml-3">
                              <div className="font-medium text-font-color">{pkg.name}</div>
                              <div className="text-sm text-font-color-100">${pkg.cost}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right side - Package Details */}
                <div className="w-2/3 overflow-y-auto p-6">
                  {tempSelectedPackages.length > 0 ? (
                    <div>
                      <h2 className="text-xl font-bold mb-3">
                        Selected Packages ({tempSelectedPackages.length})
                      </h2>
                      <div className="space-y-4">
                        {tempSelectedPackages.map((pkg, index) => (
                          <div
                            key={pkg.packageId}
                            className="border flex justify-between items-center rounded-lg p-4"
                          >
                            <h3 className="text-lg font-semibold">{pkg.name}</h3>
                            <div className="text-xl font-bold text-green-600">${pkg.cost}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t">
                        <div className="text-xl font-bold">
                          Total:{' '}
                          <span className="text-green-600">
                            $
                            {tempSelectedPackages
                              .reduce((sum: number, pkg) => sum + Number(pkg.cost), 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-font-color-100">
                      <p>Select packages to view details</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full p-6">
                <Empty description="No packages found">
                  <Button type="primary" onClick={() => router.push(SystemRoutes.PACKAGE)}>
                    Create Package
                  </Button>
                </Empty>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default PackageModal;
