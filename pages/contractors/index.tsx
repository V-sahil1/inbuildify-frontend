import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Table, Typography, message, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createContractorThunk,
  createServiceThunk,
  deleteContractorThunk,
  getContractorByIdThunk,
  getContractorsThunk,
  getServicesThunk,
  updateContractorThunk,
} from '@redux/feature/contractor/contractorThunk';
import { ContractorResponse, Service } from '@redux/feature/contractor/IContractorState';
import { DetailModal } from '@/components/common/DetailModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { CreateFormModal } from '@/components/common/Models/CreateFormModel';
import contractorFields from '@/components/formFields/contractorFields';
import rangeAndDwellingTypeFields from '@/components/formFields/rangeAndDwellingTypeFields';
import { setAddServiceModal } from '@redux/feature/contractor/contractorSlice';
import Loading from '@/components/common/Loading';

type Contractor = {
  contractorId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service?: string;
};

const initialData: Contractor[] = [];

const ContractorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({
    open: false,
    recordId: null,
  });
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<Contractor | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm<Contractor>();
  const [contractors, setContractors] = useState<Contractor[]>(initialData);
  const [loading, setLoading] = useState({
    contractors: false,
    services: false,
  });
  const dispatch = useAppDispatch();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [services, setServices] = useState<{ label: string; value: string }[]>([]);
  const addServiceModal = useAppSelector(state => state.contractor.addServiceModal);

  useEffect(() => {
    setLoading({
      contractors: true,
      services: false,
    });
    const fetchContractorData = async () => {
      await dispatch(getContractorsThunk())
        .unwrap()
        .then((res: ContractorResponse) => {
          // const mappedContractors: Contractor[] = res.map(contractor => ({
          //   key: contractor.contractorId,
          //   fullName: contractor.name,
          //   email: contractor.email,
          //   phone: contractor.phone,
          //   address: contractor.address,
          // }));
          setContractors(res);
        })
        .catch(err => {
          message.error(err || 'Failed to fetch contractors');
        })
        .finally(() => {
          setLoading({
            contractors: false,
            services: false,
          });
        });
    };
    fetchContractorData();
  }, [dispatch]);

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingKey(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Contractor) => {
    setIsEditing(true);
    setEditingKey(record.contractorId);
    setEditingUser(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingKey(null);
  };

  const handleDelete = async (key: string) => {
    try {
      setIsDeleteLoading(true);
      const res = await dispatch(deleteContractorThunk(key)).unwrap();

      if (res) {
        message.success(res.message);
        setIsDeleteModalOpen({ open: false, recordId: null });
        setContractors(prev => prev.filter(c => c.contractorId !== key));
      }
    } catch (err) {
      message.error(err || 'Failed to delete the Contractor');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    await form.validateFields();
    try {
      setLoading({
        contractors: true,
        services: false,
      });
      if (isEditing && editingKey) {
        // Update existing contractor
        const payload = {
          name: values.name,
          phone: values.phone,
          address: values.address,
          service: values.service,
        };
        const res = await dispatch(
          updateContractorThunk({ contractorId: editingKey, payload })
        ).unwrap();

        if (res) {
          setContractors(prev =>
            prev.map(c => (c.contractorId === editingKey ? { ...c, ...values } : c))
          );
          message.success(res.message);
        }
      } else {
        // Create new contractor
        const res = await dispatch(
          createContractorThunk({
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            service: values.service,
          })
        ).unwrap();
        if (res) {
          const data = res.data;
          const newContractor: Contractor = {
            contractorId: data.contractorId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            service: data.service,
          };
          setContractors(prev => [newContractor, ...prev]);
          message.success(res.message);
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      setIsEditing(false);
      setEditingKey(null);
    } catch (err) {
      message.error(err || 'Failed to create contractor');
    } finally {
      setLoading({
        contractors: false,
        services: false,
      });
    }
  };

  const handleRowClick = async (record: Contractor) => {
    try {
      setLoadingDetails(true);
      setIsViewModalOpen(true);

      // Call API with contractorId
      const response = await dispatch(getContractorByIdThunk(record.contractorId)).unwrap();

      if (response && response.data) {
        // Transform API response into Contractor type
        //   const contractor = {
        //   contractorId: response.data.contractorId,
        //   name: response.data.name,
        //   email: response.data.email,
        //   phone: response.data.phone,
        //   address: response.data.address,
        // };
        setSelectedContractor(response.data);
      }
    } catch (error) {
      message.error(error || 'Failed to fetch contractor details:');
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading({
        contractors: false,
        services: true,
      });
      try {
        const services = await dispatch(getServicesThunk()).unwrap();
        const mappedServices =
          services?.map((service: Service) => ({
            label: service.service,
            value: service.service,
          })) || [];
        setServices(mappedServices);
      } catch (error) {
        message.error(error || 'Failed to fetch services');
      } finally {
        setLoading({
          contractors: false,
          services: false,
        });
      }
    };

    fetchServices();
  }, [dispatch]);

  const handleServiceSubmit = async (values: any) => {
    try {
      setLoading({
        contractors: false,
        services: true,
      });

      await dispatch(createServiceThunk({ service: values.name })).unwrap();
      message.success('Service added successfully');
      setIsModalOpen(true);
    } catch (error: any) {
      message.error(error);
    } finally {
      dispatch(setAddServiceModal(false));
      setLoading({
        contractors: false,
        services: false,
      });
    }
  };

  const columns: TableColumnsType<Contractor> = useMemo(
    () => [
      {
        title: 'Full Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width: 200,
        render: (_, record) => (
          <Tooltip title={record.address}>
            {' '}
            <p className="line-clamp-2">{record?.address}</p>
          </Tooltip>
        ),
      },
      {
        title: 'Service',
        dataIndex: 'service',
        key: 'service',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className="flex gap-2">
            <Button
              type="link"
              onClick={e => {
                e.stopPropagation();
                handleEdit(record);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              onClick={e => {
                e.stopPropagation();
                setIsDeleteModalOpen({
                  open: true,
                  recordId: record.contractorId,
                });
              }}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <Typography.Title level={4} style={{ margin: 0, color: 'var(--font-color)' }}>
            Contractors
          </Typography.Title>
          <button
            className="btn large bg-[var(--primary)] cursor-pointer text-white"
            onClick={handleOpenModal}
          >
            Create
          </button>
        </div>

        {loading.contractors ? (
          <div className="flex justify-center items-center py-20">
            <Loading type="primary" />
          </div>
        ) : (
          <Table
            rowKey="contractorId"
            columns={columns}
            dataSource={contractors}
            pagination={{ pageSize: 10 }}
            loading={false}
            scroll={{ x: 'max-content' }}
            onRow={record => ({
              style: { cursor: 'pointer' },
              onClick: () => handleRowClick(record),
            })}
          />
        )}

        <CreateFormModal
          title="Contractor"
          open={isModalOpen}
          loading={loading.contractors}
          isEditing={isEditing}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          initialValues={editingUser}
          fields={contractorFields()}
        />

        <CreateFormModal
          title="Sevice"
          open={addServiceModal}
          loading={loading.services}
          onCancel={() => dispatch(setAddServiceModal(false))}
          onSubmit={handleServiceSubmit}
          fields={rangeAndDwellingTypeFields()}
        />

        <DetailModal
          title="Contractor Details"
          open={isViewModalOpen}
          loading={loadingDetails}
          onCancel={() => setIsViewModalOpen(false)}
          data={selectedContractor}
          fields={[
            { label: 'Full Name', key: 'name' },
            { label: 'Email', key: 'email', isLink: 'email' },
            { label: 'Phone', key: 'phone', isLink: 'phone' },
            { label: 'Address', key: 'address' },
          ]}
        />
        {isDeleteModalOpen.open && (
          <ConfirmationModal
            open={isDeleteModalOpen.open}
            onClose={() => setIsDeleteModalOpen({ open: false, recordId: null })}
            onConfirm={() => handleDelete(isDeleteModalOpen.recordId)}
            // title="Delete"
            message="Are you sure you want to delete this contractor?"
            type="danger"
            confirmText="Delete"
            cancelText="Cancel"
            loading={isDeleteLoading}
            maxWidth="sm"
          />
        )}
      </div>
    </div>
  );
};

export default ContractorPage;
