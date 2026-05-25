import React, { useMemo, useState, useEffect } from 'react';
import { Checkbox, Input, InputNumber, message } from 'antd';
import { useAppDispatch } from '@hooks/redux';
import { updateCustomSectionThunk } from '@redux/feature/quotation-format/quotationFormatThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

export interface CustomSectionRow {
  key: string;
  field: string;
  isApplicable: boolean;
  groupField: boolean;
  fieldLabel: string;
  sortOrder?: number;
  parentField?: string;
}

interface UseCustomSectionOptions {
  data?: any[] | null;
  setData?: (rows: any[] | null) => void;
  quotationFormatId?: string | null;
}

export const useCustomSectionColumns = (opts?: UseCustomSectionOptions) => {
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
  const dispatch = useAppDispatch();

  const [rows, setRows] = useState<any[]>(opts?.data ?? initialCustomSectionRows);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);

  // sync when parent data changes
  useEffect(() => {
    if (opts?.data) setRows(opts.data);
  }, [opts?.data]);

  const handleRowChange = async (record: any, changes: Partial<CustomSectionRow>) => {
    const key = record.key;
    const updated = { ...record, ...changes };

    // optimistic update locally and in parent if setter provided
    const newRows = rows.map(r => (r.key === key ? { ...r, ...changes } : r));
    setRows(newRows);
    if (opts?.setData) opts.setData(newRows);

    // prepare payload for API
    const payloadObj = {
      // customSectionId: key,
      fieldName: updated.field ?? updated.fieldName,
      fieldLabel: updated.fieldLabel,
      isApplicable: !!updated.isApplicable,
      groupField: !!updated.groupField,
      sortOrder: updated.sortOrder ?? 0,
      // parentField: updated.parentField ?? '',
    };

    try {
      setUpdatingIds(prev => [...prev, key]);
      const formData = formDataGenerator(payloadObj);
      const idToSend = key; // backend expects id in path
      await dispatch(updateCustomSectionThunk({ id: idToSend, payload: formData })).unwrap();
      message.success('Custom section updated');
    } catch (err) {
      console.error('Failed to update custom section', err);
      message.error('Failed to update custom section');
    } finally {
      setUpdatingIds(prev => prev.filter(i => i !== key));
    }
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
        render: (_: any, record: any) => (
          <Checkbox
            checked={record.isApplicable}
            onChange={e => handleRowChange(record, { isApplicable: e.target.checked })}
            disabled={updatingIds.includes(record.key)}
          />
        ),
      },
      {
        title: 'Group Field',
        dataIndex: 'groupField',
        key: 'groupField',
        width: '10%',
        render: (_: any, record: any) => (
          <Checkbox
            checked={record.groupField}
            onChange={e => handleRowChange(record, { groupField: e.target.checked })}
            disabled={updatingIds.includes(record.key)}
          />
        ),
      },
      {
        title: 'Field Label',
        dataIndex: 'fieldLabel',
        key: 'fieldLabel',
        width: '30%',
        render: (_: any, record: any) => (
          <Input
            size="small"
            value={record.fieldLabel}
            disabled={!record.isApplicable || updatingIds.includes(record.key)}
            onChange={e => handleRowChange(record, { fieldLabel: e.target.value })}
          />
        ),
      },
      {
        title: 'Sort Order',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        width: '10%',
        render: (_: any, record: any) => (
          <InputNumber
            size="small"
            min={0}
            value={record.sortOrder}
            disabled={!record.isApplicable || updatingIds.includes(record.key)}
            onChange={value => handleRowChange(record, { sortOrder: value === null ? undefined : value })}
            style={{ width: '100%' }}
          />
        ),
      },
      // {
      //   title: 'Parent Field',
      //   dataIndex: 'parentField',
      //   key: 'parentField',
      //   width: '15%',
      // },
    ],
    [rows, updatingIds]
  );

  return { columns, data: rows };
};
