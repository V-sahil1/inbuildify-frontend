'use client';
import { Form, Row, Col, Select, Button, Table, Tooltip } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ChecklistSettingForm } from '../ChecklistSettingForm';
import { useState } from 'react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { ChecklistHeader } from '../ChecklistHeader';
import { checklistFormFields } from '@/components/formFields/checklistFormFields';

export function Checklist() {
  const [editing, setEditing] = useState<number | null>(null);
  const [subChecklistModal, setSubChecklistModal] = useState(false);
  const [addChecklistModal, setAddChecklistModal] = useState(false);
   const [headerData, setHeaderData] = useState({
      builder: null,
      constructionType: null,
      constructionStage: null,
    });
  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
      <ChecklistHeader onChange={setHeaderData} data={headerData} />

      {/* Table Header */}
      <Row
        gutter={8}
        align="middle"
        className="border-b border-gray-300 pb-2 mb-4 text-sm font-semibold text-gray-700 w-full"
      >
        <Col flex="80px" className="text-center">
          S.No
        </Col>

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
                disabled={addChecklistModal}
                onClick={() => setAddChecklistModal(true)}
              >
                New
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {addChecklistModal && (
        <Row gutter={8} className="  border-gray-200 py-1">
          <ChecklistSettingForm />
        </Row>
      )}
      <Row gutter={8} className="  border-gray-200 py-1">
        {editing === 1 ? (
          <ChecklistSettingForm />
        ) : (
          <>
            <Col flex="80px" className="text-center">
              1
            </Col>
            <Col flex="auto">
              <Row gutter={8}>
                <Col flex="3" className="rounded">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <p>site visit</p>
                      <p className="bg-green-500 text-white text-center  rounded w-[60px]">
                        2 days
                      </p>
                    </div>
                    {/* show only if cost type is available */}
                    <p>cost center</p>
                    <p className="bg-pink-500 text-white text-center  rounded w-[60px]">MH001</p>
                  </div>
                </Col>
                <Col flex="1" className="p-2 rounded flex justify-center items-center h-[50px]">
                  <p className="bg-green-500 text-white text-center rounded w-[60px]">Engineer</p>
                </Col>
                <Col flex="1" className="p-2 rounded">
                  <p className="text-center">1</p>
                </Col>
                <Col flex="1" className="flex items-center justify-end gap-2">
                  <Tooltip title="Add Sub checklist">
                    <Button
                      size="small"
                      icon={<IconPlus size={14} />}
                      className="!text-xs !h-6"
                      onClick={() => setSubChecklistModal(true)}
                    />
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Button
                      size="small"
                      icon={<IconEdit size={14} />}
                      className="!text-xs !h-6"
                      onClick={() => setEditing(1)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button size="small" icon={<IconTrash size={14} />} className="!text-xs !h-6" />
                  </Tooltip>
                </Col>
              </Row>
              {/* below row is conditional if the data are avialbale then only the table will visible other wise it will be the null */}
              <Row gutter={8} align="middle" className=" py-1 w-full">
                <Col flex="auto">
                  <Row gutter={8}>
                    <Col flex="6" className="p-2 rounded">
                      <Table
                        bordered
                        pagination={false}
                        columns={[
                          {
                            title: 'prodecessor',
                            dataIndex: 'name',
                            key: 'name',
                            width: '60%',
                          },
                        ]}
                        dataSource={[{ name: 'hello' }]}
                      />
                    </Col>
                    <Col flex="1" className="p-2 rounded" />
                  </Row>
                </Col>
              </Row>
            </Col>
          </>
        )}
      </Row>

      <ActionDialogmodel
        open={subChecklistModal}
        title="Add Sub checklist"
        onCancel={() => setSubChecklistModal(false)}
        onSubmit={() => setSubChecklistModal(false)}
        fields={checklistFormFields}
      />
    </div>
  );
}
