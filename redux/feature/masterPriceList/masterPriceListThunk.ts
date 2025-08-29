import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import { ApiResponse } from "../auth/IAuthState";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { Category, Item, RequestItem } from "./iMasterPriceListState";

export const fetchCategories = createAsyncThunk(
    "categories/fetchAll",
    async (_,{rejectWithValue}) => {
      try {
        const res = await api.get<ApiResponse<{categories:Category[]}>>(API_ENDPOINTS.MASTER_PRICE_LIST_CATEGORY);
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
          if (filters.dwelling_type) query.append("dwelling_type", filters.dwelling_type);
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
    
