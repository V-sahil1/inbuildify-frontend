import { Button, Drawer, Popover, Radio, Select, Switch, Tag, Tooltip, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { useState } from 'react';
import CustomAvtar from '../common/CustomAvtar';
import { IconEye, IconPlus, IconTrash, IconUpload } from '@tabler/icons-react';
import TimelineActionsBar from '../common/TimeLineComponents/TimelineActionsBar';

export function OHShistoryDrawer({ open, onCancel }) {
  const [addList, setAddlist] = useState({ supervisor: false, supplier: false });
  const [showList, setShowList] = useState(false);
  const [supplier, setSupplier] = useState({ value: '', done: false });
  type DataType = {
    stage: string;
    supplier: string;
    createdDate: string;
    submittedDate: string;
    status: string;
  };
  const data = [
    {
      stage: 'Base Stage',
      supplier: 'A&L Windows',
      createdDate: '02-10-25',
      submittedDate: '04-10-25',
      status: 'draft',
    },
  ];

  const listData = [
    { label: 'Are OH&S and site location signs prominently displayed?' },
    { label: 'Are materials placed safely on block (outside 2m fall zone)?' },
    { label: 'If fall zone is not available, has guardrail been installed?' },
    { label: 'Is there adequate, safe access around the site?' },
    { label: 'Is the toilet clean, upright, and operating properly?' },
    { label: 'Has rubbish bin been provided, is it accessible and not full?' },
    { label: 'Is fuse / RCD protected by the security bar and pad lock?' },
    { label: 'Has the meter box RCD been tested monthly?' },
    { label: 'Is the meter box in a safe condition (eg door OK etc)?' },
    { label: 'Has void protection been correctly installed?' },
    { label: 'Is Laddaloc installed and utilised (subbie has key)?' },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      width: 150,
      render: (_, record) => (
        <div>
          <p>{record.stage}</p>
          <Tag color="purple">{record.supplier}</Tag>
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      render: (_, record) => (
        <div>
          <Tooltip title={record.supplier}>
            <CustomAvtar label={record.supplier} />
          </Tooltip>
          <p>{record.createdDate}</p>
        </div>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (_, record) => <Tag color="blue">{record.status}</Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: () => (
        <div className="flex gap-3">
          <Tooltip title="Preview">
            {' '}
            <IconEye className="text-blue" size={20} />
          </Tooltip>
          <Tooltip title="Delete">
            <IconTrash color="red" size={20} />
          </Tooltip>
        </div>
      ),
    },
  ];
  const popConetnt = (
    <div className="p-2">
      <div>
        <Switch onChange={() => setAddlist(prev => ({ ...prev, supervisor: true }))} /> Enable
        Supervisor list
      </div>
      <div className="mt-2">
        <Switch onChange={() => setAddlist(prev => ({ ...prev, supplier: true }))} /> Enable
        Supplier/Tradies list
      </div>
      {addList.supplier && (
        <div className="mt-2 text-center">
          <Select
            placeholder="Select Supplier"
            options={[{ label: 'supplier1', value: 'supplier1' }]}
            onChange={value => setSupplier(prev => ({ ...prev, value: value }))}
          />
        </div>
      )}
      <div className="flex gap-2 justify-end mt-2">
        <Button>Cancel</Button>
        <Button
          type="primary"
          onClick={() => {
            setShowList(true);
            setSupplier(prev => ({ ...prev, done: true }));
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );

  type FilterType = 'all' | 'pending' | 'yes' | 'no' | 'N/A';

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: 'all', label: 'All', count: data.length },
    { type: 'pending', label: 'Pending', count: data.length },
    { type: 'yes', label: 'Yes', count: data.length },
    { type: 'no', label: 'No', count: data.length },
    { type: 'N/A', label: 'N/A', count: data.length },
  ];
  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
  };

  return (
    <Drawer
      title={
        showList ? (
          <div className="flex justify-between items-center">
            {' '}
            <p>OH&S List</p>{' '}
            <div>
              <Button type="primary">Print</Button>
            </div>{' '}
          </div>
        ) : (
          <div className="flex justify-between items-center">
            {' '}
            <p>OH&S History</p>{' '}
            <div>
              <div className="text-end">
                <Popover content={popConetnt}>
                  <Button type="primary">New OH&S</Button>
                </Popover>
              </div>
            </div>{' '}
          </div>
        )
      }
      open={open}
      onClose={
        showList
          ? () => {
              setShowList(false);
            }
          : onCancel
      }
      size="large"
    >
      {showList ? (
        // OHS List
        <div>
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />

          {/* table */}
          <div className="w-full overflow-y-auto mt-2 " style={{ scrollbarWidth: 'none' }}>
            <div className="table w-full border-collapse">
              {/* Table Head */}
              <div className="table-header-group bg-card-color text-sm font-medium text-font-color border-b border-gray-200">
                <div className="table-row">
                  <div className="table-cell text-left p-3">Supervisor</div>
                </div>
              </div>
              {/* Table Body */}

              <div className="table-row-group overflow-y-auto">
                {listData.map(list => (
                  <div className="grid grid-cols-11 py-2 border-b-[1px]">
                    <div className="col-span-7">
                      <p>{list.label}</p>
                      <p className="flex items-center gap-1 text-xs text-blue mt-1">
                        {' '}
                        <div className="rounded-full w-3 h-3 bg-blue text-white">
                          <IconPlus size={12} />
                        </div>
                        Notes
                      </p>
                    </div>
                    <Radio.Group
                      className="col-span-3"
                      options={[
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' },
                        { value: 'N/A', label: 'N/A' },
                      ]}
                    />
                    <div className="col-span-1 justify-end">
                      <IconUpload size={20} className="text-blue " />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        //OHS History
        <div>
          {supplier.done && supplier.value && (
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
          )}
        </div>
      )}
    </Drawer>
  );
}
