'use client';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { HolidayRecalculateModal } from '@/components/common/Models/HolidayRecalculateModal';
import { holidayFields } from '@/components/formFields/holidayFields';
import { useHolidayMasterColumns } from '@/components/table-columns/holidayMasterColumn';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useStateHook } from '@hooks/useStateHook';
import { Status } from '@lib/constants/enum';
import { debouncedURL } from '@lib/utils/debounceURL';
import { getPaginationConfig } from '@lib/utils/getPaginationConfig';
import { fetchAllHoliday, updateHolidayRealculateDate } from '@redux/feature/holiday/holidayThunk';
import { IHoliday, IHolidayFetchParams } from '@redux/feature/holiday/IHolidayState';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { Table, Button, Select, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function HolidayMaster() {
  const dispatch = useAppDispatch();
  const { holiday, pagination, status } = useAppSelector(state => state.holiday);
  const [modalOpen, setModalOpen] = useState<'holiday' | 'recalculate' | 'delete' | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<IHoliday | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['startDate', 'endDate', 'desc', 'state', 'status', 'year'],
    initialValue: { status: '', year: '' },
  });
  const { columns, handleSubmit, handleHolidayStatus } = useHolidayMasterColumns({
    filters,
    setParams,
    selectedHoliday,
    setSelectedHoliday,
    setModalOpen,
  });
  const { stateOptions } = useStateHook();

  const PAGE_SIZE = 10;

  const fetchHoliday = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      const params: IHolidayFetchParams = {
        page,
        limit,
      };
      params.holiday_description = filters?.desc || undefined;
      params.holiday_end_date = filters?.endDate || undefined;
      params.holiday_start_date = filters?.startDate || undefined;
      params.state = filters?.state || undefined;
      params.status = filters?.status !== '' ? filters?.status === 'true' : undefined;
      params.year = filters?.year !== '' ? filters?.year : undefined;
      await dispatch(fetchAllHoliday(params));
    } catch (error) {
      message.error(error || 'Failed to fetch holidays');
    }
  };

  useEffect(() => {
    fetchHoliday();
  }, [currentPage, filters]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleRecalulateDate = async values => {
    try {
      await dispatch(updateHolidayRealculateDate(values)).unwrap();
      message.success('Dates recalculated successfully');
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to recalculate dates');
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-semibold">Holiday Master</h2>
          <Select
            className="w-[200px]"
            placeholder="All year"
            options={[
              { label: 'All', value: '' },
              ...Array.from({ length: 11 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return { label: year.toString(), value: year.toString() };
              }),
            ]}
            onChange={value => setParams({ year: value })}
          />
        </div>

        <div className="flex gap-3">
          <Button type="primary" className="bg-blue-600">
            Total Records 41
          </Button>

          <Button
            danger
            icon={<IconRefresh size={18} />}
            onClick={() => setModalOpen('recalculate')}
          >
            Recalculate Dates
          </Button>

          <Button
            type="primary"
            icon={<IconPlus size={18} />}
            className="bg-green-600"
            onClick={() => {
              setModalOpen('holiday');
            }}
          >
            New Holiday
          </Button>
        </div>
      </div>

      <div className="border rounded-lg shadow-sm bg-white">
        <Table
          columns={columns}
          dataSource={holiday}
          rowKey="holidayId"
          onRow={record => ({
            onClick: () => {
              setSelectedHoliday(record);
              setModalOpen('holiday');
            },
          })}
          pagination={getPaginationConfig({
            currentPage,
            limit: pagination?.limit,
            totalRecords: pagination?.totalRecords,
            setCurrentPage,
          })}
          loading={status.holiday.fetch === Status.PENDING}
        />
      </div>

      {/* TODO start and end date validation need to add and submit */}
      {modalOpen === 'holiday' && (
        <ActionDialogmodel
          open={modalOpen === 'holiday'}
          onCancel={() => setModalOpen(null)}
          onSubmit={handleSubmit}
          isEditing={!!selectedHoliday}
          title={selectedHoliday ? 'Edit Holiday' : 'New Holiday'}
          fields={holidayFields(!!selectedHoliday, stateOptions)}
          initialValues={{
            ...selectedHoliday,
            status: selectedHoliday?.status ? 'true' : 'false',
            state: selectedHoliday?.state.map(i => i.id),
            holidayStartDate: selectedHoliday?.holidayStartDate
              ? dayjs(selectedHoliday.holidayStartDate)
              : null,
            holidayEndDate: selectedHoliday?.holidayEndDate
              ? dayjs(selectedHoliday.holidayEndDate)
              : null,
          }}
          loading={status.holiday.create === Status.PENDING}
        />
      )}

      {/* TODO need to implement as the video currently only Ui is being added confitional fields will get changed */}
      {modalOpen === 'recalculate' && (
        <HolidayRecalculateModal
          open={modalOpen === 'recalculate'}
          onCancel={() => setModalOpen(null)}
          onSubmit={values => {
            handleRecalulateDate(values);
          }}
        />
      )}

      {modalOpen === 'delete' && (
        <ConfirmationModal
          open={modalOpen === 'delete'}
          onClose={() => setModalOpen(null)}
          type="danger"
          onConfirm={() => handleHolidayStatus()}
          title="Delete Holiday"
          message={`Are you sure you want to ${selectedHoliday?.status ? 'inactivate' : 'activate'} this holiday?`}
          loading={status.holiday.create === Status.PENDING}
        />
      )}
    </div>
  );
}
