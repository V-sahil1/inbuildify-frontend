import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { GroupType, Package, PackageFetchParams } from './IPackageState';
import {
  createPackage,
  createPackageGroup,
  createPackagePricelist,
  deletePackage,
  deletePackageGroup,
  deletePackagePricelist,
  fetchPackageGroup,
  fetchPackageItems,
  fetchPackages,
  fetchPackagePricelist,
  updatePackage,
  updatePackageGroup,
} from './packageThunk';
import { IPriceListItem } from '../masterPriceList/iMasterPriceListState';
import { CommonPagination } from '../common/ICommonState';

interface PackageState {
  packages: Package[] | null;
  items: IPriceListItem[] | null;
  group: GroupType[] | null;
  status: { packages: Status; items: Status; item: Status; group: Status; pricelist: Status };
  selectedFilters: PackageFetchParams;
  addInstItemModal: boolean;
  pagination: CommonPagination;
}

const initialState: PackageState = {
  packages: null,
  items: null,
  group: [],
  status: {
    packages: Status.IDLE,
    items: Status.IDLE,
    item: Status.IDLE,
    group: Status.IDLE,
    pricelist: Status.IDLE,
  },
  selectedFilters: <PackageFetchParams>{},
  addInstItemModal: false,
  pagination: <CommonPagination>{},
};

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    clearFilters: state => {
      state.selectedFilters = <PackageFetchParams>{ range_id: '', dwelling_type_id: '' };
    },
    setAddInstItemModal: (state, action) => {
      state.addInstItemModal = action.payload;
    },
    addPackageItems: (state, action) => {
      if (state.items === null) {
        state.items = [];
      }
      state.items = [action.payload, ...state.items];
    },
    removePackageItems: (state, action) => {
      state.items = state.items?.filter(
        item => item.priceListItemId !== action.payload.priceListItemId
      );
      if (state.packages) {
        state.packages = state.packages.map(pkg => ({
          ...pkg,
          categoryItems:
            pkg.categoryItems?.filter(item => item.id !== action.payload.categoryItemId) || [],
        }));
      }
    },
  },
  extraReducers: builder => {
    //get
    builder.addCase(fetchPackages.pending, state => {
      state.status.packages = Status.PENDING;
    });
    builder.addCase(fetchPackages.fulfilled, (state, action) => {
      state.status.packages = Status.SUCCESS;
      state.packages = action.payload.package.map(i => ({ ...i, priceListItem: [] }));
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchPackages.rejected, state => {
      state.status.packages = Status.ERROR;
    });
    //create
    builder.addCase(createPackage.pending, state => {
      state.status.item = Status.PENDING;
    });
    builder.addCase(createPackage.fulfilled, (state, action) => {
      state.status.item = Status.SUCCESS;
      state.packages.unshift({ ...action.payload, pricelistItems: [] });
      state.pagination.totalRecords++;
    });
    builder.addCase(createPackage.rejected, state => {
      state.status.item = Status.ERROR;
    });
    //update
    builder.addCase(updatePackage.pending, state => {
      state.status.item = Status.PENDING;
    });
    builder.addCase(updatePackage.fulfilled, (state, action) => {
      state.status.item = Status.SUCCESS;
      state.packages = state.packages?.map(pkg => {
        if (pkg.packageId === action.payload.packageId) {
          return { ...pkg, ...action.payload };
        }
        return pkg;
      });
    });
    builder.addCase(updatePackage.rejected, state => {
      state.status.item = Status.ERROR;
    });
    //delete
    builder.addCase(deletePackage.pending, state => {
      state.status.item = Status.PENDING;
    });
    builder.addCase(deletePackage.fulfilled, (state, action) => {
      state.status.item = Status.SUCCESS;
      state.packages = state.packages?.filter(pkg => pkg.packageId !== action.payload.id);
      state.pagination.totalRecords--;
    });
    builder.addCase(deletePackage.rejected, state => {
      state.status.item = Status.ERROR;
    });
    //get items
    builder.addCase(fetchPackageItems.pending, state => {
      state.status.items = Status.PENDING;
    });
    builder.addCase(fetchPackageItems.fulfilled, (state, action) => {
      // const currentItems = state.items || [];
      state.items = action.payload || [];

      // const existingIds = new Set(
      //   currentItems.map((item) => item.categoryItemId)
      // );
      // const uniqueNewItems = newItems.filter(
      //   (item) => !existingIds.has(item.categoryItemId)
      // );
      // if (uniqueNewItems.length > 0) {
      //   state.items = [...currentItems, ...uniqueNewItems];
      // } else if (currentItems.length === 0) {
      //   state.items = newItems;
      // }

      state.status.items = Status.SUCCESS;
    });
    builder.addCase(fetchPackageItems.rejected, state => {
      state.status.items = Status.ERROR;
    });

    //package group create
    builder.addCase(createPackageGroup.fulfilled, (state, action) => {
      state.group.push(action.payload);
      state.status.group = Status.SUCCESS;
    });
    builder.addCase(updatePackageGroup.fulfilled, (state, action) => {
      state.group = state.group.map(g =>
        g.packageGroupId === action.payload.packageGroupId ? action.payload : g
      );
      state.status.group = Status.SUCCESS;
    });
    builder.addCase(deletePackageGroup.fulfilled, (state, action) => {
      state.group = state.group.filter(g => g.packageGroupId !== action.payload.id);
      state.status.group = Status.SUCCESS;
    });
    builder.addCase(fetchPackageGroup.fulfilled, (state, action) => {
      state.group = action.payload;
      state.status.group = Status.SUCCESS;
    });

    // Package Pricelist
    builder.addCase(fetchPackagePricelist.pending, state => {
      state.status.pricelist = Status.PENDING;
    });
    builder.addCase(fetchPackagePricelist.fulfilled, (state, action) => {
      state.status.pricelist = Status.SUCCESS;
      const parent = state.packages?.find(pkg => pkg.packageId === action.meta.arg);
      if (parent) {
        parent.pricelistItems = action.payload;
      }
    });
    builder.addCase(fetchPackagePricelist.rejected, state => {
      state.status.pricelist = Status.ERROR;
    });

    builder.addCase(createPackagePricelist.pending, state => {
      state.status.pricelist = Status.PENDING;
    });
    builder.addCase(createPackagePricelist.fulfilled, (state, action) => {
      state.status.pricelist = Status.SUCCESS;
      const parent = state.packages?.find(pkg => pkg.packageId === action.payload.packageId);
      if (parent) {
        parent.pricelistItems.push(action.payload);
      }
    });
    builder.addCase(createPackagePricelist.rejected, state => {
      state.status.pricelist = Status.ERROR;
    });

    builder.addCase(deletePackagePricelist.pending, state => {
      state.status.pricelist = Status.PENDING;
    });
    builder.addCase(deletePackagePricelist.fulfilled, (state, action) => {
      state.status.pricelist = Status.SUCCESS;
      const parent = state.packages?.find(pkg => pkg.packageId === action.payload.packageId);
      if (parent) {
        parent.pricelistItems = parent.pricelistItems.filter(item => item.id !== action.payload.id);
      }
    });
    builder.addCase(deletePackagePricelist.rejected, state => {
      state.status.pricelist = Status.ERROR;
    });
  },
});

export const {
  setSelectedFilters,
  clearFilters,
  setAddInstItemModal,
  addPackageItems,
  removePackageItems,
} = packageSlice.actions;
export default packageSlice.reducer;
