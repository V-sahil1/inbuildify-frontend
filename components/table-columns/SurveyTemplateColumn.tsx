import { Badge, Button, Input, Popconfirm, Select, Tag, Tooltip } from 'antd';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconQuestionMark, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

export const SurveyTemplateColumn = (
  selectedTemplate,
  setSelectedTemplate,
  setDrawerOpen,
  setParams,
  filters
) => {
  const [templateData, setTemplateData] = useState([
    {
      id: '1',
      template: 'Customer Sales Feedback',
      sort: 0,
      status: 'Active',
      recommendTemplate: false,
    },
  ]);
  
  const column = [
    {
      title: (
        <div className="flex flex-col gap-1">
          <span></span>Template
          <Input value={filters.template} onChange={e => setParams({ template: e.target.value })} />
        </div>
      ),
      dataIndex: 'template',
      key: 'template',
      width: 800,
      render: (_, record) => (
        <div className="flex gap-2">
          <span>{record.template}</span>
          {record.recommendTemplate && <Tag color="red">Recommeded</Tag>}
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Sort Order</span>
          <Input
            type="number"
            value={filters.sort}
            onChange={e => setParams({ sort: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'sort',
      key: 'sort',
      width: 200,
    },

    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Status</span>
          <StatusSelect
            activeInactive={true}
            value={filters.status}
            onChange={value => setParams({ status: value })}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <span>{record.status}</span>

          <Badge count={2} size="small">
            <Tooltip title="Map Question">
              <Button
                type="text"
                shape="circle"
                className="text-blue"
                icon={<IconQuestionMark size={15} />}
                onClick={e => {
                  e.stopPropagation();
                  setDrawerOpen('question');
                }}
              />
            </Tooltip>
          </Badge>
          <Popconfirm
            okText="Inactive"
            onConfirm={e => {
              e.stopPropagation();
              setTemplateData(prev =>
                prev.map(i => (i.id === selectedTemplate.id ? { ...i, status: 'InActive' } : i))
              );
            }}
            onCancel={e => e.stopPropagation()}
            title={
              <>
                <p>Are you sure you want to inactivate?</p>
                <p>
                  This template is already mapped for existing jobs hence it can only be
                  inactivated.
                </p>
              </>
            }
            placement="topRight"
          >
            <Button
              type="text"
              color="red"
              icon={<IconTrash size={15} />}
              onClick={e => {
                e.stopPropagation();
                setSelectedTemplate(record);
              }}
            />
          </Popconfirm>
        </div>
      ),
      width: 200,
    },
  ];

  function handelSubmit(values) {
    selectedTemplate
      ? setTemplateData(prev =>
          prev.map(i =>
            i.id === selectedTemplate.id
              ? { ...values, id: i.id }
              : values.recommendTemplate
                ? { ...i, recommendTemplate: false }
                : i
          )
        )
      : setTemplateData(prev => {
          const newTemplate = {
            ...values,
            id: Math.floor(Math.random() * 100000).toString(),
            status: 'Active',
          };
          return values.recommendTemplate
            ? [
                ...prev.map(i =>
                  i.recommendTemplate === true ? { ...i, recommendTemplate: false } : i
                ),
                newTemplate,
              ]
            : [...prev, newTemplate];
        });
    setSelectedTemplate(null);
  }
  return { column, templateData, templateSubmit: handelSubmit };
};
