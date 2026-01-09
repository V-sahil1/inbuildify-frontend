'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { IconEdit } from '@tabler/icons-react';
import PdfFormatForm from './PdfFormats';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { fetchPdfTemplate } from '@redux/feature/admin/template/pdf/pdfTemplateThunk';
import { PdfTemplate } from '@redux/feature/admin/template/pdf/IpdfTemplateState';
export const PdfTemplates = () => {
  const dispatch = useAppDispatch();
  const { pdfTemplate, status } = useAppSelector(state => state.template.pdfTemplate);
  const [selectedTemplate, setSelectedTemplate] = useState<PdfTemplate | null>(null);

  const fetchPdfTemplateData = async () => {
    try {
      await dispatch(fetchPdfTemplate()).unwrap();
    } catch (error) {
      message.error(error || 'failed to fetch pdf template');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchPdfTemplateData();
    }
  }, [status.fetch]);

  const columns = [
    {
      title: 'S.No',
      width: '10%',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: 'Template Name',
      dataIndex: 'name',
      width: '80%',
    },
    {
      title: '',
      width: '10%',
      render: (_, record: any) => (
        <Button type="text" onClick={() => setSelectedTemplate(record)}>
          <IconEdit size={18} />
        </Button>
      ),
    },
  ];

  return (
    <div>
      {selectedTemplate ? (
        <PdfFormatForm
          templateName={selectedTemplate.name}
          goBack={() => setSelectedTemplate(null)}
          template={selectedTemplate.templateJson}
          templatePdfId={selectedTemplate.templatePdfId}
        />
      ) : (
        <Table
          dataSource={pdfTemplate}
          columns={columns}
          loading={status.fetch === Status.PENDING}
          pagination={false}
          rowKey="key"
        />
      )}
    </div>
  );
};

export default PdfTemplates;
