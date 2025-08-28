import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Table, Typography, message, Spin } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch } from '@hooks/redux'
import { createContractorThunk, deleteContractorThunk, getContractorByIdThunk, getContractorsThunk, updateContractorThunk } from '@redux/feature/contractor/contractorThunk'
import { ContractorResponse } from "@redux/feature/contractor/IContractorState";
import { DetailModal } from "@/components/common/DetailModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { addressRules, emailRules, nameRules, phoneRules } from "@lib/constants/formInputValidations";

type Contractor = {
  contractorId: string
  name: string
  email: string
  phone: string
  address: string
}

const initialData: Contractor[] = []

const ContractorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, recordId: null });
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<Contractor | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm<Contractor>();
  const [contractors, setContractors] = useState<Contractor[]>(initialData);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getContractorsThunk())
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
      .catch((err) => {
        console.log('GET contractors failed:', err);
        message.error('Failed to fetch contractors');
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
      console.error("Failed to delete the Contractor", err);
      message.error(err);
    } finally {
      setIsDeleteLoading(false);
    }
  };


  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
     await form.validateFields();

      if (isEditing && editingKey) {
        // Update existing contractor 
        const payload = {
          name: values.name,
          phone: values.phone,
          address: values.address,
        };
        const res = await dispatch(updateContractorThunk({ contractorId: editingKey, payload })).unwrap();

        if (res) {
          setContractors(prev =>
            prev.map(c =>
              c.contractorId === editingKey ? { ...c, ...values } : c
            )
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
      message.error(err);
    } finally {
      setLoading(false);
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
        console.log("API Called", response.data);
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
      console.error("Failed to fetch contractor details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const columns: TableColumnsType<Contractor> = useMemo(
    () => [
      {
        title: "Full Name",
        dataIndex: "name",
        key: "name",
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
                	e.stopPropagation(); // ✅ prevent row click
                	handleEdit(record);
              	}}
            	>
              	Edit
            	</Button>
            	<Button
              	type="link"
              	danger
              	onClick={(e) => {
                	console.log("🚀 ~ ContractorPage ~ e:", record)
                	e.stopPropagation(); // ✅ prevent row click
                setIsDeleteModalOpen({open:true, recordId: record.contractorId});
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
            Contractors
          </Typography.Title>
          <button className="btn large bg-[var(--primary)] cursor-pointer text-white" onClick={handleOpenModal}>
            Create 
          </button>
        </div>

        <Spin spinning={loading}>
          <Table
            rowKey="contractorId"
            columns={columns}
            dataSource={contractors}
            pagination={{ pageSize: 10 }}
            loading={false}
            scroll={{ x: "max-content" }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        </Spin>

        <CreateFormModal
          title="Contractor"
          open={isModalOpen}
          loading={loading}
          isEditing={isEditing}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          initialValues={editingUser}  
          fields={[
            {
              label: "Full Name",
              name: "name",
              placeholder: "John Doe",
              rules: nameRules,
            },
            {
              label: "Email",
              name: "email",
              placeholder: "john@example.com",
              type: "email",
              rules: emailRules,
              disabled: isEditing, 
            },
            {
              label: "Phone",
              name: "phone",
              placeholder: "+1 555 0100",
              rules: phoneRules,
            },
            {
              label: "Address",
              name: "address",
              placeholder: "123 Main St, Springfield",
              rules: addressRules,
            },
          ]}
        />


        <DetailModal
          title="Contractor Details"
          open={isViewModalOpen}
          loading={loadingDetails}
          onCancel={() => setIsViewModalOpen(false)}
          data={selectedContractor}
          fields={[
            { label: "Full Name", key: "name" },
            { label: "Email", key: "email", isLink: "email" },
            { label: "Phone", key: "phone", isLink: "phone" },
            { label: "Address", key: "address" },
          ]}
        />
        {
          isDeleteModalOpen.open &&
          <ConfirmationModal
            open={isDeleteModalOpen.open}
            onClose={() => setIsDeleteModalOpen({open:false, recordId: null})}
            onConfirm={() => handleDelete(isDeleteModalOpen.recordId)}
            title="Delete"
            message="Are you sure you want to delete this contractor?"
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

export default ContractorPage;
