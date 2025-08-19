import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Table, Typography, message, Spin } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch } from '@hooks/redux'
import { createContractorThunk, getContractorsThunk } from '@redux/feature/contractor/contractorThunk'
import { ContractorResponse } from "@redux/feature/contractor/IContractorState";

type Contractor = {
  key: string
  fullName: string
  email: string
  phone: string
  address: string
}

const initialData: Contractor[] = []

const ContractorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<Contractor>();
  const [contractors, setContractors] = useState<Contractor[]>(initialData);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()

  useEffect(() => {
    setLoading(true);
    dispatch(getContractorsThunk())
      .unwrap()
      .then((res: ContractorResponse) => {
        const mappedContractors: Contractor[] = res.map(contractor => ({
          key: contractor.contractorId,
          fullName: contractor.name,
          email: contractor.email,
          phone: contractor.phone,
          address: contractor.address,
        }));
        setContractors(mappedContractors);
      })
      .catch((err) => {
        console.log('GET contractors failed:', err);
        message.error('Failed to fetch contractors');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch])

  const columns: TableColumnsType<Contractor> = useMemo(
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
    ],
    []
  );

  const handleOpenModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await dispatch(
        createContractorThunk({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
        })
      ).unwrap()

      const newContractor: Contractor = {
        key: `${Date.now()}`,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
      }
      setContractors((prev) => [newContractor, ...prev])
      setIsModalOpen(false)
      form.resetFields()
    } catch (err) {
      message.error((err as any)?.message || 'Failed to create contractor')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <Typography.Title level={4} style={{ margin: 0, color: "var(--font-color)" }} >
            Contractors
          </Typography.Title>
          <Button type="primary" onClick={handleOpenModal} loading={loading}>
            Create Contractor
          </Button>
        </div>

        <Spin spinning={loading}>
          <Table
            rowKey="key"
            columns={columns}
            dataSource={contractors}
            pagination={{ pageSize: 10 }}
            loading={false}
          />
        </Spin>

        <Modal
          title="Create Contractor"
          open={isModalOpen}
          onOk={handleCreate}
          onCancel={handleCancel}
          okText="Create"
          confirmLoading={loading}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="john@example.com" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter phone" }]}
            >
              <Input placeholder="+1 555 0100" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input placeholder="123 Main St, Springfield" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ContractorPage;
