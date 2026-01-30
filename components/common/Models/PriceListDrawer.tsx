import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { RootState } from '@redux/feature/store';
import { IconPlus } from '@tabler/icons-react';
import { Button, Drawer, message } from 'antd';
import { useEffect } from 'react';
import PriceListItemPanel from '../PricelistItemPanel';
import { fetchPricelistMaster } from '@redux/feature/masterPriceList/masterPriceListThunk';

const PriceListDrawer = ({ title, open, onClose }) => {
  const { priceMaster, status } = useAppSelector((state: RootState) => state.masterPriceList);
  const { items } = useAppSelector((state: RootState) => state.quotation);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const res = await dispatch(fetchPricelistMaster({})).unwrap();
        console.log('response', res);
      } catch (e) {
        message.error(e || 'Failed to fetch categories');
      }
    };
    if (status.priceMaster === Status.IDLE) {
      fetchCategoriesData();
    }
  }, [dispatch, status]);

  return (
    <Drawer title={title} open={open} onClose={onClose} size="large">
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div className="flex gap-2">
            <Button>Show All</Button>
            <Button>
              Selected Items{' '}
              <div className="rounded-full w-6 h-6 text-center"> {items?.length ?? 0}</div>
            </Button>
            <div className="flex">
              {' '}
              <Button className="rounded-none">
                Extra <div className="rounded-full w-6 h-6 text-center">0</div>
              </Button>
              <Button className="rounded-none">
                <IconPlus size={15} />
              </Button>
            </div>
          </div>
          <p>House Price: $35,000</p>
        </div>
        <div>
          <PriceListItemPanel categories={priceMaster} itemsLoading={false} />
        </div>
      </div>
    </Drawer>
  );
};

export default PriceListDrawer;
