import { message } from 'antd';
import { useAppDispatch } from '@hooks/redux';
import { copyCategoryItem, updateCategoryItem } from '@redux/feature/masterPriceList/masterPriceListThunk';

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
  async function handlePricelistSubmit(values) {
      try {
      await dispatch(
        copyCategoryItem({
          data: values,
          id: selectedPricelist?.priceListItemId,
          priceListId:selectedPricelist?.priceList?.id
        })
      ).unwrap();
      message.success('Pricelist copied successfully');
      setSelectedPricelist(null);
      setDrawerOpen(null);
    } catch (error) {
      message.error(error?.message || error || 'Failed to copy pricelist ');
    }
    
  }
  return {
    handlePricelistSubmit,
    handleActivateItem,
  };
};
