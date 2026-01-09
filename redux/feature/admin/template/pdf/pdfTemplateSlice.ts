import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { fetchPdfTemplate, updatePdfTemplate } from './pdfTemplateThunk';
import { IPdfTemplateState } from './IpdfTemplateState';

const initialState: IPdfTemplateState = {
  pdfTemplate: [],
  status: {
    fetch: Status.IDLE,
    update: Status.IDLE,
  },
};

const pdfTemplateSlice = createSlice({
  name: 'pdfTemplate',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPdfTemplate.pending, (state) => {
      state.status.fetch = Status.PENDING;
    });
    builder.addCase(fetchPdfTemplate.fulfilled, (state, action) => {
      state.pdfTemplate = action.payload;
      state.status.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchPdfTemplate.rejected, (state) => {
      state.status.fetch = Status.ERROR;
    });

    builder.addCase(updatePdfTemplate.pending, (state) => {
      state.status.update = Status.PENDING;
    });
    builder.addCase(updatePdfTemplate.fulfilled, (state, action) => {
      const PdfTemplate = state.pdfTemplate.find(template =>
        template.templatePdfId === action.payload.templatePdfId
      );
      if (PdfTemplate) {
        Object.assign(PdfTemplate, action.payload);
      }
      state.status.update = Status.SUCCESS;
    });
    builder.addCase(updatePdfTemplate.rejected, (state) => {
      state.status.update = Status.ERROR;
    });
  },
});
export default pdfTemplateSlice.reducer;
