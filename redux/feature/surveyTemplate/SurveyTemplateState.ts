import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';
import { CommonPagination } from '../common/ICommonState';

export interface ISurveyTemplate {
  surveyTemplateId: string;
  name: string;
  sortOrder: number;
  isRecommended: boolean;
  status: boolean;
  isExpanded?: boolean;
  questions?: ISurveyQuestion[];
}

export interface ISurveyQuestion {
  surveyQuestionId: string;
  description: string;
  optionType: 'text' | 'radio' | 'star_1_to_5' | 'star_1_to_10';
  sortOrder: number;
  surveyTemplateId: string;
  surveyTemplate?: Entity;
}

export interface ISurveyTemplateState {
  templates: ISurveyTemplate[];
  status: {
    fetch: Status;
    create: Status;
  };
  pagination: CommonPagination;
}

export interface ISurveyTemplateFetchParams {
  page: number;
  limit: number;
  name?: string;
  sort_order?: string;
  status?: boolean;
}
