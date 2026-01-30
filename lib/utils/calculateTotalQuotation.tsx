import { IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { Package } from '@redux/feature/package/IPackageState';

const calculateTotalQuotation = (
  packageFromSlice: Package,
  itemsFromSlice: (IPriceListItem & { quantity: number })[],
  facadeCost: number
) => {
  let total = Number(packageFromSlice?.amount) || 0;
  total += Number(facadeCost) || 0;
  const packageItemIds = new Set((packageFromSlice?.categoryItems || []).map(ci => ci.id));
  itemsFromSlice?.forEach(item => {
    if (!packageItemIds?.has(item.priceListItemId)) {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.cost) || 0;
      total += qty * price;
    }
  });
  return Number(total.toFixed(2));
};

export default calculateTotalQuotation;
