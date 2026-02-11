import { ColumnsType } from 'antd/es/table';
import { Button, message } from 'antd';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ContractFormatSectionType } from '@redux/feature/contractFormat/IContractFormatState';
import { useAppDispatch } from '@hooks/redux';
import {
  createContractFormatSection,
  deleteContractFormatSection,
  updateContractFormatSection,
} from '@redux/feature/contractFormat/contractFormatThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

export const ContractSectionColumn = ({ sectionOpen, setSectionOpen, contractDetail }) => {
  const dispatch = useAppDispatch();

  async function handleSectionSubmit(values) {
    try {
      if (sectionOpen.data) {
        const formData = formDataGenerator({
          ...values,
          sectionUrl: values?.sectionUrl,
        });
        dispatch(
          updateContractFormatSection({ id: sectionOpen?.data?.contractSectionId, data: formData })
        ).unwrap();
      } else {
        const formData = formDataGenerator({
          ...values,
          sectionUrl: values?.sectionUrl,
          contractFormatId: contractDetail?.contractFormatId,
        });
        dispatch(createContractFormatSection(formData)).unwrap();
      }
      setSectionOpen({ title: null, data: null });
    } catch (error) {
      message.error(error || 'Failed to save contract document');
    }
  }

  async function handleSectionDelete() {
    try {
      await dispatch(
        deleteContractFormatSection({
          id: sectionOpen?.data?.contractSectionId,
          contractFormatId: sectionOpen?.data?.contractFormatId,
        })
      ).unwrap();

      setSectionOpen({ title: null, data: null });
    } catch (error) {
      message.error(error || 'Failed to delete contract document');
    }
  }

  function handleSectionCloseModal() {
    setSectionOpen({ title: null, data: null });
  }

  const columns: ColumnsType<ContractFormatSectionType> = [
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
      // render: (_, record) => <p>{record.merge ? 'True' : 'False'}</p>,
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 150,
    },
  ];
  return {
    columns,
    handleDelete: handleSectionDelete,
    handleSectionSubmit,
    handleDeleteClose: handleSectionCloseModal,
  };
};
