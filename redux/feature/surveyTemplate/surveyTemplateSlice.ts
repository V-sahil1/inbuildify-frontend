import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createQuestion,
  createSurveyTemplate,
  deleteQuestion,
  fetchAllQuestions,
  fetchAllSurveyTemplate,
  updateQuestion,
  updateSurveyTemplate,
} from './surveyTemplateThunk';
import { ISurveyTemplateState } from './SurveyTemplateState';

const initialState: ISurveyTemplateState = {
  templates: [],
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  pagination: null,
};

const surveyTemplateSlice = createSlice({
  name: 'surveyTemplate',
  initialState,
  reducers: {
    toggleSurveyTemplateExpand: (state, action) => {
      const template = state.templates.find(i => i.surveyTemplateId === action.payload);
      if (template) {
        template.isExpanded = true;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(createSurveyTemplate.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createSurveyTemplate.fulfilled, (state, action) => {
      if (action.payload.isRecommended) {
        const template = state.templates.find(i => i.isRecommended);
        if (template) {
          template.isRecommended = false;
        }
      }
      state.templates.unshift({ ...action.payload, isExpanded: false, questions: [] });
      state.pagination.totalRecords = state.pagination.totalRecords + 1;
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createSurveyTemplate.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllSurveyTemplate.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSurveyTemplate.fulfilled, (state, action) => {
      state.templates = action.payload.surveyTemplates.map(i => ({
        ...i,
        isExpanded: false,
        questions: [],
      }));
      state.pagination = action.payload.pagination;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSurveyTemplate.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateSurveyTemplate.pending, state => {
      state.status.create = Status.PENDING;
    });

    builder.addCase(updateSurveyTemplate.fulfilled, (state, action) => {
      if (action.payload.isRecommended) {
        const template = state.templates.find(i => i.isRecommended);
        if (template) {
          template.isRecommended = false;
        }
      }
      state.templates = state.templates.map(i =>
        i.surveyTemplateId === action.payload.surveyTemplateId ? { ...i, ...action.payload } : i
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateSurveyTemplate.rejected, state => {
      state.status.create = Status.ERROR;
    });

    //template questions

    builder.addCase(createQuestion.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createQuestion.fulfilled, (state, action) => {
      const template = state.templates.find(
        i => i.surveyTemplateId === action.payload.surveyTemplate.id
      );
      if (template) {
        template.questions.push(action.payload);
      }
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createQuestion.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllQuestions.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllQuestions.fulfilled, (state, action) => {
      const template = state.templates.find(i => i.surveyTemplateId === action.meta.arg);
      if (template) {
        template.questions = action.payload.questions;
      }
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllQuestions.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updateQuestion.pending, state => {
      state.status.create = Status.PENDING;
    });

    builder.addCase(updateQuestion.fulfilled, (state, action) => {
      const template = state.templates.find(
        i => i.surveyTemplateId === action.payload.surveyTemplate.id
      );
      if (template) {
        template.questions = template.questions.map(i =>
          i.surveyQuestionId === action.payload.surveyQuestionId ? action.payload : i
        );
      }
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateQuestion.rejected, state => {
      state.status.create = Status.ERROR;
    });

    builder.addCase(deleteQuestion.pending, state => {
      state.status.create = Status.PENDING;
    });

    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      const template = state.templates.find(i => i.surveyTemplateId === action.payload.templateId);
      if (template) {
        template.questions = template.questions.filter(
          i => i.surveyQuestionId !== action.payload.id
        );
      }
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteQuestion.rejected, state => {
      state.status.create = Status.ERROR;
    });
  },
});
export const { toggleSurveyTemplateExpand } = surveyTemplateSlice.actions;
export default surveyTemplateSlice.reducer;
