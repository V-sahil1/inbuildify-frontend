import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Empty, Tag } from 'antd';
import { fetchPackages } from '@redux/feature/package/packageThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Package } from '@redux/feature/package/IPackageState';
import { useRouter } from 'next/navigation';
import SystemRoutes from '@lib/constants/Routes';
import Loading from '../common/Loading';
interface PackageModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (pkg: Package) => void;
  selectedPackage?: Package;
  onSelect: (pkg: Package) => void;
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
  const [tempSelectedPackage, setTempSelectedPackage] = useState<Package | null>(
    selectedPackage || null
  );
  const { selectedFilters } = useAppSelector(state => state.quotation);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackagesData = async () => {
      try {
        setLoading(true);
        const params = {
          range_id: selectedFilters?.range || undefined,
          dwelling_type_id: selectedFilters?.dwellingType || undefined,
        };
        await dispatch(fetchPackages(params)).unwrap();
      } catch (e) {
        message.error(e || 'Failed to fetch packages');
      } finally {
        setLoading(false);
      }
    };
    if (visible) {
      fetchPackagesData();
    }
  }, [dispatch, visible, selectedFilters]);
  useEffect(() => {
    if (visible && packages && selectedPackage) {
      setTempSelectedPackage(packages.find(i => selectedPackage.packageId === i.packageId) || null);
    }
  }, [visible, selectedPackage, packages]);

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
            if (tempSelectedPackage) {
              onSave(tempSelectedPackage);
              onCancel();
            }
          }}
          disabled={!tempSelectedPackage}
        >
          Save
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
                      const isSelected = tempSelectedPackage?.packageId === pkg.packageId;
                      return (
                        <div
                          key={pkg.packageId}
                          className={`p-4 cursor-pointer transition-colors hover:bg-body-color ${
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setTempSelectedPackage(pkg)}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
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
                  {tempSelectedPackage ? (
                    <div>
                      <div className="space-y-4">
                        <div
                          key={tempSelectedPackage.packageId}
                          className="flex justify-between items-center"
                        >
                          <h3 className="text-xl font-semibold">{tempSelectedPackage.name}</h3>
                          <div className="text-xl font-bold text-green-600">
                            ${tempSelectedPackage.cost}
                          </div>
                        </div>
                      </div>

                      {/* Package Items */}
                      {tempSelectedPackage.pricelistItems &&
                        tempSelectedPackage.pricelistItems.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-base font-semibold mb-4">Included Items</h3>
                            <div className="space-y-2">
                              {tempSelectedPackage.pricelistItems.map((item, index) => (
                                <div
                                  key={item.priceListItemId || index}
                                  className="flex justify-between items-center p-3 border rounded"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-font-color">
                                      {item.shortDescription || item.itemDescription}
                                    </div>
                                    <Tag color="blue">{item.costType}</Tag>
                                  </div>
                                  <div className="text-lg font-bold text-green-600">
                                    {item.costType === 'Included' ? '' : `$${item.cost || 0}`}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="mt-6 pt-4 border-t">
                        <div className="text-xl font-bold">
                          Total:{' '}
                          <span className="text-green-600">
                            ${Number(tempSelectedPackage.cost).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-font-color-100">
                      <p>Select a package to view details</p>
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
