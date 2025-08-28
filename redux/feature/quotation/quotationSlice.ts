import { LeadDetails, PropertyDetails } from "@/pages/leads/data/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuotationState {
    contact: LeadDetails;
    property: PropertyDetails;
    plan: any;
    facade: any;
    package: any;
    items: any;
}

const initialState: QuotationState = {
    contact: null,
    property: null,
    plan: null,
    facade: null,
    package: null,
    items: null,
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
        setQuotationPlan(state, action: PayloadAction<any>) {
            state.plan = action.payload;
        },
        // In quotationSlice.ts, add this to the reducers object:
        setQuotationFacade(state, action: PayloadAction<any>) {
            state.facade = action.payload;
        }
    }
});

export default quotationSlice.reducer;

export const {
    setQuotationContact,
    setQuotationProperty,
    setQuotationPropertyFromResponse,
    setQuotationPlan,
    setQuotationFacade
} = quotationSlice.actions;
