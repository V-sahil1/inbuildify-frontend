import Drawer from '@/components/common/Drawer';
import { IconCloudUpload, IconX } from '@tabler/icons-react';
import React, { useMemo } from 'react';
import ReactDataTable from 'react-data-table-component';

const AddressBook = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const columnDefs = useMemo(
    () => [
      {
        name: '#',
        selector: row => row.name,
        width: '70px',
      },
      {
        name: 'Title',
        selector: row => row.title,
        cell: row => (
          <span className="text-blue-700 cursor-pointer hover:underline">{row.title}</span>
        ),
      },
      {
        name: 'Shipping Address',
        selector: row => row.shippingAddress,
        cell: row => <div className="whitespace-pre-line text-sm">{row.shippingAddress}</div>,
      },
      {
        name: 'Billing Address',
        selector: row => row.billingAddress,
        cell: row => <div className="whitespace-pre-line text-sm">{row.billingAddress}</div>,
      },
    ],
    []
  );

  const rowData = [
    {
      name: 'asd12',
      title: 'asd12',
      shippingAddress: '1 / 2 3 5 AL 6 - US',
      billingAddress: '1 / 2 3 5 AL 6 - US',
    },
    {
      name: 'DEMO account Test1',
      title: 'DEMO account Test1',
      shippingAddress: 'DCL Logistics Test 48641 Milmont Dr Fremont, CA 94538 - US',
      billingAddress: 'DCL Logistics Test 48641 Milmont Dr Fremont, CA 94538 - US',
    },
    {
      name: 'Mei Dear',
      title: 'Mei Dear',
      shippingAddress: 'DCL Logistics / Mei Dear 48641 Milmont Dr Fremont, CA 94538 - US',
      billingAddress: '',
    },
    {
      name: 'Test',
      title: 'Test',
      shippingAddress: 'Kato / Test 48641 Milmont Dr Fremont, CA 94538-7354 - US',
      billingAddress: 'DCL Logistics',
    },
    {
      name: 'Test 1234',
      title: 'Test 1234',
      shippingAddress: 'DCL / TEST 48641 Milmont Dr Fremont, CA 94538 - US',
      billingAddress: 'DCL Logistics',
    },
    {
      name: 'Test Demo March',
      title: 'Test Demo March',
      shippingAddress: 'DCL / Tester 48819 Kato Rd Fremont, CA 94538 - US',
      billingAddress: '',
    },
    {
      name: 'test112',
      title: 'test112',
      shippingAddress: 'company / attention address1 city AK 1234 - US',
      billingAddress: 'company / attention address1 city AK 1234 - US',
    },
    {
      name: 'test12',
      title: 'test12',
      shippingAddress: 'asdasd asdasdasd asdasd AL 12123-2233 - US',
      billingAddress: '',
    },
  ];

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        header="Select from address book"
        onSuccess={() => {}}
        width="large"
      >
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
            <input
              type="text"
              placeholder="Filter"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-1/2"
            />
            <button className="btn btn-primary flex items-center gap-2 self-end sm:self-auto">
              <IconCloudUpload size={16} />
              Add to Address Book
            </button>
          </div>

          <div className="border border-dashed border-border-color rounded-xl shadow-sm overflow-auto">
            <ReactDataTable
              columns={columnDefs}
              data={rowData}
              highlightOnHover
              dense
              striped
              noHeader
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 20]}
            />
          </div>

          <div className="w-full text-right">
            <p className="text-sm font-semibold text-blue-700">Total Contacts: {rowData.length}</p>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AddressBook;
