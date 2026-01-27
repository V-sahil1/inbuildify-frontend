import { Button, Dropdown } from 'antd';
import DwellingTypeSelect from '../common/custom-selects/DwellingTypeSelect';
import RangeSelect from '../common/custom-selects/RangeSelect';
import { IconDownload, IconFileSpreadsheet, IconUpload } from '@tabler/icons-react';
import { PricelistMaster } from '@lib/utils/Reports/pricelist/PricelistMaster';
import { PriceMasterCorrection } from '@lib/utils/Reports/pricelist/PriceMasterCorrection';
import LocationSelect from '../common/custom-selects/LocationSelect';

export const PricelistHeader = ({ filters, setParams, setDrawerOpen, setModalOpen }) => {
  const exportMenu = [
    {
      key: 'pricemaster',
      label: 'Export Full List',
      icon: <IconFileSpreadsheet size={15} color="red" />,
    },
    {
      key: 'pricemastercorrection',
      label: 'Export For Corrections',
      icon: <IconFileSpreadsheet size={15} color="red" />,
    },
  ];
  const handleExport = key => {
    key === 'pricemaster' ? PricelistMaster() : PriceMasterCorrection();
  };
  return (
    <>
      <div className="flex gap-2 items-center">
        {/* only show location field when there is any active location is present */}
        <span>
          <p> Location: </p>
          <LocationSelect
            value={filters?.loaction}
            onChange={value => setParams({ location: value })}
          />
        </span>
        <span>
          <p> Range :</p>
          <RangeSelect value={filters?.range} onChange={value => setParams({ range: value })} />
        </span>
        <span>
          <p> Dwelling Type :</p>
          <DwellingTypeSelect
            value={filters?.dwellingType}
            onChange={value => setParams({ dwellingType: value })}
          />
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button type="primary">Total Records 2</Button>
        <Button
          type="primary"
          onClick={() => {
            setDrawerOpen('location');
          }}
        >
          Location
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setDrawerOpen('master');
          }}
        >
          Master
        </Button>
        <Button type="primary" onClick={() => setModalOpen('ItemCreate')}>
          Item
        </Button>
        <Button
          type="primary"
          icon={<IconUpload size={15} />}
          onClick={() => setModalOpen('import')}
        />
        <Dropdown
          menu={{ items: exportMenu, onClick: e => handleExport(e.key) }}
          trigger={['click']}
        >
          <Button type="primary" icon={<IconDownload size={15} />} />
        </Dropdown>
      </div>
    </>
  );
};
