import React, { useEffect, useState } from 'react';
import { Button, Table, Typography, message, Spin, Modal, Tag, Space, Upload } from 'antd';
import { IconUserCheck, IconUpload } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getStructuralThunk } from '@redux/feature/structuralengg/structuralEnggThunk';
import { StructuralEngineer } from '@/components/table-columns/structuralEngineerColumn';
import { updateLeadThunk } from '@redux/feature/lead/leadThunk';
import type { UploadProps } from 'antd/es/upload';

interface StructuralEngineerAssignmentProps {
  leadId: string;
  hasReport?: boolean;
}

const StructuralEngineerAssignment: React.FC<StructuralEngineerAssignmentProps> = ({
  leadId,
  hasReport = false
}) => {
  const dispatch = useAppDispatch();
  const { status, structuralengg } = useAppSelector((state: any) => state.structural);
  const { leadDetail } = useAppSelector((state: any) => state.lead);
  const [assignLoading, setAssignLoading] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    dispatch(getStructuralThunk());
  }, [dispatch]);

  const handleAssign = (engineer: StructuralEngineer) => {
    if (!hasReport) {
      message.warning('No report available for assignment');
      return;
    }

    // Check if this engineer is already assigned
    if (leadDetail?.lead?.structureEngineerId === engineer.key) {
      message.info('This structural engineer is already assigned to this lead');
      return;
    }

    Modal.confirm({
      title: 'Assign Structural Engineer',
      content: `Are you sure you want to assign ${engineer.name} to this lead?`,
      okText: 'Assign',
      cancelText: 'Cancel',
      onOk: async () => {
        setAssignLoading(engineer.key);
        try {
          const payload: any = {
            structureEngineerId: engineer.key
          };

          const res = await dispatch(updateLeadThunk({ id: leadId, details: payload })).unwrap();
          // TODO: Implement assign API call
          // await dispatch(assignStructuralEngineerThunk({ leadId, structuralEngineerId: engineer.key })).unwrap();
          if (res) {
            message.success(`${engineer.name} assigned successfully!`);
          }
        } catch (error) {
          message.error('Failed to assign structural engineer');
        } finally {
          setAssignLoading(null);
        }
      },
    });
  };

  const handleFileUpload: UploadProps['onChange'] = async (info) => {
    const { file } = info;

    if (file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }

    if (file.status === 'done') {
      try {
        const payload: any = {
          structureReportFile: file.originFileObj
        };

        const res = await dispatch(updateLeadThunk({ id: leadId, details: payload })).unwrap();
        if (res) {
          message.success('File uploaded successfully!');
        }
      } catch (error) {
        message.error('Failed to upload file');
      } finally {
        setUploadLoading(false);
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
    beforeUpload: (file) => {
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // sorter: (a: StructuralEngineer, b: StructuralEngineer) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // sorter: (a: StructuralEngineer, b: StructuralEngineer) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      // sorter: (a: StructuralEngineer, b: StructuralEngineer) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: StructuralEngineer) => {
        const isAssigned = leadDetail?.lead?.structureEngineerId === record.key;

        if (isAssigned) {
          return <Tag color="blue">Assigned</Tag>;
        }

        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
        );
      },
      // sorter: (a: StructuralEngineer, b: StructuralEngineer) => {
      //   const aAssigned = leadDetail?.lead?.structureEngineerId === a.key;
      //   const bAssigned = leadDetail?.lead?.structureEngineerId === b.key;

      //   if (aAssigned && !bAssigned) return -1;
      //   if (!aAssigned && bAssigned) return 1;

      //   return Number(a.isActive) - Number(b.isActive);
      // },
    },
    {
      title: 'Upload Report',
      key: 'upload',
      width: 180,
      render: (_: any, record: StructuralEngineer) => {
        const isAssigned = leadDetail?.lead?.structureEngineerId === record.key;
        const currentFile = leadDetail?.lead?.structureReportFile;

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
              <Upload {...uploadProps} accept='.pdf'>
                <Button
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
      render: (_: any, record: StructuralEngineer) => {
        const isAssigned = leadDetail?.lead?.structureEngineerId === record.key;

        return (
          <Button
            type={isAssigned ? "default" : "primary"}
            size="small"
            icon={<IconUserCheck size={16} />}
            onClick={() => handleAssign(record)}
            loading={assignLoading === record.key}
            disabled={!hasReport || isAssigned || leadDetail?.lead?.structureReportFile}
            style={{
              backgroundColor: isAssigned ? '#f0f0f0' : (hasReport ? '#52c41a' : undefined),
              borderColor: isAssigned ? '#d9d9d9' : (hasReport ? '#52c41a' : undefined),
              color: isAssigned ? '#999' : undefined
            }}
          >
            {isAssigned ? 'Assigned' : 'Assign'}
          </Button>
        );
      },
    },
  ];

  // Transform engineers data for table
  const tableData = structuralengg && structuralengg.length > 0 ? structuralengg.map((engineer: any) => ({
    key: engineer.structureEngineerId,
    name: engineer.name,
    email: engineer.email,
    phone: engineer.phone,
    isActive: engineer.isActive,
  })) : [];

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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} engineers`,
          }}
          rowKey="key"
        />
      )}
    </div>
  );
};

export default StructuralEngineerAssignment;
