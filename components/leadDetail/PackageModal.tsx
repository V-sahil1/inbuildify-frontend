import React, { useEffect } from "react";
import { Modal, Button, message } from "antd";
import { Status } from "@lib/constants/enum";
import { fetchPackages } from "@redux/feature/package/packageThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { RootState } from "@redux/feature/store";
import { Package } from "@redux/feature/package/IPackageState";
import { setQuotationPackage } from "@redux/feature/quotation/quotationSlice";

interface PackageModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (pkg: Package) => void;
  selectedPackage?: Package;
  onSelect: (pkg: Package) => void;
}

const PackageModal: React.FC<PackageModalProps> = ({
    visible,
    onCancel,
    onSave,
    selectedPackage,
  }) => {
    const dispatch = useAppDispatch();
    const packages = useAppSelector((state: RootState) => state.package.packages);
    const getAllStatus = useAppSelector(
      (state: RootState) => state.package.status.packages
    );
    // local temp selection
    const [tempSelectedPackage, setTempSelectedPackage] = React.useState<
      Package | undefined
    >(selectedPackage);

    useEffect(() => {
    const fetchPackagesData = async () => {
      try {
        await dispatch(fetchPackages(undefined)).unwrap();
      } catch (e) {
        message.error(e || "Failed to fetch packages");
      }
    };
    if (getAllStatus === Status.IDLE) {
      fetchPackagesData();
    }
  }, [dispatch, getAllStatus]);
    // Reset temp selection whenever modal opens
    useEffect(() => {
      if (visible) {
        setTempSelectedPackage(selectedPackage);
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
              if (tempSelectedPackage) {
                // ✅ Update Redux store here
                dispatch(setQuotationPackage(tempSelectedPackage));
                // ✅ Inform parent if needed
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
          {/* Left side - Package List */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-font-color">
                Available Packages
              </h3>
            </div>
            <div className="divide-y">
              {packages?.map((pkg) => (
                <div
                  key={pkg.packageId}
                  className={`p-4 cursor-pointer transition-colors ${
                    tempSelectedPackage?.packageId === pkg.packageId
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setTempSelectedPackage(pkg)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={tempSelectedPackage?.packageId === pkg.packageId}
                      readOnly
                    />
                    <div className="ml-3">
                      <div className="font-medium text-font-color">{pkg.name}</div>
                      <div className="text-sm text-font-color-100">
                        ${pkg.amount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Right side - Package Details */}
          <div className="w-2/3 overflow-y-auto p-6">
            {tempSelectedPackage ? (
              <div>
                <h2 className="text-2xl font-bold mb-2">{tempSelectedPackage.name}</h2>
                <div className="text-3xl font-bold text-green-600 mb-6">
                  ${tempSelectedPackage.amount}
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Included Items</h3>
                  <div className="space-y-3">
                    {tempSelectedPackage.categoryItemDescriptions?.length ? (
                      tempSelectedPackage.categoryItemDescriptions.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{item}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No items included in this package.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a package to view details</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  };

export default PackageModal;
