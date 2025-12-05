import React, { useState } from 'react';
import { Card, Col, Row, Table, Tag, Button, Space, Dropdown, message, Checkbox } from 'antd';
import {
  IconDots,
  IconFileInvoice,
  IconPlus,
  IconReceipt2,
  IconWallet,
  IconX,
} from '@tabler/icons-react';
import { InvoiceForm } from './InvoiceForm';
import { SendInvoiceForm } from './SendInvoiceForm';
import { RecordPaymentForm } from './RecordPaymentForm';
import InvoicePdf from '@/components/common/pdf/Invoicepdf';
import { usePdf } from '@hooks/usePdf';
import InvoiceReceiptPdf from '@/components/common/pdf/InvoiceReceiptPdf';
import StatusTracker, { Stage } from '@/components/common/StatusTracker';
import { JobinvoiceData } from 'data/sampleData';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';

const summaryData = [
  { title: 'Total Cost', value: 450280.0, icon: <IconWallet /> },
  { title: 'Invoice Generated', value: 35600.45, icon: <IconFileInvoice /> },
  { title: 'Payment Received', value: -45000.0, icon: <IconReceipt2 /> },
];

const JobInvoicePayment: React.FC = () => {
  const [rightPanelState, setRightPanelState] = useState<
    'invoice-form' | 'send-form' | 'status-tracker' | 'record-payment' | 'send-receipt-form' | null
  >(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string>('');
  const [isContractDetailsModalVisible, setIsContractDetailsModalVisible] = useState<boolean>();
  const [showContractNotice, setShowContractNotice] = useState(true);
  const [isSendReceiptModalVisible, setIsSendReceiptModalVisible] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<any[]>(JobinvoiceData);
  const invoicePdf = usePdf(InvoicePdf);
  const invoiceReceiptPdf = usePdf(InvoiceReceiptPdf);
  const statusColors: Record<string, string> = {
    OVERDUE: 'red',
    DRAFT: 'default',
    PAID: 'green',
  };
  const handleFinish = (values: any, mode: 'create' | 'edit') => {
    if (mode === 'create') {
      setInvoices([...invoices, { id: `MYH00${invoices.length + 1}`, ...values, status: 'DRAFT' }]);
      message.success('Invoice created!');
      setCurrentInvoiceId(`MYH00${invoices.length + 1}`);
      resetStagesToInitialState();
      setRightPanelState('send-form');
    } else {
      setInvoices(invoices.map(inv => (inv.id === editingRecord.id ? { ...inv, ...values } : inv)));
      message.success('Invoice updated!');
    }
    setRightPanelState(null);
    setEditingRecord(null);
  };

  const handleSendInvoice = (values: any, mode: 'create' | 'edit') => {
    if (mode === 'create') {
      const newInvoice = { id: `MYH00${invoices.length + 1}`, ...values, status: 'DRAFT' };
      setInvoices([...invoices, newInvoice]);
      setCurrentInvoiceId(newInvoice.id);
      message.success('Invoice created!');
      resetStagesToInitialState();
      setRightPanelState('send-form');
    } else {
      setInvoices(invoices.map(inv => (inv.id === editingRecord.id ? { ...inv, ...values } : inv)));
      setCurrentInvoiceId(editingRecord.id);
      message.success('Invoice updated!');
    }
  };

  const handleSendEmail = (emailData: any) => {
    console.log('Sending email:', emailData);
    message.success('Invoice sent successfully!');
    setRightPanelState('status-tracker');
    setFormMode(null);
    setEditingRecord(null);
  };
  const handleDelete = (record: any) => {
    setInvoices(invoices.filter(inv => inv.id !== record.id));
    message.success('Invoice deleted!');
  };

  const handleResendInvoice = (record: any) => {
    message.success('Resend invoice!');
  };

  const handleRecordPayment = (paymentData: any) => {
    console.log('Recording payment:', paymentData);
    message.success('Payment recorded successfully!');
    setRightPanelState(null);
    setIsSendReceiptModalVisible(true);
    setInvoices(
      invoices.map(inv =>
        inv.id === paymentData.invoiceId
          ? { ...inv, status: 'PAID', payment: paymentData.amount }
          : inv
      )
    );
  };

  const handleSyncToXero = (record: any) => {
    message.success('Synk To Xero!');
  };

  const handleSendReceipt = (record: any) => {
    setIsSendReceiptModalVisible(true);
  };

  const handleSendReceiptNext = (values: any) => {
    console.log('Send receipt with values:', values);
    setIsSendReceiptModalVisible(false);
    setRightPanelState('send-receipt-form');
  };

  const handleSendReceiptClose = () => {
    setIsSendReceiptModalVisible(false);
    setRightPanelState('status-tracker');
  };

  const resetStagesToInitialState = () => {
    setStages(prevStages =>
      prevStages.map((stage, index) => ({
        ...stage,
        status: index === 0 ? 'active' : 'disabled',
        ...(stage.id === 2 && {
          buttons: [
            {
              label: 'Send',
              type: 'primary',
              onClick: () => {
                setStages(prevStages =>
                  prevStages.map(stage => {
                    if (stage.id === 2) {
                      return {
                        ...stage,
                        status: 'completed' as const,
                        buttons: [
                          {
                            label: 'Resend',
                            onClick: () => message.success('Invoice resent successfully!'),
                          },
                        ],
                      };
                    }
                    return stage;
                  })
                );
                setStages(prevStages =>
                  prevStages.map(stage => {
                    if (stage.id === 3) {
                      return { ...stage, status: 'active' as const };
                    }
                    return stage;
                  })
                );
              },
            },
          ],
        }),
        ...(stage.id === 4 && {
          buttons: [
            {
              label: 'Send Receipt',
              type: 'primary',
              onClick: () => setIsSendReceiptModalVisible(true),
            },
            {
              label: 'Skip Sending',
              onClick: () => handleStageClick(5),
            },
          ],
        }),
      }))
    );
  };

  const handleSendReceiptEmail = (emailData: any) => {
    console.log('Sending receipt email:', emailData);
    message.success('Receipt sent successfully!');

    setStages(prevStages =>
      prevStages.map(stage => {
        if (stage.id === 4) {
          return {
            ...stage,
            status: 'completed' as const,
            buttons: [
              {
                label: 'Resend',
                onClick: () => setRightPanelState('send-receipt-form'),
              },
            ],
          };
        }
        return stage;
      })
    );

    setRightPanelState('status-tracker');
  };

  const [stages, setStages] = useState<Stage[]>([
    {
      id: 1,
      title: 'Create Invoice',
      status: 'active',
      buttons: [
        {
          label: 'Edit Invoice',
          type: 'primary',
          onClick: () => handleStageClick(2),
        },
      ],
    },
    {
      id: 2,
      title: 'Send Invoice',
      status: 'disabled',
      buttons: [
        {
          label: 'Send',
          type: 'primary',
          onClick: () => {
            setStages(prevStages =>
              prevStages.map(stage => {
                if (stage.id === 2) {
                  return {
                    ...stage,
                    status: 'completed' as const,
                    buttons: [
                      {
                        label: 'Resend',
                        onClick: () => message.success('Invoice resent successfully!'),
                      },
                    ],
                  };
                }
                return stage;
              })
            );
            setStages(prevStages =>
              prevStages.map(stage => {
                if (stage.id === 3) {
                  return { ...stage, status: 'active' as const };
                }
                return stage;
              })
            );
          },
        },
      ],
    },
    {
      id: 3,
      title: 'Record Payment',
      status: 'disabled',
      buttons: [
        {
          label: 'Record Payment',
          type: 'primary',
          onClick: () => handleStageClick(4),
        },
      ],
    },
    {
      id: 4,
      title: 'Send Receipt',
      status: 'disabled',
      buttons: [
        {
          label: 'Send Receipt',
          type: 'primary',
          onClick: () => setIsSendReceiptModalVisible(true),
        },
        {
          label: 'Skip Sending',
          onClick: () => handleStageClick(5),
        },
      ],
    },
  ]);

  const handleStageClick = (clickedId: number) => {
    setStages(prevStages =>
      prevStages.map(stage => {
        if (stage.status === 'completed') return stage;

        if (stage.id < clickedId) return { ...stage, status: 'completed' };
        if (stage.id === clickedId) {
          if (clickedId === 4) {
            setRightPanelState('record-payment');
            const currentInvoice = invoices.find(inv => inv.id === currentInvoiceId);
            if (currentInvoice) {
              setEditingRecord(currentInvoice);
            }
          }
          if (clickedId === 3) {
            message.success('Invoice sent!');
          }
          return { ...stage, status: 'active' };
        }
        return { ...stage, status: 'disabled' };
      })
    );
  };

  const columns = [
    { title: 'Invoice ID', dataIndex: 'id' },
    { title: 'Description', dataIndex: 'desc' },
    {
      title: 'Invoice ($)',
      dataIndex: 'amount',
      render: (val: number, record: any) => (
        <Space direction="vertical" size={0}>
          <span>{typeof val === 'number' ? val.toFixed(2) : '—'}</span>
          <Tag>{record.date}</Tag>
        </Space>
      ),
    },
    {
      title: 'Payment ($)',
      dataIndex: 'payment',
      render: (val: number, record: any) => (
        <Space direction="vertical" size={0}>
          <span>{typeof val === 'number' ? val.toFixed(2) : '—'}</span>
          {val !== 0 && <Tag>{record.date}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Modify',
      render: (_: any, record: any) => {
        const isPaid = record.status === 'PAID';
        const menuItems = isPaid
          ? [
              {
                key: 'edit',
                label: 'Edit',
                onClick: () => {
                  setFormMode('edit');
                  setEditingRecord(record);
                },
              },
              {
                key: 'delete',
                label: 'Delete',
                onClick: () => handleDelete(record),
              },
              {
                key: 'PreviewInvoice',
                label: 'Preview Invoice',
                onClick: invoicePdf.previewPdf,
              },
              {
                key: 'PreviewReceipt',
                label: 'Preview Receipt',
                onClick: invoiceReceiptPdf.previewPdf,
              },
              {
                key: 'ResendInvoice',
                label: 'Reset Invoice',
                onClick: () => handleResendInvoice(record),
              },
              {
                key: 'SendReceipt',
                label: 'Send Receipt',
                onClick: () => handleSendReceipt(record),
              },
              {
                key: 'SyncToXero',
                label: 'Sync To Xero',
                onClick: () => handleSyncToXero(record),
              },
            ]
          : [
              {
                key: 'delete',
                label: 'Delete',
                onClick: () => handleDelete(record),
              },
            ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="text" icon={<IconDots size={18} />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        {summaryData.map(s => (
          <Col xs={24} sm={12} md={8} lg={6} key={s.title}>
            <Card
              style={{
                background: 'linear-gradient(180deg, var(--card-color), var(--primary-10))',
                border: 'none',
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

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="border border-dashed flex cursor-pointer items-center justify-center bg-body-color hover:border hover:border-primary hover:text-primary transition duration-150"
            onClick={() => {
              setRightPanelState('invoice-form');
              setFormMode('create');
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
            &nbsp;to provide the dates. Note: On providing the date, stage payment invoices will be
            created.
          </span>
        </Row>
      )}
      {/* Invoices Table & Form/Workflow */}
      <Row gutter={[24, 24]} align="top" className="mt-10">
        <Col xs={24} md={rightPanelState ? 14 : 24} lg={rightPanelState ? 14 : 24}>
          <Card
            title="Invoices"
            className="shadow-sm border border-gray-100"
            bodyStyle={{ padding: 16 }}
          >
            <Table dataSource={invoices} columns={columns} pagination={false} rowKey="id" />
          </Card>
        </Col>
        {rightPanelState && (
          <Col xs={24} md={10} lg={10}>
            {rightPanelState === 'invoice-form' ? (
              <Card
                title={formMode === 'edit' ? 'Edit Invoice' : 'Create Invoice'}
                className="shadow-sm border border-gray-100"
                extra={
                  <Button
                    onClick={() => {
                      setRightPanelState(null);
                      setFormMode(null);
                      setEditingRecord(null);
                    }}
                    type="text"
                  >
                    <IconX size={18} />
                  </Button>
                }
              >
                <InvoiceForm
                  mode={formMode}
                  initialValues={formMode === 'edit' ? editingRecord : undefined}
                  onFinish={handleFinish}
                  onSend={handleSendInvoice}
                />
              </Card>
            ) : rightPanelState === 'send-form' ? (
              <SendInvoiceForm
                invoiceId={currentInvoiceId}
                onCancel={() => {
                  setRightPanelState(null);
                  setFormMode(null);
                  setEditingRecord(null);
                }}
                onSend={handleSendEmail}
              />
            ) : rightPanelState === 'record-payment' ? (
              <RecordPaymentForm
                invoiceId={currentInvoiceId}
                invoiceAmount={editingRecord?.amount || 0}
                onCancel={() => {
                  setRightPanelState('status-tracker');
                }}
                onRecord={handleRecordPayment}
              />
            ) : rightPanelState === 'send-receipt-form' ? (
              <SendInvoiceForm
                invoiceId={currentInvoiceId}
                recipient="hello@aluxhomes.com.au"
                subject={`My Home: Receipt ${currentInvoiceId}`}
                message={`Please find the attached receipt for the payment of Suite 10, 45 Tallis Circuit, Truganina, VIC, 3029.\n\nThank you for your payment.\n\nPlease do not hesitate to contact me if you need any further clarification.\n\nRegards | Kishan`}
                onCancel={() => {
                  setRightPanelState('status-tracker');
                }}
                onSend={handleSendReceiptEmail}
              />
            ) : rightPanelState === 'status-tracker' ? (
              <Card
                title="Invoice Workflow"
                className="shadow-sm border border-gray-100"
                bodyStyle={{ padding: 16 }}
                extra={
                  <Button type="text" onClick={() => setRightPanelState(null)}>
                    <IconX size={18} />
                  </Button>
                }
              >
                <StatusTracker
                  stages={stages.map(stage => ({
                    ...stage,
                    buttons: stage.status === 'disabled' ? [] : stage.buttons,
                  }))}
                />
              </Card>
            ) : null}
          </Col>
        )}
      </Row>
      <ActionDialogmodel
        open={isContractDetailsModalVisible}
        onCancel={() => setIsContractDetailsModalVisible(false)}
        title="Contract Details"
        isEditing={true}
        fields={[
          {
            name: 'prepareddate',
            label: 'Prepared date',
            type: 'date' as const,
            extra: '',
          },
          {
            name: 'signeddate',
            label: 'Signed date',
            type: 'date' as const,
          },
        ]}
        onSubmit={() => {
          setIsContractDetailsModalVisible(false);
          message.success('Contract details saved successfully!');
          setShowContractNotice(false);
        }}
        submitButtonText="Confirm"
      />

      <ActionDialogmodel
        open={isSendReceiptModalVisible}
        onCancel={handleSendReceiptClose}
        title="Send Receipt"
        onSubmit={handleSendReceiptNext}
        submitButtonText="Next"
        fields={[
          {
            name: 'paymentInfo',
            label: 'Please select the payment records to generate the receipt.',
            type: 'custom',
            render: (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <Checkbox>
                    <span className="text-gray-700">
                      Payment Amount: ${(editingRecord?.amount || 2000).toFixed(2)}
                    </span>
                  </Checkbox>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded">
                    Never Sent
                  </span>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default JobInvoicePayment;
