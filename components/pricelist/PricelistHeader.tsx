import { Button, Dropdown, Select } from 'antd';
import DwellingTypeSelect from '../common/custom-selects/DwellingTypeSelect';
import RangeSelect from '../common/custom-selects/RangeSelect';
import { IconDownload, IconFileTypePdf, IconUpload } from '@tabler/icons-react';

export const PricelistHeader = ({
  filters,
  setParams,
  setDrawerOpen,
  locationdata,
  setModalOpen,
}) => {
  const exportMenu = [
    { key: 'fullList', label: 'Export Full List', icon: <IconFileTypePdf size={15} color="red" /> },
    {
      key: 'corrections',
      label: 'Export For Corrections',
      icon: <IconFileTypePdf size={15} color="red" />,
    },
  ];
  return (
    <>
      <div className="flex gap-2 items-center">
        {locationdata && locationdata.length > 0 && (
          // only show location field when there is any active location is present
          <span>
            <p> Location: </p>
            <Select
              placeholder="Location"
              value={filters?.loaction}
              onChange={value => setParams({ location: value })}
              options={locationdata.map(i => ({ label: i.location, value: i.location }))}
            />
          </span>
        )}
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
        <Dropdown menu={{ items: exportMenu }} trigger={['click']}>
          <Button type="primary" icon={<IconDownload size={15} />} />
        </Dropdown>
      </div>
    </>
  );
};
