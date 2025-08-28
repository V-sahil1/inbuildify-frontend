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
    async (categoryId: string,{rejectWithValue}) => {
      try {
        const res = await api.get<ApiResponse<Item[]>>(API_ENDPOINTS.GET_MASTER_PRICE_LIST_ITEM(categoryId));
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
    
