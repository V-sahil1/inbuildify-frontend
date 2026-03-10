import { message } from 'antd';
import { useAppDispatch } from '@hooks/redux';
import { updateCategoryItem } from '@redux/feature/masterPriceList/masterPriceListThunk';

export const PricelistColumn = (setDrawerOpen, setSelectedPricelist, selectedPricelist) => {
  const dispatch = useAppDispatch();

  async function handleActivateItem() {
    try {
      await dispatch(
        updateCategoryItem({
          payload: { status: selectedPricelist?.status === 'active' ? 'inactive' : 'active' },
          id: selectedPricelist?.priceListItemId,
        })
      ).unwrap();
      message.success('Pricelist status updated successfully');
      setSelectedPricelist(null);
    } catch (error) {
      message.error(error || 'Failed to update pricelist status ');
    }
  }
  //copy pricelist item
  function handlePricelistSubmit(values) {
    setDrawerOpen(null);
  }
  return {
    handlePricelistSubmit,
    handleActivateItem,
  };
};
