import axios, { AxiosResponse } from "axios";
import {
  getRefreshToken,
  getStoredAuthToken,
  storeAuthToken,
} from "./authToken";

import API_ENDPOINTS from "./apiEndpoints";
import { objectToQueryString } from "./url";
import SystemRoutes from "./Routes";

interface ApiError {
  code: string;
  message: string;
  status: number;
  data: Record<string, any>;
}

interface OptimisticUpdateParams<T> {
  updatedFields: T;
  currentFields: T;
  setLocalData: (data: T) => void;
}

type ApiVariables = Record<string, any>;

const defaults = {
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT || "http://api.example.com",
  error: {
    code: "INTERNAL_ERROR",
    message:
      "Something went wrong. Please check your internet connection or contact our support.",
    status: 503,
    data: {},
  } as ApiError,
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const response = await axios.post(
      `${defaults.baseURL}${API_ENDPOINTS.REFRESH_TOKEN}`,
      { refreshToken }
    );
    const newToken = response?.data?.data?.accessToken ?? "";
    storeAuthToken(newToken);
    return newToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    localStorage.clear(); // Clear tokens and force login
    return null;
  }
};

const getHeaders = async (
  refreshToken?: string
): Promise<Record<string, string | undefined>> => {
  const token = await getStoredAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: refreshToken
      ? `Bearer ${refreshToken}`
      : token
        ? `Bearer ${token}`
        : undefined,
  };
};

let isRefreshing = false;

const api = async <T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  options?: {
    params?: ApiVariables;
    data?: ApiVariables;
    headers?: ApiVariables;
  }
): Promise<T> => {
  let headers = await getHeaders();

  try {
    const response: AxiosResponse<T> = await axios({
      url: `${defaults.baseURL}${url}`,
      method,
      headers: options?.headers ?? headers,
      params: options?.params,
      data: options?.data,
      paramsSerializer: objectToQueryString,
    });

    return response.data;
  } catch (error: any) {
    console.log("Caught API error:", error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log("401 error — trying token refresh");

      if (isRefreshing) {
        throw {
          message: "Already refreshing token.",
          status: 401,
          originalError: error,
        };
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          headers = await getHeaders(newToken);

          const retryResponse = await axios({
            url: `${defaults.baseURL}${url}`,
            method,
            headers,
            params: options?.params,
            data: options?.data,
            paramsSerializer: objectToQueryString,
          });

          return retryResponse.data;
        } else {
          localStorage.clear();
          if (window.location.pathname !== `${SystemRoutes.LOGIN}`) {
            window.location.href = `${SystemRoutes.LOGIN}`;
          }

          throw {
            message: error?.response?.data?.message || "Unauthorized",
            status: 401,
            data: error?.response?.data,
            originalError: error,
          };
        }
      } catch (refreshError: any) {
        isRefreshing = false;
        // localStorage.clear();

        if (window.location.pathname !== `${SystemRoutes.LOGIN}`) {
          window.location.href = `${SystemRoutes.LOGIN}`;
        }

        console.error("Token refresh failed:", refreshError);

        throw {
          message:
            refreshError?.response?.data?.message ||
            refreshError?.message ||
            "Unauthorized",
          status: refreshError?.response?.status || 401,
          data: refreshError?.response?.data,
          originalError: refreshError,
        };
      }
    }

    // 🧨 Handle all other errors
    if (axios.isAxiosError(error)) {
      throw {
        message: error?.response?.data?.message || "Request failed",
        status: error?.response?.status,
        data: error?.response?.data,
        originalError: error,
      };
    }

    throw {
      message: "Network error. Please try again.",
      status: 503,
      data: {},
    };
  }
};

const optimisticUpdate = async <T extends ApiVariables>(
  url: string,
  { updatedFields, currentFields, setLocalData }: OptimisticUpdateParams<T>
): Promise<void> => {
  try {
    setLocalData(updatedFields);
    await api<T>("put", url, { data: updatedFields });
  } catch (error) {
    setLocalData(currentFields);
    console.error((error as ApiError).message);
  }
};

const apiMethods = {
  get: <T>(url: string, options?: { params?: ApiVariables }): Promise<T> =>
    api<T>("get", url, options),
  post: <T>(
    url: string,
    options?: { data?: ApiVariables; headers?: ApiVariables;params?: ApiVariables }
  ): Promise<T> => api<T>("post", url, options),
  put: <T>(url: string, options?: { data?: ApiVariables }): Promise<T> =>
    api<T>("put", url, options),
  patch: <T>(url: string, options?: { data?: ApiVariables }): Promise<T> =>
    api<T>("patch", url, options),
  delete: <T>(
    url: string,
    options?: { params?: ApiVariables; data?: ApiVariables }
  ): Promise<T> => api<T>("delete", url, options),
  optimisticUpdate,
};

export default apiMethods;

const apiWithFormData = async <T>(
  method: "post" | "put" | "patch",
  url: string,
  formData: FormData
): Promise<T> => {
  const headers = await getHeaders();
  headers["Content-Type"] = "multipart/form-data";

  try {
    const response: AxiosResponse<T> = await axios({
      url: `${defaults.baseURL}${url}`,
      method,
      headers,
      data: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API call error", error);

    if (error?.response?.data?.message) {
      throw {
        message: error.response.data.message,
        status: error.response.status,
        data: error.response.data,
      };
    }

    throw {
      message: error?.message || "Upload failed",
      status: error?.response?.status || 500,
      data: error?.response?.data,
    };
  }
};

const apiWithFormDataMethods = {
  post: <T>(url: string, formData: FormData): Promise<T> =>
    apiWithFormData<T>("post", url, formData),
  put: <T>(url: string, formData: FormData): Promise<T> =>
    apiWithFormData<T>("put", url, formData),
  patch: <T>(url: string, formData: FormData): Promise<T> =>
    apiWithFormData<T>("patch", url, formData),
};

export { apiWithFormDataMethods };
