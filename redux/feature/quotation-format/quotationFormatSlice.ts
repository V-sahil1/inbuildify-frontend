import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  getQuotationFormatMasterSectionsThunk,
  createQuotationFormatMasterSectionThunk,
  getQuotationFormatMasterSectionsHeadersThunk,
  createQuotationFormatMasterSectionHeaderThunk,
  createQuotationFormatMasterSectionItemThunk,
  getQuotationFormatMasterSectionsItemsThunk,
  deleteQuotationFormatMasterSectionThunk,
  deleteQuotationFormatMasterSectionHeaderThunk,
  deleteQuotationFormatMasterSectionItemThunk,
  updateQuotationFormatMasterSectionItemThunk,
  updateQuotationFormatMasterSectionThunk,
  updateQuotationFormatMasterSectionHeaderThunk,
} from './quotationFormatThunk';
import {
  MasterGroup,
  MasterHeading,
  MasterItem,
  Pagination,
  initialPagination,
} from 'data/quotationFormatData';

type PaginationRecord = Record<string, Pagination>;
type StatusRecord = Record<string, Status>;
type ErrorRecord = Record<string, string | null>;

export interface QuotationFormatState {
  masters: MasterGroup[];
  pagination: Pagination;
  headersPagination: PaginationRecord;
  itemsPagination: PaginationRecord;
  status: {
    fetchMasterSections: Status;
    loadMoreMasterSections: Status;
    fetchHeaders: StatusRecord;
    loadMoreHeaders: StatusRecord;
    fetchItems: StatusRecord;
    loadMoreItems: StatusRecord;
    createMasterSectionHeader: Status;
    createMasterSectionHeaderError: string | null;
    createMasterSectionItem: Status;
    createMasterSectionItemError: string | null;
  };
  errors: {
    fetchMasterSections: string | null;
    fetchHeaders: ErrorRecord;
    fetchItems: ErrorRecord;
  };
}

const initialState: QuotationFormatState = {
  masters: [],
  pagination: { ...initialPagination },
  headersPagination: {},
  itemsPagination: {},
  status: {
    fetchMasterSections: Status.IDLE,
    loadMoreMasterSections: Status.IDLE,
    fetchHeaders: {},
    loadMoreHeaders: {},
    fetchItems: {},
    loadMoreItems: {},
    createMasterSectionHeader: Status.IDLE,
    createMasterSectionHeaderError: null,
    createMasterSectionItem: Status.IDLE,
    createMasterSectionItemError: null,
  },
  errors: {
    fetchMasterSections: null,
    fetchHeaders: {},
    fetchItems: {},
  },
};

const buildPagination = (raw: any): Pagination => {
  const currentPage = Number(raw?.currentPage ?? 1);
  const totalPages = Number(raw?.totalPages ?? 1);
  const totalRecords = Number(raw?.totalRecords ?? 0);
  const limit = Number(raw?.limit ?? initialPagination.limit);
  return {
    currentPage,
    totalPages,
    totalRecords,
    limit,
    hasMore: currentPage < totalPages,
  };
};

