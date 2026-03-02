import React, { useEffect, useState } from 'react';
import { Table, Select, Input, Button, Tag, Image, Tooltip, Space, message } from 'antd';
import { IconPlus, IconRotate, IconEdit, IconTrash, IconDownload } from '@tabler/icons-react';
import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import { debouncedURL } from '@lib/utils/debounceURL';
import { TableDrawer } from '@/components/common/TableDrawer';
import { facadeFields } from '@/components/formFields/facadeFields';
import { ActionDialogmodel, FormField } from '@/components/common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getFacades, createFacade, updateFacade, deleteFacade } from '@redux/feature/facade/facadeThunk';
import { GetFacadesParams, IFacadeState } from '@redux/feature/facade/IFacadeState';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import { Status } from '@lib/constants/enum';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { QuotationHistory } from '@lib/utils/Reports/quotation/QuotationHistory';
import { getPaginationConfig } from '@lib/utils/getPaginationConfig';

const FacadeMaster = () => {
  const [open, setOpen] = useState<'quotation' | 'facade' | 'delete' | null>(null);
  const [isEditing, setIsEditing] = useState<IFacadeState | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { facades, status, pagination } = useAppSelector(state => state.facade);
  const dispatch = useAppDispatch();
  const { columns: quotationColumns, data } = QuotationHistoryColumn();
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });
  const { dwellingTypeOptions, rangeOptions } = useDwellingAndRangeHook({ type: ['dwellingType', 'range'] });

  const PAGE_SIZE = 10;

  const fields = facadeFields({
    isDwellingDisable: false,
    type: (isEditing?.costType as 'standard' | 'upgrade') || 'standard',
  }) as FormField[];

  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['name', 'dwellingType', 'range', 'costType', 'location', 'status', 'cost']
  });

  useEffect(() => {
    fetchFacadesData();
  }, [currentPage, filters]); // Both page and filter changes trigger fetch

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel?.();
    };
  }, [debouncedUpdateURL]);

  const fetchFacadesData = async () => {
    try {
      const params: GetFacadesParams = {
        page: currentPage,
        limit: PAGE_SIZE,
      };
      params.status = filters?.status !== '' ? filters?.status === 'active' : undefined;
      params.name = filters?.name || undefined;
      params.cost_type = filters?.costType || undefined;
      params.dwelling_type_id = filters.dwellingType || undefined;
      params.range_id = filters.range || undefined;
      params.location_id = filters.location || undefined
      await dispatch(getFacades(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Facades');
    }
  };

  const handleCreateFacade = async (values: IFacadeState) => {
    try {
      setLoading(true);
      const formData = formDataGenerator({
        ...values,
        image: values.image,
      });

      if (isEditing) {
        const { updatedFields } = getUpdatedFields(values, isEditing);
        const updateFormData = formDataGenerator(updatedFields);
        await dispatch(
          updateFacade({ data: updateFormData, facadeId: isEditing.facadeId })
        ).unwrap();
        message.success('Facade updated successfully');
        setIsEditing(null);
      } else {
        await dispatch(createFacade(formData)).unwrap();
        message.success('Facade created successfully');
      }
      setOpen(null);
    } catch (error) {
      message.error(error || 'Failed to create/update Facade');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteFacade(isEditing?.facadeId)).unwrap();
      message.success('Facade deleted successfully');
      setOpen(null);
    } catch (error) {
      message.error(error || 'Failed to delete Facade');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      render: (image: string) => (
        <div
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Image
            src={image || ''}
            alt="facade"
            width={100}
            className="rounded-md shadow-sm"
            fallback="/placeholder-image.png"
          />
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Name</span>
          <Input value={instantFilters.name} placeholder="Search Name" onChange={e => setParams({ name: e.target.value })} />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Location</span>
          <Select
            value={instantFilters?.location}
            placeholder="Select Location"
            size="small"
            onChange={v => setParams({ location: v })}
            options={[{ label: 'All', value: 'all' }, ...locationOptions]}
          />
        </div>
      ),
      dataIndex: 'location',
      key: 'location',
      width: '15%',
      render: (location: { name: string }) => location?.name || 'N/A',
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Dwelling Type</span>
          <Select value={instantFilters?.dwellingType} placeholder="Select Dwelling Type" size="small" onChange={v => setParams({ dwellingType: v })} options={[{ label: 'All', value: 'all' }, ...dwellingTypeOptions]} />
        </div>
      ),
      dataIndex: 'dwellingtype',
      key: 'dwellingType',
      width: '15%',
      render: (dwellingtype: { name: string }) => dwellingtype?.name || 'N/A',
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Range</span>
          <Select value={instantFilters?.range} placeholder="Select Range" size="small" onChange={v => setParams({ range: v })} options={[{ label: 'All', value: 'all' }, ...rangeOptions]} />
        </div>
      ),
      dataIndex: 'range',
      key: 'range',
      width: '12%',
      render: (range: { name: string }) => range?.name || 'N/A',
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Cost Type</span>
          <Select value={instantFilters?.costType} size="small" onChange={v => setParams({ costType: v })} options={[{ label: 'All', value: 'all' }, { label: 'Standard', value: 'standard' }, { label: 'Upgrade', value: 'upgrade' }]} />
        </div>
      ),
      dataIndex: 'costType',
      key: 'costType',
      width: '12%',
      render: (costType: string) => (
        <Tag color={costType === 'upgrade' ? 'orange' : 'green'}>{costType}</Tag>
      ),
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Cost</span>
        </div>
      ),
      dataIndex: 'cost',
      key: 'cost',
      width: '10%',
      render: (cost: string) => <span className="font-medium">{cost || 'N/A'}</span>,
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Status</span>
          <StatusSelect value={instantFilters?.status} activeInactive={true} onChange={v => setParams({ status: v })} />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: boolean, record: IFacadeState) => (
        <div className="flex items-center justify-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span>{status ? 'Active' : 'Inactive'}</span>
          <div className="flex gap-1">
            <Tooltip title="Edit">
              <Button
                type="text"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  setIsEditing(record);
                  setOpen('facade');
                }}
                icon={<IconEdit size={14} />}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                onClick={e => {
                  e.stopPropagation();
                  setOpen('delete');
                  setIsEditing(record);
                }}
                icon={<IconTrash size={14} />}
              />
            </Tooltip>
            <Tooltip title="Quotation History">
              <Button
                type="text"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  setOpen('quotation');
                }}
                icon={<IconRotate size={14} className="text-gray-400" />}
              />
            </Tooltip>
          </div>
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
            Total Records {pagination.totalRecords}
          </Button>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => setOpen('facade')}
          >
            New Facade
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={facades}
        pagination={getPaginationConfig({ currentPage, limit: pagination.limit, totalRecords: pagination.totalRecords, setCurrentPage })}
        loading={status === Status.PENDING}
        scroll={{ x: 'max-content' }}
      />

      {open === 'quotation' && (
        <TableDrawer
          open={open === 'quotation'}
          width={1200}
          onClose={() => setOpen(null)}
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

      {open === 'facade' && (
        <ActionDialogmodel
          open={open === 'facade'}
          onCancel={() => {
            setOpen(null);
            setIsEditing(null);
          }}
          title={`${isEditing ? 'Edit' : 'New'} Facade Information`}
          isEditing={!!isEditing}
          initialValues={
            isEditing
              ? {
                facadeId: isEditing.facadeId,
                name: isEditing.name,
                locationId: isEditing.location?.id,
                dwellingTypeId: isEditing.dwellingtype?.id,
                rangeId: isEditing.range?.id,
                costType: isEditing.costType,
                cost: isEditing.cost,
                builderCost: isEditing.builderCost,
                status: isEditing.status,
                image: isEditing.image,
              }
              : {}
          }
          fields={fields}
          onSubmit={handleCreateFacade}
          loading={loading}
        />
      )}

      {open === 'delete' && (
        <ConfirmationModal
          open={open === 'delete'}
          onClose={() => {
            setOpen(null);
            setIsEditing(null);
          }}
          onConfirm={handleDelete}
          title="Confirm Delete"
          message="Are you sure you want to delete this facade? This action cannot be undone."
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
          loading={!!isEditing}
          maxWidth="sm"
        />
      )}
    </div>
  );
};

export default FacadeMaster;
