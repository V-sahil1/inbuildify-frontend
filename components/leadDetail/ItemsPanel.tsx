import React, { useRef, useState } from 'react';
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
  onExtraClick: () => void;
  extraItem: boolean;
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
  const [form] = Form.useForm();
  const { leadDetail } = useAppSelector((state: RootState) => state.lead);
  const quantityRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { selectedFilters } = useAppSelector(state => state.quotation);

  // Filter items based on search term
  const filterItems = (itemsToFilter: any[]) => {
    if (!search.trim()) return itemsToFilter;

    const searchTerm = search.toLowerCase();

    return itemsToFilter.filter(item => {
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

      // Check cost (as string)
      if (item.cost && item.cost.toString().includes(searchTerm)) return true;

      // Check costOption
      if (item.costOption && item.costOption.toLowerCase().includes(searchTerm)) return true;

      // Check range
      if (item.range && item.range.length > 0) {
        const rangeNames = item.range.map((r: any) => r.name?.toLowerCase() || '').join(' ');
        if (rangeNames.includes(searchTerm)) return true;
      }

      // Check dwellingType
      if (item.dwellingType && item.dwellingType.length > 0) {
        const dwellingNames = item.dwellingType
          .map((d: any) => d.name?.toLowerCase() || '')
          .join(' ');
        if (dwellingNames.includes(searchTerm)) return true;
      }

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
    { key: 'additionalItem', label: 'Additional Items' },
    { key: 'complimentary', label: 'Complimentary' },
    { key: 'discount', label: 'Discount' },
    { key: 'note', label: 'Note' },
  ];

  const handleItemAdd = async (item: any) => {
    try {
      const quantity = quantityRefs.current[item.priceListItemId]?.value || '1';
      const pricelist = items.find(i => i.priceListItemId === item.priceListItemId);
      
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
      >
        {/* Table */}
        <div className="w-full">
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
                        if (key === 'additionalItem') {
                          onExtraClick();
                        }
                      },
                    }}
                  >
                    <Button type="primary" size="small" ghost>
                      Extra <span className="ml-1">{extraItems.length ?? 0}</span>
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-y-auto max-h-[250px] custom-scrollbar w-full">
            <div className="table border-collapse w-full" style={{ tableLayout: 'fixed' }}>
              <div className="table-row-group">
                {extraItem && !select && (
                  <QuatationExtraItem
                    key={'extra-item'}
                    onToggleAdd={handleItemAdd}
                    onItemQuantityChange={handleItemQuantityChange}
                    form={form}
                    isReadOnly={isReadOnly}
                    quantityRef={quantityRefs}
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
                    {(select ? filterItems(items) : filterItems(category?.items || []))?.length >
                    0 ? (
                      (select
                        ? filterItems(items)
                        : filterItems(category?.items || [])?.filter(i => i.status === 'active')
                      ).map(item => (
                        <QuatationItem
                          key={item?.priceListItemId}
                          item={item}
                          disabled={
                            isReadOnly
                            // || selectedPackageFromSlice?.some(
                            //   catItem => catItem.id === item.priceListItemId
                            // )
                          }
                          onQuantityChange={handleItemQuantityChange}
                          onQuantityUpdate={onItemQuantityUpdate}
                          quantityRef={el => (quantityRefs.current[item.priceListItemId] = el)}
                          isSelected={items?.some(
                            itemData => itemData.priceListItemId === item.priceListItemId
                          )}
                          isDiffPrice={items?.find(
                            itemData => itemData.priceListItemId === item.priceListItemId
                          )?.isPriceListItemCostMismatch}
                          onToggleAdd={handleItemAdd}
                          category={category}
                        />
                      ))
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
