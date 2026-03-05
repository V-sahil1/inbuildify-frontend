import { ColumnsType } from 'antd/es/table';
import { Input } from 'antd';
import React from 'react';
import { debouncedURL } from '@lib/utils/debounceURL';

export interface Communication {
  key: string;
  referenceNo: string;
  propertyAddress: string;
  subject: string;
  to: string;
  sentBy: string;
  sentDate: string;
  stage: 'sent' | 'delivered' | 'opened' | 'failed';
}

export const useUtilizedGraphColumns = () => {
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    delay: 500,
    filtersKey: ['referenceNo', 'propertyAddress', 'subject', 'to', 'sentBy', 'sentDate'],
  });

  React.useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const data: Communication[] = [
    {
      key: '1',
      referenceNo: 'MYH00649',
      propertyAddress: 'Lot 1, 1 coins, melbourne, VIC, 233',
      subject: 'My Home: Notes from Kishan',
      to: 'ben@harty.com.au',
      sentBy: 'Kishan',
      sentDate: '10/2/2025 9:39:40 AM',
      stage: 'sent',
    },
    {
      key: '2',
      referenceNo: 'MYH00649',
      propertyAddress: 'Lot 1, 1 coins, melbourne, VIC, 233',
      subject: 'My Home: Notes from Kishan',
      to: 'ben@harty.com.au',
      sentBy: 'Kishan',
      sentDate: '10/2/2025 9:37:43 AM',
      stage: 'delivered',
    },
    {
      key: '3',
      referenceNo: 'MYH00664',
      propertyAddress: 'Lot 89, 09 in numquam proident, Ex qui quia aut aute, VIC, 2075',
      subject: 'Lot 89, 09 in numquam proident, Ex qui quia aut aute Job Document',
      to: 'doca@mailinator.com',
      sentBy: 'Kishan',
      sentDate: '10/2/2025 5:55:39 AM',
      stage: 'sent',
    },
    {
      key: '4',
      referenceNo: 'MYH00632',
      propertyAddress: 'Lot 77 Modern Cr, Tarneit, VIC, 3029',
      subject: 'Lot 77 Modern Cr, Tarneit - Send Final Invoice',
      to: 'yash@insimplifyyy.com.au',
      sentBy: 'Kishan',
      sentDate: '10/1/2025 11:36:11 AM',
      stage: 'failed',
    },
    {
      key: '5',
      referenceNo: 'MYH00632',
      propertyAddress: 'Lot 77 Modern Cr, Tarneit, VIC, 3029',
      subject: 'Lot 77 Modern Cr, Tarneit - Send Final Invoice',
      to: 'yash@insimplifyyy.com.au',
      sentBy: 'Kishan',
      sentDate: '10/1/2025 11:36:11 AM',
      stage: 'opened',
    },
  ];

  const columns: ColumnsType<Communication> = [
    {
      title: (
        <div className="flex flex-col">
          <span>Reference No</span>
          <Input
            value={instantFilters.referenceNo}
            onChange={e => setParams({ referenceNo: e.target.value })}
            placeholder="Search reference..."
          />
        </div>
      ),
      dataIndex: 'referenceNo',
      key: 'referenceNo',
      width: 120,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Property Address</span>
          <Input
            value={instantFilters.propertyAddress}
            onChange={e => setParams({ propertyAddress: e.target.value })}
            placeholder="Search address..."
          />
        </div>
      ),
      dataIndex: 'propertyAddress',
      key: 'propertyAddress',
      width: 300,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Subject</span>
          <Input
            value={instantFilters.subject}
            onChange={e => setParams({ subject: e.target.value })}
            placeholder="Search subject..."
          />
        </div>
      ),
      dataIndex: 'subject',
      key: 'subject',
      width: 250,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>To</span>
          <Input
            value={instantFilters.to}
            onChange={e => setParams({ to: e.target.value })}
            placeholder="Search email..."
          />
        </div>
      ),
      dataIndex: 'to',
      key: 'to',
      width: 200,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Sent By</span>
          <Input
            value={instantFilters.sentBy}
            onChange={e => setParams({ sentBy: e.target.value })}
            placeholder="Search sender..."
          />
        </div>
      ),
      dataIndex: 'sentBy',
      key: 'sentBy',
      width: 100,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Sent Date</span>
          <Input
            value={instantFilters.sentDate}
            onChange={e => setParams({ sentDate: e.target.value })}
            placeholder="Search date..."
          />
        </div>
      ),
      dataIndex: 'sentDate',
      key: 'sentDate',
      width: 180,
    },
  ];

  return { columns, data };
};
