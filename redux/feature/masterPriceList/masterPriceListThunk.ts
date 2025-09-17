import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import { ApiResponse } from "../auth/IAuthState";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { Category, Item, RequestItem } from "./iMasterPriceListState";

export const fetchCategories = createAsyncThunk(
  "categorie/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ categories: Category[] }>>(
        API_ENDPOINTS.MASTER_PRICE_LIST_CATEGORY
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categorie/create",
  async (payload: { name: string; description: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Category>>(
        API_ENDPOINTS.MASTER_PRICE_LIST_CATEGORY,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categorie/update",
  async (
    { payload, id }: { payload: { name: string; description: string }; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<Category>>(
        API_ENDPOINTS.MASTER_PRICE_LIST_CATEGORY + "/" + id,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categorie/delete",
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Category>>(
        API_ENDPOINTS.MASTER_PRICE_LIST_CATEGORY + "/" + payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategoryOrder = createAsyncThunk(
  "categorie/updateOrder",
  async (payload: { categories: { id: string; order: number }[] }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<Category>>(
        API_ENDPOINTS.MASTER_CATEGORY_ORDER,
        { data: {orderedCategories:payload.categories} }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

  // Fetch items of a category
  export const fetchCategoryItems = createAsyncThunk(
    "categories/fetchItems",
    async (
      args: { categoryId: string; filters?: { range?: string; dwelling_type?: string } },
      {rejectWithValue}
    ) => {
      try {
        const { categoryId, filters } = args;
        let url = API_ENDPOINTS.GET_MASTER_PRICE_LIST_ITEM(categoryId);
        if (filters && (filters.range || filters.dwelling_type)) {
          const query = new URLSearchParams();
          if (filters.range) query.append("range", filters.range);
          if (filters.dwelling_type) query.append("dwellingType", filters.dwelling_type);
          url = `${url}?${query.toString()}`;
        }
        const res = await api.get<ApiResponse<Item[]>>(url);
        return { categoryId, items: res.data };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const createCategoryItem = createAsyncThunk(
    "categories/createItem",
    async (payload: RequestItem,{rejectWithValue}) => {
      try {
        const res = await api.post<ApiResponse<Item>>(API_ENDPOINTS.CREATE_MASTER_PRICE_LIST_ITEM
          , {data:payload});
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const updateCategoryItem = createAsyncThunk(
  "categories/updateItem",
  async ({payload, id}: {payload: any, id: string}, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<any>>(
        API_ENDPOINTS.CREATE_MASTER_PRICE_LIST_ITEM + '/' + id,
        {data:payload}
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategoryItem = createAsyncThunk(
  "categories/deleteItem",
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Item>>(
        API_ENDPOINTS.CREATE_MASTER_PRICE_LIST_ITEM + '/' + payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
