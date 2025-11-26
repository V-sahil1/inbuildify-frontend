import DwellingTypeSelect from '@/components/common/custom-selects/DwellingTypeSelect';
import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import { TableDrawer } from '@/components/common/TableDrawer';
import FloorPlanFormModal from '@/components/floorplan/FloorplanFormModal';
import { FacadeColumns } from '@/components/table-columns/FacadeColumns';
import { FloorplanPricelistColumns } from '@/components/table-columns/FloorplanPricelistColumns';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { debouncedURL } from '@lib/utils/debounceURL';
import { exportToExcel } from '@lib/utils/exportToExcel';
import { fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';
import { RootState } from '@redux/feature/store';
import { IconClockHour7, IconDeviceIpadDollar, IconDownload, IconPhoto } from '@tabler/icons-react';
import { Badge, Button, Image, Input, message, Select, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

const FloorPlanMaster = () => {
  const dispatch = useAppDispatch();
  const { floorPlans, status, filters, selectedFloorplans } = useAppSelector(
    (state: RootState) => state.floorPlan
  );
  const [createFloorPlanOpen, setcreateFloorPlanOpen] = useState(false);
  const [isEdited, setIsEdited] = useState<string>(null);
  const [drawerOpen, setDrawerOpen] = useState<'floorplan' | 'facade' | 'quotation' | null>(null);
  const { columns: quotationColumns, data } = QuotationHistoryColumn();
  const { columns: floorplanPricelistColumn, pricelistData } = FloorplanPricelistColumns();
  const { columns: facadeColumns, facadeData } = FacadeColumns();
  const [activeFilter, setActiveFilter] = useState('All');
  const filterButtons = ['All', 'Standard', 'Upgrade'];
  useEffect(() => {
    const fetchFloorPlansData = async () => {
      try {
        await dispatch(fetchFloorPlans(undefined)).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch Floor Plans');
      }
    };
    if (status?.floorPlan === Status.IDLE) {
      fetchFloorPlansData();
    }
  }, [dispatch, status, filters]);
  const { debouncedUpdateURL, setParams } = debouncedURL({
    filtersKey: ['name', 'dwellingTypeName', 'location', 'label', 'status'],
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const columns: ColumnsType<IFloorPlanState> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 150,
      render: (_, record) => <Image src={record.image} />,
    },
    {
      title: (
        <div>
          <p>Name</p>
          <Input className="w-full" onChange={e => setParams({ name: e.target.value })} />
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
          <DwellingTypeSelect onChange={value => setParams({ dwellingTypeName: value })} />
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
          <p>Beds : {record.beds}</p>
          <p>Bath : {record.bath}</p>
          <p>Car : {record.carPark}</p>
          <p>Living : {record.beds}</p>
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
          <p>W : {record.widthMeter}</p>
          <p>D : {record.depthMeter}</p>
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
          <p>Total : {record.totalSqft}</p>
        </div>
      ),
    },
    {
      title: (
        <div>
          <p>Location</p>
          <Select
            className="w-full"
            options={[{ label: 'All', value: 'all' }]}
            onChange={value => setParams({ location: value })}
          />
        </div>
      ),
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: (
        <div>
          <p>Label</p>
          <Select
            className="w-full"
            options={[{ label: 'All', value: 'all' }]}
            onChange={value => setParams({ label: value })}
          />
        </div>
      ),
      dataIndex: 'label',
      key: 'label',
      width: 150,
    },
    {
      title: (
        <div>
          <p>Status</p>
          <StatusSelect onChange={value => setParams({ status: value })} />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <p>{record?.status || 'Active'} </p>
          <Tooltip title="Map Pricelist">
            <Badge count={3} size="small">
              <Button
                size="small"
                className="text-blue"
                type="text"
                icon={<IconDeviceIpadDollar size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setDrawerOpen('floorplan');
                }}
              />
            </Badge>
          </Tooltip>
          <Tooltip title="Map Facade">
            <Badge count={5} size="small">
              <Button
                size="small"
                className="text-blue"
                type="text"
                icon={<IconPhoto size={15} />}
                onClick={e => {
                  e.stopPropagation();
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
                setDrawerOpen('quotation');
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  const handleExport = data => {
    const column = {
      referenceNo: 'Reference No',
      customerName: 'Customer Name',
      propertyAddress: 'Property Address',
      quotationStatus: 'Quotation Status',
      leadStatus: 'Lead Status',
    };
    exportToExcel({
      data,
      fileName: 'FloorplanQuotationList',
      sheetName: 'FloorplanQuotationList',
      columnHeaders: column,
    });
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Floor Plan Master</h1>
        <Space>
          <Button type="primary">
            Total Records
            <div className="rounded-full w-4 h-4 text-xs text-center bg-card-color text-primary">
              {floorPlans?.length}
            </div>
          </Button>
          <Button type="primary" onClick={() => setcreateFloorPlanOpen(true)}>
            New Floor Plan
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={floorPlans}
        onRow={record => ({
          onClick: () => {
            setcreateFloorPlanOpen(true);
            setIsEdited(record.floorPlanId);
          },
        })}
      />
      {createFloorPlanOpen && (
        <FloorPlanFormModal
          title="Create FloorPlan"
          open={createFloorPlanOpen}
          onCancel={() => {
            setcreateFloorPlanOpen(false);
            setIsEdited(null);
          }}
          onSubmit={values => {
            console.log('floorplan submit', values);
            setcreateFloorPlanOpen(false);
            setIsEdited(null);
          }}
          isEditing={isEdited !== null}
          initialValues={floorPlans.filter(item => item.floorPlanId === isEdited)[0]}
        />
      )}
      {drawerOpen === 'quotation' && (
        <TableDrawer
          open={drawerOpen === 'quotation'}
          width={1200}
          onClose={() => setDrawerOpen(null)}
          title={
            <div className="flex justify-between">
              <p>Quotation History</p>
              <Space>
                <Button type="primary">Total Records {data.length}</Button>
                <Button
                  type="primary"
                  onClick={() => handleExport(data)}
                  icon={<IconDownload size={20} />}
                />
              </Space>
            </div>
          }
          table={[{ columns: quotationColumns, data }]}
        />
      )}
      {drawerOpen === 'floorplan' && (
        <TableDrawer
          open={drawerOpen === 'floorplan'}
          width={800}
          onClose={() => setDrawerOpen(null)}
          title="Pricelist Items"
          table={[{ columns: floorplanPricelistColumn, data: pricelistData }]}
        >
          <Space className="my-2">
            <Button type="primary">Show All</Button>
            <Button>Selected Items {selectedFloorplans.length | 0}</Button>
          </Space>
        </TableDrawer>
      )}
      {drawerOpen === 'facade' && (
        <TableDrawer
          open={drawerOpen === 'facade'}
          width={800}
          onClose={() => setDrawerOpen(null)}
          title="Facade"
          table={[{ columns: facadeColumns, data: facadeData }]}
        >
          <div className="flex justify-between my-2">
            <Space>
              <Button type="primary">Show All</Button>
              <Button>Selected Items {selectedFloorplans.length | 0}</Button>
            </Space>
            <div>
              {filterButtons.map(obj => (
                <Button
                  className="rounded-none"
                  type={`${activeFilter === obj ? 'primary' : 'default'}`}
                  onClick={() => setActiveFilter(obj)}
                >
                  {obj}
                </Button>
              ))}
            </div>
          </div>
        </TableDrawer>
      )}
    </div>
  );
};

export default FloorPlanMaster;
