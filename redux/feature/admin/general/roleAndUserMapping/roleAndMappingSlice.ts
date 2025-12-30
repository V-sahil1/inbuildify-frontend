import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IRoleAndUserMappingState } from './IRoleAndUserMappingState';
import { fetchRoleTypeById, fetchRoleAndUsersMapping, createRoleAndUserMapping, updateRoleAndUserMapping } from './roleAndMappingThunk';

const initialState: IRoleAndUserMappingState = {
  userRoleMapping: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
    create: Status.IDLE,
  },
};

const roleAndMappingSlice = createSlice({
  name: 'roleAndMapping',
  initialState,
  reducers: {
    addRoleMapping: (state, action) => {
      state.userRoleMapping.unshift(action.payload);
    },
    removeRoleMapping: (state, action) => {
      state.userRoleMapping = state.userRoleMapping.filter(
        item => item.userRoleMappingId !== action.payload
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchRoleAndUsersMapping.pending, (state) => {
      state.status.fetch = Status.PENDING;
    })
    builder.addCase(fetchRoleAndUsersMapping.fulfilled, (state, action) => {
      state.userRoleMapping = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchRoleAndUsersMapping.rejected, (state) => {
      state.status.fetch = Status.ERROR;
    })
    builder.addCase(createRoleAndUserMapping.pending, (state) => {
      state.status.create = Status.PENDING;
    })
    builder.addCase(createRoleAndUserMapping.fulfilled, (state, action) => {
      const index = state.userRoleMapping.findIndex(item => item.isNew);
      if (index !== -1) {
        state.userRoleMapping[index] = action.payload;
      } else {
        state.userRoleMapping.unshift(action.payload);
      }
      state.status.create = Status.SUCCESS;
    })
    builder.addCase(createRoleAndUserMapping.rejected, (state) => {
      state.status.create = Status.ERROR;
    })
    builder.addCase(updateRoleAndUserMapping.pending, (state) => {
      state.status.update = Status.PENDING;
    })
    builder.addCase(updateRoleAndUserMapping.fulfilled, (state, action) => {
      const index = state.userRoleMapping.findIndex(
        item => item.userRoleMappingId === action.payload.userRoleMappingId
      );
      if (index !== -1) {
        state.userRoleMapping[index] = action.payload;
      }
      state.status.update = Status.SUCCESS;
    })
    builder.addCase(updateRoleAndUserMapping.rejected, (state) => {
      state.status.update = Status.ERROR;
    })
  },
});
export const { addRoleMapping, removeRoleMapping } = roleAndMappingSlice.actions;
export default roleAndMappingSlice.reducer;
