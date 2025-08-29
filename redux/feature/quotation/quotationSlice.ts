import { LeadDetails, PropertyDetails } from "@/pages/leads/data/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../masterPriceList/iMasterPriceListState";

export interface QuotationState {
    contact: LeadDetails;
    property: PropertyDetails;
    plan: any;
    facade: any;
    package: any;
    items: string[];
    extraItems: Item[];
}

const initialState: QuotationState = {
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
            state.extraItems = [action.payload, ...state.extraItems];
            state.items = [action.payload.categoryItemId, ...state.items];
        },
        setQuotationItems(state, action: PayloadAction<string>) {
            state.items = [action.payload, ...state.items];
        },
        removeQuotationItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter((item) => item !== action.payload);
        },
        setQuotationPlan(state, action: PayloadAction<any>) {
            state.plan = action.payload;
        },
        setQuotationFacade(state, action: PayloadAction<any>) {
            state.facade = action.payload;
        },
        setQuotationPackage(state, action: PayloadAction<any>) {
            state.package = action.payload;
        }
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
    setQuotationPackage
} = quotationSlice.actions;
