import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Button, Space, Popconfirm, message } from 'antd';
import { IconCheck, IconTrash, IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import ChecklistDrawer from '../ChecklistDrawer';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { fetchAllScreen } from '@redux/feature/admin/general/screen/screenThunk';
import { Status } from '@lib/constants/enum';
import {
  createChecklist,
  deleteChecklist,
  fetchAllChecklist,
  updateChecklist,
} from '@redux/feature/admin/general/checklist/checklistThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { checklist } from '@redux/feature/admin/general/checklist/IChecklistState';
import { screenTypeResponse } from '@redux/feature/admin/general/screen/IScreenState';
import { fetchAllFunctionality } from '@redux/feature/common/commonThunk';

const Checklist = () => {
  const dispatch = useAppDispatch();
  const { checklist, status } = useAppSelector((state: RootState) => state.general.checklist);
  const { screen, status: screenStatus } = useAppSelector(
    (state: RootState) => state.general.screen
  );
  const { functionality, status: commonStatus } = useAppSelector(state => state.common);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<checklist | null>(null);
  const [formRow, setFormRow] = useState<{
    name: string;
    screenId: string;
    functionalityId: string;
  } | null>(null);
  const [error, setError] = useState({ name: '', screenId: '', functionalityId: '' });
  const screenOption =
    screen &&
    screen.map((item: screenTypeResponse) => ({ label: item.name, value: item.screenId }));

  useEffect(() => {
    if (screenStatus === Status.IDLE) {
      fetchScreen();
    }

    if (commonStatus.functionality === Status.IDLE) {
      fetchFunctionality();
    }

    if (status.fetch === Status.IDLE) {
      fetchChecklist();
    }
  }, [status.fetch, commonStatus.functionality, screenStatus]);

  async function fetchScreen() {
    try {
      await dispatch(fetchAllScreen()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch screen');
    }
  }
  async function fetchFunctionality() {
    try {
      await dispatch(fetchAllFunctionality()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch functionality');
    }
  }
  async function fetchChecklist() {
    try {
      await dispatch(fetchAllChecklist()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch checklist');
    }
  }

  const validateForm = () => {
    const errors = {
      name: '',
      screenId: '',
      functionalityId: '',
    };
    let isValid = true;
    if (!formRow.name?.trim()) {
      errors.name = 'Lost Reason is required';
      isValid = false;
    }
    if (formRow.screenId === '') {
      errors.screenId = 'Screen is required';
      isValid = false;
    }
    if (!formRow.functionalityId) {
      errors.functionalityId = 'Functionality is required';
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleAddNew = () => {
    setError(null);
    setIsAdding(true);
    setFormRow({ name: '', screenId: '', functionalityId: '' });
  };

  const handleSaveNew = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await dispatch(createChecklist(formRow)).unwrap();
      message.success('Checklist created Successfully');
    } catch (error) {
      message.error(error || 'Failed to create checklist');
    }
    setIsAdding(false);
  };

  const handleCancelNew = () => {
    setIsAdding(false);
  };

  const handleEdit = record => {
    setError(null);
    setEditingId(record.checklistId);
    setFormRow({
      name: record.name,
      screenId: record.screen?.id || '',
      functionalityId: record.functionality?.id || '',
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!validateForm()) {
      return;
    }

    let prevCheklist = checklist.find(i => i.checklistId === id);
    const { isUpdated, updatedFields } = getUpdatedFields(formRow, {
      name: prevCheklist.name,
      functionalityId: prevCheklist.functionality.id,
      screenId: prevCheklist.screen.id,
    });
    if (!isUpdated) {
      setEditingId(null);
      return;
    }
    try {
      dispatch(updateChecklist({ checklistId: id, data: updatedFields }));
      setEditingId(null);
    } catch (error) {
      message.error(error || 'Failed to update checklist');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteChecklist(id)).unwrap();
      message.success('Checklist delete successfully');
    } catch (error) {
      message.error(error || 'Failed to delete checklist');
    }
  };

  const handleRowClick = (record: checklist) => {
    setSelectedRecord(record);
    setIsDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Checklist Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record: checklist, index: number) => {
        if ((isAdding && index === 0 && !record.checklistId) || editingId === record.checklistId) {
          console.log(error);
          return (
            <>
              <Input
                value={formRow.name}
                onChange={e => {
                  e.stopPropagation();
                  setFormRow({ ...formRow, name: e.target.value });
                }}
                disabled={status.create === Status.PENDING}
              />
              {error?.name && <span className="text-red-500">{error?.name}</span>}
            </>
          );
        }
        return record.name;
      },
    },
    {
      title: 'Screen',
      dataIndex: 'screen',
      key: 'screen',
      render: (_, record, index: number) => {
        if ((isAdding && index === 0 && !record.checklistId) || editingId === record.checklistId) {
          return (
            // on the chnage of the screen the functionality will be chnaged
            <>
              <Select
                value={formRow.screenId}
                options={screenOption}
                style={{ width: '100%' }}
                onChange={val => setFormRow({ ...formRow, screenId: val, functionalityId: '' })}
                disabled={status.create === Status.PENDING}
              />
              {error?.screenId && <span className="text-red-500">{error?.screenId}</span>}
            </>
          );
        }
        return record.screen.name;
      },
    },
    {
      title: 'Functionality',
      dataIndex: 'functionality',
      key: 'functionality',
      render: (_, record) => {
        if ((isAdding && !record.checklistId) || editingId === record.checklistId) {
          return (
            <>
              <Select
                value={formRow.functionalityId}
                options={
                  functionality &&
                  functionality
                    .filter(i => i.screen.id === formRow.screenId)
                    .map(i => ({ label: i.functionalityName, value: i.functionalityId }))
                }
                style={{ width: '100%' }}
                onChange={val => setFormRow({ ...formRow, functionalityId: val })}
                disabled={status.create === Status.PENDING}
              />
              {error?.functionalityId && (
                <span className="text-red-500">{error?.functionalityId}</span>
              )}
            </>
          );
        }
        return record.functionality?.name;
      },
    },
    {
      key: 'actions',
      render: (_, record, index: number) => {
        if (isAdding && index === 0 && !record.checklistId) {
          return (
            <Space>
              <Button
                icon={<IconCheck size={16} />}
                onClick={e => {
                  e.stopPropagation();
                  handleSaveNew();
                }}
                type="text"
                size="small"
                loading={status.create === Status.PENDING}
              />

              <Button
                icon={<IconX size={16} />}
                onClick={e => {
                  e.stopPropagation();
                  handleCancelNew();
                }}
                type="text"
                disabled={status.create === Status.PENDING}
              />
            </Space>
          );
        }

        if (editingId === record.checklistId) {
          return (
            <Space>
              <Button
                icon={<IconCheck size={16} />}
                onClick={e => {
                  e.stopPropagation();
                  handleSaveEdit(record.checklistId);
                }}
                type="text"
                size="small"
                loading={status.create === Status.PENDING}
              />

              <Button
                icon={<IconX size={16} />}
                onClick={e => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}
                type="text"
                size="small"
                danger
                disabled={status.create === Status.PENDING}
              />
            </Space>
          );
        }

        return (
          <Space>
            <Button
              icon={<IconPlus size={16} />}
              onClick={e => {
                e.stopPropagation();
                handleRowClick(record);
              }}
              type="text"
              size="small"
            />

            <Button
              icon={<IconEdit size={16} />}
              onClick={e => {
                e.stopPropagation();
                handleEdit(record);
              }}
              type="text"
              size="small"
            />
            <div onClick={e => e.stopPropagation()}>
              <Popconfirm
                title="Delete this checklist?"
                onConfirm={() => handleDelete(record.checklistId)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  icon={<IconTrash size={16} />}
                  type="text"
                  size="small"
                  danger
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
              </Popconfirm>
            </div>
          </Space>
        );
      },
    },
  ];

  const tableData = isAdding ? [{ key: 'new', ...formRow }, ...checklist] : checklist;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <Button type="primary" icon={<IconPlus />} onClick={handleAddNew} disabled={isAdding}>
          New
        </Button>
      </div>
      <ChecklistDrawer
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        record={selectedRecord}
      />
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey="id"
        loading={status.fetch === Status.PENDING}
      />
    </div>
  );
};

export default Checklist;
