import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Table,
  Tag,
  Button,
  Space,
  Dropdown,
  message,
} from "antd";
import {
  IconDots,
  IconFileInvoice,
  IconPlus,
  IconReceipt2,
  IconWallet,
} from "@tabler/icons-react";
import { InvoiceForm } from "./InvoiceForm";

interface JobInvoicePaymentProps {
  data: any[];
  dataSummary: { title: string; value: number }[];
}

const JobInvoicePayment: React.FC<JobInvoicePaymentProps> = ({
  data,
  dataSummary,
}) => {
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const [invoices, setInvoices] = useState<any[]>(
    Array.isArray(data) ? data : []
  );

  const statusColors: Record<string, string> = {
    OVERDUE: "red",
    DRAFT: "default",
    PAID: "green",
  };

  const handleFinish = (values: any, mode: "create" | "edit") => {
    if (mode === "create") {
      setInvoices([
        ...invoices,
        { id: `MYH00${invoices.length + 1}`, ...values, status: "DRAFT" },
      ]);
      message.success("Invoice created!");
    } else {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingRecord.id ? { ...inv, ...values } : inv
        )
      );
      message.success("Invoice updated!");
    }

    setFormMode(null);
    setEditingRecord(null);
  };

  const handleDelete = (record: any) => {
    setInvoices(invoices.filter((inv) => inv.id !== record.id));
    message.success("Invoice deleted!");
  };

  const columns = [
    { title: "Invoice ID", dataIndex: "id" },
    { title: "Description", dataIndex: "desc" },
    {
      title: "Invoice($)",
      dataIndex: "amount",
      render: (val: number, record: any) => (
        <Space direction="vertical" size={0}>
          <span>{typeof val === "number" ? val.toFixed(2) : "—"}</span>
          <Tag color="blue">{record.date}</Tag>
        </Space>
      ),
    },
    {
      title: "Payment($)",
      dataIndex: "payment",
      render: (val: number, record: any) => (
        <Space direction="vertical" size={0}>
          <span>{typeof val === "number" ? val.toFixed(2) : "—"}</span>
          {val !== 0 && <Tag color="blue">{record.date}</Tag>}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Modify",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
                onClick: () => {
                  setFormMode("edit");
                  setEditingRecord(record);
                },
              },
              {
                key: "delete",
                label: "Delete",
                onClick: () => handleDelete(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<IconDots size={18} />} />
        </Dropdown>
      ),
    },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    "Total Cost": <IconWallet />,
    "Invoice Generated": <IconFileInvoice />,
    "Payment Received": <IconReceipt2 />,
  };

  return (
    <>
      {/* Summary Cards + Create */}
      <div className="flex flex-col justify-center bg-card-color">
        <Row
          gutter={[16, 16]}
          align="middle"
          justify="space-between"
          style={{ marginBottom: 16, marginTop: 8 }}
        >
          {/* Left: Summary Cards */}
          <Col flex="auto">
            <Row gutter={[16, 16]}>
              {dataSummary?.map((s) => (
                <Col key={s.title} xs={24} sm={12} md={8} lg={6}>
                  <Card>
                    <div className="flex items-center gap-3">
                      {iconMap[s.title]}
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">{s.title}</span>
                        <span className="text-xl font-semibold">
                          ${s.value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Right: Button */}
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<IconPlus size={18} />}
              onClick={() => {
                setFormMode("create");
                setEditingRecord(null);
              }}
            >
              Create Invoice
            </Button>
          </Col>
        </Row>

        {/* Table + Form */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={formMode ? 14 : 24}>
            <Table
              dataSource={invoices}
              columns={columns}
              pagination={false}
              rowKey="id"
              scroll={{ x: true }}
            />
          </Col>

          {formMode && (
            <Col xs={24} lg={10}>
              <InvoiceForm
                mode={formMode}
                initialValues={formMode === "edit" ? editingRecord : undefined}
                onFinish={handleFinish}
                onCancel={() => {
                  setFormMode(null);
                  setEditingRecord(null);
                }}
              />
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default JobInvoicePayment;