const quotationFormatSlice = createSlice({
  name: 'quotationFormat',
  initialState,
  reducers: {
    setMasters(state, action: PayloadAction<MasterGroup[]>) {
      state.masters = action.payload;
    },
    resetMasterSections(state) {
      state.masters = [];
      state.pagination = { ...initialPagination };
      state.status.fetchMasterSections = Status.IDLE;
      state.status.loadMoreMasterSections = Status.IDLE;
      state.errors.fetchMasterSections = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuotationFormatMasterSectionsThunk.pending, (state, action) => {
        const arg = action.meta.arg || {};
        if (arg.masterSectionId) return;
        const page = arg.page ?? 1;
        if (page > 1) {
          state.status.loadMoreMasterSections = Status.PENDING;
        } else {
          state.status.fetchMasterSections = Status.PENDING;
        }
        state.errors.fetchMasterSections = null;
      })
      .addCase(getQuotationFormatMasterSectionsThunk.fulfilled, (state, action) => {
        const arg = action.meta.arg || {};
        const rawPayload = action.payload as any;
        if (!rawPayload) {
          state.status.fetchMasterSections = Status.SUCCESS;
          return;
        }

        const payload = (rawPayload.masterSectionId || rawPayload.masterSections)
          ? rawPayload
          : (rawPayload.data || {});

        const masterSectionId = payload.masterSectionId;

        // Single master-section refresh (no pagination effect)
        if (masterSectionId) {
          state.masters = state.masters.map((m: any) => {
            if (m.masterSectionId === masterSectionId) {
              const rawHeadings = payload.quotationFormatMasterHeadings ||
                payload.quotationFormatMasterSectionHeadings ||
                payload.masterSectionHeadings ||
                payload.masterHeadings ||
                payload.headings ||
                payload.quotationFormatMasterHeading ||
                payload.quotationFormatMasterSectionHeading ||
                payload.masterSectionHeading ||
                payload.masterHeading ||
                payload.heading;

              const headingsArray = Array.isArray(rawHeadings)
                ? rawHeadings
                : (rawHeadings ? [rawHeadings] : []);

              return {
                ...m,
                name: payload.masterName || payload.name || m.name,
                active: payload.status !== undefined ? !!payload.status : m.active,
                headings: headingsArray.length > 0
                  ? headingsArray.map((h: any, idx: number) => {
                      const rawItems = h.quotationFormatMasterItems ||
                        h.quotationFormatMasterSectionItems ||
                        h.masterItems ||
                        h.items ||
                        h.quotationFormatMasterItem ||
                        h.quotationFormatMasterSectionItem ||
                        h.masterItem ||
                        h.item;
                      const itemsArray = Array.isArray(rawItems)
                        ? rawItems
                        : (rawItems ? [rawItems] : []);

                      const existingHeading = m.headings?.find(
                        (eh: any) => eh.id === (h.quotationFormatMasterHeadingId || h.id)
                      );

                      return {
                        id: h.quotationFormatMasterHeadingId || h.masterHeadingId || h.id || `${masterSectionId}-heading-${idx}`,
                        name: h.headingName || h.name || 'Untitled Heading',
                        startDate: h.startDate,
                        endDate: h.endDate,
                        active: h.status !== undefined ? !!h.status : (h.active !== undefined ? !!h.active : true),
                        sortOrder: h.sortOrder ?? idx + 1,
                        items: itemsArray.length > 0
                          ? itemsArray.map((item: any, itemIdx: number) => ({
                              id: item.quotationFormatMasterItemId || item.masterItemId || item.id || `${masterSectionId}-item-${idx}-${itemIdx}`,
                              name: item.itemName || item.name || item.description || 'Untitled Item',
                              startDate: item.startDate,
                              endDate: item.endDate,
                              active: item.status !== undefined ? !!item.status : (item.active !== undefined ? !!item.active : true),
                              sortOrder: item.sortOrder ?? itemIdx + 1,
                            }))
                          : (existingHeading?.items || []),
                      };
                    })
                  : (m.headings || []),
              };
            }
            return m;
          });
          return;
        }

        // Bulk load with pagination
        const page = arg.page ?? 1;
        const masterSections = Array.isArray(payload)
          ? payload
          : payload.masterSections;

        const sectionsArray = Array.isArray(masterSections) ? masterSections : [];
        const mapped = sectionsArray.map((m: any, idx: number) => ({
          id: m.masterSectionId || `${Date.now()}-${idx}`,
          masterSectionId: m.masterSectionId,
          name: m.masterName || m.name || 'Untitled',
          active: !!m.status,
          headings: [],
        }));

        if (page > 1) {
          const existingIds = new Set(state.masters.map(m => m.masterSectionId || m.id));
          const fresh = mapped.filter(m => !existingIds.has(m.masterSectionId || m.id));
          state.masters = [...state.masters, ...fresh];
          state.status.loadMoreMasterSections = Status.SUCCESS;
        } else {
          state.masters = mapped;
          state.status.fetchMasterSections = Status.SUCCESS;
        }

        state.pagination = buildPagination(payload.pagination);
      })
      .addCase(getQuotationFormatMasterSectionsThunk.rejected, (state, action) => {
        const arg = action.meta.arg || {};
        if (arg.masterSectionId) return;
        const page = arg.page ?? 1;
        const errorMessage = (action.payload as string) || action.error?.message || 'Failed to load master sections';
        if (page > 1) {
          state.status.loadMoreMasterSections = Status.ERROR;
        } else {
          state.status.fetchMasterSections = Status.ERROR;
        }
        state.errors.fetchMasterSections = errorMessage;
      })
      .addCase(createQuotationFormatMasterSectionThunk.fulfilled, (state, action) => {
        const rawPayload = action.payload as any;
        const newMaster = (rawPayload && rawPayload.data) ? rawPayload.data : rawPayload;
        if (newMaster && newMaster.masterSectionId) {
          state.masters.push({
            id: newMaster.masterSectionId,
            masterSectionId: newMaster.masterSectionId,
            name: newMaster.masterName || 'Untitled',
            active: !!newMaster.status,
            headings: [],
          });
          state.pagination.totalRecords += 1;
        }
      })
      .addCase(getQuotationFormatMasterSectionsHeadersThunk.pending, (state, action) => {
        const arg = action.meta.arg || {};
        const key = arg.masterSectionId;
        if (!key) return;
        const page = arg.page ?? 1;
        if (page > 1) {
          state.status.loadMoreHeaders[key] = Status.PENDING;
        } else {
          state.status.fetchHeaders[key] = Status.PENDING;
        }
        state.errors.fetchHeaders[key] = null;
      })
      .addCase(getQuotationFormatMasterSectionsHeadersThunk.fulfilled, (state, action) => {
        const rawPayload = action.payload as any;
        const arg = action.meta.arg || {};
        const masterSectionId = arg.masterSectionId;
        if (!masterSectionId) return;

        const payload = (rawPayload && rawPayload.headers) ? rawPayload : (rawPayload?.data || {});
        const headers = Array.isArray(payload.headers) ? payload.headers : [];
        const page = arg.page ?? 1;

        const mapped: MasterHeading[] = headers.map((h: any, idx: number) => ({
          id: h.masterSectionHeaderId || h.id || `${masterSectionId}-heading-${idx}`,
          name: h.headingName || h.name || 'Untitled Heading',
          startDate: h.effectiveStartDate || h.startDate,
          endDate: h.effectiveEndDate || h.endDate,
          active: h.status !== undefined ? !!h.status : (h.active !== undefined ? !!h.active : true),
          sortOrder: h.sortOrder ?? idx + 1,
          items: [],
        }));

        state.masters = state.masters.map((m: any) => {
          if (m.masterSectionId !== masterSectionId) return m;

          if (page > 1) {
            const existing = m.headings || [];
            const existingIds = new Set(existing.map((h: any) => h.id));
            const fresh = mapped.filter(h => !existingIds.has(h.id));
            return { ...m, headings: [...existing, ...fresh] };
          }

          // For page 1, preserve item arrays for matching existing headings
          return {
            ...m,
            headings: mapped.map(h => {
              const existing = m.headings?.find((eh: any) => eh.id === h.id);
              return { ...h, items: existing?.items || [] };
            }),
          };
        });

        state.headersPagination[masterSectionId] = buildPagination(payload.pagination);

        if (page > 1) {
          state.status.loadMoreHeaders[masterSectionId] = Status.SUCCESS;
        } else {
          state.status.fetchHeaders[masterSectionId] = Status.SUCCESS;
        }
      })
      .addCase(getQuotationFormatMasterSectionsHeadersThunk.rejected, (state, action) => {
        const arg = action.meta.arg || {};
        const key = arg.masterSectionId;
        if (!key) return;
        const page = arg.page ?? 1;
        const errorMessage = (action.payload as string) || action.error?.message || 'Failed to load headings';
        if (page > 1) {
          state.status.loadMoreHeaders[key] = Status.ERROR;
        } else {
          state.status.fetchHeaders[key] = Status.ERROR;
        }
        state.errors.fetchHeaders[key] = errorMessage;
      })
      .addCase(createQuotationFormatMasterSectionHeaderThunk.pending, (state) => {
        state.status.createMasterSectionHeader = Status.PENDING;
        state.status.createMasterSectionHeaderError = null;
      })
      .addCase(createQuotationFormatMasterSectionHeaderThunk.rejected, (state, action) => {
        state.status.createMasterSectionHeader = Status.ERROR;
        state.status.createMasterSectionHeaderError = (action.payload as string) || 'Failed to create heading';
      })
      .addCase(createQuotationFormatMasterSectionHeaderThunk.fulfilled, (state, action) => {
        state.status.createMasterSectionHeader = Status.SUCCESS;
        state.status.createMasterSectionHeaderError = null;

        const rawPayload = action.payload as any;
        const newHeader = (rawPayload && rawPayload.data) ? rawPayload.data : rawPayload;
        if (!newHeader || !newHeader.masterSectionId) return;

        state.masters = state.masters.map((m: any) => {
          if (m.masterSectionId === newHeader.masterSectionId) {
            const headingsList = m.headings || [];
            const headingExists = headingsList.some((h: any) => h.id === newHeader.masterSectionHeaderId);
            if (headingExists) return m;

            const newHeading: MasterHeading = {
              id: newHeader.masterSectionHeaderId,
              name: newHeader.headingName || 'Untitled Heading',
              startDate: newHeader.effectiveStartDate,
              endDate: newHeader.effectiveEndDate,
              active: newHeader.status !== undefined ? !!newHeader.status : true,
              sortOrder: newHeader.sortOrder ?? (headingsList.length + 1),
              items: [],
            };

            return {
              ...m,
              headings: [...headingsList, newHeading],
            };
          }
          return m;
        });

        const key = newHeader.masterSectionId;
        if (state.headersPagination[key]) {
          state.headersPagination[key].totalRecords += 1;
        }
      })
      .addCase(createQuotationFormatMasterSectionItemThunk.pending, (state) => {
        state.status.createMasterSectionItem = Status.PENDING;
        state.status.createMasterSectionItemError = null;
      })
      .addCase(createQuotationFormatMasterSectionItemThunk.rejected, (state, action) => {
        state.status.createMasterSectionItem = Status.ERROR;
        state.status.createMasterSectionItemError = (action.payload as string) || 'Failed to create item';
      })
      .addCase(createQuotationFormatMasterSectionItemThunk.fulfilled, (state, action) => {
        state.status.createMasterSectionItem = Status.SUCCESS;
        state.status.createMasterSectionItemError = null;

        const rawPayload = action.payload as any;
        const newItemPayload = (rawPayload && rawPayload.data) ? rawPayload.data : rawPayload;
        if (!newItemPayload || !newItemPayload.masterSectionHeaderId) return;

        state.masters = state.masters.map((m: any) => {
          const headings = m.headings || [];
          const headingExists = headings.some((h: any) => h.id === newItemPayload.masterSectionHeaderId);
          if (!headingExists) return m;

          return {
            ...m,
            headings: headings.map((h: any) => {
              if (h.id === newItemPayload.masterSectionHeaderId) {
                const itemsList = h.items || [];
                const itemExists = itemsList.some((item: any) => item.id === newItemPayload.masterSectionItemId);
                if (itemExists) return h;

                const newItem: MasterItem = {
                  id: newItemPayload.masterSectionItemId,
                  name: newItemPayload.itemName || 'Untitled Item',
                  startDate: newItemPayload.effectiveStartDate,
                  endDate: newItemPayload.effectiveEndDate,
                  active: newItemPayload.status !== undefined ? !!newItemPayload.status : true,
                  sortOrder: newItemPayload.sortOrder ?? (itemsList.length + 1),
                };

                return {
                  ...h,
                  items: [...itemsList, newItem],
                };
              }
              return h;
            }),
          };
        });

        const key = newItemPayload.masterSectionHeaderId;
        if (state.itemsPagination[key]) {
          state.itemsPagination[key].totalRecords += 1;
        }
      })
      .addCase(getQuotationFormatMasterSectionsItemsThunk.pending, (state, action) => {
        const arg = action.meta.arg || {};
        const key = arg.masterSectionId;
        if (!key) return;
        const page = arg.page ?? 1;
        if (page > 1) {
          state.status.loadMoreItems[key] = Status.PENDING;
        } else {
          state.status.fetchItems[key] = Status.PENDING;
        }
        state.errors.fetchItems[key] = null;
      })
      .addCase(getQuotationFormatMasterSectionsItemsThunk.fulfilled, (state, action) => {
        const rawPayload = action.payload as any;
        const arg = action.meta.arg || {};
        const masterSectionHeaderId = arg.masterSectionId;
        if (!masterSectionHeaderId) return;

        const payload = (rawPayload && rawPayload.items) ? rawPayload : (rawPayload?.data || {});
        const items = Array.isArray(payload.items) ? payload.items : [];
        const page = arg.page ?? 1;

        const mapped: MasterItem[] = items.map((item: any, idx: number) => ({
          id: item.masterSectionItemId || item.id || `${masterSectionHeaderId}-item-${idx}`,
          name: item.itemName || item.name || 'Untitled Item',
          startDate: item.effectiveStartDate || item.startDate,
          endDate: item.effectiveEndDate || item.endDate,
          active: item.status !== undefined ? !!item.status : (item.active !== undefined ? !!item.active : true),
          sortOrder: item.sortOrder ?? idx + 1,
        }));

        state.masters = state.masters.map((m: any) => {
          const headings = m.headings || [];
          const headingExists = headings.some((h: any) => h.id === masterSectionHeaderId);
          if (!headingExists) return m;

          return {
            ...m,
            headings: headings.map((h: any) => {
              if (h.id !== masterSectionHeaderId) return h;
              if (page > 1) {
                const existing = h.items || [];
                const existingIds = new Set(existing.map((it: any) => it.id));
                const fresh = mapped.filter(it => !existingIds.has(it.id));
                return { ...h, items: [...existing, ...fresh] };
              }
              return { ...h, items: mapped };
            }),
          };
        });

        state.itemsPagination[masterSectionHeaderId] = buildPagination(payload.pagination);

        if (page > 1) {
          state.status.loadMoreItems[masterSectionHeaderId] = Status.SUCCESS;
        } else {
          state.status.fetchItems[masterSectionHeaderId] = Status.SUCCESS;
        }
      })
      .addCase(getQuotationFormatMasterSectionsItemsThunk.rejected, (state, action) => {
        const arg = action.meta.arg || {};
        const key = arg.masterSectionId;
        if (!key) return;
        const page = arg.page ?? 1;
        const errorMessage = (action.payload as string) || action.error?.message || 'Failed to load items';
        if (page > 1) {
          state.status.loadMoreItems[key] = Status.ERROR;
        } else {
          state.status.fetchItems[key] = Status.ERROR;
        }
        state.errors.fetchItems[key] = errorMessage;
      })
      .addCase(deleteQuotationFormatMasterSectionThunk.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.masters = state.masters.filter(m => m.masterSectionId !== deletedId && m.id !== deletedId);
        state.pagination.totalRecords = Math.max(0, state.pagination.totalRecords - 1);
      })
      .addCase(deleteQuotationFormatMasterSectionHeaderThunk.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.masters = state.masters.map(m => {
          const wasPresent = (m.headings || []).some((h: any) => h.id === deletedId);
          const headings = (m.headings || []).filter((h: any) => h.id !== deletedId);
          if (wasPresent && m.masterSectionId && state.headersPagination[m.masterSectionId]) {
            state.headersPagination[m.masterSectionId].totalRecords = Math.max(
              0,
              state.headersPagination[m.masterSectionId].totalRecords - 1
            );
          }
          return { ...m, headings };
        });
      })
      .addCase(deleteQuotationFormatMasterSectionItemThunk.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.masters = state.masters.map(m => ({
          ...m,
          headings: (m.headings || []).map((h: any) => {
            const wasPresent = (h.items || []).some((item: any) => item.id === deletedId);
            const items = (h.items || []).filter((item: any) => item.id !== deletedId);
            if (wasPresent && state.itemsPagination[h.id]) {
              state.itemsPagination[h.id].totalRecords = Math.max(
                0,
                state.itemsPagination[h.id].totalRecords - 1
              );
            }
            return { ...h, items };
          }),
        }));
      })
      .addCase(updateQuotationFormatMasterSectionItemThunk.fulfilled, (state, action) => {
        const rawPayload = action.payload as any;
        const updatedItem = (rawPayload && rawPayload.data) ? rawPayload.data : rawPayload;
        if (!updatedItem || !updatedItem.masterSectionItemId) return;

        state.masters = state.masters.map((m: any) => {
          const headings = m.headings || [];
          const headingExists = headings.some((h: any) => h.id === updatedItem.masterSectionHeaderId);
          if (!headingExists) return m;

          return {
            ...m,
            headings: headings.map((h: any) => {
              if (h.id === updatedItem.masterSectionHeaderId) {
                return {
                  ...h,
                  items: (h.items || []).map((item: any) => {
                    if (item.id === updatedItem.masterSectionItemId) {
                      return {
                        ...item,
                        name: updatedItem.itemName || item.name,
                        startDate: updatedItem.effectiveStartDate || item.startDate,
                        endDate: updatedItem.effectiveEndDate || item.endDate,
                        active: updatedItem.status !== undefined ? !!updatedItem.status : item.active,
                        sortOrder: updatedItem.sortOrder ?? item.sortOrder,
                      };
                    }
                    return item;
                  }),
                };
              }
              return h;
            }),
          };
        });
      })
      .addCase(updateQuotationFormatMasterSectionThunk.fulfilled, (state, action) => {
        const rawPayload = action.payload as any;
        const updatedMaster = (rawPayload && rawPayload.data) ? rawPayload.data : rawPayload;
        if (!updatedMaster || !updatedMaster.masterSectionId) return;

        state.masters = state.masters.map((m: any) => {
          if (m.masterSectionId === updatedMaster.masterSectionId || m.id === updatedMaster.masterSectionId) {
            return {
              ...m,
              name: updatedMaster.masterName || m.name,
              active: updatedMaster.status !== undefined ? !!updatedMaster.status : m.active,
            };
          }
          return m;
        });
      })
      .addCase(updateQuotationFormatMasterSectionHeaderThunk.fulfilled, (state, action) => {
        const rawPayload = action.payload as any;
        const updatedHeader = (rawPayload && rawPayload.data) ? rawPayload.data : rawPayload;
        if (!updatedHeader || !updatedHeader.masterSectionHeaderId) return;

        state.masters = state.masters.map((m: any) => {
          if (m.masterSectionId === updatedHeader.masterSectionId || m.id === updatedHeader.masterSectionId) {
            return {
              ...m,
              headings: (m.headings || []).map((h: any) => {
                if (h.id === updatedHeader.masterSectionHeaderId) {
                  return {
                    ...h,
                    name: updatedHeader.headingName || h.name,
                    startDate: updatedHeader.effectiveStartDate || h.startDate,
                    endDate: updatedHeader.effectiveEndDate || h.endDate,
                    active: updatedHeader.status !== undefined ? !!updatedHeader.status : h.active,
                    sortOrder: updatedHeader.sortOrder ?? h.sortOrder,
                  };
                }
                return h;
              }),
            };
          }
          return m;
        });
      });
  },
});

export const { setMasters, resetMasterSections } = quotationFormatSlice.actions;
export default quotationFormatSlice.reducer;
