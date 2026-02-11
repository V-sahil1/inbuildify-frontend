import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createContractFormat,
  fetchAllContractFormat,
  updateContractFormat,
  deleteContractFormat,
  fetchAllContractFormatById,
  createContractFormatSection,
  fetchAllContractFormatSection,
  deleteContractFormatSection,
  updateContractFormatSection,
} from './contractFormatThunk';
import { IContractFormatState } from './IContractFormatState';

const initialState: IContractFormatState = {
  contractFormat: [],
  contractDetail: null,
  contractDetailStatus: Status.IDLE,
  status: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
  contractSectionStatus: {
    fetch: Status.IDLE,
    create: Status.IDLE,
  },
};

const contractFormatSlice = createSlice({
  name: 'contractFormat',
  initialState,
  reducers: {
    clearContractDetail: state => {
      state.contractDetail = null;
      state.contractDetailStatus = Status.IDLE;
    },
  },
  extraReducers: builder => {
    //contract format
    builder.addCase(createContractFormat.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(createContractFormat.fulfilled, (state, action) => {
      state.contractFormat.unshift(action.payload);
      state.contractDetail = { ...action.payload, sections: [] };
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(createContractFormat.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(fetchAllContractFormat.pending, state => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllContractFormat.fulfilled, (state, action) => {
      state.contractFormat = action.payload.contractFormats.map(i => ({ ...i, sections: [] }));
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllContractFormat.rejected, state => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(fetchAllContractFormatById.pending, state => {
      state.contractDetailStatus = Status.PENDING;
    });
    builder.addCase(fetchAllContractFormatById.fulfilled, (state, action) => {
      state.contractDetail = { ...action.payload, sections: state.contractDetail?.sections };
      state.contractDetailStatus = Status.SUCCESS;
    });
    builder.addCase(fetchAllContractFormatById.rejected, state => {
      state.contractDetailStatus = Status.ERROR;
    });

    builder.addCase(updateContractFormat.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(updateContractFormat.fulfilled, (state, action) => {
      state.contractFormat = state.contractFormat.map(i =>
        i.contractFormatId === action.payload.contractFormatId ? { ...i, ...action.payload } : i
      );
      state.contractDetail = { ...action.payload, sections: state.contractDetail.sections };
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(updateContractFormat.rejected, state => {
      state.status.create = Status.ERROR;
    });
    builder.addCase(deleteContractFormat.pending, state => {
      state.status.create = Status.PENDING;
    });
    builder.addCase(deleteContractFormat.fulfilled, (state, action) => {
      state.contractFormat = state.contractFormat.filter(
        i => i.contractFormatId !== action.payload
      );
      state.status.create = Status.SUCCESS;
    });
    builder.addCase(deleteContractFormat.rejected, state => {
      state.status.create = Status.ERROR;
    });

    //contarct format section
    builder.addCase(createContractFormatSection.pending, state => {
      state.contractSectionStatus.create = Status.PENDING;
    });
    builder.addCase(createContractFormatSection.fulfilled, (state, action) => {
      const contract = state.contractFormat.find(
        i => i.contractFormatId === action.payload.contractFormatId
      );
      if (contract) {
        contract.sections.unshift(action.payload);
      }
      state.contractDetail = { ...state.contractDetail, ...contract };
      state.contractSectionStatus.create = Status.SUCCESS;
    });
    builder.addCase(createContractFormatSection.rejected, state => {
      state.contractSectionStatus.create = Status.ERROR;
    });
    builder.addCase(fetchAllContractFormatSection.pending, state => {
      state.contractSectionStatus.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllContractFormatSection.fulfilled, (state, action) => {
      const contract = state.contractFormat.find(i => i.contractFormatId === action.meta.arg);
      if (contract) {
        contract.sections = action.payload.contractSections;
      }
      state.contractDetail = { ...state.contractDetail, ...contract };
      state.contractSectionStatus.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllContractFormatSection.rejected, state => {
      state.contractSectionStatus.fetch = Status.ERROR;
    });

    builder.addCase(updateContractFormatSection.pending, state => {
      state.contractSectionStatus.create = Status.PENDING;
    });
    builder.addCase(updateContractFormatSection.fulfilled, (state, action) => {
      const contract = state.contractFormat.find(
        i => i.contractFormatId === action.payload.contractFormatId
      );
      if (contract) {
        contract.sections = contract.sections.map(i =>
          i.contractSectionId === action.payload.contractSectionId ? action.payload : i
        );
      }
      state.contractDetail = { ...state.contractDetail, ...contract };
      state.contractSectionStatus.create = Status.SUCCESS;
    });
    builder.addCase(updateContractFormatSection.rejected, state => {
      state.contractSectionStatus.create = Status.ERROR;
    });
    builder.addCase(deleteContractFormatSection.pending, state => {
      state.contractSectionStatus.create = Status.PENDING;
    });
    builder.addCase(deleteContractFormatSection.fulfilled, (state, action) => {
      const contract = state.contractFormat.find(
        i => i.contractFormatId === action.meta.arg.contractFormatId
      );
      if (contract) {
        contract.sections = contract.sections.filter(
          i => i.contractSectionId !== action.meta.arg.id
        );
      }
      state.contractDetail = { ...state.contractDetail, ...contract };
      state.contractSectionStatus.create = Status.SUCCESS;
    });
    builder.addCase(deleteContractFormatSection.rejected, state => {
      state.contractSectionStatus.create = Status.ERROR;
    });
  },
});
export const { clearContractDetail } = contractFormatSlice.actions;
export default contractFormatSlice.reducer;
