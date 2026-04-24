import React, { useState, useMemo } from 'react';
import { Button, Table, Typography, message, Spin, Modal, Tag, Space, Upload, Select, Tooltip } from 'antd';
import { IconUserCheck, IconUpload } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { StructuralEngineer } from '@/components/table-columns/structuralEngineerColumn';
import { updateLeadThunk } from '@redux/feature/lead/leadThunk';
import type { UploadProps } from 'antd/es/upload';
import StructuralEngineerListModal from '../common/Models/StructuralEngineerListModal';
import { updateQuotationVersion, uploadQuotationStructuralReport } from '@redux/feature/quotation/quotationThunk';

interface StructuralEngineerAssignmentProps {
  leadId: string;
  hasReport?: boolean;
}

const StructuralEngineerAssignment: React.FC<StructuralEngineerAssignmentProps> = ({
  leadId,
  hasReport = false,
}) => {
  const dispatch = useAppDispatch();
  const { status, structuralengg } = useAppSelector((state: any) => state.structural);
  const { quotation } = useAppSelector((state: any) => state.quotation);
  const { leadDetail } = useAppSelector((state: any) => state.lead);
  const [assignLoading, setAssignLoading] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuotationVersion, setSelectedQuotationVersion] = useState<any>(null);
  const [selectedUploadVersion, setSelectedUploadVersion] = useState<any>(null);

  const handleAssign = (record: any) => {
    setSelectedQuotationVersion(record);
    setModalOpen(true);
  };

  const onStructuralEngineerSelect = async (engineer: any) => {
    if (!selectedQuotationVersion) return;

    try {
      await dispatch(
        updateQuotationVersion({
          id: selectedQuotationVersion?.versionId,
          data: { structureEngineerId: engineer?.structureEngineerId },
        })
      ).unwrap();
      message.success('Engineer assigned successfully!');
      setModalOpen(false);
      setSelectedQuotationVersion(null);
    } catch (error) {
      message.error('Failed to assign engineer');
    }
  };

  const handleUploadClick = (record: any) => {
    setSelectedUploadVersion(record);
  };

  const handleFileUpload: UploadProps['onChange'] = async info => {
    const { file } = info;

    if (file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }

    if (file.status === 'done') {
      try {
        // Send binary file directly using the new upload thunk
        const res = await dispatch(uploadQuotationStructuralReport({ 
          id: selectedUploadVersion?.versionId, 
          file: file.originFileObj 
        })).unwrap();
        if (res) {
          message.success('File uploaded successfully!');
        }
      } catch (error) {
        message.error('Failed to upload file');
      } finally {
        setUploadLoading(false);
        setSelectedUploadVersion(null);
      }
    } else if (file.status === 'error') {
      message.error('File upload failed');
      setUploadLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    onChange: handleFileUpload,
    beforeUpload: file => {
      const isValidType = file.type === 'application/pdf';
      if (!isValidType) {
        message.error('You can only upload PDF files!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return false;
      }
      return true;
    },
  };

  // Transform quotation versions data for table
  const tableData = useMemo(() => {
    const data: any[] = [];

    quotation?.forEach((q: any) => {
      if (q.versions && q.versions.length > 0) {
        q.versions.forEach((v: any) => {
          data.push({
            key: v.quotationVersionId,
            quotationReference: q.referenceNumber,
            version: v,
            versionNo: v.quotationVersionNo,
            versionId: v.quotationVersionId,
            structuralEngineer: structuralengg?.find(
              (e: any) => e?.structureEngineerId === v?.structuralEngineer?.id
            ),
            quotation: q,
          });
        });
      }
    });
    
    return data;
  }, [quotation, structuralengg]);

  const columns = [
    {
      title: 'Quotation',
      key: 'quotation',
      render: (_: any, record: any) => {
        return (
          <div style={{ fontWeight: 'bold' }}>
            {record.quotationReference} V{record.versionNo}
          </div>
        );
      },
    },
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: any) => {
        return (
          record?.structuralEngineer?.name || (
            <span style={{ color: '#999', fontSize: '12px' }}>-</span>
          )
        );
      },
    },
    {
      title: 'Email',
      key: 'email',
      render: (_: any, record: any) => {
        return (
          record.structuralEngineer?.email || (
            <span style={{ color: '#999', fontSize: '12px' }}>-</span>
          )
        );
      },
    },
    {
      title: 'Phone',
      key: 'phone',
      render: (_: any, record: any) => {
        return (
          record.structuralEngineer?.phone || (
            <span style={{ color: '#999', fontSize: '12px' }}>-</span>
          )
        );
      },
    },
    {
      title: 'Upload Report',
      key: 'upload',
      width: 180,
      render: (_: any, record: any) => {
        const isAssigned = record?.version?.isApprove;
        const currentFile = record?.version?.uploadReport;

        if (!isAssigned) {
          return <span style={{ color: '#999', fontSize: '12px' }}>-</span>;
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {currentFile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 6px',
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  const fileUrl = currentFile.startsWith('http')
                    ? currentFile
                    : `${process.env.NEXT_PUBLIC_API_URL || ''}${currentFile}`;
                  window.open(fileUrl, '_blank', 'noopener,noreferrer');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d9f7be';
                  e.currentTarget.style.borderColor = '#95de64';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f6ffed';
                  e.currentTarget.style.borderColor = '#b7eb8f';
                }}
                title="Click to open file in new tab"
              >
                <span style={{ fontSize: '12px', color: '#52c41a' }}>📄</span>
                <span style={{
                  fontSize: '11px',
                  color: '#52c41a',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {currentFile.split('/').pop() || 'Current Report'}
                </span>
              </div>
            )}
            {!currentFile && (
              <div onClick={() => handleUploadClick(record)}>
                <Upload {...uploadProps} accept='.pdf'>
                  <Button
                  disabled={!record?.version?.structuralEngineer?.id}  
                    type="default"
                    size="small"
                    icon={<IconUpload size={14} />}
                    loading={uploadLoading}
                    style={{
                      color: '#1890ff',
                      borderColor: '#1890ff',
                      height: '24px',
                      fontSize: '12px',
                      padding: '0 8px'
                    }}
                  >
                    Upload
                  </Button>
                </Upload>
              </div>
            )}
            {currentFile && (
              <Button
                type="default"
                size="small"
                disabled
                style={{
                  height: '24px',
                  fontSize: '12px',
                  padding: '0 8px',
                  backgroundColor: '#f5f5f5',
                  color: '#bfbfbf',
                  borderColor: '#d9d9d9'
                }}
              >
                Uploaded
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => {
        const isApproved = record?.version?.isApprove
        const isDisabled = !record.version?.facadeId || !record.version?.floorPlanId || isApproved;
        const tooltipText = isApproved
          ? 'This quotation version is already approved'
          : isDisabled
            ? 'Please select floor plan and facade before assigning engineer'
            : 'Assign structural engineer to this quotation version';

        return (
          <Tooltip title={tooltipText}>
            <Button
              type="primary"
              size="small"
              icon={<IconUserCheck size={16} />}
              onClick={() => handleAssign(record)}
              loading={assignLoading === record.key}
              disabled={isDisabled}
            >
              {record?.version?.structuralEngineer?.id ? 'Change' : 'Assign'}
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Typography.Title level={4}>Assign Structural Engineer</Typography.Title>
        {!hasReport && (
          <Tag color="orange" className="mb-4">
            No report available - Assignment is disabled
          </Tag>
        )}
        {hasReport && (
          <Tag color="green" className="mb-4">
            Report available - You can assign structural engineers
          </Tag>
        )}
      </div>

      {status === 'PENDING' ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          rowKey="key"
        />
      )}

      {/* Structural Engineer List Modal */}
      <StructuralEngineerListModal
        visible={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedQuotationVersion(null);
        }}
        onAssign={onStructuralEngineerSelect}
        selectedStructuralEngineer={selectedQuotationVersion?.structuralEngineer}
      />
    </div>
  );
};

export default StructuralEngineerAssignment;
