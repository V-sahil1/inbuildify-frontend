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
  Statistic,
  Modal,
} from "antd";
import {
  IconDots,
  IconFileInvoice,
  IconPlus,
  IconReceipt2,
  IconWallet,
} from "@tabler/icons-react";
import { InvoiceForm } from "./InvoiceForm";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import InvoicePdf from "@/components/common/Invoicepdf";
import { usePdf } from "@hooks/usePdf";
import InvoiceReceiptPdf from "@/components/common/InvoiceReceiptPdf";

const initialData: any[] = [
  {
    id: "MYH00486-I2",
    desc: "2nd deposit",
    amount: 35600.45,
    payment: 0.0,
    status: "OVERDUE",
    date: "17-07-2023",
  },
  {
    id: "MYH00486-I4",
    desc: "base invoice",
    amount: 45000.0,
    payment: 0.0,
    status: "DRAFT",
    date: "06-08-2023",
  },
  {
    id: "MYH00486-I1",
    desc: "Initial Deposit",
    amount: 5000.0,
    payment: 5000.0,
    status: "PAID",
    date: "27-06-2023",
  },
  {
    id: "MYH00486-I3",
    desc: "Returns",
    amount: -50000.0,
    payment: -50000.0,
    status: "PAID",
    date: "31-07-2023",
  },
];

const summaryData = [
  { title: "Total Cost", value: 450280.0, icon: <IconWallet /> },
  { title: "Invoice Generated", value: 35600.45, icon: <IconFileInvoice /> },
  { title: "Payment Received", value: -45000.0, icon: <IconReceipt2 /> },
];

const JobInvoicePayment: React.FC = () => {
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>(initialData);
const invoicePdf = usePdf(InvoicePdf);
const invoiceReceiptPdf = usePdf(InvoiceReceiptPdf);
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
      title: "Invoice ($)",
      dataIndex: "amount",
      render: (val: number, record: any) => (
        <Space direction="vertical" size={0}>
          <span>{typeof val === "number" ? val.toFixed(2) : "—"}</span>
          <Tag>{record.date}</Tag>
        </Space>
      ),
    },
    {
      title: "Payment ($)",
      dataIndex: "payment",
      render: (val: number, record: any) => (
        <Space direction="vertical" size={0}>
          <span>{typeof val === "number" ? val.toFixed(2) : "—"}</span>
          {val !== 0 && <Tag>{record.date}</Tag>}
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
              {
                key:"PreviewInvoice",
                label:"Preview Invoice",
                onClick: invoicePdf.previewPdf
              },
               {
                key:"PreviewReceipt",
                label:"Preview Receipt",
                onClick: invoiceReceiptPdf.previewPdf
              }
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<IconDots size={18} />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        {summaryData.map((s) => (
          <Col xs={24} sm={12} md={8} lg={6} key={s.title}>
            <Card
              style={{
                background: "linear-gradient(180deg, var(--card-color), var(--primary-10))",
                border: "none",
              }}
            >
              <Space direction="vertical" size="small">
                <Space align="center" size="middle">
                  <div className="flex items-center justify-center h-[20px] w-[20px]">{s.icon}</div>
                  <span className="font-medium">{s.title}</span>
                </Space>
                <div className="text-xl font-medium">${s.value.toLocaleString()}</div>
              </Space>
            </Card>
          </Col>
        ))}

        {/* Create Invoice Button as card */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="border border-dashed flex cursor-pointer items-center justify-center bg-body-color hover:border hover:border-primary hover:text-primary transition duration-150"
            onClick={() => {
              setFormMode("create");
              setEditingRecord(null);
            }}
          >
            <Space direction="vertical" align="center">
              <IconPlus size={28} />
              <span style={{ fontWeight: 500 }}>Create Invoice</span>
            </Space>
          </Card>
        </Col>
      </Row>


      <Table
        dataSource={invoices}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
      <Modal
        title={formMode === "edit" ? "Edit Invoice" : "Create Invoice"}
        open={formMode !== null}
        onCancel={() => setFormMode(null)}
        footer={null}
      >
        {formMode && (
          <InvoiceForm
            mode={formMode}
            initialValues={formMode === "edit" ? editingRecord : undefined}
            onFinish={handleFinish}
          />
        )}
      </Modal>

    </Card>
  );
};

export default JobInvoicePayment;
