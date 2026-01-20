
import { exportToExcel } from '@lib/utils/exportToExcel';
import { bulkPricelistData } from 'data/pricelistMasterData';

export const BulkPricelist = () => {
  const bulkPricelist = {
    priceList: { label: 'Price List', color: 'FF0023BD' },
    description: { label: 'Description', color: 'FF0023BD' },
    cost: { label: 'Cost', color: 'FF0023BD' },
    costType: { label: 'Cost Type', color: 'FF0023BD' },
    tba_tbc: { label: 'TBA/TBC', color: 'FF0023BD' },
    shortDesc: { label: 'Short Desc', color: 'FF0023BD' },
    uom: { label: 'UOM', color: 'FF0023BD' },
    dwellingType: { label: 'Dwelling Type', color: 'FF0023BD' },
    builderCost: { label: 'Builder Cost', color: 'FF0023BD' },
    range: { label: 'Range', color: 'FF0023BD' },
  };
  exportToExcel({
    data: bulkPricelistData,
    fileName: 'Bulk Pricelist Import Template',
    sheetName: 'Bulk Pricelist Import Template',
    columnHeaders: bulkPricelist,
  });
};
