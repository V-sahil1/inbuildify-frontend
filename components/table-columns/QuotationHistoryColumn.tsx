import { Input } from 'antd';
import React, { useEffect } from 'react';
import StatusSelect from '../common/custom-selects/StatusSelect';
import { debouncedURL } from '@lib/utils/debounceURL';
import { exportToExcel } from '@lib/utils/exportToExcel';

interface QuotationRecord {
  key: string;
  referenceNo: string;
  customerName: string;
  propertyAddress: string;
  quotationStatus: 'Approved' | 'Cancelled' | 'Modified' | 'Expired';
  leadStatus: 'Open' | 'Closed Won';
}

export const QuotationHistoryColumn = () => {
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['referenceNo', 'customerName', 'propertyAddress', 'quotationStatus', 'leadStatus'],
    shouldSyncURL: false,
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExport = data => {
    const column = {
      referenceNo: 'Reference No',
      customerName: 'Customer Name',
      propertyAddress: 'Property Address',
      quotationStatus: 'Quotation Status',
      leadStatus: 'Lead Status',
    };
    exportToExcel({
      data,
      fileName: 'QuotationList',
      sheetName: 'QuotationList',
      columnHeaders: column,
    });
  };
  const columns = [
    {
      title: (
        <div>
          {' '}
          <span>Reference No</span>{' '}
          <Input
            placeholder="Search Reference No"
            onChange={
              e => {
                setParams({ referenceNo: e.target.value });
              }
              //  handleFilterChange('referenceNo', e.target.value)
            }
          />
        </div>
      ),
      dataIndex: 'referenceNo',
      key: 'referenceNo',
      render: (text: string) => (
        <a className="text-blue-600 hover:underline font-medium cursor-pointer">{text}</a>
      ),
    },
    {
      title: (
        <div>
          {' '}
          <span>Customer Name</span>{' '}
          <Input
            placeholder="Search Customer Name"
            onChange={
              e => {
                setParams({ customerName: e.target.value });
              }
              //  handleFilterChange('customerName', e.target.value)
            }
          />
        </div>
      ),
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text: string) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
      title: (
        <div>
          {' '}
          <span>Property Address</span>{' '}
          <Input
            placeholder="Search Property Address"
            onChange={
              e => {
                setParams({ propertyAddress: e.target.value });
              }
              //  handleFilterChange('propertyAddress', e.target.value)
            }
          />
        </div>
      ),
      dataIndex: 'propertyAddress',
      key: 'propertyAddress',
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Quotation Status</span>
          <StatusSelect
            approveOption={true}
            onChange={value => {
              setParams({ quotationStatus: value });
            }}
          />
        </div>
      ),
      dataIndex: 'quotationStatus',
      key: 'quotationStatus',
      width: 150,
      render: (status: string) => {
        const colors: Record<string, string> = {
          Approved: 'bg-green-100 text-green-800',
          Cancelled: 'bg-gray-300 text-gray-700',
          Modified: 'bg-blue-100 text-blue-700',
          Expired: 'bg-red-100 text-red-700',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded ${colors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span>Lead Status</span>
          <select
            className="border rounded text-sm px-2 py-1 outline-none"
            defaultValue="All"
            onChange={e => {
              setParams({ leadStatus: e.target.value });
            }}
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Closed Won">Closed Won</option>
          </select>
        </div>
      ),
      dataIndex: 'leadStatus',
      key: 'leadStatus',
      render: (status: string) => {
        const colors: Record<string, string> = {
          Open: 'bg-sky-100 text-sky-700',
          'Closed Won': 'bg-green-100 text-green-800',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded ${colors[status]}`}>
            {status}
          </span>
        );
      },
    },
  ];

  const data: QuotationRecord[] = [
    {
      key: '1',
      referenceNo: 'MYH25080065',
      customerName: 'Grand Homes Demo',
      propertyAddress: '234, fall street, epping, VIC, 1234',
      quotationStatus: 'Approved',
      leadStatus: 'Closed Won',
    },
    {
      key: '2',
      referenceNo: 'MYH25070055',
      customerName: 'Demo lead',
      propertyAddress: '123, office street, melbourne, VIC, 1233',
      quotationStatus: 'Approved',
      leadStatus: 'Closed Won',
    },
    {
      key: '3',
      referenceNo: 'MYH25060045',
      customerName: 'Xyz',
      propertyAddress: 'Lot 34 343434, 343434, VIC, 3434',
      quotationStatus: 'Approved',
      leadStatus: 'Closed Won',
    },
    {
      key: '4',
      referenceNo: 'MYH25060044',
      customerName: 'Surya',
      propertyAddress: 'Lot 56 Tarneit, Tarneit, VIC, 5552',
      quotationStatus: 'Approved',
      leadStatus: 'Open',
    },
    {
      key: '5',
      referenceNo: 'MYH25050040',
      customerName: 'Chris',
      propertyAddress: 'Lot 23 Tarneit Road, Tarneit, VIC, 3029',
      quotationStatus: 'Approved',
      leadStatus: 'Open',
    },
    {
      key: '6',
      referenceNo: 'MYH25040036',
      customerName: 'Soundarya',
      propertyAddress: '14, Melbourne view, Sydney, VIC, 3024',
      quotationStatus: 'Approved',
      leadStatus: 'Closed Won',
    },
    {
      key: '7',
      referenceNo: 'MYH25040035',
      customerName: 'John Wick',
      propertyAddress: 'Suite 10, 45 Tallis Circuit, Truganina, VIC, 3029',
      quotationStatus: 'Cancelled',
      leadStatus: 'Closed Won',
    },
    {
      key: '8',
      referenceNo: 'MYH25030034',
      customerName: 'Mark',
      propertyAddress: 'Lot 22, 46 Airport Rd, Melton, VIC, 3039',
      quotationStatus: 'Modified',
      leadStatus: 'Open',
    },
    {
      key: '9',
      referenceNo: 'MYH25030033',
      customerName: 'Demo Lead',
      propertyAddress: 'Lot 203, 1 Main St, Tarneit, VIC, 3001',
      quotationStatus: 'Approved',
      leadStatus: 'Closed Won',
    },
    {
      key: '10',
      referenceNo: 'MYH24120094',
      customerName: 'John',
      propertyAddress: 'Lot 237 Princess Hwy, Tarneit, VIC, 3029',
      quotationStatus: 'Expired',
      leadStatus: 'Open',
    },
  ];

  return { columns, data, handleExport };
};
