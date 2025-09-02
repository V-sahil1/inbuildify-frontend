import { createSlice } from "@reduxjs/toolkit";
import { Status } from "@lib/constants/enum";
import { Package } from "./IPackageState";
import {
  createPackage,
  deletePackage,
  fetchPackageItems,
  fetchPackages,
  updatePackage,
} from "./packageThunk";
import { Item } from "../masterPriceList/iMasterPriceListState";

interface PackageState {
  packages: Package[] | null;
  items: Item[] | null;
  status: { packages: Status; items: Status; item: Status };
  selectedFilters: { range: string; dwelling_type: string };
}

const initialState: PackageState = {
  packages: null,
  items: null,
  status: { packages: Status.IDLE, items: Status.IDLE, item: Status.IDLE },
  selectedFilters: { range: '', dwelling_type: '' },
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    clearFilters: (state) => {
      state.selectedFilters = { range: '', dwelling_type: '' };
    },
    addPackageItems: (state, action) => {
      state.items = [action.payload, ...state.items];
    },
  },
  extraReducers: (builder) => {
    //get
    builder.addCase(fetchPackages.pending, (state) => {
      state.status.packages = Status.PENDING;
    });
    builder.addCase(fetchPackages.fulfilled, (state, action) => {
      state.status.packages = Status.SUCCESS;
      state.packages = action.payload;
    });
    builder.addCase(fetchPackages.rejected, (state) => {
      state.status.packages = Status.ERROR;
    });
    //create
    builder.addCase(createPackage.pending, (state) => {
      state.status.item = Status.PENDING;
    });
    builder.addCase(createPackage.fulfilled, (state, action) => {
      state.status.item = Status.SUCCESS;
      state.packages.unshift(action.payload);
    });
    builder.addCase(createPackage.rejected, (state) => {
      state.status.item = Status.ERROR;
    });
    //update
    builder.addCase(updatePackage.pending, (state) => {
      state.status.item = Status.PENDING;
    });
    builder.addCase(updatePackage.fulfilled, (state, action) => {
      state.status.item = Status.SUCCESS;
      state.packages = state.packages?.map((pkg) => {
        if (pkg.packageId === action.payload.packageId) {
          return action.payload;
        }
        return pkg;
      });
    });
    builder.addCase(updatePackage.rejected, (state) => {
      state.status.item = Status.ERROR;
    });
    //delete
    builder.addCase(deletePackage.pending, (state) => {
      state.status.item = Status.PENDING;
    });
    builder.addCase(deletePackage.fulfilled, (state, action) => {
      state.status.item = Status.SUCCESS;
      state.packages = state.packages?.filter((pkg) => pkg.packageId !== action.payload.id);
    });
    builder.addCase(deletePackage.rejected, (state) => {
      state.status.item = Status.ERROR;
    }); 
    //get items
    builder.addCase(fetchPackageItems.pending, (state) => {
      state.status.items = Status.PENDING;
    });
    builder.addCase(fetchPackageItems.fulfilled, (state, action) => {
      state.status.items = Status.SUCCESS;
      state.items = action.payload;
    });
    builder.addCase(fetchPackageItems.rejected, (state) => {
      state.status.items = Status.ERROR;
    });
  },
});

export const { setSelectedFilters, clearFilters, addPackageItems } = packageSlice.actions;
export default packageSlice.reducer;
