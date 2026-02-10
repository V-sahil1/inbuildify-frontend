import { createSlice } from '@reduxjs/toolkit';

import { Status } from '@lib/constants/enum';
import {
  createSupplier,
  createSupplierChecklist,
  createSupplierContact,
  createSupplierType,
  createSupplierTypeMapping,
  deleteSupplier,
  deleteSupplierChecklist,
  deleteSupplierContact,
  deleteSupplierType,
  deleteSupplierTypeMapping,
  fetchAllSupplierChecklist,
  fetchAllSupplierContacts,
  fetchAllSuppliers,
  fetchAllSupplierType,
  fetchAllSupplierTypeMapping,
  updateSupplier,
  updateSupplierContact,
  updateSupplierType,
  updateSupplierTypeMapping,
} from './supplierThunk';
import { ISupplierState, ISupplierType } from './ISupplierState';

const initialState: ISupplierState = {
  supplierType: [],
  suppliers: [],
  status: {
    supplier: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    supplierType: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    supplierContact: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    supplierChecklist: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
    supplierMapping: {
      fetch: Status.IDLE,
      create: Status.IDLE,
    },
  },
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllSupplierType.pending, state => {
      state.status.supplierType.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSupplierType.fulfilled, (state, action) => {
      state.supplierType = action.payload.map((supplierType: ISupplierType) => ({
        ...supplierType,
        isNew: false,
        checklists: [],
        suppliers: [],
      }));
      state.status.supplierType.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSupplierType.rejected, state => {
      state.status.supplierType.fetch = Status.ERROR;
    });

    builder.addCase(createSupplierType.pending, state => {
      state.status.supplierType.create = Status.PENDING;
    });
    builder.addCase(createSupplierType.fulfilled, (state, action) => {
      state.supplierType.unshift({
        ...action.payload,
        isNew: false,
        checklists: [],
        suppliers: [],
      });
      state.status.supplierType.create = Status.SUCCESS;
    });
    builder.addCase(createSupplierType.rejected, state => {
      state.status.supplierType.create = Status.ERROR;
    });
    builder.addCase(updateSupplierType.pending, state => {
      state.status.supplierType.create = Status.PENDING;
    });
    builder.addCase(updateSupplierType.fulfilled, (state, action) => {
      state.supplierType = state.supplierType.map((supplierType: ISupplierType) =>
        supplierType.supplierTypeId === action.payload.supplierTypeId
          ? { ...supplierType, ...action.payload }
          : supplierType
      );
      state.status.supplierType.create = Status.SUCCESS;
    });
    builder.addCase(updateSupplierType.rejected, state => {
      state.status.supplierType.create = Status.ERROR;
    });

    builder.addCase(deleteSupplierType.pending, state => {
      state.status.supplierType.create = Status.PENDING;
    });
    builder.addCase(deleteSupplierType.fulfilled, (state, action) => {
      state.supplierType = state.supplierType.filter(
        supplierType => supplierType.supplierTypeId !== action.payload
      );
      state.status.supplierType.create = Status.SUCCESS;
    });
    builder.addCase(deleteSupplierType.rejected, state => {
      state.status.supplierType.create = Status.ERROR;
    });

    //supplier
    builder.addCase(fetchAllSuppliers.pending, state => {
      state.status.supplier.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSuppliers.fulfilled, (state, action) => {
      state.suppliers = action.payload;
      state.status.supplier.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSuppliers.rejected, state => {
      state.status.supplier.fetch = Status.ERROR;
    });
    builder.addCase(createSupplier.pending, state => {
      state.status.supplier.create = Status.PENDING;
    });
    builder.addCase(createSupplier.fulfilled, (state, action) => {
      const { supplier, contacts } = action.payload;
      state.suppliers.unshift({ ...supplier, contacts });
      state.status.supplier.create = Status.SUCCESS;
    });
    builder.addCase(createSupplier.rejected, state => {
      state.status.supplier.create = Status.ERROR;
    });
    builder.addCase(updateSupplier.pending, state => {
      state.status.supplier.create = Status.PENDING;
    });
    builder.addCase(updateSupplier.fulfilled, (state, action) => {
      state.suppliers = state.suppliers.map(supplier =>
        supplier.supplierId === action.payload.supplierId
          ? { ...supplier, ...action.payload }
          : supplier
      );
      state.status.supplier.create = Status.SUCCESS;
    });
    builder.addCase(updateSupplier.rejected, state => {
      state.status.supplier.create = Status.ERROR;
    });

    builder.addCase(deleteSupplier.pending, state => {
      state.status.supplier.create = Status.PENDING;
    });
    builder.addCase(deleteSupplier.fulfilled, (state, action) => {
      state.suppliers = state.suppliers.filter(supplier => supplier.supplierId !== action.payload);
      state.status.supplier.create = Status.SUCCESS;
    });
    builder.addCase(deleteSupplier.rejected, state => {
      state.status.supplier.create = Status.ERROR;
    });

    //supplier contact
    builder.addCase(fetchAllSupplierContacts.pending, state => {
      state.status.supplierContact.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSupplierContacts.fulfilled, (state, action) => {
      const supplier = state.suppliers.find(supplier => supplier.supplierId === action.meta.arg);
      if (supplier) {
        supplier.contacts = action.payload;
      }
      state.status.supplierContact.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSupplierContacts.rejected, state => {
      state.status.supplierContact.fetch = Status.ERROR;
    });
    builder.addCase(createSupplierContact.pending, state => {
      state.status.supplierContact.create = Status.PENDING;
    });
    builder.addCase(createSupplierContact.fulfilled, (state, action) => {
      const supplier = state.suppliers.find(
        supplier => supplier.supplierId === action.payload.supplierId
      );
      if (supplier) {
        supplier.contacts.unshift(action.payload);
      }
      state.status.supplierContact.create = Status.SUCCESS;
    });
    builder.addCase(createSupplierContact.rejected, state => {
      state.status.supplierContact.create = Status.ERROR;
    });
    builder.addCase(updateSupplierContact.pending, state => {
      state.status.supplierContact.create = Status.PENDING;
    });
    builder.addCase(updateSupplierContact.fulfilled, (state, action) => {
      const supplier = state.suppliers.find(
        supplier => supplier.supplierId === action.payload.supplierId
      );
      if (supplier) {
        supplier.contacts = supplier.contacts.map(supplierContact =>
          supplierContact.supplierContactId === action.payload.supplierContactId
            ? action.payload
            : supplierContact
        );
      }
      state.status.supplierContact.create = Status.SUCCESS;
    });
    builder.addCase(updateSupplierContact.rejected, state => {
      state.status.supplierContact.create = Status.ERROR;
    });

    builder.addCase(deleteSupplierContact.pending, state => {
      state.status.supplierContact.create = Status.PENDING;
    });
    builder.addCase(deleteSupplierContact.fulfilled, (state, action) => {
      const supplier = state.suppliers.find(
        supplier => supplier.supplierId === action.payload.supplierId
      );
      if (supplier) {
        supplier.contacts = supplier.contacts.filter(
          supplierContact => supplierContact.supplierContactId !== action.payload.id
        );
      }
      state.status.supplierContact.create = Status.SUCCESS;
    });
    builder.addCase(deleteSupplierContact.rejected, state => {
      state.status.supplierContact.create = Status.ERROR;
    });

    //supplier checklist
    builder.addCase(fetchAllSupplierChecklist.pending, state => {
      state.status.supplierChecklist.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSupplierChecklist.fulfilled, (state, action) => {
      const supplierType = state.supplierType.find(
        supplierType => supplierType.supplierTypeId === action.meta.arg
      );
      if (supplierType) {
        supplierType.checklists = action.payload;
      }
      state.status.supplierChecklist.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSupplierChecklist.rejected, state => {
      state.status.supplierChecklist.fetch = Status.ERROR;
    });
    builder.addCase(createSupplierChecklist.pending, state => {
      state.status.supplierChecklist.create = Status.PENDING;
    });
    builder.addCase(createSupplierChecklist.fulfilled, (state, action) => {
      const supplierType = state.supplierType.find(
        supplierType => supplierType.supplierTypeId === action.payload.supplierTypeId
      );
      if (supplierType) {
        supplierType.checklists.unshift(action.payload);
      }
      state.status.supplierChecklist.create = Status.SUCCESS;
    });
    builder.addCase(createSupplierChecklist.rejected, state => {
      state.status.supplierChecklist.create = Status.ERROR;
    });

    builder.addCase(deleteSupplierChecklist.pending, state => {
      state.status.supplierChecklist.create = Status.PENDING;
    });
    builder.addCase(deleteSupplierChecklist.fulfilled, (state, action) => {
      const supplierType = state.supplierType.find(
        supplierType => supplierType.supplierTypeId === action.payload.supplierTypeId
      );
      if (supplierType) {
        supplierType.checklists = supplierType.checklists.filter(
          supplierChecklist => supplierChecklist.id !== action.payload.id
        );
      }
      state.status.supplierChecklist.create = Status.SUCCESS;
    });
    builder.addCase(deleteSupplierChecklist.rejected, state => {
      state.status.supplierChecklist.create = Status.ERROR;
    });

    //supplier mapping
    builder.addCase(fetchAllSupplierTypeMapping.pending, state => {
      state.status.supplierMapping.fetch = Status.PENDING;
    });
    builder.addCase(fetchAllSupplierTypeMapping.fulfilled, (state, action) => {
      const supplierType = state.supplierType.find(
        supplierType => supplierType.supplierTypeId === action.meta.arg
      );
      if (supplierType) {
        supplierType.suppliers = action.payload;
      }
      state.status.supplierMapping.fetch = Status.SUCCESS;
    });
    builder.addCase(fetchAllSupplierTypeMapping.rejected, state => {
      state.status.supplierMapping.fetch = Status.ERROR;
    });
    builder.addCase(createSupplierTypeMapping.pending, state => {
      state.status.supplierMapping.create = Status.PENDING;
    });
    builder.addCase(createSupplierTypeMapping.fulfilled, (state, action) => {
      const supplierType = state.supplierType.find(
        supplierType => supplierType.supplierTypeId === action.payload.supplierTypeId
      );
      if (supplierType) {
        supplierType.suppliers.unshift(action.payload);
      }
      state.status.supplierMapping.create = Status.SUCCESS;
    });
    builder.addCase(createSupplierTypeMapping.rejected, state => {
      state.status.supplierMapping.create = Status.ERROR;
    });

    builder.addCase(updateSupplierTypeMapping.pending, state => {
      state.status.supplierMapping.create = Status.PENDING;
    });
    builder.addCase(updateSupplierTypeMapping.fulfilled, (state, action) => {
      const supplierType = state.supplierType.find(
        supplierType => supplierType.supplierTypeId === action.payload.supplierTypeId
      );
      if (supplierType) {
        supplierType.suppliers = supplierType.suppliers.map(supplier =>
          supplier.id === action.payload.id ? action.payload : { ...supplier, isRecommended: false }
        );
      }
      state.status.supplierMapping.create = Status.SUCCESS;
    });
    builder.addCase(updateSupplierTypeMapping.rejected, state => {
      state.status.supplierMapping.create = Status.ERROR;
    });

    builder.addCase(deleteSupplierTypeMapping.pending, state => {
      state.status.supplierMapping.create = Status.PENDING;
    });
    builder.addCase(deleteSupplierTypeMapping.fulfilled, (state, action) => {
      const supplierType = state.supplierType.find(
        supplierType => supplierType.supplierTypeId === action.payload.supplierTypeId
      );
      if (supplierType) {
        supplierType.suppliers = supplierType.suppliers.filter(
          supplierMapping => supplierMapping.id !== action.payload.id
        );
      }
      state.status.supplierMapping.create = Status.SUCCESS;
    });
    builder.addCase(deleteSupplierTypeMapping.rejected, state => {
      state.status.supplierMapping.create = Status.ERROR;
    });
  },
});
export default supplierSlice.reducer;
