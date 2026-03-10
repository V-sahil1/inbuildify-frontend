import { createSlice } from '@reduxjs/toolkit';
import { IFacadeState } from './IFacadeState';
import { Status } from '@lib/constants/enum';
import { createFacade, deleteFacade, getFacades, updateFacade } from './facadeThunk';

export const facadeSlice = createSlice({
  name: 'facade',
  initialState: {
    facades: [] as IFacadeState[],
    status: Status.IDLE,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRecords: 0,
      limit: 10,
    },
    selectedFilters: { standard: false, upgrade: false },
  },
  reducers: {
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    clearFilters: state => {
      state.selectedFilters = { standard: false, upgrade: false };
    },
    clearStandardFilter: state => {
      state.selectedFilters.standard = false;
    },
    clearUpgradeFilter: state => {
      state.selectedFilters.upgrade = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(getFacades.pending, state => {
      state.status = Status.PENDING;
    });
    builder.addCase(getFacades.fulfilled, (state, action) => {
      state.facades = action.payload.facades;
      state.pagination = action.payload.pagination;
      state.status = Status.SUCCESS;
    });
    builder.addCase(getFacades.rejected, state => {
      state.status = Status.ERROR;
    });
    builder.addCase(createFacade.fulfilled, (state, action) => {
      state.facades.unshift(action.payload);
    });
    builder.addCase(updateFacade.fulfilled, (state, action) => {
      state.facades = state.facades.map(facade =>
        facade.facadeId === action.payload.facadeId ? action.payload : facade
      );
    });
    builder.addCase(deleteFacade.fulfilled, (state, action) => {
      state.facades = state.facades.filter(facade => facade.facadeId !== action.payload);
      state.pagination.totalRecords -= 1;
    });
  },
});

export const { setSelectedFilters, clearFilters, clearStandardFilter, clearUpgradeFilter } =
  facadeSlice.actions;
export default facadeSlice.reducer;
