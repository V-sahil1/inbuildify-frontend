'use client';

import React from 'react';
import { Button, message, Table, Upload } from 'antd';
import { IconCirclePlus } from '@tabler/icons-react';
import { EstateDocumentsColumns } from 'components/table-columns/EstateDocumentsColumns';
import { useAppDispatch } from '@hooks/redux';
import { createEStateDocument } from '@redux/feature/estate/estateThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

export default function EstateDocuments({ estate }) {
  const dispatch = useAppDispatch();
  const { columns } = EstateDocumentsColumns();

  const handleUpload = async file => {
    if (!file || !estate?.estateId) {
      message.error('Please select a file and ensure estate is loaded');
      return false;
    }
    const payload = {
      documentName: file.name,
      fileUrl: file,
      estateId: estate.estateId,
    };
    const formData = formDataGenerator(payload);
    try {
      await dispatch(createEStateDocument(formData)).unwrap();
      message.success('Document uploaded successfully');
    } catch (error) {
      message.error(error || 'Failed to upload document');
    }
  };

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-center mb-3 text-primary">
        <Upload showUploadList={false} beforeUpload={handleUpload} accept=".pdf,.png,.jpg,.jpeg">
          <Button type="text">
            <IconCirclePlus size={16} />
            <span>Document</span>
          </Button>
        </Upload>
      </div>

      <Table
        rowKey="estateDocumentId"
        columns={columns}
        dataSource={estate?.documents || []}
        pagination={false}
      />
    </div>
  );
}
