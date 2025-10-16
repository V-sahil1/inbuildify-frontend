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
import InvoicePdf from "@/components/common/Invoicepdf";
import { usePdf } from "@hooks/usePdf";
import InvoiceReceiptPdf from "@/components/common/InvoiceReceiptPdf";
import StatusTracker, { Stage } from "@/components/common/StatusTracker";
import { JobinvoiceData } from "data/sampleData";
import { ActionDialogmodel } from "@/components/common/Models/ActionDialogModel";


const summaryData = [
  { title: "Total Cost", value: 450280.0, icon: <IconWallet /> },
  { title: "Invoice Generated", value: 35600.45, icon: <IconFileInvoice /> },
  { title: "Payment Received", value: -45000.0, icon: <IconReceipt2 /> },
];

const JobInvoicePayment: React.FC = () => {
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isContractDetailsModalVisible, setIsContractDetailsModalVisible] = useState<boolean>();
  const [showContractNotice, setShowContractNotice] = useState(true);
  const [invoices, setInvoices] = useState<any[]>(JobinvoiceData);
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
  }
  const handleContractDetails = () => {
    setIsContractDetailsModalVisible(true);
  }

  const handleResendInvoice = (record: any) => {
    message.success("Resend invoice!");
  }

  const handleSendReceipt = (record: any) => {
    message.success("Send Receipt!");
  }

  const handleSyncToXero = (record: any) => {
    message.success("Synk To Xero!");
  }

  const [stages, setStages] = useState<Stage[]>([
    {
      id: 1,
      title: "Create Invoice",
      status: "active",
      buttons: [
        {
          label: "Edit Invoice",
          type: "primary",
          onClick: () => handleStageClick(2),
        },
      ],
    },
    {
      id: 2,
      title: "Send Invoice",
      status: "disabled",
      buttons: [
        {
          label: "Send",
          type: "primary",
          onClick: () => handleStageClick(3),
        },
        {
          label: "Skip Sending",
          onClick: () => handleStageClick(3),
        },
      ],
    },
    {
      id: 3,
      title: "Record Payment",
      status: "disabled",
      buttons: [
        {
          label: "Record Payment",
          type: "primary",
          onClick: () => handleStageClick(4),
        },
      ],
    },
    {
      id: 4,
      title: "Send Receipt",
      status: "disabled",
      buttons: [
        {
          label: "Send Receipt",
          type: "primary",
          onClick: () => handleStageClick(5),
        },
      ],
    },
  ]);

  const handleStageClick = (clickedId: number) => {
    setStages((prevStages) =>
      prevStages.map((stage) => {
        if (stage.status === "completed") return stage;

        if (stage.id < clickedId) return { ...stage, status: "completed" };
        if (stage.id === clickedId) return { ...stage, status: "active" };
        return { ...stage, status: "disabled" };
      })
    );
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
      render: (_: any, record: any) => {
        const isPaid = record.status === "PAID";
        const menuItems = isPaid
          ? [
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
              key: "PreviewInvoice",
              label: "Preview Invoice",
              onClick: invoicePdf.previewPdf,
            },
            {
              key: "PreviewReceipt",
              label: "Preview Receipt",
              onClick: invoiceReceiptPdf.previewPdf,
            },
            {
              key: "ResendInvoice",
              label: "Reset Invoice",
              onClick: () => handleResendInvoice(record),
            },
            {
              key: "SendReceipt",
              label: "Send Receipt",
              onClick: () => handleSendReceipt(record),
            },
            {
              key: "SyncToXero",
              label: "Sync To Xero",
              onClick: () => handleSyncToXero(record),
            },
          ]
          : [
            {
              key: "delete",
              label: "Delete",
              onClick: () => handleDelete(record),
            },
          ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
          >
            <Button type="text" icon={<IconDots size={18} />} />
          </Dropdown>
        );
      },
    }

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
      {showContractNotice && (
        <Row>
          <span className="w-full bg-primary-10 mt-3 font-base text-font-color text-lg my-2">
            Contract sign date is not provided,&nbsp;
            <a
              className="text-blue underline cursor-pointer"
              onClick={() => {
                setIsContractDetailsModalVisible(true);

              }}
            >
              click here
            </a>
            &nbsp;to provide the dates. Note: On providing the date, stage payment invoices will be created.
          </span>
        </Row>
      )}
      {/* Invoices Table & Workflow */}
      <Row gutter={[24, 24]} align="top" className="mt-10">
        <Col xs={24} md={14} lg={14}>
          <Card
            title="Invoices"
            className="shadow-sm border border-gray-100"
            bodyStyle={{ padding: 16 }}
          >
            <Table
              dataSource={invoices}
              columns={columns}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
{/* //show this component when new invoice in successfully created according to selected options the table view is also getting changed*/}
        <Col xs={24} md={10} lg={10}>
          <Card
            title="Invoice Workflow"
            className="shadow-sm border border-gray-100"
            bodyStyle={{ padding: 16 }}
          >
            <StatusTracker
              stages={stages.map((stage) => ({
                ...stage,
                buttons: stage.status === "disabled" ? [] : stage.buttons,
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Invoice Modal */}
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
      <ActionDialogmodel
        open={isContractDetailsModalVisible}
        onCancel={() => setIsContractDetailsModalVisible(false)}
        title="Contract Details"
        isEditing={true}
        fields={[
          {
            name: "prepareddate",
            label: "Prepared date",
            type: "date" as const,
            extra: ''
          },
          {
            name: "signeddate",
            label: "Signed date",
            type: "date" as const,
          },
        ]}
        onSubmit={() => {
          setIsContractDetailsModalVisible(false);
          message.success("Contract details saved successfully!");
          setShowContractNotice(false);
        }}
        submitButtonText="Confirm"
      />
    </Card>
  );

};

export default JobInvoicePayment;
