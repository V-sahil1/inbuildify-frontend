import { PriceMasterData } from '@/data/pricelistMasterData';
import { exportToExcel } from '@lib/utils/exportToExcel';

export const PricelistMaster = () => {
  const masterColumn = {
    priceList: { label: 'Price List', color: 'FF0023BD' },
    description: { label: 'Description', color: 'FF0023BD' },
    cost: { label: 'Cost', color: 'FF0023BD' },
    builderCost: { label: 'Builder Cost', color: 'FF0023BD' },
    isTBA: { label: 'IsTBA', color: 'FF0023BD' },
    isPackageOnly: { label: 'IsPackageOnly', color: 'FF0023BD' },
    enableBuilderCost: { label: 'Enable Builder Cost', color: 'FF0023BD' },
    status: { label: 'Status', color: 'FF0023BD' },
    location: { label: 'Location', color: 'FF0023BD' },
    shortDesc: { label: 'Short Desc', color: 'FF0023BD' },
  };
  exportToExcel({
    data: PriceMasterData,
    fileName: 'PricelistMster',
    sheetName: 'PricelistMster',
    columnHeaders: masterColumn,
  });
};
