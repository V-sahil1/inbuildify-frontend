import { createSlice } from "@reduxjs/toolkit";
import { Status } from "@lib/constants/enum";
import { Package } from "./IPackageState";
import {
  createPackage,
  fetchPackageItems,
  fetchPackages,
} from "./packageThunk";
import { Item } from "../masterPriceList/iMasterPriceListState";

interface PackageState {
  packages: Package[] | null;
  items: Item[] | null;
  status: { packages: Status; items: Status;create: Status };
}

const initialState: PackageState = {
  packages: null,
  items: null,
  status: { packages: Status.IDLE, items: Status.IDLE,create: Status.IDLE },
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {},
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
      state.status.create = Status.PENDING;
    });
    builder.addCase(createPackage.fulfilled, (state, action) => {
      state.status.create = Status.SUCCESS;
      state.packages.unshift(action.payload);
    });
    builder.addCase(createPackage.rejected, (state) => {
      state.status.create = Status.ERROR;
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

export default packageSlice.reducer;
