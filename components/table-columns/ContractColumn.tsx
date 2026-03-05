import { Button, Input, Popconfirm, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import DateFilterDropdown from '../common/custom-selects/DateFilterDropdown';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconCheck, IconShare3, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import SystemRoutes from '@lib/constants/Routes';
import TooltipButton from '../common/TooltipButton';
import { ContractFormatType } from '@redux/feature/contractFormat/IContractFormatState';
import {
  fetchAllContractFormat,
  deleteContractFormat,
} from '@redux/feature/contractFormat/contractFormatThunk';
import { useEffect } from 'react';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import dayjs from 'dayjs';
import { useBuildersHook } from '@hooks/useBuildersHook';

export const ContractColumn = ({ filters, setParams, instantFilters }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { contractFormat } = useAppSelector(state => state.contractFormat);
  const { builderOptions } = useBuildersHook();

  useEffect(() => {
    fetchContractFormatData();
  }, [filters]);

  const fetchContractFormatData = async () => {
    try {
      const params = {
        builder: filters?.builderName || undefined,
        format_name: filters?.formatName || undefined,
        created_at: filters?.createdDate || undefined,
        updated_at: filters?.updatedDate || undefined,
        status: filters?.status !== '' ? filters?.status === 'true' : undefined,
        default_format: filters?.contract !== '' ? filters?.contract === 'yes' : undefined,
        start_date: filters?.startDate || undefined,
        end_date: filters?.endDate || undefined,
        start_updated_date: filters?.startUpdatedDate || undefined,
        end_updated_date: filters?.endUpdatedDate || undefined,
      };
      await dispatch(fetchAllContractFormat(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch contract document');
    }
  };

  const handleDelete = async (contractId: string) => {
    try {
      await dispatch(deleteContractFormat(contractId));
      message.success('Contract document deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete contract format');
    }
  };

  const columns: ColumnsType<ContractFormatType> = [
    {
      title: (
        <>
          <span>Builder Name</span>
          <Select
            value={instantFilters.builderName}
            onChange={value => setParams({ builderName: value })}
            className="w-full"
            options={builderOptions}
          />
        </>
      ),
      dataIndex: 'builderName',
      key: 'builderName',
      width: 150,
    },
    {
      title: (
        <>
          <span>Format Name</span>
          <Input
            value={instantFilters.formatName}
            onChange={e => setParams({ formatName: e.target.value })}
          />
        </>
      ),
      dataIndex: 'formatName',
      key: 'formatName',
      width: 150,
    },
    {
      title: (
        <>
          <span>Created</span>
          <DateFilterDropdown
            onClear={() => {}}
            onFilter={(type, value) =>
              type === 'custom'
                ? setParams({
                    startDate: dayjs(value[0]).format('YYYY-MM-DD'),
                    endDate: dayjs(value[1]).format('YYYY-MM-DD'),
                  })
                : setParams({ createdDate: value })
            }
          />
        </>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: value => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: (
        <>
          <span>Updated</span>
          <DateFilterDropdown
            onClear={() => {}}
            onFilter={(type, value) =>
              type === 'custom'
                ? setParams({
                    startUpdatedDate: dayjs(value[0]).format('YYYY-MM-DD'),
                    endUpdatedDate: dayjs(value[1]).format('YYYY-MM-DD'),
                  })
                : setParams({ updatedDate: value })
            }
          />
        </>
      ),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: value => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: (
        <>
          <span>Status</span>
          <StatusSelect
            activeInactive={true}
            value={instantFilters.status}
            onChange={value => setParams({ status: value })}
          />
        </>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: value => (value ? 'Active' : 'Inactive'),
    },
    {
      title: (
        <>
          <span>Default Contract</span>
          <Select
            value={instantFilters.contract}
            onChange={value => setParams({ contract: value })}
            options={[
              { label: 'All', value: '' },
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            className="w-full"
          />
        </>
      ),
      dataIndex: 'defaultFormat',
      key: 'defaultFormat',
      width: 150,
      render: (defaultFormat, record) => (
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            {defaultFormat === 'Yes' && (
              <div className="rounded-full w-4 h-4 bg-green-600 text-white text-center">
                <IconCheck size={15} />
              </div>
            )}
            <p>{defaultFormat ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <Popconfirm
              title={
                record?.defaultFormat
                  ? 'This is default Quotation Format you cannot delete or inactivate. Change the Default Quotation Format to delete or inactivate this quotation format.'
                  : 'Are you sure you want to delete?'
              }
              showCancel={record?.defaultFormat ? false : true}
              overlayStyle={{ width: 300 }}
              onConfirm={() => {
                !record.defaultFormat ? handleDelete(record.contractFormatId) : '';
              }}
              okText="OK"
              cancelText="Cancel"
            >
              <Button type="text" size="small" icon={<IconTrash size={15} color="red" />} />
            </Popconfirm>

            <TooltipButton
              title="Open in new tab"
              type="text"
              size="small"
              className="text-blue"
              onClick={() => {
                router.push(`${SystemRoutes.CONTRACT}/${record.contractFormatId}`);
              }}
              icon={<IconShare3 size={15} />}
            />
          </div>
        </div>
      ),
    },
  ];
  return { columns, contractData: contractFormat };
};
