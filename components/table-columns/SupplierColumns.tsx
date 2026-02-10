import { Input, Select, Button, Tag, message, Popconfirm } from 'antd';
import { IconTrash } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createSupplier,
  deleteSupplier,
  fetchAllSupplierContacts,
  fetchAllSuppliers,
  updateSupplier,
} from '@redux/feature/supplier/supplierThunk';
import { Supplier } from '@redux/feature/supplier/ISupplierState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import TooltipButton from '../common/TooltipButton';
import { Entity } from 'types/common.types';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { useSupplierTypeOptions } from '@hooks/useSupplierTypeHook';
import { Status } from '@lib/constants/enum';

export const useSupplierColumns = (selectedSupplier, setSelectedSupplier, setDrawerOpen) => {
  const dispatch = useAppDispatch();
  const { suppliers, status } = useAppSelector(state => state.supplier);
  const { activeOptions } = useSupplierTypeOptions();
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    delay: 500,
    filtersKey: ['name', 'email', 'phone', 'website', 'type', 'induction', 'isActive'],
    initialValue: { induction: '', isActive: '' },
  });
  useEffect(() => {
    fetchSuppliers();
  }, [filters]);
  useEffect(() => {
    fetchSupplierContact();
  }, [suppliers]);

  const fetchSuppliers = async () => {
    try {
      const params = {
        company_name: filters?.name || undefined,
        emails: filters?.email || undefined,
        phone: filters?.phone || undefined,
        website: filters?.website || undefined,
        supplier_type_id: filters?.type || undefined,
        induction: filters?.induction !== '' ? filters?.induction === 'yes' : undefined,
        status: filters?.isActive !== '' ? filters?.isActive === 'true' : undefined,
      };
      await dispatch(fetchAllSuppliers(params)).unwrap();
    } catch (error) {
      message.error('Failed to fetch suppliers');
    }
  };

  const fetchSupplierContact = async () => {
    try {
      suppliers?.map(async supplier => {
        if (status.supplierContact.fetch === Status.IDLE) {
          await dispatch(fetchAllSupplierContacts(supplier.supplierId)).unwrap();
        }
      });
    } catch (error) {
      message.error('Failed to fetch supplier contact');
    }
  };

  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSupplier(id)).unwrap();
      message.success('Supplier deleted successfully');
      setSelectedSupplier(null);
    } catch (error) {
      message.error('Failed to delete supplier');
    }
  };

  const handleCreate = async values => {
    const imageFields = [
      'workCoverUrl',
      'plInsuranceUrl',
      'whiteCardUrl',
      'forkLiftLicenseUrl',
      'tradeLicenseUrl',
      'inductionPackUrl',
    ];

    const imagePayload = imageFields.reduce((acc, field) => {
      const imageData = values[field];
      acc[field] = imageData?.length > 0 ? imageData[0].originFileObj : null;
      return acc;
    }, {});
    try {
      if (selectedSupplier) {
        const { isUpdated, updatedFields } = getUpdatedFields(
          { ...values, ...imagePayload },
          selectedSupplier
        );
        if (!isUpdated) {
          setSelectedSupplier(null);
          setDrawerOpen(null);
          return;
        }
        await dispatch(
          updateSupplier({ supplierId: selectedSupplier.supplierId, data: updatedFields })
        ).unwrap();
        message.success('Supplier updated successfully');
      } else {
        const supplierData = {
          ...values,
          contacts:
            values.contacts?.map(contact => ({
              contactName: contact.contactName,
              email: contact.email,
              phone: contact.phone,
              contactType: contact.contactType,
            })) || [],
          ...imagePayload,
        };
        const formData = formDataGenerator(supplierData);
        await dispatch(createSupplier(formData)).unwrap();
        message.success('Supplier created successfully');
      }
      setSelectedSupplier(null);
      setDrawerOpen(null);
    } catch (error) {
      message.error('Failed to create supplier');
    }
  };

  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span>Supplier Name</span>
          <Input value={filters.name} onChange={e => setParams({ name: e.target.value ?? '' })} />
        </div>
      ),
      dataIndex: 'companyName',
      width: '20%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Email</span>
          <Input value={filters.email} onChange={e => setParams({ email: e.target.value ?? '' })} />
        </div>
      ),
      dataIndex: 'emails',
      width: '20%',
      render: (value: string[]) => value.join(', '),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Phone</span>
          <Input value={filters.phone} onChange={e => setParams({ phone: e.target.value ?? '' })} />
        </div>
      ),
      dataIndex: 'primaryPhone',
      width: '10%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Website</span>
          <Input
            value={filters.website}
            onChange={e => setParams({ website: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'website',
      width: '15%',
      render: (value: string | undefined) =>
        value ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-blue-500">
            {value}
          </a>
        ) : (
          ''
        ),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Type</span>
          <Select
            allowClear
            value={filters.type}
            onChange={val => setParams({ type: val ?? '' })}
            options={activeOptions}
          />
        </div>
      ),
      dataIndex: 'supplierTypes',
      width: '10%',
      render: (supplierTypes: Entity[]) =>
        supplierTypes && supplierTypes.length
          ? supplierTypes.map(supplierType => supplierType.name).join(', ')
          : '',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Induction</span>
          <Select
            allowClear
            value={filters.induction}
            onChange={val => setParams({ induction: val ?? '' })}
            options={[
              { value: '', label: 'All' },
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </div>
      ),
      dataIndex: 'inductionPackReceived',
      width: '10%',
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Status</span>
          <StatusSelect
            activeInactive={true}
            value={filters.isActive}
            onChange={val => setParams({ isActive: val ?? '' })}
          />
        </div>
      ),
      dataIndex: 'status',
      width: '10%',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'}>{value ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: '',
      dataIndex: 'actions',
      width: '5%',
      render: (_, record: Supplier) => (
        <Popconfirm
          title="Are you sure you want to delete this supplier?"
          onConfirm={e => {
            e.stopPropagation();
            handleDelete(record.supplierId);
          }}
        >
          <TooltipButton
            title="Delete"
            type="text"
            size="small"
            icon={<IconTrash size={16} color="red" />}
            onClick={e => e.stopPropagation()}
          />
        </Popconfirm>
      ),
    },
  ];

  return {
    columns,
    suppliers,
    handleCreate,
  };
};
