import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IPasswordPolicyState, passwordPolicy } from './IPasswordPolicyState';
import { fetchPasswordPolicy, updatePasswordPolicy } from './passwordPolicyThunk';

const initialState: IPasswordPolicyState = {
  passwordPolicy: <passwordPolicy>{},
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const passwordPolicySlice = createSlice({
  name: 'passwordPolicy',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPasswordPolicy.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchPasswordPolicy.fulfilled, (state, action) => {
      state.passwordPolicy = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchPasswordPolicy.rejected, state => {
      state.status.fetch = Status.ERROR;
    });
    builder.addCase(updatePasswordPolicy.pending, state => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updatePasswordPolicy.fulfilled, (state, action) => {
      state.passwordPolicy = { ...state.passwordPolicy, ...action.payload };
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updatePasswordPolicy.rejected, state => {
      state.status.update = Status.ERROR;
    });
  },
});
export default passwordPolicySlice.reducer;
