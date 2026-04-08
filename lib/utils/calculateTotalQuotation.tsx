import { QuotationPriceListItem } from '@redux/feature/quotation/IQuotationState';

const calculateTotalQuotation = (
  packageFromSlice: any, // todo
  itemsFromSlice: QuotationPriceListItem[],
  facadeCost: number,
  structuralEngineerPrice: number
) => {
  let total = Number(packageFromSlice?.price) || 0;
  // total += Number(facadeCost) || 0;
  // const packageItemIds = new Set((packageFromSlice?.categoryItems || []).map(ci => ci.id));
  itemsFromSlice?.forEach(item => {
    // if (!packageItemIds?.has(item.priceListItemId)) {
    const qty = Number(item?.quantity) || 0;
    const price = Number(item?.priceListItemCost) || 0;
    total += qty * price ;
    // }
  });

  total += Number(packageFromSlice?.cost) || 0;
  total += structuralEngineerPrice || 0;

  return Number(total.toFixed(2));
};

export default calculateTotalQuotation;
