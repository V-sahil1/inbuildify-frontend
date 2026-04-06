import React, { useEffect, useState } from 'react';
import { Button, Image, message, Empty, Spin, Pagination, Space, Tooltip } from 'antd';
import { IconPlus, IconRotate, IconEdit, IconTrash, IconDownload } from '@tabler/icons-react';
import { debouncedURL } from '@lib/utils/debounceURL';
import { TableDrawer } from '@/components/common/TableDrawer';
import { facadeFields } from '@/components/formFields/facadeFields';
import { ActionDialogmodel, FormField } from '@/components/common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  getFacades,
  createFacade,
  updateFacade,
  deleteFacade,
} from '@redux/feature/facade/facadeThunk';
import { GetFacadesParams, IFacadeState } from '@redux/feature/facade/IFacadeState';
import { Status } from '@lib/constants/enum';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { QuotationHistory } from '@lib/utils/Reports/quotation/QuotationHistory';
import TooltipButton from '@/components/common/TooltipButton';

const FacadeMaster = () => {
  const [open, setOpen] = useState<'quotation' | 'facade' | 'delete' | null>(null);
  const [isEditing, setIsEditing] = useState<IFacadeState | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { facades, status, pagination } = useAppSelector(state => state.facade);
  const dispatch = useAppDispatch();
  const { columns: quotationColumns, data } = QuotationHistoryColumn();

  const PAGE_SIZE = 10;

  const fields = facadeFields({
    isDwellingDisable: false,
    type: (isEditing?.costType as 'standard' | 'upgrade') || 'standard',
  }) as FormField[];

  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['name', 'dwellingType', 'range', 'costType', 'location', 'status', 'cost'],
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
      params.cost_type = filters?.costType as 'standard' | 'upgrade' || undefined;
      params.dwelling_type_id = filters.dwellingType || undefined;
      params.range_id = filters.range || undefined;
      params.location_id = filters.location || undefined;
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

  return (
    <div className="p-6 h-[calc(100vh-150px)] flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold">Facade Master</h1>
        <div className="flex items-center gap-2">
          <Button type="primary" ghost>
            Total Records {pagination.totalRecords}
          </Button>
          <Button type="primary" icon={<IconPlus size={16} />} onClick={() => setOpen('facade')}>
            New Facade
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        {status == Status.PENDING ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : facades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facades?.map((facade: IFacadeState) => (
              <div
                key={facade.facadeId}
                className="card bg-card-color p-4 rounded-xl flex flex-col items-center border border-border-color relative group"
              >
                {/* Hover overlay with blur effect */}
                <div className="absolute inset-0 bg-black-50 bg-opacity-50 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                  <Tooltip title="Edit">
                    <button
                      className="p-2 bg-white bg-opacity-80 text-black rounded-full hover:bg-opacity-100 transition-all duration-200"
                      onClick={e => {
                        e.stopPropagation();
                        setIsEditing(facade);
                        setOpen('facade');
                      }}
                    >
                      <IconEdit />
                    </button>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <button
                      className="p-2 bg-white bg-opacity-80 text-black rounded-full hover:bg-opacity-100 transition-all duration-200"
                      onClick={e => {
                        e.stopPropagation();
                        setOpen('delete');
                        setIsEditing(facade);
                      }}
                    >
                      <IconTrash color="red" size={20} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Quotation History">
                    <button
                      className="p-2 bg-white bg-opacity-80 text-black rounded-full hover:bg-opacity-100 transition-all duration-200"
                      onClick={e => {
                        e.stopPropagation();
                        setOpen('quotation');
                      }}
                    >
                      <IconRotate size={20} />
                    </button>
                  </Tooltip>
                </div>

                <Image
                  src={facade?.image ? facade?.image : ''}
                  alt={facade?.name}
                  className="mb-4 w-[200px] h-[200px]"
                  width={200}
                  height={200}
                />

                <div className="mt-2 flex w-full rounded-lg p-4 overflow-hidden shadow-sm bg-body-color">
                  {/* Left Section */}
                  <div className="flex-1 space-y-2 pr-4">
                    <h5 className="text-[20px]/[24px] font-bold mb-4 text-center">
                      {facade?.name}
                    </h5>
                    <div className="flex justify-between">
                      <span className="font-medium">Dwelling Type :</span>
                      <span>{facade?.dwellingtype?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Range :</span>
                      <span>{facade?.range?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Cost Type :</span>
                      <span>{facade?.costType || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Cost :</span>
                      <span>{facade?.cost || 'N/A'}</span>
                    </div>
                    {/* <div className="flex justify-between gap-5">
                      <span className="font-medium">Created At :</span>
                      <span>{facade?.createdAt?.split('T')[0] || 'N/A'}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            description={
              <span className="text-gray-500">
                No facade found. Create your first facade to get started.
              </span>
            }
            className="py-12"
          />
        )}
      </div>
      <div className="flex justify-end mt-3 flex-shrink-0">
        <Pagination
          current={currentPage || 1}
          pageSize={pagination?.limit || PAGE_SIZE}
          total={pagination?.totalRecords || 0}
          showSizeChanger={false}
          showQuickJumper={false}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} facades`}
          onChange={page => {
            setCurrentPage(page);
          }}
        />
      </div>

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
                // locationId: isEditing.location?.id,
                dwellingTypeId: isEditing.dwellingtype?.id,
                rangeId: isEditing.range?.id,
                costType: isEditing.costType,
                cost: isEditing.cost,
                builderCost: isEditing.builderCost,
                status: isEditing.status ? 'true' : 'false',
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
          maxWidth="sm"
        />
      )}
    </div>
  );
};

export default FacadeMaster;
