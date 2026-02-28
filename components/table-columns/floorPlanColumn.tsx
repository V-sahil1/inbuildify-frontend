import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';
import { Badge, Button, Image, Input, message, Select, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconClockHour7, IconDeviceIpadDollar, IconPhoto } from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import { createFloorPlan, updateFloorPlan } from '@redux/feature/floorPlan/floorPlanThunk';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';

export const FloorPlanColumn = (
  setDrawerOpen,
  setParams,
  selectedFloorplan,
  setSelectedFloorplan,
  debouncedFilters
) => {
  const dispatch = useAppDispatch();
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });
  const { dwellingTypeOptions, rangeOptions } = useDwellingAndRangeHook({ type: ['dwellingType', 'range'] });
  const columns: ColumnsType<IFloorPlanState> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 150,
      render: (_, record) => (
        <div
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Image src={record?.simpleImage} />
        </div>
      ),
    },
    {
      title: (
        <div>
          <p>Name</p>
          <Input value={debouncedFilters?.name} className="w-full" onChange={e => setParams({ name: e.target.value })} />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: (
        <div>
          <p>Dwelling Type</p>
          <Select value={debouncedFilters?.dwellingType} className="w-full" onChange={value => setParams({ dwellingType: value })} options={[{ label: 'All', value: 'all' }, ...dwellingTypeOptions]} />
        </div>
      ),
      dataIndex: 'dwellingTypeName',
      key: 'dwellingTypeName',
      width: 150,
    },
    {
      title: 'Specs',
      dataIndex: 'specs',
      key: 'specs',
      width: 150,
      render: (_, record) => (
        <div>
          <p>Beds : {record?.beds}</p>
          <p>Bath : {record?.baths}</p>
          <p>Car : {record?.carpark}</p>
          <p>Living : {record?.living}</p>
        </div>
      ),
    },
    {
      title: 'Land(m)',
      dataIndex: 'land',
      key: 'land',
      width: 150,
      render: (_, record) => (
        <div>
          <p>W : {record?.minLandWidth}</p>
          <p>D : {record?.minLandDepth}</p>
        </div>
      ),
    },
    {
      title: 'Size(sq)',
      dataIndex: 'size',
      key: 'size',
      width: 150,
      render: (_, record) => (
        <div>
          <p>Total : {record?.totalArea}</p>
        </div>
      ),
    },
    {
      title: (
        <div>
          <p>Location</p>
          <Select
            value={debouncedFilters?.location}
            className="w-full"
            options={[{ label: 'All', value: 'all' }, ...locationOptions]}
            onChange={value => setParams({ location: value })}
          />
        </div>
      ),
      dataIndex: 'locationName',
      key: 'locationName',
      width: 150,
    },
    {
      title: (
        <div>
          <p>Label</p>
          <Select value={debouncedFilters?.label} className="w-full" onChange={value => setParams({ label: value })} options={[{ label: 'All', value: 'all' }, ...rangeOptions]} />
        </div>
      ),
      dataIndex: 'rangeName',
      key: 'rangeName',
      width: 150,
    },
    {
      title: (
        <div>
          <p>Status</p>
          <StatusSelect value={debouncedFilters?.status} onChange={value => setParams({ status: value })} activeInactive={true} />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <div className="flex justify-between items-center">
          {record?.status ? (
            <p className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Active
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              Inactive
            </p>
          )}

          <Tooltip title="Map Pricelist">
            <Badge count={record?.pricelistItems?.length || 0} size="small">
              <Button
                size="small"
                className="text-blue"
                type="text"
                icon={<IconDeviceIpadDollar size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedFloorplan(record);
                  setDrawerOpen('floorplan');
                }}
              />
            </Badge>
          </Tooltip>
          <Tooltip title="Map Facade">
            <Badge count={record?.facade?.length || 0} size="small">
              <Button
                size="small"
                className="text-blue"
                type="text"
                icon={<IconPhoto size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedFloorplan(record);
                  setDrawerOpen('facade');
                }}
              />
            </Badge>
          </Tooltip>
          <Tooltip title="Quotation History">
            <Button
              size="small"
              className="text-blue"
              type="text"
              icon={<IconClockHour7 size={15} />}
              onClick={e => {
                e.stopPropagation();
                setSelectedFloorplan(record);
                setDrawerOpen('quotation');
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleFloorPlan = async values => {
    try {
      if (selectedFloorplan) {
        await dispatch(
          updateFloorPlan({ data: values, floorPlanId: selectedFloorplan.floorPlanId })
        ).unwrap();
        message.success('Floor Plan Updated Successfully');
      } else {
        await dispatch(createFloorPlan(values)).unwrap();
        message.success('Floor Plan Created Successfully');
      }
      setSelectedFloorplan(null);
    } catch (error) {
      message.error(error || 'Failed to save Floor Plans');
    }
  };
  return {
    columns,
    handleFloorPlan,
  };
};
