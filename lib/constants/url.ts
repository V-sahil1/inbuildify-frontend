import queryString from 'query-string';
import { omit } from 'lodash';

export const queryStringToObject = (str: string, options = {}) =>
  queryString.parse(str, {
    arrayFormat: 'bracket',
    ...options,
  });

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objectToQueryString = (obj: any, options = {}) =>
  queryString.stringify(obj, {
    arrayFormat: 'bracket',
    ...options,
  });

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const omitFromQueryString = (str: string, keys: any) =>
  objectToQueryString(omit(queryStringToObject(str), keys));

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addToQueryString = (str: any, fields: any) =>
  objectToQueryString({
    ...queryStringToObject(str),
    ...fields,
  });
