'use client';

import React from 'react';
import { Button, Space, Table, Typography } from 'antd';
import { useRouter } from 'next/router';
import SystemRoutes from '@lib/constants/Routes';
import {
  useQuotationFormatColumns,
  QuotationFormat,
} from '@/components/table-columns/quotationFormatcolumn';

const QuotationFormatPage: React.FC = () => {
  const router = useRouter();
  const { columns, data } = useQuotationFormatColumns();

  return (
    <div style={{ padding: 20 }}>
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center gap-4">
          <Typography.Title level={4} className="!mb-0">
            Quotation Format Listing
          </Typography.Title>
        </div>

        <Space>
          <Button
            type="primary"
            onClick={() => {
              router.push(`${SystemRoutes.QUOTATION_FORMAT}/create`);
            }}
          >
            New Quotation Format
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        onRow={(record: QuotationFormat) => ({
          onClick: () => router.push(`${SystemRoutes.QUOTATION_FORMAT}/${record.key}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default QuotationFormatPage;
