import React, { useMemo, useState } from 'react';
import { Checkbox, Input, InputNumber } from 'antd';

export interface CustomSectionRow {
  key: string;
  field: string;
  isApplicable: boolean;
  groupField: boolean;
  fieldLabel: string;
  sortOrder?: number;
  parentField?: string;
}

export const useCustomSectionColumns = () => {
  const initialCustomSectionRows: CustomSectionRow[] = [
    {
      key: '1',
      field: 'Client name',
      isApplicable: false,
      groupField: false,
      fieldLabel: 'Client name',
      parentField: '',
    },
    {
      key: '2',
      field: 'Client Address',
      isApplicable: false,
      groupField: false,
      fieldLabel: 'Client Address',
      parentField: '',
    },
    {
      key: '3',
      field: 'Client Mobile',
      isApplicable: false,
      groupField: false,
      fieldLabel: 'Client Mobile',
      parentField: '',
    },
    {
      key: '4',
      field: 'Client Email',
      isApplicable: false,
      groupField: false,
      fieldLabel: 'Client Email',
      parentField: '',
    },
    {
      key: '5',
      field: 'Property Address',
      isApplicable: false,
      groupField: false,
      fieldLabel: 'Property Address',
      parentField: '',
    },
    {
      key: '6',
      field: 'Facade Name',
      isApplicable: false,
      groupField: false,
      fieldLabel: 'Facade Name',
      parentField: '',
    },
  ];
  const [rows, setRows] = useState<CustomSectionRow[]>(initialCustomSectionRows);

  const handleRowChange = (key: string, changes: Partial<CustomSectionRow>) => {
    setRows(prev => prev.map(row => (row.key === key ? { ...row, ...changes } : row)));
  };

  const columns = useMemo(
    () => [
      {
        title: 'Field',
        dataIndex: 'field',
        key: 'field',
        width: '25%',
      },
      {
        title: 'Is Applicable',
        dataIndex: 'isApplicable',
        key: 'isApplicable',
        width: '10%',
        render: (_: any, record: CustomSectionRow) => (
          <Checkbox
            checked={record.isApplicable}
            onChange={e => handleRowChange(record.key, { isApplicable: e.target.checked })}
          />
        ),
      },
      {
        title: 'Group Field',
        dataIndex: 'groupField',
        key: 'groupField',
        width: '10%',
        render: (_: any, record: CustomSectionRow) => (
          <Checkbox checked={record.groupField} disabled />
        ),
      },
      {
        title: 'Field Label',
        dataIndex: 'fieldLabel',
        key: 'fieldLabel',
        width: '30%',
        render: (_: any, record: CustomSectionRow) => (
          <Input
            size="small"
            value={record.fieldLabel}
            disabled={!record.isApplicable}
            onChange={e => handleRowChange(record.key, { fieldLabel: e.target.value })}
          />
        ),
      },
      {
        title: 'Sort Order',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        width: '10%',
        render: (_: any, record: CustomSectionRow) => (
          <InputNumber
            size="small"
            min={0}
            value={record.sortOrder}
            disabled={!record.isApplicable}
            onChange={value =>
              handleRowChange(record.key, { sortOrder: value === null ? undefined : value })
            }
            style={{ width: '100%' }}
          />
        ),
      },
      {
        title: 'Parent Field',
        dataIndex: 'parentField',
        key: 'parentField',
        width: '15%',
      },
    ],
    []
  );

  return { columns, data: rows };
};
