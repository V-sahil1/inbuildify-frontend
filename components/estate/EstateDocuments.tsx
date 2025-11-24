'use client';

import React, { useState } from 'react';
import { Button, Table, Upload } from 'antd';
import { IconCirclePlus } from '@tabler/icons-react';
import {
  EstateDocumentsColumns,
  EstateDocItem,
} from 'components/table-columns/EstateDocumentsColumns';

export default function EstateDocuments() {
  const { columns, estateDocumentsData } = EstateDocumentsColumns();
  const [docs, setDocs] = useState<EstateDocItem[]>(estateDocumentsData);

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-center mb-3 text-primary">
        <Upload
          showUploadList={false}
          beforeUpload={file => {
            const url = URL.createObjectURL(file);
            setDocs(prev => [
              {
                key: String(Date.now()),
                name: file.name,
                createdAt: new Date().toISOString(),
                url,
              },
              ...prev,
            ]);
            return false;
          }}
        >
          <Button type="text">
            <IconCirclePlus size={16} />
            <span>Document</span>
          </Button>
        </Upload>
      </div>

      <Table rowKey="key" columns={columns} dataSource={docs} pagination={false} />
    </div>
  );
}
