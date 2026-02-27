import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import CustomAvtar from '@/components/common/CustomAvtar';
import LandCreatePackageDrawerModel from '@/components/common/Models/LandCreatePackageDrawerModel';
import LandLotFormModel from '@/components/common/Models/LandLotFormModel';
import LandPackageDrawer from '@/components/common/Models/LandPackageDrawer';
import { useAppDispatch } from '@hooks/redux';
import { debouncedURL } from '@lib/utils/debounceURL';
import { IconCopy, IconPlus, IconTable } from '@tabler/icons-react';
import { Button, Input, message, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@hooks/redux';
import { ILandLot } from '@redux/feature/land/ILandState';
import { createLandLot, createLandPackage, fetchAllLandLot, fetchAllLandPackage, updateLandLot } from '@redux/feature/land/landThunk';
import { Status } from '@lib/constants/enum';
import dayjs from 'dayjs';

export default function Land() {
  const dispatch = useAppDispatch();
  const { lot, status } = useAppSelector(state => state.land)
  const [drawerOpen, setDrawerOpen] = useState<'lot' | 'package' | 'createPackage' | null>(null)
  const [selectedLot, setSelectedLot] = useState<ILandLot | null>(null)
  const [isCopy, setIsCopy] = useState(false);

  useEffect(() => {
    if (status.lot.fetch === Status.IDLE) {
      fetchLot()
    }
    fetchHLPackage()
  }, [status.lot.fetch])

  const fetchLot = async () => {
    try {
      await dispatch(fetchAllLandLot()).unwrap()
    }
    catch (error) {
      message.error(error || 'Failed to fetch land lot')
    }
  };

  const fetchHLPackage = async () => {
    try {
      const promises = lot?.map(item =>
        dispatch(fetchAllLandPackage({ lotId: item.lotId })).unwrap()
      ) || [];
      await Promise.all(promises);
    }
    catch (error) {
      message.error(error || 'Failed to fetch land package')
    }
  }

  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: [
      'lotNumber',
      'price',
      'size',
      'estate',
      'stageName',
      'address',
      'status',
      'createdby',
    ]
  });

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const columns: ColumnsType<ILandLot> = [
    {
      title: (
        <div>
          <span>Lot Number</span>
          <Input
            value={filters.lotNumber}
            onChange={e => setParams({ lotNumber: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Price</span>
          <Input value={filters.price} onChange={e => setParams({ price: e.target.value })} />
        </div>
      ),
      dataIndex: 'price',
      key: 'price',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Size</span>
          <Input value={filters.size} onChange={e => setParams({ size: e.target.value })} />
        </div>
      ),
      dataIndex: 'totalSizeM2',
      key: 'totalSizeM2',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Estate</span>
          <Input value={filters.estate} onChange={e => setParams({ estate: e.target.value })} />
        </div>
      ),
      dataIndex: 'estate',
      key: 'estate',
      width: 150,
      render: (estate) => estate.name
    },
    {
      title: (
        <div>
          <span>Stage Name</span>
          <Input
            value={filters.stageName}
            onChange={e => setParams({ stageName: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'estateStage',
      key: 'estateStage',
      width: 150,
      render: (estateStage) => estateStage.name
    },
    {
      title: (
        <div>
          <span>Address</span>
          <Input value={filters.address} onChange={e => setParams({ address: e.target.value })} />
        </div>
      ),
      dataIndex: 'address',
      key: 'address',
      width: 150,
      render: (_, record) => record?.street + ', ' + record?.city
    },
    {
      title: (
        <div>
          <span>Status</span>
          <StatusSelect value={filters.status} onChange={value => setParams({ status: value })} />
        </div>
      ),
      dataIndex: 'status',
      key: 'stattus',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Created By</span>
          <AssigneeSelect
            value={filters.createdby}
            onChange={value => setParams({ createdby: value })}
          />
        </div>
      ),
      dataIndex: 'createdByName',
      key: 'createdByName',
      width: 200,
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <Tooltip title={record.createdByName} className="cursor-pointer">
            <CustomAvtar label={record.createdByName} />
          </Tooltip>
          <div className="flex gap-4 text-blue items-center">
            <Tooltip title="Copy Lot">
              <IconCopy
                size={15}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLot(record)
                  setDrawerOpen('lot');
                  setIsCopy(true);
                }}
                className="cursor-pointer"
              />
            </Tooltip>
            <Tooltip title="Packages">
              <IconTable
                size={15}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLot(record)
                  setDrawerOpen('package')
                }}
                className="cursor-pointer"
              />
            </Tooltip>
            <Tooltip title="Add Package">
              <IconPlus
                size={15}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLot(record)
                  setDrawerOpen('createPackage')
                }}
                className="cursor-pointer"
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  const handleNewPackaheSubmit = async values => {
    try {
      await dispatch(createLandPackage({ lotId: selectedLot?.lotId, ...values })).unwrap()
      message.success('Land package created successfully')
      setDrawerOpen(null)
    }
    catch (error) {
      message.error(error || 'Failed to save land package')
    }
  };

  const handleLotSubmit = async values => {
    const payload = {
      ...values,
      titleDate: dayjs(values.titleDate).format('YYYY-MM-DD'),
    };
    try {
      if (selectedLot) {
        await dispatch(updateLandLot({ id: selectedLot.lotId, data: payload })).unwrap()
        message.success('Land lot updated successfully')
      } else {
        await dispatch(createLandLot(payload)).unwrap()
        message.success('Land lot created successfully')
      }
      setSelectedLot(null)
      setDrawerOpen(null)
    }
    catch (error) {
      message.error(error || 'Failed to save land lot')
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Land Listing</h1>
        <Space>
          <Button onClick={() => setDrawerOpen('lot')}>New Lot</Button>
          <div className="text-primary border border-primary p-1 rounded-lg">
            <IconTable />
          </div>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={lot}
        pagination={{
          pageSize: 10,
        }}
        onRow={record => ({
          onClick: () => {
            setDrawerOpen('lot')
            setSelectedLot(record)
          },
          style: { cursor: 'pointer' },
        })}
      />
      {drawerOpen === 'package' && (
        <LandPackageDrawer
          title="Packages"
          open={drawerOpen === 'package'}
          onClose={() => setDrawerOpen(null)}
          data={selectedLot?.packages}
        />
      )}
      {drawerOpen === 'lot' && (
        <LandLotFormModel
          title="Lot Details"
          open={drawerOpen === 'lot'}
          isCopy={isCopy}
          onSubmit={handleLotSubmit}
          initialValues={{ ...selectedLot, titleDate: selectedLot?.titleDate ? dayjs(selectedLot.titleDate) : null, estateId: selectedLot?.estate?.id, estateStageId: selectedLot?.estateStage?.id }}
          onClose={() => {
            setDrawerOpen(null);
            setIsCopy(false);
          }}
        />
      )}
      {drawerOpen === 'createPackage' && (
        <LandCreatePackageDrawerModel
          title={"New Package for " + selectedLot?.lotNumber}
          open={drawerOpen === 'createPackage'}
          onClose={() => setDrawerOpen(null)}
          onSubmit={handleNewPackaheSubmit}
        />
      )}
    </div>
  );
}
