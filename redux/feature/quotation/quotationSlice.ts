import { PropertyDetails } from 'data/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { createQuotation, getQuotationVersionById } from './quotationThunk';
import { ILeadContact } from '../lead/ILeadState';
import { Package } from '../package/IPackageState';
import { IPriceListItem } from '../masterPriceList/iMasterPriceListState';

export interface QuotationState {
  status: { create: Status; getById: Status };
  quoteDetails: {
    slugId: string;
    quotationId: string;
    leadStatus: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    totalAmount: number;
    builder: {
      builderId: string;
      name: string;
    };
  } | null;
  selectedFilters: any;
  contact: ILeadContact;
  property: PropertyDetails;
  plan: any;
  facade: any;
  package: Package;
  items: (IPriceListItem & { quantity: number; price: number })[];
  extraItems: (IPriceListItem & { quantity: number; price: number })[];
}

const initialState: QuotationState = {
  status: { create: Status.IDLE, getById: Status.IDLE },
  quoteDetails: null,
  selectedFilters: { range: '', dwelling_type: '' },
  contact: null,
  property: null,
  plan: null,
  facade: null,
  package: null,
  items: [],
  extraItems: [],
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    clearQuotation(state) {
      state.items = [];
      state.extraItems = [];
      state.contact = null;
      state.property = null;
      state.plan = null;
      state.facade = null;
      state.package = null;
      state.selectedFilters = { range: '', dwelling_type: '' };
    },
    clearSelectedFloorplanFacadePackageReducer(state) {
      state.plan = null;
      state.facade = null;
      state.items = [];
      state.package = null;
    },
    setQuotationContact(state, action: PayloadAction<ILeadContact | null>) {
      state.contact = action.payload as any;
    },
    setQuotationProperty(state, action: PayloadAction<PropertyDetails | null>) {
      state.property = action.payload as any;
    },
    setQuotationPropertyFromResponse(state, action: PayloadAction<any>) {
      const { builderId, ...propertyWithoutBuilder } = (action.payload || {}) as any;
      state.property = propertyWithoutBuilder as any;
    },
    setQuotationExtraItems(
      state,
      action: PayloadAction<
        IPriceListItem & {
          quantity: number;
          price: number;
        }
      >
    ) {
      state.extraItems = [...state.extraItems, action.payload];
      state.items = [...state.items, action.payload];
    },
    setQuotationItems(
      state,
      action: PayloadAction<IPriceListItem & { quantity: number; price: number }>
    ) {
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
      const uniqueItems = action.payload.categoryItems.filter(
        item => !state.items.some(i => i.priceListItemId === item.id)
      );
      state.items = [
        ...state.items,
        ...uniqueItems.map(item => ({
          categoryItemId: item.id,
          quantity: 1,
          price: item.price,
          description: item.desc,
          cost: item.price,
        })),
      ];
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
        state.status.getById = Status.IDLE;
      })
      .addCase(getQuotationVersionById.fulfilled, (state, action) => {
        const data = action.payload;
        state.quoteDetails = {
          slugId: data.slugId,
          quotationId: data.quotationId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          totalAmount: data.totalAmount,
          builder: data.builder,
          leadStatus: data.lead.status,
        };
        // Set contact from lead.leadContact
        if (data.lead?.leadContact) {
          state.contact = data.lead.leadContact;
        }

        // Set property
        if (data.property) {
          state.property = data.property;
        }

        // Set plan from floorPlan
        if (data.floorPlan) {
          state.plan = data.floorPlan;
        }

        // Set facade
        if (data.facade) {
          state.facade = data.facade;
        }

        // Set package
        if (data.package) {
          state.package = data.package;
        }

        // Set selected filters
        state.selectedFilters = {
          range: data.range?.name || '',
          dwelling_type: data.dwellingType?.name || '',
        };

        state.items = data.items?.map(item => ({
          priceListItemId: item.categoryItemId,
          quantity: item.categoryItemQuantity, // Default quantity to 1 if not specified
          price: parseFloat(item.categoryItemCost) || 0,
        }));
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
