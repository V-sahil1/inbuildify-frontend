import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Input, message, Select, Tag } from 'antd';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { useStateHook } from '@hooks/useStateHook';
import { IHoliday } from '@redux/feature/holiday/IHolidayState';
import dayjs from 'dayjs';
import { useAppDispatch } from '@hooks/redux';
import { createHoliday, updateHoliday } from '@redux/feature/holiday/holidayThunk';
import TooltipButton from '../common/TooltipButton';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const useHolidayMasterColumns = ({
  filters,
  setParams,
  selectedHoliday,
  setSelectedHoliday,
  setModalOpen,
}) => {
  const dispatch = useAppDispatch();
  const { stateOptions } = useStateHook();

  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Holiday Start Date</span>
          <Input
            size="small"
            className="mt-1"
            placeholder="Filter by start date"
            value={filters.startDate}
            onChange={e => setParams({ startDate: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'holidayStartDate',
      key: 'holidayStartDate',
      render: (holidayStartDate: string) => dayjs(holidayStartDate).format('YYYY-MM-DD'),
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Holiday End Date</span>
          <Input
            size="small"
            className="mt-1"
            placeholder="Filter by end date"
            value={filters.endDate}
            onChange={e => setParams({ endDate: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'holidayEndDate',
      key: 'holidayEndDate',
      render: holidayEndDate => dayjs(holidayEndDate).format('YYYY-MM-DD'),
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Holiday Description</span>
          <Input
            size="small"
            className="mt-1"
            placeholder="Filter by description"
            value={filters.desc}
            onChange={e => setParams({ desc: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'holidayDescription',
      key: 'holidayDescription',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">State</span>
          <Select
            size="small"
            className="mt-1 w-full"
            value={filters.state}
            onChange={value => setParams({ state: value })}
            options={stateOptions}
          />
        </div>
      ),
      dataIndex: 'state',
      key: 'state',
      render: state => state.map(i => <Tag>{i.name}</Tag>),
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Status</span>

          <StatusSelect
            value={filters.status}
            onChange={value => setParams({ status: value })}
            activeInactive={true}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'} className="px-3 py-1 text-sm">
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_, record: IHoliday) =>
        record.status ? (
          <TooltipButton
            title="Inactivate"
            type="text"
            icon={<IconTrash size={18} color="red" />}
            onClick={e => {
              e.stopPropagation();
              setSelectedHoliday(record);
              setModalOpen('delete');
            }}
          />
        ) : (
          <TooltipButton
            title="Activate"
            type="text"
            icon={<IconPlus size={18} color="blue" />}
            onClick={e => {
              e.stopPropagation();
              setSelectedHoliday(record);
              setModalOpen('delete');
            }}
          />
        ),
    },
  ];

  const handleHolidayStatus = async () => {
    try {
      await dispatch(
        updateHoliday({
          data: { status: !selectedHoliday?.status },
          id: selectedHoliday?.holidayId,
        })
      ).unwrap();
      message.success('Holiday status update successfully');
      setSelectedHoliday(null);
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to delete holiday');
    }
    // TODO
    // the video not mentioned about inactive active but the holiday could be inactive need to verify with BE
    // Add your delete logic here
  };

  const handleSubmit = async values => {
    const payload = {
      ...values,
      holidayStartDate: dayjs(values.holidayStartDate).format('YYYY-MM-DD'),
      holidayEndDate: dayjs(values.holidayEndDate).format('YYYY-MM-DD'),
    };
    try {
      if (selectedHoliday) {
        const { isUpdated, updatedFields } = getUpdatedFields(
          { ...payload, status: values.status === 'true' },
          selectedHoliday
        );
        if (!isUpdated) {
          setSelectedHoliday(null);
          setModalOpen(null);
          return;
        }
        await dispatch(
          updateHoliday({
            data: updatedFields,
            id: selectedHoliday?.holidayId,
          })
        ).unwrap();
        message.success('Holiday updated successfully');
      } else {
        await dispatch(createHoliday(payload)).unwrap();
        message.success('Holiday created successfully');
      }
      setSelectedHoliday(null);
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save holiday');
    }
  };

  return {
    columns,
    handleHolidayStatus,
    handleSubmit,
  };
};
