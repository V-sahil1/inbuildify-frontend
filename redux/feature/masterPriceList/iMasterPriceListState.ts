// categoriesSlice.ts
export interface Item {
    name: string;
    cost: number;
    type: "Fixed" | "Variable";
    categoryItemId: string;
    shortDescription: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Category {
    categoryId: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    items: Item[] | null;
    isExpanded: boolean;  
    loadingItems: boolean;
  }
  
  export interface CategoriesState {
    categories: Category[];
    loading: boolean;
  }
  