import { PropertyDetails } from 'data/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  getQuotationCustomSection,
  getQuotationPricelistThunk,
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
  QuotationPriceListItem,
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
  status: { create: Status; getById: Status; customSection: Status };
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
}

const initialState: QuotationState = {
  status: { create: Status.IDLE, getById: Status.IDLE, customSection: Status.IDLE },
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
      .addCase(getQuotationVersionById.pending, state => {
        state.status.getById = Status.PENDING;
      })
      .addCase(getQuotationVersionById.fulfilled, (state, action) => {
        const data = action.payload.find(
          i => i.quotationVersionId === action.meta.arg.quoteVersionId
        );
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
        state.status.getById = Status.SUCCESS;
      })
      .addCase(getQuotationVersionById.rejected, state => {
        state.status.getById = Status.ERROR;
      })

      .addCase(updateQuotationVersion.fulfilled, (state, action) => {
        state.quoteDetails = action.payload;
        state.plan = action.payload.floorPlan;
        state.facade = action.payload.facade;
        state.package = action.payload.package;
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
