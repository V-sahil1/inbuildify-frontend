import { ColumnsType } from 'antd/es/table';
import { DataType } from 'data/contractData';
import { Button } from 'antd';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { reorderBySort } from '@lib/utils/reorderBySort';
import { title } from 'process';
export const ContractSectionColumn = ({ sectionOpen, setSectionOpen }) => {
  const [sectionsData, setSectionData] = useState<DataType[]>([]);
  function handleSectionSubmit(values) {
    console.log('section submit', values);
    setSectionData(prev => {
      if (sectionOpen.data) {
        const updatedItem = { ...sectionOpen.data, ...values };
        return reorderBySort(prev, updatedItem);
      } else {
        const newItem = {
          ...values,
          id: Math.floor(Math.random() * 1000000),
          sort: Number(values.sort) || prev.length + 1,
        };
        return reorderBySort(prev, newItem);
      }
    });
    setSectionOpen({ title: null, data: null });
  }

  function handleSectionDelete() {
    setSectionData(prev => prev.filter(obj => obj.id !== sectionOpen.data.id));
    setSectionOpen({ title: null, data: null });
  }

  function handleSectionCloseModal() {
    setSectionOpen({ title: null, data: null });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Section Name',
      dataIndex: 'sectionName',
      key: 'sectionName',
      width: 150,
      render: (_, record) => (
        <div className="flex gap-3">
          <Button
            type="text"
            className="text-blue"
            size="small"
            onClick={() => {
              setSectionOpen({ type: 'create', data: record });
            }}
            icon={<IconPencil size={15} />}
          />
          <Button
            type="text"
            size="small"
            onClick={() => {
              setSectionOpen({ type: 'delete', data: record });
            }}
            icon={<IconTrash size={15} color="red" />}
          />
          <p>{record.sectionName}</p>
        </div>
      ),
    },
    {
      title: 'Section Title',
      dataIndex: 'sectionTitle',
      key: 'sectionTitle',
      width: 150,
    },
    {
      title: 'Allow Merge',
      dataIndex: 'merge',
      key: 'merge',
      width: 150,
      render: (_, record) => <p>{record.merge ? 'True' : 'False'}</p>,
    },
    {
      title: 'Sort Order',
      dataIndex: 'sort',
      key: 'sort',
      width: 150,
    },
  ];
  return {
    columns,
    data: sectionsData,
    handleDelete: handleSectionDelete,
    handleSectionSubmit,
    handleDeleteClose: handleSectionCloseModal,
  };
};
