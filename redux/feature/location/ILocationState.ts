export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ICountryResponse {
  countryId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStateResponse {
  stateId: string;
  name: string;
  countryId: string;
  createdAt: string;
  updatedAt: string;
}
