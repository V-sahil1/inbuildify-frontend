import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Button, Tooltip } from 'antd';
import { useState } from 'react';

export const TemplateQuestionColumn = (selectedQuestion, setSelectedQuestion, setModalOpen) => {
  const [questions, setQuestions] = useState([
    { id: '1', description: 'Rate quality', options: 'Radio Button', sort: 1 },
  ]);
  const column = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
    },
    {
      title: 'Sort Order',
      dataIndex: 'sort',
      key: 'sort',
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
  function handleDeleteQuestion(record) {
    setQuestions(prev => prev.filter(i => i.id !== record.id));
  }
  function handleSubmit(values) {
    selectedQuestion
      ? setQuestions(prev =>
          prev.map(i => (i.id === selectedQuestion.id ? { ...values, id: i.id } : i))
        )
      : setQuestions(prev => [
          ...prev,
          { ...values, id: Math.floor(Math.random() * 100000).toString() },
        ]);
    setSelectedQuestion(null);
  }

  return { column, questions, questionSubmit: handleSubmit, questionDelete: handleDeleteQuestion };
};
