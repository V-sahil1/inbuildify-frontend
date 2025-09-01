import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Table, Typography, message, Spin } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch } from '@hooks/redux'
import { createCustomerThunk, deleteCustomerThunk, getCustomerByIdThunk, getCustomersThunk, updateCustomerThunk } from "@redux/feature/customer/customerThunk";
import { DetailModal } from "@/components/common/DetailModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { addressRules, emailRules, nameRules, phoneRules } from "@lib/constants/formInputValidations";
import { customerCreateFields } from "@/components/formFields/customerCreateFields";

type Customer = {
  key: string
  fullName: string
  email: string
  phone: string
  address: string
}

const initialData: Customer[] = []

const CustomerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, recordId: null });
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [form] = Form.useForm<Customer>();
  const [customers, setCustomers] = useState<Customer[]>(initialData);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getCustomersThunk())
      .unwrap()
      .then((res: any) => {
        const mappedCustomer: Customer[] = res?.data?.map((customer: any) => ({
          key: customer?.customerId,
          fullName: customer?.name,
          email: customer?.email,
          phone: customer?.phone,
          address: customer?.address,
        }));
        setCustomers(mappedCustomer);
      })
      .catch((err) => {
        console.log('GET customer failed:', err);
        message.error('Failed to fetch customers');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch])

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingKey(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Customer) => {
    setIsEditing(true);
    setEditingKey(record.key);
    form.setFieldsValue(record);
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
      const res = await dispatch(deleteCustomerThunk(key)).unwrap();

      if (res) {
        message.success(res.message);
        setIsDeleteModalOpen({ open: false, recordId: null });
        setCustomers(prev => prev.filter(c => c.key !== key));
      }
    } catch (err) {
      console.error("Failed to delete the Contractor", err);
      message.error(err);
    } finally {
      setIsDeleteLoading(false);
    }
  };


  const handleSubmit = async (values) => {
    await form.validateFields();
    try {
      setLoading(true);
      if (isEditing && editingKey) {
        // Update existing contractor 
        const payload = {
          name: values.fullName,
          phone: values.phone,
          address: values.address,
        };
        const res = await dispatch(updateCustomerThunk({ customerId: editingKey, payload })).unwrap();

        if (res) {
          setCustomers(prev =>
            prev.map(c =>
              c.key === editingKey ? { ...c, ...values } : c
            )
          );
          message.success(res.message);
        }
      } else {
        // Create new contractor
        const res = await dispatch(
          createCustomerThunk({
            name: values.fullName,
            email: values.email,
            phone: values.phone,
            address: values.address,
          })
        ).unwrap();

        if (res) {
          const data = res.data
          const newContractor: Customer = {
            key: data.customerId,
            fullName: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
          };
          setCustomers(prev => [newContractor, ...prev]);
          message.success(res.message);
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      setIsEditing(false);
      setEditingKey(null);
    } catch (err) {
      console.log("Error", err);
      message.error(err || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (record: Customer) => {
    try {
      setLoadingDetails(true);
      setIsViewModalOpen(true);

      const response = await dispatch(getCustomerByIdThunk(record.key)).unwrap();

      if (response && response.data) {

        const customer = {
          key: response.data.customer_id,
          fullName: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
        };
        setSelectedCustomer(customer);
      }
    } catch (error) {
      message.error(error || 'Failed to fetch customer details');
    } finally {
      setLoadingDetails(false);
    }
  };



  const columns: TableColumnsType<Customer> = useMemo(
    () => [
      {
        title: "Full Name",
        dataIndex: "fullName",
        key: "fullName",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <div className="flex gap-2">
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen({ open: true, recordId: record.key });

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
          <Typography.Title level={4} style={{ margin: 0, color: "var(--font-color)" }}>
            Customers
          </Typography.Title>
          <button className="btn large bg-[var(--primary)] cursor-pointer text-white" onClick={handleOpenModal}>
            Create Customer
          </button>
        </div>

        <Spin spinning={loading}>
          <Table
            rowKey="key"
            columns={columns}
            dataSource={customers}
            pagination={{ pageSize: 10 }}
            loading={false}
            scroll={{ x: "max-content" }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        </Spin>

        <CreateFormModal
          open={isModalOpen}
          title="Customer"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isEditing={editingKey ? true : false}
          initialValues={editingKey ? customers.find((c) => c.key === editingKey) : {}}
          fields={[...customerCreateFields, {
            name: "email",
            label: "Email",
            rules: emailRules,
            disabled: isEditing

          },]}
        />

        <DetailModal
          title="Customer Details"
          open={isViewModalOpen}
          loading={loadingDetails}
          onCancel={() => setIsViewModalOpen(false)}
          data={selectedCustomer}
          fields={[
            { label: "Full Name", key: "fullName" },
            { label: "Email", key: "email", isLink: "email" },
            { label: "Phone", key: "phone", isLink: "phone" },
            { label: "Address", key: "address" },
          ]}
        />
        {
          isDeleteModalOpen.open &&
          <ConfirmationModal
            open={isDeleteModalOpen.open}
            onClose={() => setIsDeleteModalOpen({ open: false, recordId: null })}
            onConfirm={() => handleDelete(isDeleteModalOpen.recordId)}
            // title="Delete"
            message="Are you sure you want to delete this customer?"
            type="danger"
            confirmText="Delete"
            cancelText="Cancel"
            loading={isDeleteLoading}
            maxWidth="sm"
          />
        }
      </div>
    </div>
  );
};

export default CustomerPage;
