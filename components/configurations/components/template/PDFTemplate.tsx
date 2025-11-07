"use client";

import React, { useState } from "react";
import { Table, Button } from "antd";
import { IconEdit } from "@tabler/icons-react";
import PdfFormatForm from "./PdfFormats";
import { PdfTemplateData } from "data/configuration/TemplateData";
export const PdfTemplates = () => {
  

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const columns = [
    {
      title: "S.No",
      width: "10%",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Template Name",
      dataIndex: "name",
      width: "80%",
    },
    {
      title: "",
      width: "10%",
      render: (_: any, record: any) => (
        <Button
          type="text"
          onClick={() => setSelectedTemplate(record)}
        >
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
        />
      ) : (
        <Table 
          dataSource={PdfTemplateData}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      )}
    </div>
  );
};

export default PdfTemplates;
