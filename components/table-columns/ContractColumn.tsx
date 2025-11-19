import { Button, Input, Popconfirm, Select, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { contractdata, contractDataType } from 'data/contractData';
import DateFilterDropdown from '../common/custom-selects/DateFilterDropdown';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconCheck, IconShare3, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import SystemRoutes from '@lib/constants/Routes';

export const ContractColumn = ({ filters, setParams }) => {
  const router = useRouter();
  const [contractData, setContractData] = useState<contractDataType[]>(contractdata);
  const columns: ColumnsType<contractDataType> = [
    {
      title: (
        <div>
          <span>Builder Name</span>
          <Select
            value={filters.builderName}
            onChange={value => setParams({ builderName: value })}
            className="w-full"
            options={[{ label: 'My Home', value: 'My Home' }]}
          />
        </div>
      ),
      dataIndex: 'builderName',
      key: 'builderName',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Format Name</span>
          <Input
            value={filters.formatName}
            onChange={e => setParams({ formatName: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'formatName',
      key: 'formatName',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Created</span>
          <DateFilterDropdown
            onClear={() => {}}
            onFilter={value => setParams({ createdDate: value })}
          />
        </div>
      ),
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Updated</span>
          <DateFilterDropdown
            onClear={() => {}}
            onFilter={value => setParams({ updatedDate: value })}
          />
        </div>
      ),
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      width: 150,
    },
    {
      title: (
        <div>
          <span>Status</span>
          <StatusSelect
            activeInactive={true}
            value={filters.status}
            onChange={value => setParams({ status: value })}
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
          <span>Default Contract</span>
          <Select
            value={filters.contract}
            onChange={value => setParams({ contract: value })}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            className="w-full"
          />
        </div>
      ),
      dataIndex: 'contract',
      key: 'contract',
      width: 150,
      render: (contract, record) => (
        <div className="flex justify-between" key={record.id}>
          <div className="flex gap-2 items-center">
            {contract === 'Yes' && (
              <div className="rounded-full w-4 h-4 bg-green-600 text-white text-center">
                <IconCheck size={15} />
              </div>
            )}
            <p>{contract}</p>
          </div>
          <div>
            <Popconfirm
              title={
                record?.contract === 'Yes'
                  ? 'This is default Quotation Format you cannot delete or inactivate. Change the Default Quotation Format to delete or inactivate this quotation format.'
                  : 'Are you sure you want to delete?'
              }
              showCancel={record?.contract === 'Yes' ? false : true}
              overlayStyle={{ width: 300 }}
              onConfirm={() => {
                record.contract === 'No'
                  ? setContractData(prev => prev.filter(i => i.id !== record.id))
                  : '';
              }}
              okText="OK"
              cancelText="Cancel"
            >
              <Button type="text" size="small" icon={<IconTrash size={15} color="red" />} />
            </Popconfirm>
            <Tooltip title="Open in new tab">
              <Button
                type="text"
                size="small"
                className="text-blue"
                onClick={() => {
                  router.push(`${SystemRoutes.CONTRACT}/${record.id}`);
                }}
                icon={<IconShare3 size={15} />}
              />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];
  return { columns, contractData };
};
