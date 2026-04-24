import { PropertyDetails } from 'data/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { Status } from '@lib/constants/enum';
import {
  approveQuotation,
  createQuotationCompareThunk,
  createQuotationCustomSection,
  createQuotationPackageThunk,
  createQuotationPricellistThunk,
  createQuotationThunk,
  createQuotationVersionThunk,
  deleteQuotationCustomSection,
  deleteQuotationPackageThunk,
  deleteQuotationPricelistThunk,
  deleteQuotationThunk,
  getAllQuotationsThunk,
  getQuotationCustomSection,
  getQuotationPricelistThunk,
  getQuotationStatusCountsThunk,
  getQuotationFilterOptionsThunk,
  getQuotationThunk,
  getQuotationVersionById,
  updateQuotationCustomSection,
  updateQuotationVersion,
  updateQuotationItemThunk,
  createQuotationAdditionalPricellistThunk,
} from './quotationThunk';
import { LeadContact } from '../lead/ILeadState';
import {
  CustomSection,
  Quotation,
  QuotationComparison,
  QuotationListItem,
  QuotationListPagination,
  QuotationPriceListItem,
  QuotationStatusCounts,
  QuotationFilterOption,
  QuotationVersionDetails,
} from './IQuotationState';
import { Package } from '../package/IPackageState';
import { updateContact } from '../contacts/contactThunk';
import { updateLeadProperty, updateLeadThunk } from '../lead/leadThunk';
// Helper function to map price list item data to quotation item format
const mapPriceListItemToQuotationItem = (item: any, quantity?: number) => ({
  ...item,
  quantity: Number(quantity || item?.quantity) || 1,
  itemDescription: item.priceListItemDescription,
  costType: item?.priceListItemCostType,
  cost: item?.priceListItemCost,
  uom: item?.priceListItemUom,
  rangeId: item?.priceListItemRangeId,
  dwellingTypeId: item?.priceListItemDwellingTypeId,
  status: 'active',
});

export interface QuotationState {
  status: { create: Status; getById: Status; customSection: Status; list: Status };
  quoteDetails: QuotationVersionDetails | null;
  selectedFilters: any;
  contact: LeadContact[];
  property: PropertyDetails;
  plan: any;
  facade: any;
  package: Package;
  items: QuotationPriceListItem[];
  extraItems: QuotationPriceListItem[];
  quotation: Quotation[];
  customSections: CustomSection[];
  comparison?: QuotationComparison;
  structureEngineer?: any;
  // quotation listing
  quotationList: QuotationListItem[];
  quotationListPagination: QuotationListPagination;
  quotationStatusCounts: QuotationStatusCounts;
  quotationFilterOptions: QuotationFilterOption[];
}

