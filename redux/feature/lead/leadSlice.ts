import { createSlice } from "@reduxjs/toolkit";
import { createLeadThunk, getLeadThunk } from "./leadThunk";
import { getLeadByIdThunk, updatePropertyDetailsThunk } from "./leadThunk";
import { ILead } from "./ILeadState";
import { Status } from "@lib/constants/enum";

export const leadSlice = createSlice({
    name: "lead",
    initialState: {
        leads:[] as ILead[],
        status: Status.IDLE,
        leadDetail: null as any,
    },
    reducers: {
        clearLeadDetail: (state) => {
            state.leadDetail = null;
        },
        setLeadProperty: (state, action) => {
            const { builderId, ...propertyWithoutBuilder } = (action.payload || {}) as any;
            state.leadDetail = state.leadDetail ?? ({} as any);
            (state.leadDetail as any).property = propertyWithoutBuilder;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getLeadThunk.pending, (state) => {
            state.status = Status.PENDING;
        });
        builder.addCase(getLeadThunk.fulfilled, (state, action) => {
            state.leads = action.payload;
            state.status = Status.SUCCESS;
        });
        builder.addCase(getLeadThunk.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(getLeadByIdThunk.pending, (state) => {
            state.status = Status.PENDING;
        });
        builder.addCase(getLeadByIdThunk.fulfilled, (state, action) => {
            const payload: any = action.payload;
            const prop = payload?.property;
            let normalizedProperty = prop;
            if (prop && typeof prop === 'object') {
                normalizedProperty = {
                    propertyId: prop.propertyId ?? prop.property_id,
                    builderId: prop.builderId ?? prop.builder_id,
                    leadId: prop.leadId ?? prop.lead_id,
                    country: prop.country,
                    address1: prop.address1,
                    address2: prop.address2,
                    citySuburb: prop.citySuburb ?? prop.city_suburb,
                    stateRegion: prop.stateRegion ?? prop.state_region,
                    zipPostalCode: prop.zipPostalCode ?? prop.zip_postal_code,
                    estateName: prop.estateName ?? prop.estate_name,
                    titleStatus: prop.titleStatus ?? prop.title_status,
                    titleDate: prop.titleDate ?? prop.title_date,
                    compactionReport: prop.compactionReport ?? prop.compaction_report,
                    landType: prop.landType ?? prop.land_type,
                    widthM: prop.widthM ?? prop.width_m,
                    depthM: prop.depthM ?? prop.depth_m,
                    totalSizeM2: prop.totalSizeM2 ?? prop.total_size_m2,
                    siteFallMm: prop.siteFallMm ?? prop.site_fall_mm,
                    landFillMm: prop.landFillMm ?? prop.land_fill_mm,
                    bushFire: (prop.bushFire ?? prop.bush_fire) as any,
                    cornerBlock: (prop.cornerBlock ?? prop.corner_block) as any,
                    createdAt: prop.createdAt ?? prop.created_at,
                    updatedAt: prop.updatedAt ?? prop.updated_at,
                };
            }
            state.leadDetail = {
                ...payload,
                property: normalizedProperty ?? payload?.property,
            };
            state.status = Status.SUCCESS;
        });
        builder.addCase(getLeadByIdThunk.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(createLeadThunk.fulfilled, (state, action) => {
            state.leads.push(action.payload);
        });
    }
});

export const { clearLeadDetail, setLeadProperty } = leadSlice.actions;
export const leadReducer = leadSlice.reducer;
