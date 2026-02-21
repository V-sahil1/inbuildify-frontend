import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { IEstateState } from './IEstateState';
import {
  createEState,
  createEStateDocument,
  createEStateFeature,
  createEStateStage,
  deleteEState,
  fetchAllEState,
  fetchAllEStateDocument,
  fetchAllEStateFeature,
  fetchAllEStateImages,
  fetchAllEStateStage,
  updateEState,
  updateEStateFeature,
  updateEStateImages,
  updateEStateStage,
} from './estateThunk';

const initialState: IEstateState = {
  estate: [],
  status: {
    estate: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    document: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    feature: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    stage: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    image: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
  },
};

const estateSlice = createSlice({
  name: 'estate',
  initialState,
  reducers: {
    toggleEstateExpand: (
      state,
      action: { payload: { estateId: string; type: 'document' | 'feature' | 'stage' | 'image' } }
    ) => {
      const { estateId, type } = action.payload;
      const estate = state.estate.find(e => e.estateId === estateId);
      if (estate) {
        estate.isExpanded[type] = true;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(createEState.pending, state => {
      state.status.estate.create = Status.PENDING;
    });
    builder.addCase(createEState.fulfilled, (state, action) => {
      state.estate.unshift({
        ...action.payload,
        documents: [],
        features: [],
        isExpanded: { document: false, feature: false, stage: false, image: false },
      });
      state.status.estate.create = Status.SUCCESS;
    });
    builder.addCase(createEState.rejected, state => {
      state.status.estate.create = Status.ERROR;
    });
    builder.addCase(fetchAllEState.pending, state => {
      state.status.estate.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllEState.fulfilled, (state, action) => {
      state.estate = action.payload.estate.map(i => ({
        ...i,
        documents: [],
        features: [],
        isExpanded: { document: false, feature: false, stage: false, image: false },
      }));
      state.status.estate.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllEState.rejected, state => {
      state.status.estate.fetch = Status.ERROR;
    });
    builder.addCase(updateEState.pending, state => {
      state.status.estate.create = Status.PENDING;
    });
    builder.addCase(updateEState.fulfilled, (state, action) => {
      state.estate = state.estate.map(i =>
        i.estateId === action.payload.estateId ? { ...i, ...action.payload } : i
      );
      state.status.estate.create = Status.SUCCESS;
    });
    builder.addCase(updateEState.rejected, state => {
      state.status.estate.create = Status.ERROR;
    });

    builder.addCase(deleteEState.pending, state => {
      state.status.estate.create = Status.PENDING;
    });
    builder.addCase(deleteEState.fulfilled, (state, action) => {
      state.estate = state.estate.filter(contact => contact.estateId !== action.meta.arg);
      state.status.estate.create = Status.SUCCESS;
    });
    builder.addCase(deleteEState.rejected, state => {
      state.status.estate.create = Status.ERROR;
    });

    //estate document
    builder.addCase(createEStateDocument.pending, state => {
      state.status.document.create = Status.PENDING;
    });
    builder.addCase(createEStateDocument.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.payload.estate.id);
      if (parent) {
        parent.documents.unshift(action.payload);
      }
    });
    builder.addCase(createEStateDocument.rejected, state => {
      state.status.document.create = Status.ERROR;
    });
    builder.addCase(fetchAllEStateDocument.pending, state => {
      state.status.document.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllEStateDocument.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.meta.arg.estate_id);
      if (parent) {
        parent.documents = action.payload.data;
      }
      state.status.document.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllEStateDocument.rejected, state => {
      state.status.document.fetch = Status.ERROR;
    });

    //estate feature
    builder.addCase(createEStateFeature.pending, state => {
      state.status.feature.create = Status.PENDING;
    });
    builder.addCase(createEStateFeature.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.payload.estateId);
      if (parent) {
        parent.features.unshift(action.payload);
      }
      state.status.feature.create = Status.SUCCESS;
    });
    builder.addCase(createEStateFeature.rejected, state => {
      state.status.feature.create = Status.ERROR;
    });
    builder.addCase(fetchAllEStateFeature.pending, state => {
      state.status.feature.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllEStateFeature.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.meta.arg);
      if (parent) {
        parent.features = action.payload;
      }
      state.status.feature.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllEStateFeature.rejected, state => {
      state.status.feature.fetch = Status.ERROR;
    });
    builder.addCase(updateEStateFeature.pending, state => {
      state.status.feature.create = Status.PENDING;
    });
    builder.addCase(updateEStateFeature.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.payload.estateId);
      if (parent) {
        parent.features = parent.features.map(feature =>
          feature.estateFeatureId === action.payload.estateFeatureId
            ? { ...feature, ...action.payload }
            : feature
        );
      }
      state.status.feature.create = Status.SUCCESS;
    });
    builder.addCase(updateEStateFeature.rejected, state => {
      state.status.feature.create = Status.ERROR;
    });

    //estate stages
    builder.addCase(createEStateStage.pending, state => {
      state.status.stage.create = Status.PENDING;
    });
    builder.addCase(createEStateStage.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.payload.estateId);
      if (parent) {
        parent.stages.unshift(action.payload);
      }
      state.status.stage.create = Status.SUCCESS;
    });
    builder.addCase(createEStateStage.rejected, state => {
      state.status.stage.create = Status.ERROR;
    });
    builder.addCase(fetchAllEStateStage.pending, state => {
      state.status.stage.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllEStateStage.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.meta.arg);
      if (parent) {
        parent.stages = action.payload.estateStage;
      }
      state.status.stage.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllEStateStage.rejected, state => {
      state.status.stage.fetch = Status.ERROR;
    });
    builder.addCase(updateEStateStage.pending, state => {
      state.status.stage.create = Status.PENDING;
    });
    builder.addCase(updateEStateStage.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.payload.estateId);
      if (parent) {
        parent.stages = parent.stages.map(stage =>
          stage.estateStageId === action.payload.estateStageId
            ? { ...stage, ...action.payload }
            : stage
        );
      }
      state.status.stage.create = Status.SUCCESS;
    });
    builder.addCase(updateEStateStage.rejected, state => {
      state.status.stage.create = Status.ERROR;
    });

    //estate image
    builder.addCase(fetchAllEStateImages.pending, state => {
      state.status.image.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllEStateImages.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.meta.arg);
      if (parent) {
        parent.image = action.payload;
      }
      state.status.image.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllEStateImages.rejected, state => {
      state.status.image.fetch = Status.ERROR;
    });
    builder.addCase(updateEStateImages.pending, state => {
      state.status.image.create = Status.PENDING;
    });
    builder.addCase(updateEStateImages.fulfilled, (state, action) => {
      const parent = state.estate.find(i => i.estateId === action.payload.estate.id);
      if (parent) {
        parent.image = action.payload;
      }
      state.status.image.create = Status.SUCCESS;
    });
    builder.addCase(updateEStateImages.rejected, state => {
      state.status.image.create = Status.ERROR;
    });
  },
});
export const { toggleEstateExpand } = estateSlice.actions;
export default estateSlice.reducer;
