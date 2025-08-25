import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import { ApiResponse } from "../auth/IAuthState";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";

export const fetchCategories = createAsyncThunk(
    "categories/fetchAll",
    async () => {
      const res = await api.get<ApiResponse<any>>(API_ENDPOINTS.MASTER_PRICE_LIST_CATEGORY);
      return res.data;
    }
  );
  
  // Fetch items of a category
  export const fetchCategoryItems = createAsyncThunk(
    "categories/fetchItems",
    async (categoryId: string) => {
      const res = await api.get<ApiResponse<any>>(`/categories/${categoryId}/items`);
      return { categoryId, items: res.data };
    }
  );