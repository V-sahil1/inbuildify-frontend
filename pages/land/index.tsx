import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import CustomAvtar from '@/components/common/CustomAvtar';
import LandCreatePackageDrawerModel from '@/components/common/Models/LandCreatePackageDrawerModel';
import LandLotFormModel from '@/components/common/Models/LandLotFormModel';
import LandPackageDrawerModel from '@/components/common/Models/LandPackageDrawerModel';
import { debouncedURL } from '@lib/utils/debounceURL';
import { IconCopy, IconPlus, IconTable } from '@tabler/icons-react';
import { Button, Input, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { data, DataType } from 'data/landData';

import { useSearchParams } from 'next/navigation';

import { useCallback, useEffect, useState } from 'react';

export default function Land() {
  const searchParams = useSearchParams();
  const [isPackageDrawerOpen, setIsPackageDrawerOpen] = useState(false);
  const [isLotFormDrawerOpen, setIsLotFormDrawerOpen] = useState(false);
  const [isNewPackageDrawerOpen, setIsNewPackageDrawerOpen] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  const initialValues = {
    lotNumber: '',
    lotPrice: '',
    estate: '',
    stage: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    titleStatus: '',
    date: '',
    lotType: '',
    cornerBlock: '',
    sitefall: '',
    landFill: '',
    width: '',
    depth: '',
    totalsize: '',
  };

  const [filters, setFilters] = useState<{
    lotNumber: string;
    price: string;
    size: string;
    estate: string;
    stageName: string;
    address: string;
    status: string;
    createdby: string;
  }>({
    lotNumber: searchParams.get('lotNumber') || '',
    price: searchParams.get('price') || '',
    size: searchParams.get('size') || '',
    estate: searchParams.get('estate') || '',
    stageName: searchParams.get('stageName') || '',
    address: searchParams.get('address') || '',
    status: searchParams.get('status') || '',
    createdby: searchParams.get('createdby') || '',
  });
  const debouncedUpdateURL = debouncedURL();

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters(prev => {
        const newFilters = { ...prev, ...updates };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const columns: ColumnsType<DataType> = [
    {
      title: (
        <div>
          <span>Lot Number</span>
          <Input
            value={filters.lotNumber}
            onChange={e => handleFilterChange({ lotNumber: e.target.value })}
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
          <Input
            value={filters.price}
            onChange={e => handleFilterChange({ price: e.target.value })}
          />
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
          <Input
            value={filters.size}
            onChange={e => handleFilterChange({ size: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'size',
      key: 'size',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Estate</span>
          <Input
            value={filters.estate}
            onChange={e => handleFilterChange({ estate: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'estate',
      key: 'estate',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Stage Name</span>
          <Input
            value={filters.stageName}
            onChange={e => handleFilterChange({ stageName: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'stageName',
      key: 'stageName',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Address</span>
          <Input
            value={filters.address}
            onChange={e => handleFilterChange({ address: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'address',
      key: 'address',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Status</span>
          <StatusSelect
            value={filters.status}
            onChange={value => handleFilterChange({ status: value })}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Created By</span>
          <AssigneeSelect
            value={filters.createdby}
            onChange={value => handleFilterChange({ createdby: value })}
          />
        </div>
      ),
      dataIndex: 'createdby',
      key: 'createdby',
      width: 200,
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <Tooltip title={record.createdby} className="cursor-pointer">
            {' '}
            <CustomAvtar label={record.createdby} />
          </Tooltip>
          <div className="flex gap-4 text-blue items-center">
            <Tooltip title="Copy Lot">
              <IconCopy
                size={15}
                onClick={() => {
                  setIsLotFormDrawerOpen(true);
                  setIsCopy(true);
                }}
                className="cursor-pointer"
              />
            </Tooltip>
            <Tooltip title="Packages">
              <IconTable
                size={15}
                onClick={() => setIsPackageDrawerOpen(true)}
                className="cursor-pointer"
              />
            </Tooltip>
            <Tooltip title="Add Package">
              <IconPlus
                size={15}
                onClick={() => setIsNewPackageDrawerOpen(true)}
                className="cursor-pointer"
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  const handleNewPackaheSubmit = values => {
    // create new package
    console.log('new package', values);
    setIsNewPackageDrawerOpen(false);
  };

  const handleLotSubmit = values => {
    //create new lot
    console.log('new lot', values);
    setIsLotFormDrawerOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Land Listing</h1>
        <Space>
          <Button onClick={() => setIsLotFormDrawerOpen(true)}>New Lot</Button>
          <div className="text-primary border border-primary p-1 rounded-lg">
            {' '}
            <IconTable />
          </div>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
        }}
      />
      {isPackageDrawerOpen && (
        <LandPackageDrawerModel
          title="Packages"
          open={isPackageDrawerOpen}
          onClose={() => setIsPackageDrawerOpen(false)}
        />
      )}
      {isLotFormDrawerOpen && (
        <LandLotFormModel
          title="Lot Details"
          open={isLotFormDrawerOpen}
          isCopy={isCopy}
          onSubmit={handleLotSubmit}
          initialValues={initialValues as any}
          onClose={() => {
            setIsLotFormDrawerOpen(false);
            setIsCopy(false);
          }}
        />
      )}
      {isNewPackageDrawerOpen && (
        <LandCreatePackageDrawerModel
          title="New Package for 333"
          open={isNewPackageDrawerOpen}
          onClose={() => setIsNewPackageDrawerOpen(false)}
          onSubmit={handleNewPackaheSubmit}
        />
      )}
    </div>
  );
}
