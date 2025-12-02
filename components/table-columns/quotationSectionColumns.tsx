import React, { useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Button, Popover } from 'antd';

export interface QuoteSection {
  key: string;
  name: string;
  title: string;
  allowMerge: 'True' | 'False';
  sortOrder: number;
}

export const useQuotationSectionColumns = () => {
  const initialData: QuoteSection[] = [
    { key: '1', name: 'Attach PDF', title: '', allowMerge: 'False', sortOrder: 1 },
    { key: '2', name: 'Customer Details', title: 'Sales Tender', allowMerge: 'True', sortOrder: 2 },
    { key: '3', name: 'Packages', title: '', allowMerge: 'True', sortOrder: 3 },
    { key: '4', name: 'Custom Text', title: '', allowMerge: 'True', sortOrder: 4 },
    { key: '5', name: 'Price List', title: '', allowMerge: 'True', sortOrder: 5 },
  ];

  const [data, setData] = useState<QuoteSection[]>(initialData);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  const columns = [
    {
      title: '',
      key: 'name',
      width: '5%',
      render: (_: any, record: QuoteSection) => (
        <div className="flex items-center gap-2">
          <Button type="link" icon={<IconEdit size={18} />} />
          <Popover
            trigger="click"
            open={deleteKey === record.key}
            onOpenChange={open => {
              if (open) {
                setDeleteKey(record.key);
              } else if (deleteKey === record.key) {
                setDeleteKey(null);
              }
            }}
            content={
              <div className="text-xs max-w-[220px]">
                <p className="mb-2">Are you sure you want to delete this section?</p>
                <div className="flex justify-end gap-2">
                  <Button
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      setDeleteKey(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={e => {
                      e.stopPropagation();
                      setData(prev => prev.filter(item => item.key !== record.key));
                      setDeleteKey(null);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            }
          >
            <Button type="link" danger icon={<IconTrash size={18} />} />
          </Popover>
        </div>
      ),
    },
    {
      title: 'Section Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Section Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Allow Merge',
      dataIndex: 'allowMerge',
      key: 'allowMerge',
      width: '15%',
      render: (value: string) => <span>{value === 'True' ? 'Yes' : 'No'}</span>,
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: '15%',
    },
  ];

  return { columns, data };
};
