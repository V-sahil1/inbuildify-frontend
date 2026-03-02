import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { TableDrawer } from '@/components/common/TableDrawer';
import {
  SurveyTemplateFields,
  TemplateQuestionField,
} from '@/components/formFields/surveyTemplateFields';
import { SurveyTemplateColumn } from '@/components/table-columns/SurveyTemplateColumn';
import { TemplateQuestionColumn } from '@/components/table-columns/TemplateQuestionColumn';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { debouncedURL } from '@lib/utils/debounceURL';
import { getPaginationConfig } from '@lib/utils/getPaginationConfig';
import { toggleSurveyTemplateExpand } from '@redux/feature/surveyTemplate/surveyTemplateSlice';
import {
  ISurveyTemplate,
  ISurveyTemplateFetchParams,
} from '@redux/feature/surveyTemplate/SurveyTemplateState';
import {
  fetchAllQuestions,
  fetchAllSurveyTemplate,
} from '@redux/feature/surveyTemplate/surveyTemplateThunk';
import { IconPlus } from '@tabler/icons-react';
import { Button, message, Table } from 'antd';
import { useEffect, useState } from 'react';

const SurveyTemplate = () => {
  const dispatch = useAppDispatch();
  const { templates, status, pagination } = useAppSelector(state => state.surveyTemplate);
  const [modalOpen, setModalOpen] = useState<'create' | 'questionCreate' | 'deleteQuestion' | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ISurveyTemplate | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['template', 'sort', 'status'],
    initialValue: {
      status: '',
    },
  });
  const PAGE_SIZE = 10;

  const fetchTemplateData = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      const params: ISurveyTemplateFetchParams = {
        page,
        limit,
      };
      params.name = filters?.template || undefined;
      params.sort_order = filters?.sort || undefined;
      params.status = filters?.status !== '' ? filters?.status === 'true' : undefined;
      await dispatch(fetchAllSurveyTemplate(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch templates');
    }
  };

  const fetchAllQuestionsData = async () => {
    try {
      const response = await Promise.all(
        templates.map(template => {
          if (!template.isExpanded) {
            dispatch(toggleSurveyTemplateExpand(template.surveyTemplateId));
            dispatch(fetchAllQuestions(template?.surveyTemplateId)).unwrap();
          }
        })
      );
    } catch (error) {
      message.error(error || 'Failed to fetch questions');
    }
  };
  useEffect(() => {
    fetchTemplateData();
  }, [currentPage, filters]);

  useEffect(() => {
    fetchAllQuestionsData();
  }, [templates]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const { column, templateSubmit } = SurveyTemplateColumn(
    selectedTemplate,
    setSelectedTemplate,
    setDrawerOpen,
    setParams,
    setModalOpen,
    instantFilters
  );
  const {
    column: questionColumn,
    questionSubmit,
    questionDelete,
  } = TemplateQuestionColumn(selectedQuestion, setSelectedQuestion, setModalOpen, selectedTemplate);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Survey Template Listing</h1>
        <div className="flex items-center gap-2">
          <Button type="primary" ghost>
            Total Records {templates?.length}
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
        dataSource={templates}
        onRow={record => ({
          onClick: () => {
            setSelectedTemplate(record);
            setModalOpen('create');
          },
          style: {
            cursor: 'pointer',
          },
        })}
        pagination={getPaginationConfig({
          currentPage,
          limit: pagination?.limit,
          totalRecords: pagination?.totalRecords,
          setCurrentPage,
        })}
        loading={status.fetch === Status.PENDING}
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
            modalOpen === 'create' ? templateSubmit(values) : questionSubmit(values);
          }}
          fields={
            modalOpen === 'create'
              ? SurveyTemplateFields(!!selectedTemplate, setIsRecommended, isRecommended)
              : TemplateQuestionField
          }
          isEditing={!!selectedTemplate || !!selectedQuestion}
          initialValues={
            modalOpen === 'create'
              ? { ...selectedTemplate, status: selectedTemplate?.status ? 'active' : 'inactive' }
              : selectedQuestion || {}
          }
          footerMessage={
            modalOpen === 'create' ? (
              <p className="text-red-500">
                Note:Applying the recommended template will remove your previous template.
              </p>
            ) : null
          }
        />
      )}
      {drawerOpen && (
        <TableDrawer
          title="Questions"
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
          table={[
            {
              columns: questionColumn,
              data:
                templates?.find(i => i.surveyTemplateId === selectedTemplate?.surveyTemplateId)
                  ?.questions || [],
            },
          ]}
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
          onSubmit={questionDelete}
          content={
            <div className="text-center">
              <p className="text-lg">Question: {selectedQuestion?.description}</p>
              <p>Are you sure you want to delete this {selectedQuestion?.description}? </p>
            </div>
          }
          okText="Delete"
        />
      )}
    </div>
  );
};

export default SurveyTemplate;
