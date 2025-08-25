// categoriesSlice.ts
interface Item {
    id: string;
    name: string;
    cost: number;
    type: "Fixed" | "Variable";
  }
  
  interface Category {
    id: string;
    name: string;
    items: Item[] | null;
    isExpanded: boolean;  
    loadingItems: boolean;
  }
  
  interface CategoriesState {
    categories: Category[];
    loading: boolean;
  }
  