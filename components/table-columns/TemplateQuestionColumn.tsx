import { useAppDispatch } from '@hooks/redux';
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from '@redux/feature/surveyTemplate/surveyTemplateThunk';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Button, message, Tooltip } from 'antd';
import { useState } from 'react';

export const TemplateQuestionColumn = (
  selectedQuestion,
  setSelectedQuestion,
  setModalOpen,
  selectedTemplate
) => {
  const dispatch = useAppDispatch();

  const column = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Options',
      dataIndex: 'optionType',
      key: 'optionType',
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: (
        <Button type="primary" onClick={() => setModalOpen('questionCreate')}>
          New
        </Button>
      ),
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Edit">
            <Button
              type="text"
              className="text-blue"
              icon={<IconPencil size={15} />}
              onClick={() => {
                setSelectedQuestion(record);
                setModalOpen('questionCreate');
              }}
            />
          </Tooltip>

          <Tooltip title="Remove">
            <Button
              type="text"
              color="red"
              icon={<IconTrash size={15} />}
              onClick={() => {
                setModalOpen('deleteQuestion');
                setSelectedQuestion(record);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  async function handleDeleteQuestion() {
    try {
      await dispatch(
        deleteQuestion({
          id: selectedQuestion.surveyQuestionId,
          templateId: selectedQuestion.surveyTemplate.id,
        })
      ).unwrap();
      setSelectedQuestion(null);
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save question');
    }
  }
  async function handleSubmit(values) {
    console.log('seleccted', selectedQuestion);
    try {
      if (selectedQuestion) {
        await dispatch(
          updateQuestion({ data: values, id: selectedQuestion.surveyQuestionId })
        ).unwrap();
        message.success('Question updated successfully');
      } else {
        await dispatch(
          createQuestion({ ...values, surveyTemplateId: selectedTemplate.surveyTemplateId })
        ).unwrap();
        message.success('Question created successfully');
      }
      setSelectedQuestion(null);
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save question');
    }
  }

  return { column, questionSubmit: handleSubmit, questionDelete: handleDeleteQuestion };
};
