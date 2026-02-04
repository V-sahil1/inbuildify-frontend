'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, message, Switch, Input, Popconfirm } from 'antd';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel, FormField } from '@/components/common/Models/ActionDialogModel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createOHSItem,
  deleteOHSItem,
  fetchAllOHSItem,
  fetchOHSSetting,
  updateOHSItem,
  updateOHSSetting,
} from '@redux/feature/admin/construction/constructionOHS/OHSListThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { OHSListCategory } from '@redux/feature/admin/construction/constructionOHS/IOHSListState';
import { toggleExpand } from '@redux/feature/admin/construction/constructionOHS/OHSListSlice';
import TooltipButton from '@/components/common/TooltipButton';

export const OHList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setting, ohsCategory, status } = useAppSelector(state => state.construction.ohsList);
  const [editing, setEditing] = useState<OHSListCategory | null>(null);
  const [selectedategory, setSelectedCategory] = useState(null);
  const [modalopen, setModalopen] = useState<'category' | 'item' | null>(null);
  const [isChannged, setIsChanged] = useState(false);
  const [settingData, setSettingData] = useState<{
    signatureRequired: boolean;
    minimumAudits: number;
  }>({ signatureRequired: false, minimumAudits: 0 });

  const fetchSetting = async () => {
    try {
      await dispatch(fetchOHSSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch settings');
    }
  };
  const fetchCategoryData = async () => {
    try {
      await dispatch(fetchAllOHSItem({ fieldType: 'category' })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch settings');
    }
  };

  useEffect(() => {
    if (status.setting.fetch === Status.IDLE) {
      fetchSetting();
    }

    if (status.ohsCategory.fetch === Status.IDLE) {
      fetchCategoryData();
    }
    if (setting) {
      setSettingData({
        signatureRequired: setting.signatureRequired,
        minimumAudits: setting.minimumAudits,
      });
    }
  }, [status.setting.fetch, status.ohsCategory.fetch]);

  const handleSaveSetting = async () => {
    try {
      const { isUpdated, updatedFields } = getUpdatedFields(settingData, setting);
      if (!isUpdated) {
        return;
      }
      await dispatch(updateOHSSetting(updatedFields)).unwrap();
      message.success('settings updated successfully');
      setIsChanged(false);
    } catch (error) {
      message.error(error || 'Failed to update settings');
    }
  };

  const handleDelete = async (record: OHSListCategory) => {
    try {
      await dispatch(
        deleteOHSItem({ id: record.constructionOhsListId, parentId: record.parentId })
      ).unwrap();
      message.success('Deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete item');
    }
  };

  const handleSaveCategory = async values => {
    try {
      const { updatedFields, isUpdated } = getUpdatedFields(values, editing);
      if (!isUpdated) {
        setModalopen(null);
        setEditing(null);
        return;
      }
      await dispatch(
        updateOHSItem({ data: updatedFields, id: editing?.constructionOhsListId })
      ).unwrap();
      message.success('Category updated successfully');
      setModalopen(null);
      setEditing(null);
    } catch (error) {
      message.error(error || 'Failed to update category');
    }
  };

  const handleSaveItem = async values => {
    try {
      if (editing) {
        const { updatedFields, isUpdated } = getUpdatedFields(values, editing);
        if (!isUpdated) {
          setModalopen(null);
          setEditing(null);
          return;
        }
        await dispatch(
          updateOHSItem({ data: updatedFields, id: editing?.constructionOhsListId })
        ).unwrap();
        message.success('Item updated successfully');
      } else {
        await dispatch(
          createOHSItem({
            ...values,
            fieldType: 'item',
            parentId: selectedategory?.constructionOhsListId,
          })
        ).unwrap();
        message.success('Item created successfully');
      }
      setModalopen(null);
      setEditing(null);
    } catch (error) {
      message.error(error || 'Failed to update category');
    }
  };

  const handleDefaultChange = async (record: OHSListCategory, checked: boolean) => {
    try {
      await dispatch(
        updateOHSItem({
          data: { addDefaults: checked },
          id: record.constructionOhsListId,
        })
      ).unwrap();
      message.success('Default setting updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update default setting');
    }
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'fieldName',
      key: 'fieldName',
      render: (text: string, record: OHSListCategory) => (
        <div className="flex justify-between">
          <div className="flex  gap-2 flex-col">
            {text}
            <div
              className="flex items-center gap-2"
              onClick={() => {
                setEditing(record);
                setModalopen('category');
              }}
            >
              <IconPlus size={16} className="border rounded-full border-primary text-primary" />
              Notes
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>Add to default</p>
            <div>
              <Switch
                checked={record.addDefaults}
                onChange={checked => handleDefaultChange(record, checked)}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      align: 'center' as const,
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_, record: OHSListCategory) => (
        <Button
          icon={<IconPlus />}
          type="primary"
          onClick={() => {
            setSelectedCategory(record);
            setModalopen('item');
          }}
        >
          New
        </Button>
      ),
    },
  ];

  const getChecklistData = async record => {
    if (!record.isExpanded) {
      dispatch(toggleExpand(record.constructionOhsListId));
      try {
        await dispatch(
          fetchAllOHSItem({ id: record.constructionOhsListId, fieldType: 'item' })
        ).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch stage data');
      }
    }
  };
  const expandedRowRender = record => {
    getChecklistData(record);
    const ohsItemColumn = [
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Sort',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        width: 100,
        align: 'center' as const,
      },
      {
        title: '',
        key: 'actions',
        width: 120,
        align: 'center' as const,
        render: (_, record) => (
          <div className="flex justify-center gap-4">
            <TooltipButton
              title="Edit"
              type="text"
              icon={<IconPencil size={16} />}
              onClick={() => {
                setEditing(record);
                setModalopen('item');
              }}
            />
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={() => handleDelete(record)}
            >
              <TooltipButton
                title="Delete"
                type="text"
                icon={<IconTrash size={16} color="red" />}
              />
            </Popconfirm>
          </div>
        ),
      },
    ];
    return (
      <Table
        columns={ohsItemColumn}
        dataSource={record.items}
        pagination={false}
        rowKey="constructionInspectionChecklistId"
        size="small"
        loading={status.ohsItem.fetch === Status.PENDING}
      />
    );
  };

  return (
    <div className="p-6 bg-card-color rounded shadow-md">
      <div className="bg-card-color p-6 rounded-lg shadow-sm border border-border-color w-full mb-3">
        <h2 className="text-lg font-semibold text-font-color mb-4">General Settings</h2>

        {/* Signature Required Section */}
        <div className="flex items-start gap-3 mb-6">
          <Switch
            checked={settingData.signatureRequired}
            onChange={checked => {
              setSettingData(prev => ({ ...prev, signatureRequired: checked }));
              console.log(checked, setting.signatureRequired);
              setIsChanged(checked !== setting.signatureRequired);
            }}
            className="mt-1"
          />
          <div>
            <div className="text-font-color font-medium">Signature Required</div>
            <p className="text-font-color-100 text-sm leading-snug mt-1">
              When the toggle is <span className="font-semibold">ON</span> — During list submission,
              if the logged-in user has an email signature, it will be added to the PDF.
              <br />
              When the toggle is <span className="font-semibold">OFF</span> — During list
              submission, regardless of whether the toggle is enabled or not, the user’s email
              signature will not be added to the PDF.
            </p>
          </div>
        </div>

        {/* Minimum Audits Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="text-font-color font-medium mb-2 sm:mb-0">Minimum Audits</div>
            <Input
              placeholder="No count given"
              value={settingData.minimumAudits}
              onChange={e => {
                setSettingData(prev => ({ ...prev, minimumAudits: Number(e.target.value) }));
                setIsChanged(Number(e.target.value) !== setting.minimumAudits);
              }}
              className="w-48"
            />
          </div>
          <p
            className="text-font-color-100
           text-sm leading-snug mt-2"
          >
            Based on the values provided, score will be calculated on the OH&amp;S count graph. If
            the value is provided as <span className="font-semibold">2</span>, then the scoring can
            be calculated as follows:
            <br />2 audits per week = 100%, 1 audit per week = 50%, 0 audits per week = 0%.
          </p>
        </div>
        {isChannged && (
          <div className="text-end">
            <Button type="primary" onClick={handleSaveSetting}>
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-font-color">OH&S List Table</h2>
      </div>

      <Table
        columns={columns}
        dataSource={ohsCategory}
        pagination={false}
        rowKey="constructionOhsListId"
        bordered
        expandable={{ expandedRowRender }}
        rowClassName={record => (record.children ? 'bg-gray-50' : '')}
        loading={status.ohsCategory.fetch === Status.PENDING}
      />
      {!!modalopen && (
        <ActionDialogmodel
          open={!!modalopen}
          title={`${modalopen === 'item' ? (!!editing ? 'Edit' : 'New OH&S List') : 'Notes'}`}
          initialValues={editing}
          isEditing={!!editing}
          onCancel={() => {
            setModalopen(null);
            setEditing(null);
          }}
          onSubmit={values => {
            modalopen === 'category' ? handleSaveCategory(values) : handleSaveItem(values);
          }}
          fields={
            [
              {
                label: 'Description',
                name: 'description',
                type: 'text',
                placeholder: 'Enter description',
                rules: [{ required: true, message: 'Please enter description' }],
              },
              modalopen === 'item' && {
                label: 'Sort',
                name: 'sortOrder',
                type: 'number',
                rules: [{ required: true, message: 'Please enter sort' }],
              },
            ].filter(Boolean) as FormField[]
          }
        />
      )}
    </div>
  );
};
