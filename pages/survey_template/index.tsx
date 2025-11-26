import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { TableDrawer } from '@/components/common/TableDrawer';
import {
  SurveyTemplateFields,
  TemplateQuestionField,
} from '@/components/formFields/surveyTemplateFields';
import { SurveyTemplateColumn } from '@/components/table-columns/SurveyTemplateColumn';
import { TemplateQuestionColumn } from '@/components/table-columns/TemplateQuestionColumn';
import { debouncedURL } from '@lib/utils/debounceURL';
import { IconPlus } from '@tabler/icons-react';
import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';

const SurveyTemplate = () => {
  const [modalOpen, setModalOpen] = useState<'create' | 'questionCreate' | 'deleteQuestion' | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState<'question' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['template', 'sort', 'status'],
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const { column, templateData, templateSubmit } = SurveyTemplateColumn(
    selectedTemplate,
    setSelectedTemplate,
    setDrawerOpen,
    setParams,
    filters
  );
  const {
    column: questionColumn,
    questions,
    questionSubmit,
    questionDelete,
  } = TemplateQuestionColumn(selectedQuestion, setSelectedQuestion, setModalOpen);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Survey Template Listing</h1>
        <div className="flex items-center gap-2">
          <Button type="primary" ghost>
            Total Records 12
          </Button>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => {
              setModalOpen('create');
            }}
          >
            New Template
          </Button>
        </div>
      </div>
      <Table
        columns={column}
        dataSource={templateData}
        pagination={{ pageSize: 10 }}
        onRow={record => ({
          onClick: () => {
            setSelectedTemplate(record);
            setModalOpen('create');
          },
        })}
      />
      {['create', 'questionCreate'].includes(modalOpen) && (
        <ActionDialogmodel
          title={
            modalOpen === 'create'
              ? !!selectedTemplate
                ? 'Edit Template'
                : 'Create Template'
              : !!selectedQuestion
                ? 'Edit Question'
                : 'Create Question'
          }
          open={['create', 'questionCreate'].includes(modalOpen)}
          onCancel={() => {
            setModalOpen(null);
            setSelectedTemplate(null);
            setSelectedQuestion(null);
          }}
          onSubmit={values => {
            console.log('template submit', values);
            modalOpen === 'create' ? templateSubmit(values) : questionSubmit(values);
            setModalOpen(null);
          }}
          fields={
            modalOpen === 'create'
              ? SurveyTemplateFields(!!selectedTemplate)
              : TemplateQuestionField
          }
          isEditing={!!selectedTemplate || !!selectedQuestion}
          initialValues={modalOpen === 'create' ? selectedTemplate : selectedQuestion}
          footerMessage={
            modalOpen === 'create' && (
              <p className="text-red-500">
                Note:Applying the recommended template will remove your previous template.
              </p>
            )
          }
        />
      )}
      {drawerOpen === 'question' && (
        <TableDrawer
          title="Questions"
          open={drawerOpen === 'question'}
          onClose={() => {
            setDrawerOpen(null);
          }}
          table={[{ columns: questionColumn, data: questions }]}
          width={700}
        />
      )}
      {modalOpen === 'deleteQuestion' && (
        <ConfirmationContentModal
          title="Confirm Deletion"
          open={modalOpen === 'deleteQuestion'}
          onClose={() => {
            setModalOpen(null);
            setSelectedQuestion(null);
          }}
          onSubmit={() => {
            questionDelete(selectedQuestion);
            setModalOpen(null);
            setSelectedQuestion(null);
          }}
          content={
            <div className="text-center">
              <p className="text-lg">Question: {selectedQuestion?.description}</p>
              <p>Are you sure you want to delete this {selectedQuestion.description}? </p>
            </div>
          }
          okText="Delete"
        />
      )}
    </div>
  );
};

export default SurveyTemplate;
