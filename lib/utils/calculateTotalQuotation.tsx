import { Package } from "@redux/feature/package/IPackageState";

interface Item {
  itemId: string;
  quantity: number;
  price: number;
}

const calculateTotalQuotation = (
  packageFromSlice: Package,
  itemsFromSlice: Item[]
) => {
  let total = Number(packageFromSlice?.amount) || 0;

  itemsFromSlice.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    total += qty * price;
  });

  return Number(total.toFixed(2));
};

export default calculateTotalQuotation;