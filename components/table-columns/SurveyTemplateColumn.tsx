import { Badge, Button, Input, message, Popconfirm, Tag, Tooltip } from 'antd';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { IconPlus, IconQuestionMark, IconTrash } from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import {
  createSurveyTemplate,
  updateSurveyTemplate,
} from '@redux/feature/surveyTemplate/surveyTemplateThunk';
import TooltipButton from '../common/TooltipButton';

export const SurveyTemplateColumn = (
  selectedTemplate,
  setSelectedTemplate,
  setDrawerOpen,
  setParams,
  setModalOpen,
  filters
) => {
  const dispatch = useAppDispatch();

  const column = [
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Template</span>
          <Input value={filters.template} onChange={e => setParams({ template: e.target.value })} />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 800,
      render: (_, record) => (
        <div className="flex gap-2">
          <span>{record.name}</span>
          {record.isRecommended && <Tag color="red">Recommended</Tag>}
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
      dataIndex: 'sortOrder',
      key: 'sortOrder',
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
          <span>{record.status ? 'Active' : 'Inactive'}</span>

          {record.status && (
            <Badge count={record.questions?.length || 0} size="small">
              <Tooltip title="Map Question">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  className="text-blue border border-blue"
                  icon={<IconQuestionMark size={15} />}
                  onClick={e => {
                    e.stopPropagation();
                    setDrawerOpen(true);
                    setSelectedTemplate(record);
                  }}
                />
              </Tooltip>
            </Badge>
          )}
          {record.status ? (
            <Popconfirm
              okText="Inactive"
              onConfirm={e => {
                e.stopPropagation();
                handleSurveyTemplateStatus();
              }}
              onCancel={e => {
                e.stopPropagation();
                setSelectedTemplate(null);
              }}
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
              <TooltipButton
                type="text"
                title="Inactivate"
                icon={<IconTrash size={15} color="red" />}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedTemplate(record);
                }}
              />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to to activate template?"
              onConfirm={e => {
                e.stopPropagation();
                handleSurveyTemplateStatus();
              }}
              onCancel={e => {
                e.stopPropagation();
                setSelectedTemplate(null);
              }}
              okText="Active"
            >
              <TooltipButton
                type="text"
                title="Activate"
                icon={<IconPlus size={15} className="text-blue" />}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedTemplate(record);
                }}
              />
            </Popconfirm>
          )}
        </div>
      ),
      width: 200,
    },
  ];

  async function handleSurveyTemplateStatus() {
    try {
      await dispatch(
        updateSurveyTemplate({
          data: { status: !selectedTemplate.status },
          id: selectedTemplate.surveyTemplateId,
        })
      ).unwrap();
      message.success('Survey Template updated Successfully');
      setSelectedTemplate(null);
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to update survey template');
    }
  }

  async function handelSubmit(values) {
    try {
      if (selectedTemplate) {
        await dispatch(
          updateSurveyTemplate({
            data: { ...values, status: values.status === 'active' },
            id: selectedTemplate.surveyTemplateId,
          })
        ).unwrap();
        message.success('Survey Template updated Successfully');
      } else {
        await dispatch(createSurveyTemplate(values)).unwrap();
        message.success('Survey Template created Successfully');
      }
      setModalOpen(null);
      setSelectedTemplate(null);
    } catch (error) {
      message.error(error || 'Failed to save survey template');
    }
  }
  return { column, templateSubmit: handelSubmit };
};
