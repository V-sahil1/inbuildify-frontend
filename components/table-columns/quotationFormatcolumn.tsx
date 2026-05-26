import { Button, Dropdown, Input, Popover, Select, Space, Spin, Tag, type MenuProps } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { debouncedURL } from '@lib/utils/debounceURL';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import { IconCopy, IconDotsVertical, IconExternalLink } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getallQuotationFormatThunk, copyQuotationFormatThunk, deleteQuotationFormatThunk } from '@redux/feature/quotation-format/quotationFormatThunk';
import { message } from 'antd';
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
  const dispatch = useAppDispatch();
  const quotationFormat = useAppSelector((s: any) => s.quotationFormat?.quotationFormats ?? []);
  const getAllStatus = useAppSelector((s: any) => s.quotationFormat?.getAllStatus);

  // Ensure we have data loaded once (will be cached in redux)
  useEffect(() => {
    if (!quotationFormat || quotationFormat.length === 0) {
      dispatch(getallQuotationFormatThunk());
    }
  }, [dispatch, quotationFormat]);

  const data: QuotationFormat[] = useMemo(() => {
    return (quotationFormat || []).map((item: any, index: number) => ({
      key: item.quotationFormatId || item.id || index.toString(),
      builderName: item.builderInfo?.name || item.builderInfo || '',
      formatName: item.formatName || item.format || item.name || '',
      created: item?.createdAt ? new Date(item?.createdAt).toLocaleDateString() : (item?.created ? formatDate(item.created) : ''),
      updated: item?.updatedAt ? new Date(item?.updatedAt).toLocaleDateString() : (item?.updated ? formatDate(item.updated) : ''),
      isActive: item.status || false,
      defaultQuotation: item.makeDefault ?? item.defaultQuotation ?? false,
    }));
  }, [quotationFormat]);
  
  const [warningForKey, setWarningForKey] = useState<string | null>(null);
  const [copyingKey, setCopyingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const handleQuotationFormatDelete = async (record: QuotationFormat) => {
    if (record.defaultQuotation) {
      setWarningForKey(record.key);
      return;
    }
    try {
      setDeletingKey(record.key);
      await dispatch(deleteQuotationFormatThunk(record.key)).unwrap();
      message.success('Quotation format deleted successfully');
      // store reducer will remove item from list
    } catch (err: any) {
      console.error('Failed to delete quotation format', err);
      message.error(err?.message || 'Failed to delete quotation format');
    } finally {
      setDeletingKey(null);
    }
  };

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
              loading={copyingKey === record.key}
              onClick={async e => {
                e.stopPropagation();
                if (!record.key) return;
                try {
                  setCopyingKey(record.key);
                  await dispatch(copyQuotationFormatThunk(String(record.key))).unwrap();
                  message.success('Quotation format copied successfully');

                } catch (err: any) {
                  console.error('Failed to copy quotation format', err);
                  message.error(err?.message || 'Failed to copy quotation format');
                } finally {
                  setCopyingKey(null);
                }
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
                        label: deletingKey === record.key ? (
                          <span className="flex items-center gap-2">
                            <Spin size="small" />
                            <span>Deleting...</span>
                          </span>
                        ) : (
                          'Delete'
                        ),
                        disabled: deletingKey === record.key,
                      },
                    ],
                    onClick: info => {
                      info.domEvent.stopPropagation();
                      if (info.key === 'delete') {
                        handleQuotationFormatDelete(record);
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
