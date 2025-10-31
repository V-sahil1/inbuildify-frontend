import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICountryResponse, IStateResponse } from './ILocationState';
import { getCountriesThunk, getStatesByCountryIdThunk } from './locationThunk';
import { Status } from '@lib/constants/enum';

export interface ILocationState {
  countries: ICountryResponse[];
  states: IStateResponse[];
  status: Status;
  error: string | null;
}

const initialState: ILocationState = {
  countries: [],
  states: [],
  status: Status.IDLE,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearLocationState: () => initialState,
    clearStates: state => {
      state.states = [];
    },
  },
  extraReducers: builder => {
    // Get Countries
    builder.addCase(getCountriesThunk.pending, state => {
      state.status = Status.PENDING;
      state.error = null;
    });
    builder.addCase(
      getCountriesThunk.fulfilled,
      (state, action: PayloadAction<ICountryResponse[]>) => {
        state.status = Status.SUCCESS;
        state.countries = action.payload;
      }
    );
    builder.addCase(getCountriesThunk.rejected, (state, action) => {
      state.status = Status.ERROR;
      state.error = action.payload as string;
    });

    // Get States by Country ID
    builder.addCase(getStatesByCountryIdThunk.pending, state => {
      state.status = Status.PENDING;
      state.error = null;
    });
    builder.addCase(
      getStatesByCountryIdThunk.fulfilled,
      (state, action: PayloadAction<IStateResponse[]>) => {
        state.status = Status.SUCCESS;
        state.states = action.payload;
      }
    );
    builder.addCase(getStatesByCountryIdThunk.rejected, (state, action) => {
      state.status = Status.ERROR;
      state.error = action.payload as string;
    });
  },
});

export const { clearLocationState, clearStates } = locationSlice.actions;
export default locationSlice.reducer;
