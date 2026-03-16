import React, { useState, useRef } from 'react';
import { Modal, Button, Upload, Table, Popconfirm } from 'antd';
import { IconUpload, IconEdit, IconTrash, IconX, IconCheck } from '@tabler/icons-react';
import { CustomSection } from '@redux/feature/quotation/IQuotationState';

interface CustomSectionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (documents: File, id: string) => void;
  onDelete?: (id: string) => void;
  data?: CustomSection[];
  title?: string;
  loading?: boolean;
  message?: string;
}

const CustomSectionModal: React.FC<CustomSectionModalProps> = ({
  open,
  onClose,
  onSubmit,
  onDelete,
  data = [],
  title = 'Documents',
  loading = false,
  message,
}) => {
  const [editingItem, setEditingItem] = useState<CustomSection | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCheckFile = () => {
    if (editingItem) {
      onSubmit(editingItem?.fileUrl as File, editingItem?.customSectionId || null);
      setEditingItem(null);
    } else {
      onSubmit(selectedFile, editingItem?.customSectionId || null);
      setSelectedFile(null);
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const columns = [
    {
      title: 'Document Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string, record: CustomSection) => {
        if (editingItem?.customSectionId === record.customSectionId) {
          return (
            <div className="flex items-center gap-2">
              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                onChange={info => {
                  if (info.fileList.length > 0) {
                    setEditingItem({ ...record, fileUrl: info.fileList[0].originFileObj as File });
                  }
                }}
              >
                <Button size="small" icon={<IconUpload size={14} />}>
                  {editingItem?.fileUrl instanceof File
                    ? editingItem.fileUrl.name
                    : typeof editingItem?.fileUrl === 'string'
                      ? editingItem.fileName
                      : 'Choose File'}
                </Button>
              </Upload>
            </div>
          );
        }
        return text;
      },
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (text: number, record: CustomSection, index: number) => (
        <span className="text-center block">{text || index + 1}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: CustomSection) => (
        <div className="flex gap-2">
          {editingItem?.customSectionId === record.customSectionId ? (
            <>
              <Button
                type="text"
                size="small"
                onClick={handleCheckFile}
                className="text-xs"
                icon={<IconCheck size={15} />}
              />

              <Button
                type="text"
                size="small"
                onClick={() => {
                  setEditingItem(null);
                }}
                className="text-xs"
                icon={<IconX size={15} />}
              />
            </>
          ) : (
            <>
              <Button
                size="small"
                type="text"
                icon={<IconEdit size={14} />}
                onClick={() => setEditingItem(record)}
                className="text-xs"
              />
              <Popconfirm
                title="Are you sure you wannt to delete this attachment?"
                onConfirm={() => onDelete?.(record.customSectionId)}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<IconTrash size={14} />}
                  danger
                  className="text-xs"
                />
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal title={title} open={open} onCancel={onClose} footer={null} width={600} centered>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Upload
            onChange={info => {
              if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
                setSelectedFile(info.fileList[0].originFileObj);
              }
            }}
            showUploadList={false}
            accept=".pdf"
          >
            <Button icon={<IconUpload size={16} />} className="flex items-center">
              Upload Document
            </Button>
          </Upload>

          {selectedFile && (
            <>
              <span className="text-sm text-gray-600">{selectedFile.name}</span>
              <Button
                size="small"
                icon={<IconCheck size={14} />}
                onClick={handleCheckFile}
                type="primary"
              />
              <Button size="small" icon={<IconX size={14} />} onClick={handleCancelFile} />
            </>
          )}
        </div>
        {message && <p className="text-font-color-100">{message}</p>}

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          size="small"
          className="mt-4"
        />
      </div>
    </Modal>
  );
};

export default CustomSectionModal;
