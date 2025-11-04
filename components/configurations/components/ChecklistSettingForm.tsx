'use client';
import { Row, Col, Input, InputNumber, Select, Checkbox, Button, Table } from 'antd';
import { IconCheck, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { useState } from 'react';
import ConfirmationModal from '@/components/common/ConfirmationModal';

export function ChecklistSettingForm() {
  const [openModel, setOpenModel] = useState(false);
  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 w-full">
      <Row gutter={8} align="middle" className="  border-gray-200 py-1">
        <Col flex="80px" className="text-center">
          1
        </Col>
        <Col flex="auto">
          <Row gutter={8}>
            <Col flex="3" className="p-2 rounded">
              <Input placeholder="Checklist Name" />
            </Col>
            <Col flex="1" className="p-2 rounded">
              <Select placeholder="Select Type" className="w-full" />
            </Col>
            <Col flex="1" className="p-2 rounded">
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
      <Row gutter={8} align="middle" className="  border-gray-200 py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={8}>
            {/* Text spanning two columns */}
            <Col flex="1" className="p-2 rounded">
              <Checkbox>Date required</Checkbox>
            </Col>
            <Col flex="1" className="p-2 rounded">
              <Checkbox>Supplier</Checkbox>
            </Col>
            <Col flex="1" className="p-2 rounded">
              <Checkbox>Claim</Checkbox>
            </Col>
            <Col flex="1" className="p-2 rounded">
              <Checkbox>Dependent</Checkbox>
            </Col>
            <Col flex="1" className="p-2 rounded" />
            <Col flex="1" className="p-2 rounded" />
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className="  border-gray-200 py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={8}>
            {/* Text spanning two columns */}
            <Col flex="1" className="p-2 rounded">
              <div className="flex">
                <p>No of Days:</p>
                <InputNumber min={0} className="ml-2 w-[90px]" placeholder="Duration" />
              </div>
            </Col>
            <Col flex="1" className="p-2 rounded">
              <Checkbox>Notify</Checkbox>
            </Col>
            <Col flex="1" className="p-2 rounded">
              <Checkbox>Milestone</Checkbox>
            </Col>
            <Col flex="1" className="p-2 rounded">
              <Checkbox>Attachement mandatory</Checkbox>
            </Col>
            <Col flex="1" className="p-2 rounded" />
            <Col flex="1" className="p-2 rounded" />
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className="  border-gray-200 py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={8}>
            <Col flex="2" className="p-2 rounded">
              <div className="flex gap-2">
                <p>compliance type:</p>
                <Select placeholder="Select Compliance Type" />
              </div>
            </Col>
            <Col flex="2" className="p-2 rounded">
              <div className="flex gap-2">
                <p>cost center:</p>
                <Select placeholder="Select Cost Center" />
              </div>
            </Col>
            <Col flex="2" className="p-2 rounded">
              <div className="flex gap-2">
                <p>construction options:</p>
                <Select placeholder="Select Construction Options" />
              </div>
            </Col>

            <Col flex="1" className="p-2 rounded" />
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className=" py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={7}>
            <Col flex="6" className="p-2 rounded">
              <Input placeholder="Checklist Name" />
            </Col>
            <Col flex="1" className="p-2 rounded" />
          </Row>
        </Col>
      </Row>
      <Row gutter={8} align="middle" className=" py-1">
        <Col flex="80px" className="text-center" />
        <Col flex="auto">
          <Row gutter={7}>
            <Col flex="6" className="p-2 rounded">
              <Table
                bordered
                columns={[
                  {
                    title: 'prodecessor',
                    dataIndex: 'name',
                    key: 'name',
                    width: '60%',
                  },
                  {
                    title: 'Offset',
                    dataIndex: 'offset',
                    key: 'offset',
                    width: '20%',
                  },
                  {
                    title: 'Duration',
                    dataIndex: 'duration',
                    key: 'duration',
                    width: '20%',
                  },
                  {
                    title: (
                      <Button type="primary" size="small" onClick={() => setOpenModel(true)}>
                        Add
                      </Button>
                    ),
                    key: 'action',
                    width: '20%',
                    render: () => (
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          className="!p-2 border-none"
                          type="default"
                          icon={<IconEdit />}
                          onClick={() => console.log('editing value')}
                        />
                        <Button
                          size="small"
                          className="!p-2 border-none"
                          type="default"
                          icon={<IconTrash />}
                          onClick={() => console.log('deleeting value')}
                        />
                      </div>
                    ),
                  },
                ]}
                dataSource={[{ name: 'hello', offset: 2, duration: 3 }]}
              />
            </Col>
            <Col flex="1" className="p-2 rounded" />
          </Row>
        </Col>
      </Row>
      <ActionDialogmodel
        open={openModel}
        onCancel={() => setOpenModel(false)}
        onSubmit={() => setOpenModel(false)}
        title="Add Predecessor"
        fields={[
          {
            label: 'Name',
            name: 'name',
            type: 'select',
            options: [
              { label: 'Lookup stage - window installation', value: 'windowInstallation' },
              { label: 'Lookup stage - look up', value: 'lookUp' },
              { label: 'Lookup stage - fail protection', value: 'failProtection' },
            ],
          },
          {
            label: 'Offset',
            name: 'offset',
            type: 'switch',
          },
          {
            label: 'Duration',
            name: 'duration',
            type: 'text',
          },
        ]}
      />

      {/* model for the delete */}
      <ConfirmationModal
        open={false}
        onClose={() => setOpenModel(false)}
        onConfirm={() => setOpenModel(false)}
        message="Are you sure you want to delete this?"
      />
    </div>
  );
}