const initialState: QuotationState = {
  status: { create: Status.IDLE, getById: Status.IDLE, customSection: Status.IDLE, list: Status.IDLE },
  quoteDetails: null,
  selectedFilters: { range: '', dwellingType: '', location: '' },
  contact: [],
  property: null,
  plan: null,
  facade: null,
  package: null,
  items: [],
  extraItems: [],
  quotation: [],
  customSections: [],
  comparison: null,
  structureEngineer: null,
  // quotation listing
  quotationList: [],
  quotationListPagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  quotationStatusCounts: { total: 0, approved: 0, draft: 0 },
  quotationFilterOptions: [],
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    clearQuotation(state) {
      state.items = [];
      state.extraItems = [];
      state.contact = [];
      state.property = null;
      state.plan = null;
      state.facade = null;
      state.package = null;
      state.selectedFilters = { range: '', dwellingType: '', location: '' };
      state.customSections = [];
    },
    clearSelectedFloorplanFacadePackageReducer(state) {
      state.plan = null;
      state.facade = null;
      state.items = [];
      state.package = null;
    },
    setQuotationContact(state, action: PayloadAction<LeadContact | null>) {
      state.contact = state?.contact?.map(i =>
        i.contactId === action.payload.contactId ? action.payload : i
      );
    },
    setQuotationProperty(state, action: PayloadAction<PropertyDetails | null>) {
      state.property = action.payload as any;
    },
    setQuotationPropertyFromResponse(state, action: PayloadAction<any>) {
      const { builderId, ...propertyWithoutBuilder } = (action.payload || {}) as any;
      state.property = propertyWithoutBuilder as any;
    },
    setQuotationExtraItems(state, action: PayloadAction<QuotationPriceListItem>) {
      state.extraItems = [...state.extraItems, action.payload];
    },
    setQuotationItems(state, action: PayloadAction<QuotationPriceListItem>) {
      state.items = [...state.items, action.payload];
    },
    removeQuotationItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.priceListItemId !== action.payload);
    },
    setQuotationPlan(state, action: PayloadAction<any>) {
      state.plan = action.payload;
    },
    setQuotationFacade(state, action: PayloadAction<any>) {
      state.facade = action.payload;
    },
    setQuotationPackage(state, action: PayloadAction<any>) {
      state.package = action.payload;
      // const uniqueItems = action.payload.categoryItems.filter(
      //   item => !state.items.some(i => i.priceListItemId === item.id)
      // );
      // state.items = [
      //   ...state.items,
      //   ...uniqueItems.map(item => ({
      //     categoryItemId: item.id,
      //     quantity: 1,
      //     price: item.price,
      //     description: item.desc,
      //     cost: item.price,
      //   })),
      // ];
    },
    setQuotationStructuralEngineer(state, action: PayloadAction<any>) {
      state.structureEngineer = action.payload;
      // Keep quoteDetails in sync so the package-selection guard
      // (which reads quoteDetails.structuralEngineer) becomes truthy immediately
      // without waiting for an API round-trip.
      if (state.quoteDetails) {
        state.quoteDetails.structuralEngineer = action.payload;
      }
    },
    updateQuotationItem: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i.priceListItemId === itemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    updateQuotationContact(state, action: PayloadAction<any>) {
      state.contact = action.payload;
    },
    // setQuotationBaseItems(state, action: PayloadAction<any>) {
    //     state.items = [...state.items,...action.payload];
    // },
    setSelectedFilters(state, action: PayloadAction<any>) {
      state.selectedFilters = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(REHYDRATE, state => {
        if (!Array.isArray(state.quotationFilterOptions)) {
          state.quotationFilterOptions = [];
        }
      })
      .addCase(getQuotationVersionById.pending, state => {
        state.status.getById = Status.PENDING;
      })
      .addCase(getQuotationVersionById.fulfilled, (state, action) => {
        const data = action.payload.find(
          i => i.quotationVersionId === action.meta.arg.quoteVersionId
        );
        state.quoteDetails = data;
        // state.quoteDetails = {
        //   slugId: data.slugId,
        //   quotationId: data.quotationId,
        //   createdAt: data.createdAt,
        //   updatedAt: data.updatedAt,
        //   totalAmount: data.totalAmount,
        //   builder: data.builder,
        //   leadStatus: data.lead.status,
        // };

        // Set contact from lead.leadContact
        if (data?.leadContacts) {
          state.contact = data.leadContacts;
        }

        // // Set property
        // if (data.property) {
        //   state.property = data.property;
        // }

        // Always overwrite (not conditionally) so stale data from a previously
        // viewed quotation is never carried into a new one.
        // If the incoming quotation has no plan/facade/package/engineer the
        // fields correctly become null rather than keeping old values.
        state.plan = data?.floorPlan ?? null;
        state.facade = data?.facade ?? null;
        state.package = data?.package ?? null;
        state.structureEngineer = data?.structuralEngineer ?? null;

        // Extra items belong to the current quotation only — reset them so
        // previously-viewed quotation extras don't leak through.
        state.extraItems = [];

        // Set selected filters
        state.selectedFilters = {
          range: data?.rangeId || '',
          dwellingType: data?.dwellingTypeId || '',
          location: data?.locationId || '',
        };
        state.status.getById = Status.SUCCESS;
      })
      .addCase(getQuotationVersionById.rejected, state => {
        state.status.getById = Status.ERROR;
      })

      .addCase(updateQuotationVersion.fulfilled, (state, action) => {
        // Preserve fields that the update API doesn't return (leadContacts, property,
        // structuralEngineer) so they don't disappear after a range/dwelling-type change.
        state.quoteDetails = {
          ...action.payload,
          leadContacts:
            action.payload?.leadContacts ?? state.quoteDetails?.leadContacts,
          property:
            action.payload?.property ?? state.quoteDetails?.property,
          structuralEngineer:
            action.payload?.structuralEngineer ?? state.quoteDetails?.structuralEngineer,
        };
        // Update the structural engineer in the matching quotation version
        if (state.quotation) {
          state.quotation = state.quotation.map(q => {
            if (q.versions) {
              return {
                ...q,
                versions: q.versions.map(v => {
                  if (v.quotationVersionId === action.payload?.quotationVersionId) {
                    return {
                      ...v,
                      ...action.payload
                    };
                  }
                  return v;
                })
              };
            }
            return q;
          });
        }
        // Use nullish coalescing so that a partial API response (e.g. when
        // only the structural engineer was updated and the backend returns
        // null for unrelated fields) does NOT wipe the user's existing
        // plan/facade/package selections.
        state.plan = action.payload.floorPlan ?? state.plan;
        state.facade = action.payload.facade ?? state.facade;
        state.package = action.payload.package ?? state.package;
        state.items = action.payload.quotationVersionItems?.filter(i => !i.packageId).map(i => mapPriceListItemToQuotationItem(i));
      })

      //new
      .addCase(createQuotationThunk.fulfilled, (state, action) => {
        state.quotation.push(action.payload);
        const data = action.payload.versions[action.payload.versions.length - 1];
        state.quoteDetails = data;
        state.contact = data.leadContacts;
        state.plan = data?.floorPlan;
        state.facade = data?.facade;
        state.package = data?.package;
        state.selectedFilters = {
          range: data?.rangeId || '',
          dwellingType: data?.dwellingTypeId || '',
          location: data?.locationId || '',
        };
      })
      .addCase(getQuotationThunk.fulfilled, (state, action) => {
        state.quotation = action.payload;
      })
      .addCase(deleteQuotationThunk.fulfilled, (state, action) => {
        state.quotation = state.quotation.filter(i => i.quotationId !== action.payload.quotationId);
      })

      //quotation version
      .addCase(createQuotationVersionThunk.fulfilled, (state, action) => {
        const quotationData = state.quotation.find(
          i => i.quotationId === action.payload.quotationId
        );
        if (quotationData) {
          quotationData.versions.push(action.payload);
          state.quoteDetails = action.payload;
        }
      })

      //quotattion contact
      .addCase(updateContact.fulfilled, (state, action) => {
        if (state.quoteDetails) {
          state.quoteDetails.leadContacts = state.quoteDetails.leadContacts?.map(i =>
            i.contactId === action.payload.usersId ? { ...i, ...action.payload } : i
          );
        }
        state.contact = state.contact.map(i =>
          i.contactId === action.payload.usersId ? { ...i, ...action.payload } : i
        );
      })

      // quotation pricelist
      .addCase(createQuotationPricellistThunk.fulfilled, (state, action) => {
        const { quantity, note } = action.payload;
        state.items.push({
          ...mapPriceListItemToQuotationItem(action.payload, quantity),
          note: note,
        });
      })
      .addCase(getQuotationPricelistThunk.fulfilled, (state, action) => {
        state.items = action.payload.map(i => mapPriceListItemToQuotationItem(i));
      })
      .addCase(deleteQuotationPricelistThunk.fulfilled, (state, action) => {
        state.items = state.items?.filter(i => i.quotationVersionItemId !== action.meta.arg);
      })
      .addCase(createQuotationAdditionalPricellistThunk.fulfilled, (state, action) => {
        const { quantity, note } = action.payload;
        state.items.push({
          ...mapPriceListItemToQuotationItem(action.payload, quantity),
          note: note,
        });
      })

      // quotation item update
      .addCase(updateQuotationItemThunk.pending, (state, action) => {
        state.status.create = Status.PENDING;
      })
      .addCase(updateQuotationItemThunk.fulfilled, (state, action) => {
        state.status.create = Status.SUCCESS;
        // Update the specific item in the items array
        const updatedItem = action.payload;
        const index = state.items.findIndex(
          item => item.quotationVersionItemId === updatedItem.quotationVersionItemId
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...mapPriceListItemToQuotationItem(updatedItem),
          };
        }
      })
      .addCase(updateQuotationItemThunk.rejected, (state, action) => {
        state.status.create = Status.ERROR;
      })

      // quotation package
      .addCase(createQuotationPackageThunk.pending, (state, action) => {
        state.status.create = Status.PENDING;
      })
      .addCase(createQuotationPackageThunk.fulfilled, (state, action) => {
        state.status.create = Status.SUCCESS;
        // Update package with response data
        if (action.payload?.package) {
          state.package = action.payload.package;
        }
      })
      .addCase(createQuotationPackageThunk.rejected, (state, action) => {
        state.status.create = Status.ERROR;
      })

      .addCase(deleteQuotationPackageThunk.fulfilled, (state, action) => {
        state.package = null;
      })

      //quotation compare
      .addCase(createQuotationCompareThunk.fulfilled, (state, action) => {
        state.comparison = action.payload;
      })

      //quotataion custom section
      .addCase(createQuotationCustomSection.pending, (state, action) => {
        state.status.customSection = Status.PENDING;
      })
      .addCase(createQuotationCustomSection.fulfilled, (state, action) => {
        state.customSections.unshift(action.payload);
        state.status.customSection = Status.SUCCESS;
      })
      .addCase(createQuotationCustomSection.rejected, (state, action) => {
        state.status.customSection = Status.ERROR;
      })

      .addCase(updateQuotationCustomSection.pending, (state, action) => {
        state.status.customSection = Status.PENDING;
      })
      .addCase(updateQuotationCustomSection.fulfilled, (state, action) => {
        state.customSections = state.customSections?.map(section =>
          section.customSectionId === action.payload.customSectionId ? action.payload : section
        );
        state.status.customSection = Status.SUCCESS;
      })
      .addCase(updateQuotationCustomSection.rejected, (state, action) => {
        state.status.customSection = Status.ERROR;
      })

      .addCase(getQuotationCustomSection.fulfilled, (state, action) => {
        state.quoteDetails.customSections = action.payload;
        state.customSections = action.payload;
      })
      .addCase(deleteQuotationCustomSection.pending, (state, action) => {
        state.status.customSection = Status.PENDING;
      })
      .addCase(deleteQuotationCustomSection.fulfilled, (state, action) => {
        state.customSections = state.customSections?.filter(
          section => section.customSectionId !== action.meta.arg
        );
        state.status.customSection = Status.SUCCESS;
      })
      .addCase(deleteQuotationCustomSection.rejected, (state, action) => {
        state.status.customSection = Status.ERROR;
      });

    //update lead
    builder.addCase(updateLeadThunk.fulfilled, (state, action) => {
      state.quotation = action.payload.quotations;
    });

    //approve quotation
    builder.addCase(approveQuotation.fulfilled, (state, action) => {
      state.quoteDetails = action.payload;
    });
    builder.addCase(updateLeadProperty.fulfilled, (state, action) => {
      state.quoteDetails.property = action.payload;
    });

    // get all quotations (listing)
    builder
      .addCase(getAllQuotationsThunk.pending, state => {
        state.status.list = Status.PENDING;
      })
      .addCase(getAllQuotationsThunk.fulfilled, (state, action) => {
        state.status.list = Status.SUCCESS;
        const payload = action.payload as any;
        // Handle both shapes:
        // 1) thunk returns res.data => { data: [], pagination: {} }
        // 2) older shape => { data: { data: [], pagination: {} } }
        const listingPayload = Array.isArray(payload?.data)
          ? payload
          : payload?.data && Array.isArray(payload?.data?.data)
            ? payload.data
            : payload;
        state.quotationList = listingPayload?.data || [];
        state.quotationListPagination = listingPayload?.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        };
      })
      .addCase(getAllQuotationsThunk.rejected, state => {
        state.status.list = Status.ERROR;
      });

    // get quotation status counts
    builder
      .addCase(getQuotationStatusCountsThunk.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.quotationStatusCounts = payload?.total !== undefined ? payload : payload?.data || state.quotationStatusCounts;
      })
      .addCase(getQuotationFilterOptionsThunk.fulfilled, (state, action) => {
        const payload = action.payload as any;
        let raw = Array.isArray(payload) ? payload : payload?.data;
        if (!Array.isArray(raw) && raw && typeof raw === 'object') {
          const nested = raw as { data?: unknown; rows?: unknown; options?: unknown };
          if (Array.isArray(nested.data)) raw = nested.data;
          else if (Array.isArray(nested.rows)) raw = nested.rows;
          else if (Array.isArray(nested.options)) raw = nested.options;
        }
        state.quotationFilterOptions = Array.isArray(raw) ? raw : [];
      });
  },
});

export default quotationSlice.reducer;

export const {
  setQuotationContact,
  setQuotationProperty,
  setQuotationPropertyFromResponse,
  setQuotationExtraItems,
  setQuotationItems,
  updateQuotationContact,
  setQuotationPlan,
  setQuotationFacade,
  removeQuotationItem,
  setQuotationPackage,
  setQuotationStructuralEngineer,
  //   setQuotationBaseItems,
  clearQuotation,
  updateQuotationItem,
  setSelectedFilters,
  clearSelectedFloorplanFacadePackageReducer,
} = quotationSlice.actions;
