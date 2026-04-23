import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Button, Dropdown, Form, Input, message } from 'antd';
import { IPriceList } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { QuatationItem } from '../quotation/QuatationItem';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { updateQuotationItem } from '@redux/feature/quotation/quotationSlice';
import Loading from '../common/Loading';
import { QuatationExtraItem } from '../quotation/QuatationExtraItem';
import {
  createQuotationPricellistThunk,
  deleteQuotationPricelistThunk,
  updateQuotationItemThunk,
} from '@redux/feature/quotation/quotationThunk';
import { IconSearch } from '@tabler/icons-react';

interface ItemsPanelProps {
  category?: IPriceList;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onItemQuantityUpdate: (itemId: string, quantity: number) => Promise<void>;
  onExtraClick: (type: string) => void;
  extraItem: 'item' | 'complimentry' | 'discount' | 'note' | null;
  isReadOnly: boolean;
  itemsLoading: boolean;
  select?: boolean;
  setSelect?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItemsPanel: React.FC<ItemsPanelProps> = ({
  category,
  onItemQuantityChange,
  onItemQuantityUpdate,
  onExtraClick,
  extraItem,
  isReadOnly,
  itemsLoading,
  select,
  setSelect,
}) => {
  const [search, setSearch] = useState('');
  const dispatch = useAppDispatch();
  const {
    extraItems,
    items,
    package: selectedPackageFromSlice,
    quoteDetails,
  } = useAppSelector((state: RootState) => state.quotation);
  const { priceMaster: categoryData } = useAppSelector((state: RootState) => state.masterPriceList);

  const userSelectedItems = useMemo(() =>
    categoryData?.flatMap(cd =>
      cd?.items?.reduce<typeof cd.items>((acc, categoryItem) => {
        const quotationItem = items.find(
          selected => selected?.priceListItemId === categoryItem?.priceListItemId
        );
        if (quotationItem) {
          acc.push({
            ...categoryItem,
            isPriceListItemCostMismatch: quotationItem?.isPriceListItemCostMismatch ?? false,
          });
        }

        return acc;
      }, [])
    ), [categoryData, items]
  );

  // Helper function to check if item is automatically mapped
  const isItemAutomaticallyMapped = useCallback((priceListItemId: string) => {
    const quotationItem = items.find(
      item => item?.priceListItemId === priceListItemId
    );
    return quotationItem?.isAutomaticallyMapped === true;
  }, [items]);



  const [form] = Form.useForm();
  const { leadDetail } = useAppSelector((state: RootState) => state.lead);
  const quantityRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { selectedFilters } = useAppSelector(state => state.quotation);

  // Filter items based on search term
  const filterItems = (itemsToFilter: any[]) => {
    if (!search.trim()) return itemsToFilter;

    const searchTerm = search.toLowerCase();

    return itemsToFilter.filter(item => {
      // Check rangeId and dwellingTypeId arrays
      if (item.rangeId && item.rangeId.length > 0 && selectedFilters?.range) {
        if (item.rangeId.includes(selectedFilters.range)) return true;
      }
      if (item.dwellingTypeId && item.dwellingTypeId.length > 0 && selectedFilters?.dwellingType) {
        if (item.dwellingTypeId.includes(selectedFilters.dwellingType)) return true;
      }
      // Check shortDescription or itemDescription
      const description = (item.shortDescription || item.itemDescription || '').toLowerCase();
      if (description.includes(searchTerm)) return true;

      // Check costType
      if (item.costType && item.costType.toLowerCase().includes(searchTerm)) return true;

      // Check itemCost (as string)
      if (item.itemCost && item.itemCost.toString().includes(searchTerm)) return true;

      // Check if this is the Compaction Report Charge item
      const isCompactionReportItem =
        item.itemDescription?.toLowerCase().includes('compaction report') ||
        item.shortDescription?.toLowerCase().includes('compaction report');

      // Check if compaction report is available
      const isCompactionReportAvailable = leadDetail?.property?.compactionReport === 'available';

      // // Don't render compaction report item if compaction report is available (it's already included)
      if (isCompactionReportItem && !isCompactionReportAvailable) {
        return true; // Include the item
      }

      return false;
    });
  };
  const menuItems = [
    { key: 'item', label: 'Additional Items' },
    { key: 'complimentry', label: 'Complimentary' },
    { key: 'discount', label: 'Discount' },
    // { key: 'note', label: 'Note' },
  ];

  const handleItemAdd = async (item: any) => {
    try {
      const quantity = quantityRefs.current[item.priceListItemId]?.value || '1';
      const pricelist = items.find(i => i.quotationVersionItemId === item.quotationVersionItemId);
      if (!!pricelist) {
        await dispatch(deleteQuotationPricelistThunk(pricelist?.quotationVersionItemId)).unwrap();
        message.success('Item removed successfully');
      } else {
        const payload = {
          quotationVersionId: quoteDetails?.quotationVersionId,
          priceListItemId: item?.priceListItemId,
          quantity: Number(quantity),
          note: item?.notes || '',
        };
        await dispatch(createQuotationPricellistThunk(payload)).unwrap();
        message.success('Item added successfully');
      }
    } catch (error) {
      message.error(error as string || 'Failed to update item. Please try again.');
    }
  };

  const handleItemQuantityUpdate = async (itemId: string, quantity: number) => {
    try {
      const priceItem = items.find(i => i.priceListItemId === itemId);
      if (!priceItem?.quotationVersionItemId) return;

      // Only update if quantity has changed
      if (Number(priceItem.quantity) !== quantity) {
        await dispatch(
          updateQuotationItemThunk({
            quotationVersionItemId: priceItem.quotationVersionItemId,
            quantity,
            note: priceItem.note || '',
            priceListItemDescription: priceItem.itemDescription || ''
          })
        ).unwrap();
        message.success('Quantity updated successfully');
      }
    } catch (error) {
      message.error(error as string || 'Failed to update quantity');
      throw error; // Re-throw to let child component handle revert
    }
  };

  const handleNotesUpdate = async (itemId: string, notes: string) => {
    try {
      await dispatch(
        updateQuotationItemThunk({ quotationVersionItemId: itemId, note: notes })
      ).unwrap();
    } catch (error) {
      message.error(error || 'Failed to update notes');
    }
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    dispatch(updateQuotationItem({ itemId, quantity }));
  };
  return (
    <div className="w-full bg-card-color flex flex-col border-0 rounded-tr-lg rounded-br-lg">
      {/* Header (search + actions) */}
      <div className="p-3 border-b border-gray-200">
        <div className="text-end">
          <Button
            type={select ? 'primary' : 'default'}
            size="small"
            onClick={() => setSelect(!select)}
          >
            Selected Items {items?.length ?? 0}
          </Button>
        </div>
      </div>
      <Form
        form={form}
        onValuesChange={(changed, all) => {
          const total = (all.quantity | 0) * (all.cost | 0);
          form.setFieldValue('total', total);
        }}
        className="min-h-0 h-full overflow-hidden"
      >
        {/* Table */}
        <div className="w-full min-h-0 h-full flex flex-col">
          <div className="table w-full border-collapse" style={{ tableLayout: 'fixed' }}>
            {/* Table Head */}
            <div className="table-header-group bg-card-color text-sm font-medium text-font-color border-b border-gray-200">
              <div className="table-row">
                <div className="table-cell text-left p-3  w-[475px]">
                  Item{' '}
                  <Input
                    placeholder="Search Items..."
                    prefix={<IconSearch size={15} className="text-gray-400" />}
                    className="w-64 mx-2"
                    size="small"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="table-cell text-center p-3 w-[100px]">UOM</div>
                <div className="table-cell text-center p-3 w-[100px]">Quantity</div>
                <div className="table-cell text-center p-3 w-[100px]">Price</div>
                <div className="table-cell text-center p-3 w-[60px]">Total</div>
                <div className="table-cell text-center p-3 w-[100px]">
                  <Dropdown
                    menu={{
                      items: menuItems,
                      onClick: ({ key }) => {
                        onExtraClick(key);
                        form.resetFields();
                      },
                    }}
                    disabled={!selectedFilters?.range || !selectedFilters?.dwellingType}
                  >
                    <Button type="primary" size="small" ghost>
                      Extra{' '}
                      <span className="ml-1">{items?.filter(i => i.extraItem).length ?? 0}</span>
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-auto h-full min-h-0 w-full">
            <div className="table border-collapse w-full" style={{ tableLayout: 'fixed' }}>
              <div className="table-row-group">
                {!!extraItem && !select && (
                  <QuatationExtraItem
                    key={'extra-item'}
                    onToggleAdd={handleItemAdd}
                    onItemQuantityChange={handleItemQuantityChange}
                    form={form}
                    isReadOnly={isReadOnly}
                    quantityRef={quantityRefs}
                    type={extraItem}
                  />
                )}
                {!category && !extraItem && (items.length <= 0 || !select) && (
                  <div className="table-row">
                    <div className="table-cell p-6 text-center col-span-7 text-font-color">
                      No items found
                    </div>
                  </div>
                )}

                {/* Table Body */}
                {itemsLoading ? (
                  <div className="table-cell p-6 text-center col-span-7 text-font-color">
                    <Loading type="primary" />
                  </div>
                ) : (
                  <>
                    {(select ? filterItems(userSelectedItems) : filterItems(category?.items || []))?.length >
                    0 ? (
                      (select ? filterItems(userSelectedItems) : filterItems(category?.items || [])).map(
                        item => (
                          <QuatationItem
                            key={item?.priceListItemId}
                            item={item}
                            disabled={
                              isReadOnly || item?.isSystemData || isItemAutomaticallyMapped(item?.priceListItemId) || item?.priceListItemIsSystemData
                            }
                            onQuantityChange={handleItemQuantityChange}
                            onQuantityUpdate={onItemQuantityUpdate}
                            quantityRef={el => (quantityRefs.current[item?.priceListItemId] = el)}
                            isSelected={
                              userSelectedItems?.some(
                                itemData => itemData?.priceListItemId === item?.priceListItemId
                              ) || !!item?.extraItem
                              || item?.isSystemData
                              || item?.isAutomaticallyMapped
                            }
                            isDiffPrice={
                              userSelectedItems?.find(
                                itemData => itemData?.priceListItemId === item?.priceListItemId
                              )?.isPriceListItemCostMismatch
                            }
                            onToggleAdd={handleItemAdd}
                            category={category}
                            onNoteUpdate={handleNotesUpdate}
                          />
                        )
                      )
                    ) : (
                      <div className="table-row">
                        {category && (
                          <div className="table-cell p-6 text-center col-span-7 text-font-color">
                            No items found
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ItemsPanel;
