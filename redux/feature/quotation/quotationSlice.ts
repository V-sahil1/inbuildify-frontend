import { PropertyDetails } from 'data/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import {
  createQuotation,
  createQuotationPricellistThunk,
  createQuotationThunk,
  createQuotationVersionThunk,
  deleteQuotationPackageThunk,
  deleteQuotationPricelistThunk,
  deleteQuotationThunk,
  getQuotationCompareThunk,
  getQuotationPricelistThunk,
  getQuotationThunk,
  getQuotationVersionById,
  updateQuotationVersion,
} from './quotationThunk';
import { LeadContact } from '../lead/ILeadState';
import { Quotation, QuotationPriceListItem, QuotationVersionDetails } from './IQuotationState';
import { Package } from '../package/IPackageState';
import { updateContact } from '../contacts/contactThunk';
export interface QuotationState {
  status: { create: Status; getById: Status };
  quoteDetails: QuotationVersionDetails | null;
  selectedFilters: any;
  contact: LeadContact[];
  property: PropertyDetails;
  plan: any;
  facade: any;
  package: Package[];
  items: QuotationPriceListItem[];
  extraItems: QuotationPriceListItem[];
  quotation: Quotation[];
}

const initialState: QuotationState = {
  status: { create: Status.IDLE, getById: Status.IDLE },
  quoteDetails: null,
  selectedFilters: { range: '', dwellingType: '', location: '' },
  contact: [],
  property: null,
  plan: null,
  facade: null,
  package: [],
  items: [],
  extraItems: [],
  quotation: [],
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
      state.package = [];
      state.selectedFilters = { range: '', dwelling_type: '' };
    },
    clearSelectedFloorplanFacadePackageReducer(state) {
      state.plan = null;
      state.facade = null;
      state.items = [];
      state.package = [];
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
      .addCase(createQuotation.pending, state => {
        state.status.create = Status.PENDING;
      })
      .addCase(createQuotation.fulfilled, state => {
        state.status.create = Status.SUCCESS;
      })
      .addCase(createQuotation.rejected, state => {
        state.status.create = Status.ERROR;
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

        // Set plan from floorPlan
        if (data?.floorPlan) {
          state.plan = data?.floorPlan;
        }

        // Set facade
        if (data?.facade) {
          state.facade = data?.facade;
        }

        // Set package
        if (data?.packages) {
          state.package = data?.packages;
        }

        // Set selected filters
        state.selectedFilters = {
          range: data?.rangeId || '',
          dwellingType: data?.dwellingTypeId || '',
          location: data?.locationId || '',
        };

        // state.items = data.items?.map(item => ({
        //   priceListItemId: item.categoryItemId,
        //   quantity: item.categoryItemQuantity, // Default quantity to 1 if not specified
        //   price: parseFloat(item.categoryItemCost) || 0,
        // }));
        // Get latest version and set items
        // const versions = data.versions;
        // if (versions) {
        //     // Get all version numbers and find the latest one
        //     const versionNumbers = Object.keys(versions).map(Number);
        //     const latestVersion = Math.max(...versionNumbers);
        //     const latestItems = versions[latestVersion] || [];

        //     // Map to the required format for items
        //     state.items = latestItems?.map(item => ({
        //         itemId: item.categoryItemId,
        //         quantity: 1, // Default quantity to 1 if not specified
        //         price: parseFloat(item.categoryItemCost) || 0
        //     }));
        // } else {
        //     state.items = [];
        // }
        state.status.getById = Status.SUCCESS;
      })
      .addCase(getQuotationVersionById.rejected, state => {
        state.status.getById = Status.ERROR;
      })

      .addCase(updateQuotationVersion.fulfilled, (state, action) => {
        state.quoteDetails = action.payload;
        state.plan = action.payload.floorPlan;
        state.facade = action.payload.facade;
        state.package = action.payload.packages;
      })

      //new
      .addCase(createQuotationThunk.fulfilled, (state, action) => {
        state.quotation.push(action.payload);
        state.quoteDetails = action.payload.versions[action.payload.versions.length - 1];
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
        state.quoteDetails.leadContacts = state.quoteDetails.leadContacts.map(i =>
          i.contactId === action.payload.usersId ? { ...i, ...action.payload } : i
        );
        state.contact = state.contact.map(i =>
          i.contactId === action.payload.usersId ? { ...i, ...action.payload } : i
        );
      })

      // quotation pricelist
      .addCase(createQuotationPricellistThunk.fulfilled, (state, action) => {
        state.items.push({ ...action.payload, quantity: Number(action.payload.quantity) || 1 });
      })
      .addCase(getQuotationPricelistThunk.fulfilled, (state, action) => {
        state.items = action.payload.map(i => ({ ...i, quantity: Number(i.quantity) || 1 }));
      })
      .addCase(deleteQuotationPricelistThunk.fulfilled, (state, action) => {
        state.items = state.items?.filter(i => i.id !== action.meta.arg);
      })

      // quotation package
      .addCase(deleteQuotationPackageThunk.fulfilled, (state, action) => {
        state.package = state.package?.filter(i => i.packageId !== action.meta.arg.pkgId);
      })

      //quotation compare
      .addCase(getQuotationCompareThunk.fulfilled, (state, action) => {
        const quote = state.quotation.find(i => i.quotationId === action.meta.arg.quoteId);
        if (quote) {
          quote.comparison = action.payload;
        }
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
  //   setQuotationBaseItems,
  clearQuotation,
  updateQuotationItem,
  setSelectedFilters,
  clearSelectedFloorplanFacadePackageReducer,
} = quotationSlice.actions;
