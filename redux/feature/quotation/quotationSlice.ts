import { LeadDetails, PropertyDetails } from "data/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../masterPriceList/iMasterPriceListState";
import { Status } from "@lib/constants/enum";
import { createQuotation } from "./quotationThunk";
import { updateLeadStatus } from "../lead/leadSlice";

export interface QuotationState {

    status: Status;
    selectedFilters: any;
    contact: LeadDetails;
    property: PropertyDetails;
    plan: any;
    facade: any;
    package: any;
    items: { itemId: string; quantity: number; price: number;}[];
    extraItems: (Item & { quantity: number })[];
}

const initialState: QuotationState = {
    status: Status.IDLE,
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
    name: "quotation",
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
        setQuotationContact(state, action: PayloadAction<LeadDetails | null>) {
            state.contact = action.payload as any;
        },
        setQuotationProperty(state, action: PayloadAction<PropertyDetails | null>) {
            state.property = action.payload as any;
        },
        setQuotationPropertyFromResponse(state, action: PayloadAction<any>) {
            const { builderId, ...propertyWithoutBuilder } = (action.payload || {}) as any;
            state.property = propertyWithoutBuilder as any;
        },
        setQuotationExtraItems(state, action: PayloadAction<Item>) {
            state.extraItems = [{ ...action.payload, quantity: 1 }, ...state.extraItems];
            state.items = [{ itemId: action.payload.categoryItemId, quantity: 1, price: action.payload.cost }, ...state.items];
        },
        setQuotationItems(state, action: PayloadAction<{itemId:string,quantity:number,price:number}>) {
            state.items = [{ itemId: action.payload.itemId, quantity: action.payload.quantity, price: action.payload.price }, ...state.items];
        },
        removeQuotationItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter((item) => item.itemId !== action.payload);
        },
        setQuotationPlan(state, action: PayloadAction<any>) {
            state.plan = action.payload;
        },
        setQuotationFacade(state, action: PayloadAction<any>) {
            state.facade = action.payload;
        },
        setQuotationPackage(state, action: PayloadAction<any>) {
            state.package = action.payload;
        },
        updateQuotationItem: (state, action) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find((i) => i.itemId === itemId);
            if (item) {
              item.quantity = quantity;
            }
        },
        setSelectedFilters(state, action: PayloadAction<any>) {
            state.selectedFilters = action.payload;
        },
          
    },
    extraReducers: (builder) => {
        builder
            .addCase(createQuotation.pending, (state) => {
                state.status = Status.PENDING;
            })
            .addCase(createQuotation.fulfilled, (state) => {
                state.status = Status.SUCCESS;
            })
            .addCase(createQuotation.rejected, (state) => {
                state.status = Status.ERROR;
            })
    }
});

export default quotationSlice.reducer;

export const {
    setQuotationContact,
    setQuotationProperty,
    setQuotationPropertyFromResponse, setQuotationExtraItems, setQuotationItems,
    setQuotationPlan,
    setQuotationFacade,
    removeQuotationItem,
    setQuotationPackage,
    clearQuotation,
    updateQuotationItem,
    setSelectedFilters
} = quotationSlice.actions;
