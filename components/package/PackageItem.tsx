import { Package } from '@redux/feature/package/IPackageState';
import {
  IconDeviceIpadDollar,
  IconEdit,
  IconPlus,
  IconRotate,
  IconTrash,
} from '@tabler/icons-react';
import { Badge } from 'antd';

import TooltipButton from '../common/TooltipButton';

interface PackageItemProps {
  pkg: Package;
  setSelectedPackage?: (pkg: Package) => void;
  setDrawerOpen?: (type: 'pricelist' | 'quotation' | 'delete' | 'edit' | 'create' | null) => void;
}

export const PackageItem = ({ pkg, setSelectedPackage, setDrawerOpen }: PackageItemProps) => {
  return (
    <div className="border border-border-color rounded-lg overflow-hidden mb-4">
      <div className="p-4 bg-card-color hover:bg-primary-5 transition-colors flex justify-between items-center">
        <h3 className="text-lg font-medium">{pkg.name}</h3>
        <div className="flex items-center space-x-2">
          {pkg.status ? (
            <TooltipButton
              title="InActive"
              type="text"
              size="small"
              icon={<IconTrash size={18} color="red" />}
              onClick={e => {
                e.stopPropagation();
                setSelectedPackage(pkg);
                setDrawerOpen('delete');
              }}
            />
          ) : (
            <TooltipButton
              title="Activate"
              type="text"
              icon={<IconPlus size={18} />}
              onClick={e => {
                setSelectedPackage(pkg);
                setDrawerOpen('delete');
              }}
            />
          )}

          <TooltipButton
            title="Edit"
            type="text"
            className="text-blue"
            onClick={e => {
              setSelectedPackage(pkg);
              setDrawerOpen('create');
            }}
            icon={<IconEdit size={18} />}
          />

          <Badge size="small" count={pkg.priceListItem?.length || 0}>
            <TooltipButton
              title="Map Priceist"
              type="text"
              className="text-blue"
              onClick={e => {
                setSelectedPackage(pkg);
                setDrawerOpen('pricelist');
              }}
              icon={<IconDeviceIpadDollar size={18} />}
            />
          </Badge>

          <TooltipButton
            title="Quotation History"
            size="small"
            type="text"
            className="text-blue"
            onClick={e => {
              setSelectedPackage(pkg);
              setDrawerOpen('quotation');
            }}
            icon={<IconRotate size={18} />}
          />
        </div>
      </div>
    </div>
  );
};
