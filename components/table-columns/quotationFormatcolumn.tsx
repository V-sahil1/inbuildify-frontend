import { Button, Dropdown, Input, Popover, Select, Space, Tag, type MenuProps } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { debouncedURL } from '@lib/utils/debounceURL';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import { IconCopy, IconDotsVertical, IconExternalLink } from '@tabler/icons-react';
import { useAppDispatch } from '@hooks/redux';
import { getallQuotationFormatThunk } from '@redux/feature/quotation-format/quotationFormatThunk';
import { formatDate } from '@lib/utils/formatDate';

const { Option } = Select;

export interface QuotationFormat {
  key: string;
  builderName: string;
  formatName: string;
  created: string;
  updated?: string;
  isActive: boolean;
  defaultQuotation: boolean;
}

export const useQuotationFormatColumns = () => {
  const [quotationFormat, setQuotationFormat] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      if (quotationFormat.length === 0) {
        // Fetch quotation formats
        const res = dispatch(getallQuotationFormatThunk()).unwrap();
        res.then((data) => {
          setQuotationFormat(data.quotationFormats);
        });
      }
    } catch (error) {
      console.error('Error fetching quotation formats:', error);
    }
  }, [dispatch, quotationFormat]);
  
  const data: QuotationFormat[] = useMemo(() => {
    return quotationFormat?.map((item: any, index: number) => ({
      key: item.quotationFormatId || index.toString(),
      builderName: item.builderInfo?.name || '',
      formatName: item.formatName || '',
      created: new Date(item?.createdAt).toLocaleDateString() || '',
      updated: new Date(item?.updatedAt).toLocaleDateString() || '',
      isActive: item.status || false,
      defaultQuotation: item.isDefault || false,
    })) || [];
  }, [quotationFormat]);
  
  const [warningForKey, setWarningForKey] = useState<string | null>(null);

  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    delay: 500,
    filtersKey: ['builderName', 'formatName', 'created', 'updated', 'isActive', 'defaultQuotation'],
  });

  React.useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span>Builder Name</span>
          <Select
            size="small"
            allowClear
            value={instantFilters.builderName}
            onChange={val => setParams({ builderName: val ?? '' })}
          >
            {Array.from(new Set(data.map(d => d.builderName))).map(name => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </div>
      ),
      dataIndex: 'builderName',
      key: 'builderName',
      width: '20%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Format Name</span>
          <Input
            size="small"
            value={instantFilters.formatName}
            onChange={e => setParams({ formatName: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'formatName',
      key: 'formatName',
      width: '25%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Created</span>
          <DateFilterDropdown
            onFilter={type => {
              setParams({ created: type });
            }}
            onClear={() => setParams({ created: '' })}
          />
        </div>
      ),
      dataIndex: 'created',
      key: 'created',
      width: '15%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Updated</span>
          <DateFilterDropdown
            onFilter={type => {
              setParams({ updated: type });
            }}
            onClear={() => setParams({ updated: '' })}
          />
        </div>
      ),
      dataIndex: 'updated',
      key: 'updated',
      width: '15%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Status</span>
          <Select
            size="small"
            allowClear
            value={instantFilters.isActive}
            onChange={val => setParams({ isActive: val ?? '' })}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
      ),
      dataIndex: 'isActive',
      key: 'isActive',
      width: '10%',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'}>{value ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Default Quotation</span>
          <Select
            size="small"
            allowClear
            value={instantFilters.defaultQuotation}
            onChange={val => setParams({ defaultQuotation: val ?? '' })}
          >
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </Select>
        </div>
      ),
      dataIndex: 'defaultQuotation',
      key: 'defaultQuotation',
      width: '15%',
      render: (value: boolean, record: QuotationFormat) => (
        <div className="flex justify-between items-center">
          <div>
            <span className="flex items-center gap-1">
              <span
                className={`inline-block w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-400'
                  }`}
              />
              <span>{value ? 'Yes' : 'No'}</span>
            </span>
          </div>
          <div>
            <Button
              type="link"
              onClick={e => {
                e.stopPropagation();
                console.log('copy', record);
              }}
            >
              <IconCopy size={20} />
            </Button>
            <Popover
              open={warningForKey === record.key}
              placement="left"
              content={
                <div className="text-sm">
                  <div className="max-w-[260px]">
                    <p className="mb-3">
                      This is default Quotation Format you cannot delete or inactivate. Change the
                      Default Quotation Format to delete or inactivate this quotation format.
                    </p>
                    <div className="text-center">
                      <Button
                        type="primary"
                        onClick={e => {
                          e.stopPropagation();
                          setWarningForKey(null);
                        }}
                      >
                        OK
                      </Button>
                    </div>
                  </div>
                </div>
              }
              onOpenChange={open => {
                if (!open) setWarningForKey(null);
              }}
            >
              <Dropdown
                trigger={['hover']}
                menu={
                  {
                    items: [
                      {
                        key: 'delete',
                        label: 'Delete',
                      },
                    ],
                    onClick: info => {
                      info.domEvent.stopPropagation();
                      if (info.key === 'delete') {
                        setWarningForKey(record.key);
                      }
                    },
                  } as MenuProps
                }
              >
                <Button
                  type="link"
                  onClick={e => {
                    e.stopPropagation();
                    console.log('Edit', record);
                  }}
                >
                  <IconDotsVertical size={20} />
                </Button>
              </Dropdown>
            </Popover>
            <Button
              type="link"
              onClick={e => {
                e.stopPropagation();
                if (typeof window !== 'undefined') {
                  window.open(`/quotation-format/${record.key}`, '_blank');
                }
              }}
            >
              <IconExternalLink size={20} />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return { columns, data };
};
