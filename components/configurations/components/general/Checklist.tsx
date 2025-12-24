import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Button, Space, Popconfirm, Drawer, message } from 'antd';
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
import { fetchAllFunctionality } from '@redux/feature/admin/general/functionality/functionalityThunk';

const Checklist = () => {
  const dispatch = useAppDispatch();
  const { checklist, status } = useAppSelector((state: RootState) => state.general.checklist);
  const { screen, status: screenStatus } = useAppSelector((state: RootState) => state.general.screen);
  const { functionality, status: functionalityStatus } = useAppSelector(
    (state: RootState) => state.general.functionality
  );
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [formRow, setFormRow] = useState({
    name: '',
    screenId: '',
    functionalityId: '',
  });
  const screenOption =
    screen && screen.map((item: any) => ({ label: item.name, value: item.screenId }));

  useEffect(() => {
    async function fetchScreen() {
      await dispatch(fetchAllScreen()).unwrap();
    }
    if (screenStatus.fetch === Status.IDLE) {
      fetchScreen();
    }
    async function fetchFunctionality() {
      await dispatch(fetchAllFunctionality()).unwrap();
    }
    if (functionalityStatus.fetch === Status.IDLE) {
      fetchFunctionality();
    }
    async function fetchChecklist() {
      await dispatch(fetchAllChecklist()).unwrap();
    }
    if (status.fetch === Status.IDLE) {
      fetchChecklist();
    }
  }, []);
  const handleAddNew = () => {
    setIsAdding(true);
    setFormRow({ name: '', screenId: '', functionalityId: '' });
  };

  const handleSaveNew = async () => {
    try {
      if (!formRow.name || !formRow.screenId || !formRow.functionalityId) return;
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

  const handleEdit = (record: any) => {
    setEditingId(record.checklistId);
    setFormRow({
      name: record.name,
      screenId: record.screenId,
      functionalityId: record.functionalityId,
    });
  };

  const handleSaveEdit = (id: string) => {
    try {
      dispatch(updateChecklist({ checklistId: id, data: formRow }));
    } catch (error) {
      message.error(error || 'Failed to update checklist');
    }
    setEditingId(null);
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

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setIsDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Checklist Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any, index: number) => {
        if (isAdding && index === 0 && !record.checklistId) {
          return (
            <Input
              value={formRow.name}
              onChange={e => {
                e.stopPropagation();
                setFormRow({ ...formRow, name: e.target.value });
              }}
            />
          );
        }
        if (editingId === record.checklistId) {
          return (
            <Input
              value={formRow.name}
              onChange={e => {
                e.stopPropagation();
                setFormRow({ ...formRow, name: e.target.value });
              }}
            />
          );
        }
        return record.name;
      },
    },
    {
      title: 'Screen',
      dataIndex: 'screen',
      key: 'screen',
      render: (text: string, record: any, index: number) => {
        if (isAdding && index === 0 && !record.checklistId) {
          return (
            // on the chnage of the screen the functionality will be chnaged
            <Select
              value={formRow.screenId}
              options={screenOption}
              style={{ width: '100%' }}
              onChange={val => setFormRow({ ...formRow, screenId: val })}
            />
          );
        }
        if (editingId === record.checklistId) {
          return (
            <Select
              value={formRow.screenId}
              options={screenOption}
              style={{ width: '100%' }}
              onChange={val => setFormRow({ ...formRow, screenId: val })}
            />
          );
        }
        return screen && screen.filter(i => i.screenId === record.screenId)[0]?.name;
      },
    },
    {
      title: 'Functionality',
      dataIndex: 'functionality',
      key: 'functionality',
      render: (_, record: any) => {
        if (isAdding && !record.checklistId) {
          return (
            <Select
              value={formRow.functionalityId}
              options={
                functionality &&
                functionality
                  .filter(i => i.screenId === formRow.screenId)
                  .map(i => ({ label: i.name, value: i.functionalityId }))
              }
              style={{ width: '100%' }}
              onChange={val => setFormRow({ ...formRow, functionalityId: val })}
            />
          );
        }
        if (editingId === record.checklistId) {
          return (
            <Select
              value={formRow.functionalityId}
              options={
                functionality &&
                functionality
                  .filter(i => i.screenId === formRow.screenId)
                  .map(i => ({ label: i.name, value: i.functionalityId }))
              }
              style={{ width: '100%' }}
              onChange={val => setFormRow({ ...formRow, functionalityId: val })}
            />
          );
        }
        return (
          functionality &&
          functionality.filter(i => i.functionalityId === record.functionalityId)[0]?.name
        );
      },
    },
    {
      key: 'actions',
      render: (_: any, record: any, index: number) => {
        const iconStyle = { cursor: 'pointer' };
        if (isAdding && index === 0 && !record.checklistId) {
          return (
            <Space>
              <IconCheck
                onClick={e => {
                  e.stopPropagation();
                  handleSaveNew();
                }}
                style={{ color: 'green', ...iconStyle }}
              />
              <IconX
                onClick={e => {
                  e.stopPropagation();
                  handleCancelNew();
                }}
                style={{ color: 'red', ...iconStyle }}
              />
            </Space>
          );
        }

        if (editingId === record.checklistId) {
          return (
            <Space>
              <IconCheck
                onClick={e => {
                  e.stopPropagation();
                  handleSaveEdit(record.checklistId);
                }}
                style={{ color: 'green', ...iconStyle }}
              />
              <IconX
                onClick={e => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}
                style={{ color: 'red', ...iconStyle }}
              />
            </Space>
          );
        }

        return (
          <Space>
            <IconPlus
              style={{ color: 'green', ...iconStyle }}
              onClick={e => {
                e.stopPropagation();
                handleRowClick(record);
              }}
            />
            <IconEdit
              onClick={e => {
                e.stopPropagation();
                handleEdit(record);
              }}
              style={iconStyle}
            />
            <div onClick={e => e.stopPropagation()}>
              <Popconfirm
                title="Delete this checklist?"
                onConfirm={() => handleDelete(record.checklistId)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <IconTrash
                  style={{ color: 'red', ...iconStyle }}
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
        // onRow={record => ({
        //   onClick: e => {
        //     e.preventDefault();
        //     handleRowClick(record);
        //   },
        // })}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
};

export default Checklist;
