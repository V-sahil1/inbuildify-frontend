import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Table, Typography, message, Spin } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch } from '@hooks/redux'
import { createContractorThunk, deleteContractorThunk, getContractorByIdThunk, getContractorsThunk, updateContractorThunk } from '@redux/feature/contractor/contractorThunk'
import { ContractorResponse } from "@redux/feature/contractor/IContractorState";
import { DetailModal } from "@/components/common/DetailModal";

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
  const [isEditing, setIsEditing] = useState(false);
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

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingKey(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Contractor) => {
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

 const handleDelete = async (record: Contractor) => {
  try {
    const contractorId = record.key;

    const res = await dispatch(deleteContractorThunk(contractorId)).unwrap();

    if (res) {
      message.success(res.message);
      setContractors(prev => prev.filter(c => c.key !== record.key));
    }
  } catch (err) {
    console.error("Failed to delete the Contractor", err);
    message.error(err);
  }
};


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (isEditing && editingKey) {
        // Update existing contractor 
        const payload = {
          name: values.fullName,
          phone: values.phone,
          address: values.address,
        };
        const res = await dispatch(updateContractorThunk({ contractorId: editingKey, payload })).unwrap();

        if(res){
        setContractors(prev =>
          prev.map(c =>
            c.key === editingKey ? { ...c, ...values } : c
          )
        );
        message.success(res.message);
        }
      } else {
        // Create new contractor
        const res  = await dispatch(
          createContractorThunk({
            name: values.fullName,
            email: values.email,
            phone: values.phone,
            address: values.address,
          })
        ).unwrap();
        if(res){

        const newContractor: Contractor = {
          key: `${Date.now()}`,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
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
      message.error((err as any)?.message || 'Failed to save contractor');
    } finally {
      setLoading(false);
    }
  };

 const handleRowClick = async (record: Contractor) => {
  try {
    setLoadingDetails(true);
    setIsViewModalOpen(true);

    // Call API with contractorId
    const response = await dispatch(getContractorByIdThunk(record.key)).unwrap();
    
    if (response && response.data) {
      // Transform API response into Contractor type
      console.log("API Called", response.data);
        const contractor = {
        key: response.data.contractorId,
        fullName: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
      };
       setSelectedContractor(contractor);
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
                e.stopPropagation(); // ✅ prevent row click
                handleDelete(record);
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
          <button className="btn large bg-[#4c3575] cursor-pointer text-white" onClick={handleOpenModal}>
            Create Contractor
          </button>
        </div>

        <Spin spinning={loading}>
          <Table
            rowKey="key"
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

        <Modal
          title={isEditing ? "Edit Contractor" : "Create Contractor"}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText={isEditing ? "Update" : "Create"}
          confirmLoading={loading}
          cancelButtonProps={{
            style: { color: "#4c3575", borderColor: "#4c3575" }, 
          }}
           okButtonProps={{
            style: { backgroundColor: "#4c3575", borderColor: "#4c3575" },
          }}
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
              <Input placeholder="john@example.com"  disabled={isEditing}/>
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter phone" },
                 {
                    pattern: /^\d{10,15}$/,
                    message: "Phone number must be between 10 to 15 digits",
                 },
              ]}
            >
              <Input placeholder="+1 555 0100" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address" },
                      { min: 10, message: "Address must be at least 10 characters" },
                     ]}
            >
              <Input placeholder="123 Main St, Springfield" />
            </Form.Item>
          </Form>
        </Modal>

        {/* <Modal
          title="Contractor Details"
          open={isViewModalOpen}
          footer={null}
          onCancel={() => setIsViewModalOpen(false)}
        >
          {loadingDetails ? (
            <p>Loading contractor details...</p>
          ) : selectedContractor ? (
            <div className="space-y-2">
              <p><strong>Full Name:</strong> {selectedContractor.fullName}</p>
              <p><strong>Email:</strong> {selectedContractor.email}</p>
              <p><strong>Phone:</strong> {selectedContractor.phone}</p>
              <p><strong>Address:</strong> {selectedContractor.address}</p>
            </div>
          ) : (
            <p>No contractor details found.</p>
          )}
        </Modal> */}
        {/* <Modal
          title="Contractor Details"
          open={isViewModalOpen}
          footer={null}
          onCancel={() => setIsViewModalOpen(false)}
          centered
        >
          {loadingDetails ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" />
            </div>
          ) : selectedContractor ? (
            <div className="">
              <Card bordered={false} className="shadow-md mt-3 rounded-xl ">
                <Descriptions
                  bordered
                  column={1}
                  labelStyle={{ fontWeight: 600, width: "150px" }}
                  contentStyle={{ backgroundColor: "#fff" }}
                >
                  <Descriptions.Item label="Full Name">
                    {selectedContractor.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <a href={`mailto:${selectedContractor.email}`}>
                      {selectedContractor.email}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <a href={`tel:${selectedContractor.phone}`}>
                      {selectedContractor.phone}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {selectedContractor.address}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          ) : (
            <p className="text-center text-gray-500">No contractor details found.</p>
          )}
        </Modal> */}

        <DetailModal
          title="Contractor Details"
          open={isViewModalOpen}
          loading={loadingDetails}
          onCancel={() => setIsViewModalOpen(false)}
          data={selectedContractor}
          fields={[
            { label: "Full Name", key: "fullName" },
            { label: "Email", key: "email", isLink: "email" },
            { label: "Phone", key: "phone", isLink: "phone" },
            { label: "Address", key: "address" },
          ]}
        />

      </div>
    </div>
  );
};

export default ContractorPage;
