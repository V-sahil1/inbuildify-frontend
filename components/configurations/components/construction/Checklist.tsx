'use client';
import React, { useState } from 'react';
import { Form, Row, Col, Input, InputNumber, Select, Checkbox, Button, Typography } from 'antd';
import { IconPlus, IconCheck, IconX } from '@tabler/icons-react';

const { Option } = Select;
const { Text } = Typography;

export function Checklist() {
  const [rows, setRows] = useState([
    { id: 1, checklist: '', supplierType: '', sort: 1, dateRequired: true },
  ]);

  const handleChange = (id: number, field: string, value: any) => {
    setRows(prev => prev.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addRow = () => {
    const next = {
      id: Date.now(),
      checklist: '',
      supplierType: '',
      sort: rows.length + 1,
      dateRequired: false,
    };
    setRows([...rows, next]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
      <Form layout="vertical" className="mb-6">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Builder" required>
              <Select
                placeholder="Select Builder"
                options={[
                  { label: 'Company Level', value: 'companyLevel' },
                  { label: 'Project Level', value: 'projectLevel' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Construction Types" required>
              <Select
                placeholder="Select Construction Type"
                options={[
                  { label: 'Single Storey Build', value: 'singleStoreyBuilding' },
                  { label: 'Multi Storey Build', value: 'multiStoreyBuilding' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Stage" required>
              <Select
                placeholder="Select Stage"
                options={[
                  { label: 'Base Stage', value: 'baseStage' },
                  { label: 'Project Stage', value: 'projectLevel' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Table Header */}
      <Row
        gutter={8}
        align="middle"
        className="border-b border-gray-300 pb-2 mb-4 text-sm font-semibold text-gray-700 w-full"
      >
        {/* Narrow column for S.No */}
        <Col flex="80px" className="text-center">
          S.No
        </Col>

        {/* Six equal columns */}
        <Col flex="auto">
          <Row gutter={8} align="middle">
            <Col flex="3">Checklist</Col>

            <Col flex="1" className="text-center">
              Supplier Type
            </Col>
            <Col flex="1" className="text-center">
              Sort
            </Col>
            <Col flex="1" className="text-center">
              <Button
                type="primary"
                size="small"
                icon={<IconPlus size={14} />}
                className="!text-xs !h-6"
              >
                New
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className="border-b border-gray-200 py-1">
        <Col flex="80px" className="text-center">
          1
        </Col>
        <Col flex="auto">
          <Row gutter={8}>
            {/* Text spanning two columns */}
            <Col flex="3" className="bg-gray-50 p-2 rounded">
              <Input placeholder="Checklist Name" />
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Select placeholder="Select Type" className="w-full" />
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Input placeholder="Sort" />
            </Col>
            <Col flex="1" className="flex items-center justify-end gap-2">
              <Button
                type="primary"
                size="small"
                icon={<IconCheck size={14} />}
                className="!text-xs !h-6"
              />
              <Button
                type="primary"
                size="small"
                icon={<IconX size={14} />}
                className="!text-xs !h-6"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className="border-b border-gray-200 py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={8}>
            {/* Text spanning two columns */}
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Checkbox>Date required</Checkbox>
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Checkbox>Supplier</Checkbox>
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Checkbox>Claim</Checkbox>
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Checkbox>Dependent</Checkbox>
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded" />
            <Col flex="1" className="bg-gray-50 p-2 rounded" />
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className="border-b border-gray-200 py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={8}>
            {/* Text spanning two columns */}
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <div className="flex">
                <p>No of Days:</p>
                <InputNumber min={0} className="ml-2 w-[90px]" placeholder="Duration" />
              </div>
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Checkbox>Notify</Checkbox>
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Checkbox>Milestone</Checkbox>
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded">
              <Checkbox>Attachement mandatory</Checkbox>
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded" />
            <Col flex="1" className="bg-gray-50 p-2 rounded" />
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className="border-b border-gray-200 py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={8}>
            <Col flex="2" className="bg-gray-50 p-2 rounded">
              <div className="flex gap-2">
                <p>compliance type:</p>
                <Select placeholder="Select Compliance Type" />
              </div>
            </Col>
            <Col flex="2" className="bg-gray-50 p-2 rounded">
              <div className="flex gap-2">
                <p>cost center:</p>
                <Select placeholder="Select Cost Center" />
              </div>
            </Col>
            <Col flex="2" className="bg-gray-50 p-2 rounded">
              <div className="flex gap-2">
                <p>construction options:</p>
                <Select placeholder="Select Construction Options" />
              </div>
            </Col>

            <Col flex="1" className="bg-gray-50 p-2 rounded" />
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className=" py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={7}>
            <Col flex="6" className="bg-gray-50 p-2 rounded">
              <Input placeholder="Checklist Name" />
            </Col>
            <Col flex="1" className="bg-gray-50 p-2 rounded" />
          </Row>
        </Col>
      </Row>
    </div>
  );
}
