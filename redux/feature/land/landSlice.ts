import { createSlice } from '@reduxjs/toolkit';
import { Status } from '@lib/constants/enum';
import { ILandLot, ILandState } from './ILandState';
import { createHLPackageCommission, createHLPackagePricelist, createLandLot, createLandPackage, deleteHLPackageCommission, deleteHLPackagPricelist, deleteLandLot, deleteLandPackage, fetchAllHLPackageCommissionById, fetchAllHLPackagePricelistById, fetchAllLandLot, fetchAllLandPackage, fetchAllLandPackageById, fetchAllLandPackageGroup, updateLandLot, updateLandPackage } from './landThunk';

const initialState: ILandState = {
  lot: [],
  package: [],
  packageGroup: [],
  packageDetails: null,
  status: {
    lot: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    package: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    packageCommission: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    packagePricelist: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    packageGroup: Status.IDLE,
    packageDetails: Status.IDLE
  },
};

const landSlice = createSlice({
  name: 'land',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createLandLot.pending, state => {
      state.status.lot.create = Status.PENDING;
    });
    builder.addCase(createLandLot.fulfilled, (state, action) => {
      state.lot.unshift({ ...action.payload, packages: [] });
      state.status.lot.create = Status.SUCCESS;
    });
    builder.addCase(createLandLot.rejected, state => {
      state.status.lot.create = Status.ERROR;
    });
    builder.addCase(fetchAllLandLot.pending, state => {
      state.status.lot.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllLandLot.fulfilled, (state, action) => {
      state.lot = action.payload.map((lot: ILandLot) => ({ ...lot, packages: [] })) || [];
      state.status.lot.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllLandLot.rejected, state => {
      state.status.lot.fetch = Status.ERROR;
    });
    builder.addCase(updateLandLot.pending, state => {
      state.status.lot.create = Status.PENDING;
    });

    builder.addCase(updateLandLot.fulfilled, (state, action) => {
      state.lot = state.lot.map(i =>
        i.lotId === action.payload.lotId ? { ...i, ...action.payload } : i
      );
      state.status.lot.create = Status.SUCCESS;
    });
    builder.addCase(updateLandLot.rejected, state => {
      state.status.lot.create = Status.ERROR;
    });

    builder.addCase(deleteLandLot.pending, state => {
      state.status.lot.create = Status.PENDING;
    });

    builder.addCase(deleteLandLot.fulfilled, (state, action) => {
      state.lot = state.lot.filter(i => i.lotId !== action.payload.id);
      state.status.lot.create = Status.SUCCESS;
    });
    builder.addCase(deleteLandLot.rejected, state => {
      state.status.lot.create = Status.ERROR;
    });

    //land package  
    builder.addCase(createLandPackage.pending, state => {
      state.status.package.create = Status.PENDING;
    });
    builder.addCase(createLandPackage.fulfilled, (state, action) => {
      if (!!action.payload.lotDetails) {
        const lot = state.lot.find(i => i.lotId === action.payload.lotDetails.lotId);
        if (lot) {
          lot.packages.unshift({ ...action.payload, commissions: [] });
        }
        state.package.unshift({ ...action.payload, commissions: [] });
      }
      else {
        state.package.unshift({ ...action.payload, lotDetails: null, commissions: [] });
      }
      state.status.package.create = Status.SUCCESS;
    });
    builder.addCase(createLandPackage.rejected, state => {
      state.status.package.create = Status.ERROR;
    });
    builder.addCase(fetchAllLandPackage.pending, state => {
      state.status.package.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllLandPackage.fulfilled, (state, action) => {
      if (action.meta.arg && Object.keys(action.meta.arg).length > 0) {
        const lot = state.lot.find(i => i.lotId === action.meta.arg.lotId);
        if (lot) {
          lot.packages = action.payload.houseLandPackages.map(pkg => ({ ...pkg, commissions: [] }));
        }
      }
      else {
        state.package = action.payload.houseLandPackages.map(pkg => ({ ...pkg, commissions: [] }))
      }
      state.status.package.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllLandPackage.rejected, state => {
      state.status.package.fetch = Status.ERROR;
    });

    builder.addCase(fetchAllLandPackageById.pending, state => {
      state.status.packageDetails = Status.PENDING;
    });
    builder.addCase(fetchAllLandPackageById.fulfilled, (state, action) => {
      state.packageDetails = { ...action.payload, commissions: [] };
      state.status.packageDetails = Status.SUCCESS;
    });
    builder.addCase(fetchAllLandPackageById.rejected, state => {
      state.status.packageDetails = Status.ERROR;
    });
    builder.addCase(updateLandPackage.pending, state => {
      state.status.package.create = Status.PENDING;
    });

    builder.addCase(updateLandPackage.fulfilled, (state, action) => {
      if (!!action.payload.lotDetails) {
        const lot = state.lot.find(i => i.lotId === action.payload.lotDetails.lotId)
        if (lot) {
          lot.packages = lot.packages.map(i => i.houseLandPackageId === action.payload.houseLandPackageId ? { ...i, ...action.payload } : i)
        }
      }
      state.package = state.package.map(i => i.houseLandPackageId === action.payload.houseLandPackageId ? { ...i, ...action.payload } : i)
      state.packageDetails = action.payload
      state.status.package.create = Status.SUCCESS;
    });
    builder.addCase(updateLandPackage.rejected, state => {
      state.status.package.create = Status.ERROR;
    });

    builder.addCase(deleteLandPackage.pending, state => {
      state.status.package.create = Status.PENDING;
    });

    builder.addCase(deleteLandPackage.fulfilled, (state, action) => {
      if (!!action.meta.arg.lotId) {
        const lot = state.lot.find(i => i.lotId === action.meta.arg.lotId)
        if (lot) {
          lot.packages = lot.packages.filter(i => i.houseLandPackageId !== action.meta.arg.id)
        }
      }
      state.package = state.package.filter(i => i.houseLandPackageId !== action.meta.arg.id)
      state.status.package.create = Status.SUCCESS;
    });
    builder.addCase(deleteLandPackage.rejected, state => {
      state.status.package.create = Status.ERROR;
    });


    //package group
    builder.addCase(fetchAllLandPackageGroup.pending, state => {
      state.status.packageGroup = Status.PENDING;
    });
    builder.addCase(fetchAllLandPackageGroup.fulfilled, (state, action) => {
      state.packageGroup = action.payload.groups
      state.status.packageGroup = Status.SUCCESS;
    });
    builder.addCase(fetchAllLandPackageGroup.rejected, state => {
      state.status.packageGroup = Status.ERROR;
    });

    //hlpackage commission mapping

    builder.addCase(fetchAllHLPackageCommissionById.pending, state => {
      state.status.packageCommission.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllHLPackageCommissionById.fulfilled, (state, action) => {
      const parent = state.package.find(i => i.houseLandPackageId === action.meta.arg)
      if (parent) {
        parent.commissions = action.payload.mappings;
        parent.commissionTotal = action.payload.commissionTotal
      }
      state.packageDetails.commissions = action.payload.mappings
      state.packageDetails.commissionTotal = action.payload.commissionTotal
      state.status.packageCommission.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllHLPackageCommissionById.rejected, state => {
      state.status.packageCommission.fetch = Status.ERROR;
    });
    builder.addCase(createHLPackageCommission.pending, state => {
      state.status.packageCommission.create = Status.PENDING;
    });
    builder.addCase(createHLPackageCommission.fulfilled, (state, action) => {
      const parent = state.package.find(i => i.houseLandPackageId === action.payload.mapping.houseLandPackageId)
      if (parent) {
        parent.commissions.unshift(action.payload.mapping);
        parent.commissionTotal = action.payload.commissionTotal
      }
      state.packageDetails.commissions.unshift(action.payload.mapping)
      state.packageDetails.commissionTotal = action.payload.commissionTotal
      state.status.packageCommission.create = Status.SUCCESS;
    });
    builder.addCase(createHLPackageCommission.rejected, state => {
      state.status.packageCommission.create = Status.ERROR;
    });
    builder.addCase(deleteHLPackageCommission.pending, state => {
      state.status.packageCommission.create = Status.PENDING;
    });
    builder.addCase(deleteHLPackageCommission.fulfilled, (state, action) => {
      const parent = state.package.find(i => i.houseLandPackageId === action.meta.arg.packageId)
      if (parent) {
        parent.commissions = parent.commissions.filter(i => i.id !== action.meta.arg.id);
        parent.commissionTotal = action.payload.commissionTotal
      }
      state.packageDetails = { ...state.packageDetails, commissions: state.packageDetails.commissions.filter(i => i.id !== action.meta.arg.id), commissionTotal: action.payload?.commissionTotal }
      state.status.packageCommission.create = Status.SUCCESS;
    });
    builder.addCase(deleteHLPackageCommission.rejected, state => {
      state.status.packageCommission.create = Status.ERROR;
    });


    //hl package pricelist mapping
    builder.addCase(fetchAllHLPackagePricelistById.pending, state => {
      state.status.packagePricelist.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllHLPackagePricelistById.fulfilled, (state, action) => {
      const parent = state.package.find(i => i.houseLandPackageId === action.meta.arg)
      if (parent) {
        parent.pricelist = action.payload.mappings;
        parent.commissionTotal = action.payload.commissionTotal
      }
      state.packageDetails.pricelist = action.payload.mappings
      state.packageDetails.commissionTotal = action.payload.commissionTotal
      state.status.packagePricelist.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllHLPackagePricelistById.rejected, state => {
      state.status.packagePricelist.fetch = Status.ERROR;
    });
    builder.addCase(createHLPackagePricelist.pending, state => {
      state.status.packagePricelist.create = Status.PENDING;
    });
    builder.addCase(createHLPackagePricelist.fulfilled, (state, action) => {
      const parent = state.package.find(i => i.houseLandPackageId === action.payload.mapping?.houseLandPackageId)
      if (parent) {
        parent.pricelist.unshift(action.payload.mapping);
        parent.commissionTotal = action.payload.commissionTotal
      }
      state.packageDetails.pricelist.unshift(action.payload.mapping)
      state.packageDetails.commissionTotal = action.payload.commissionTotal
      state.status.packagePricelist.create = Status.SUCCESS;
    });
    builder.addCase(createHLPackagePricelist.rejected, state => {
      state.status.packagePricelist.create = Status.ERROR;
    });
    builder.addCase(deleteHLPackagPricelist.pending, state => {
      state.status.packagePricelist.create = Status.PENDING;
    });
    builder.addCase(deleteHLPackagPricelist.fulfilled, (state, action) => {
      const parent = state.package.find(i => i.houseLandPackageId === action.meta.arg.packageId)
      if (parent) {
        parent.pricelist = parent.pricelist.filter(i => i.id !== action.meta.arg.id);
        parent.commissionTotal = action.payload.commissionTotal
      }
      state.packageDetails = { ...state.packageDetails, pricelist: state.packageDetails.pricelist.filter(i => i.id !== action.meta.arg.id), commissionTotal: action.payload?.commissionTotal }
      state.status.packagePricelist.create = Status.SUCCESS;
    });
    builder.addCase(deleteHLPackagPricelist.rejected, state => {
      state.status.packagePricelist.create = Status.ERROR;
    });


  },
});
export default landSlice.reducer;
