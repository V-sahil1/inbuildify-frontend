import React, { useEffect, useState } from 'react';
import { Table, Select, Input, Button, Tag, Image, Tooltip, Space } from 'antd';
import { IconDownload, IconPlus, IconRotate } from '@tabler/icons-react';
import DwellingTypeSelect from '@/components/common/custom-selects/DwellingTypeSelect';
import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import { facadeData } from 'data/facadeData';
import { debouncedURL } from '@lib/utils/debounceURL';
import { TableDrawer } from '@/components/common/TableDrawer';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { facadeFields } from '@/components/formFields/facadeFields';
import { ActionDialogmodel, FormField } from '@/components/common/Models/ActionDialogModel';
import { QuotationHistory } from '@lib/utils/Reports/quotation/QuotationHistory';

const { Option } = Select;

const FacadeMaster = () => {
  const [statusFilter, setStatusFilter] = useState('active');
  const [drawerOpen, setDrawerOpen] = useState<'quotation' | 'facade' | null>(null);
  const [isEditing, setIsEditing] = useState(null);
  const { columns: quotationColumns, data } = QuotationHistoryColumn();
  const fields = facadeFields({
    isDwellingDisable: false,
    type: isEditing?.costType || 'standard',
  }) as FormField[];
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['name', 'dwellingType', 'dwellingType', 'costType', 'label', 'location', 'status'],
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      render: images => (
        <div
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Image
            src={images?.[0]?.url || ''}
            alt="facade"
            width={100}
            className="rounded-md shadow-sm"
          />
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Name</span>
          <Input placeholder="Search Name" onChange={e => setParams({ name: e.target.value })} />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: text => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Dwelling Type</span>
          <DwellingTypeSelect onChange={v => setParams({ dwellingType: v })} />
        </div>
      ),
      dataIndex: 'dwelling_type',
      key: 'dwellingType',
      width: '15%',
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Cost Type</span>
          <Select defaultValue="All" size="small" onChange={v => setParams({ costType: v })}>
            <Option value="All">All</Option>
            <Option value="Standard">Standard</Option>
            <Option value="Upgrade">Upgrade</Option>
          </Select>
        </div>
      ),
      dataIndex: 'costType',
      key: 'costType',
      width: '15%',
      render: costType =>
        costType.includes('Upgrade') ? (
          <Tag color="orange">{costType}</Tag>
        ) : (
          <Tag color="green">{costType}</Tag>
        ),
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Label</span>
          <Select defaultValue="All" size="small" onChange={v => setParams({ label: v })}>
            <Option value="All">All</Option>
            <Option value="Standard">Standard</Option>
          </Select>
        </div>
      ),
      dataIndex: 'label',
      key: 'label',
      width: '12%',
      render: label => label !== '-' && <Tag color="green">{label}</Tag>,
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Location</span>
          <Select defaultValue="All" size="small" onChange={v => setParams({ location: v })}>
            <Option value="All">All</Option>
          </Select>
        </div>
      ),
      dataIndex: 'location',
      key: 'location',
      width: '13%',
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Status</span>
          <StatusSelect activeInactive={true} onChange={v => setParams({ status: v })} />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: status => (
        <div className="flex items-center justify-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          {status}
          <Tooltip title="Quotation History">
            <Button
              type="text"
              onClick={e => {
                e.stopPropagation();
                setDrawerOpen('quotation');
              }}
              icon={<IconRotate size={16} className="text-gray-400 " />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Facade Master</h1>
        <div className="flex items-center gap-2">
          <Button type="primary" ghost>
            Total Records 12
          </Button>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => setDrawerOpen('facade')}
          >
            New Facade
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={facadeData.filter(item =>
          statusFilter ? item.status.toLowerCase() === statusFilter.toLowerCase() : true
        )}
        pagination={false}
        rootClassName="cursor-pointer"
        onRow={record => ({
          onClick: () => {
            setIsEditing(record);
            setDrawerOpen('facade');
          },
        })}
        bordered
        rowClassName={record => (record.costType.includes('Upgrade') ? 'bg-orange-50' : '')}
      />
      {drawerOpen === 'quotation' && (
        <TableDrawer
          open={drawerOpen === 'quotation'}
          width={1200}
          onClose={() => setDrawerOpen(null)}
          title={
            <div className="flex justify-between items-center">
              <p>Quotation History</p>
              <Space>
                <Button type="primary">Total Records {data.length}</Button>
                <Button
                  type="primary"
                  onClick={() => QuotationHistory(data, 'Facade QuotationList')}
                  icon={<IconDownload size={20} />}
                />
              </Space>
            </div>
          }
          table={[{ columns: quotationColumns, data }]}
        />
      )}

      {drawerOpen === 'facade' && (
        <ActionDialogmodel
          open={drawerOpen === 'facade'}
          onCancel={() => {
            setDrawerOpen(null);
            setIsEditing(null);
          }}
          title={`${isEditing ? 'Edit' : 'New'} Facade Information`}
          isEditing={isEditing}
          initialValues={
            isEditing
              ? Object.fromEntries(Object.entries(isEditing).filter(([key]) => key !== 'costType'))
              : {}
          }
          fields={fields}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
};

export default FacadeMaster;
