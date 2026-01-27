import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { CommonPagination } from '../common/ICommonState';
import {
  ISurveyQuestion,
  ISurveyTemplate,
  ISurveyTemplateFetchParams,
} from './SurveyTemplateState';

export const createSurveyTemplate = createAsyncThunk(
  'surveyTemplate/create',
  async (payload: ISurveyTemplate, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ISurveyTemplate>>(API_ENDPOINTS.SURVEY_TEMPLATE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllSurveyTemplate = createAsyncThunk(
  'surveyTemplate/fetchAll',
  async (params: ISurveyTemplateFetchParams, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ surveyTemplates: ISurveyTemplate[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.SURVEY_TEMPLATE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSurveyTemplate = createAsyncThunk(
  'surveyTemplate/update',
  async (payload: { data: Partial<ISurveyTemplate>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ISurveyTemplate>>(
        `${API_ENDPOINTS.SURVEY_TEMPLATE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuestion = createAsyncThunk(
  'surveyTemplate/createQuestion',
  async (payload: ISurveyQuestion, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ISurveyQuestion>>(API_ENDPOINTS.SURVEY_QUESTION, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllQuestions = createAsyncThunk(
  'surveyTemplate/fetchAllQuestions',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ questions: ISurveyQuestion[]; paginationn: CommonPagination }>
      >(API_ENDPOINTS.SURVEY_QUESTION, { params: { survey_template_id: id } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'surveyTemplate/updateQuestion',
  async (payload: { data: Partial<ISurveyQuestion>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ISurveyQuestion>>(
        `${API_ENDPOINTS.SURVEY_QUESTION}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'surveyTemplate/deleteQuestion',
  async (payload: { id: string; templateId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<ISurveyTemplate>>(
        `${API_ENDPOINTS.SURVEY_QUESTION}/${payload.id}`
      );
      return { id: payload.id, templateId: payload.templateId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
