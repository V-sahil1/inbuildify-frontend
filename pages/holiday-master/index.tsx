'use client';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { HolidayRecalculateModal } from '@/components/common/Models/HolidayRecalculateModal';
import { holidayFields } from '@/components/formFields/holidayFields';
import { useHolidayMasterColumns } from '@/components/table-columns/holidayMasterColumn';
import { debouncedURL } from '@lib/utils/debounceURL';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { Table, Button, Select } from 'antd';
import { useEffect, useState } from 'react';

export default function HolidayMaster() {
  const [modalOpen, setModalOpen] = useState<'holiday' | 'recalculate' | null>(null);
  const [isEditing, setIsEditing] = useState<any>(null);
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['startDate', 'endDate', 'desc', 'state', 'status'],
  });
  const { columns, data, deleteModal } = useHolidayMasterColumns({ filters, setParams });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

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
              { label: '2025', value: '2025' },
              { label: '2024', value: '2024' },
              { label: '2023', value: '2023' },
              { label: '2022', value: '2022' },
              { label: '2021', value: '2021' },
              { label: '2020', value: '2020' },
            ]}
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
              setIsEditing(false);
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
          dataSource={data}
          pagination={false}
          rowKey="id"
          className="holiday-table"
          rootClassName="cursor-pointer hover:bg-primary"
          onRow={record => ({
            onClick: () => {
              setIsEditing(record);
              setModalOpen('holiday');
            },
          })}
        />
      </div>

      {/* TODO start and end date validation need to add and submit */}
      {modalOpen === 'holiday' && (
        <ActionDialogmodel
          open={modalOpen === 'holiday'}
          onCancel={() => setModalOpen(null)}
          onSubmit={isEditing ? () => {} : () => {}}
          isEditing={!!isEditing}
          title={isEditing ? 'Edit Holiday' : 'New Holiday'}
          fields={holidayFields(!!isEditing)}
          initialValues={isEditing}
        />
      )}

      {/* TODO need to implement as the video currently only Ui is being added confitional fields will get changed */}
      <HolidayRecalculateModal
        open={modalOpen === 'recalculate'}
        onCancel={() => setModalOpen(null)}
        onSubmit={values => {
          console.log('Submitted', values);
          setModalOpen(null);
        }}
      />
      {deleteModal}
    </div>
  );
}
