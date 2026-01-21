'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Switch, Table, Button, Form, Input, Space, message, Popconfirm } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { colorSettingCustomFields } from '@/components/formFields/ColorSettingCustomFIelds';
import { colorSettingFields } from '@/components/formFields/ColorSettingFields';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createJobColorSection,
  deleteJobColorSection,
  fetchJobColor,
  fetchJobColorColumn,
  fetchJobColorSection,
  updateJobColor,
  updateJobColorColumn,
  updateJobColorSection,
} from '@redux/feature/admin/job/jobColor/jobColorThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import {
  JobColorColumnType,
  JobColorSection,
  JobColorSettings,
} from '@redux/feature/admin/job/jobColor/IJobColorState';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

export const Colors: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    jobColor,
    jobColorSection,
    jobColorColumn,
    jobColorColumnStatus,
    jobColorSectionStatus,
    status,
  } = useAppSelector(state => state.job.jobColor);
  const [settings, setSettings] = useState<JobColorSettings | null>(jobColor || null);
  const [headerText, setHeaderText] = useState(jobColor?.headerText || '');
  const [initialHeaderText, setInitialHeaderText] = useState(jobColor?.headerText || '');
  const [showSave, setShowSave] = useState<{ setting: boolean; header: boolean }>({
    setting: false,
    header: false,
  });
  const [editingRow, setEditingRow] = useState<JobColorColumnType>(null);
  const [isModalOpen, setIsModalOpen] = useState<'colorColumn' | 'colorSection' | null>(null);
  const [editingCustomSection, setEditingCustomSection] = useState<JobColorSection | null>(null);
  const [customForm] = Form.useForm();
  const [form] = Form.useForm();
  const [currentDisplayOption, setCurrentDisplayOption] = useState<string>('');

  const fetchJobColorData = async () => {
    try {
      await dispatch(fetchJobColor()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch job color data');
    }
  };

  const fetchJobColorSectionData = async () => {
    try {
      await dispatch(fetchJobColorSection()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch job color data');
    }
  };

  const fetchJobColorColumnData = async () => {
    try {
      await dispatch(fetchJobColorColumn()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch job column color data');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchJobColorData();
    }
    if (jobColorSectionStatus.fetch === Status.IDLE) {
      fetchJobColorSectionData();
    }
    if (jobColorColumnStatus.fetch === Status.IDLE) {
      fetchJobColorColumnData();
    }
  }, [status.fetch, jobColorSectionStatus.fetch, jobColorColumnStatus.fetch]);

  useEffect(() => {
    if (jobColor) {
      setSettings(jobColor);
      setHeaderText(jobColor.headerText || '');
      setInitialHeaderText(jobColor.headerText || '');
    }
  }, [jobColor]);

  useEffect(() => {
    if (!settings || !jobColor) {
      setShowSave(prev => ({ ...prev, setting: false }));
      return;
    }

    const { isUpdated } = getUpdatedFields(settings, jobColor);

    setShowSave(prev => ({ ...prev, setting: isUpdated }));
  }, [settings, jobColor]);

  useEffect(() => {
    const hasHeaderChanged = headerText !== initialHeaderText;
    setShowSave(prev => ({ ...prev, header: hasHeaderChanged }));
  }, [headerText, initialHeaderText]);

  const handleSwitchChange = (key: string, value: boolean) => {
    if (!settings) return;
    setSettings(prev => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSaveSettings = async () => {
    if (!settings || !jobColor) return;

    const { isUpdated, updatedFields } = getUpdatedFields(settings, jobColor);

    if (!isUpdated) {
      message.info('No changes to save');
      return;
    }

    try {
      await dispatch(updateJobColor(updatedFields)).unwrap();
      message.success('Settings saved successfully!');
    } catch (error) {
      message.error('Failed to save settings');
      console.error('Save error:', error);
    }
  };

  const handleCancelSettings = () => {
    setSettings(jobColor);
  };

  const handleEdit = (record: JobColorColumnType) => {
    setEditingRow(record);
    setCurrentDisplayOption(record.displayOption || '');
    form.setFieldsValue(record);
    setIsModalOpen('colorColumn');
  };

  const handleModalOk = async values => {
    await form.validateFields();
    try {
      const { isUpdated, updatedFields } = getUpdatedFields(values, editingRow);
      if (!isUpdated) {
        message.info('No changes detect');
        setIsModalOpen(null);
        return;
      }
      await dispatch(
        updateJobColorColumn({ data: updatedFields, id: editingRow.jobColorColumnId })
      ).unwrap();
      message.success('Color column updated successfully');
      setIsModalOpen(null);
    } catch (error) {
      message.error(error?.message || 'Failed to update color column');
    }
  };

  const handleAddCustomSection = () => {
    setEditingCustomSection(null);
    setIsModalOpen('colorSection');
  };

  const handleCustomModalSave = async (values: JobColorSection) => {
    await customForm.validateFields();
    try {
      if (values) {
        const formData = formDataGenerator(values);
        await dispatch(createJobColorSection(formData)).unwrap();
        message.success('Custom section created successfully');
        setIsModalOpen(null);
        customForm.resetFields();
      }
    } catch (error) {
      message.error(error || 'Failed to create color custom section');
    }
  };

  const handleEditCustomSection = async (values: JobColorSection) => {
    await customForm.validateFields();
    try {
      if (editingCustomSection && values) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, editingCustomSection);
        if (!isUpdated) {
          setIsModalOpen(null);
          setEditingCustomSection(null);
          customForm.resetFields();
          return;
        }
        const formData = formDataGenerator(updatedFields);
        await dispatch(
          updateJobColorSection({
            data: formData,
            id: editingCustomSection.jobColorColumnSectionId,
          })
        ).unwrap();
        message.success('custom secction updated successfully');
        setIsModalOpen(null);
        setEditingCustomSection(null);
        customForm.resetFields();
      }
    } catch (error) {
      message.error(error || 'Failed to update color custom section');
    }
  };

  const handleDeleteCustomSection = async (id: string) => {
    try {
      await dispatch(deleteJobColorSection(id)).unwrap();
      message.success('custom section deleted succcessfully');
    } catch (error) {
      message.error(error || 'Failed to delete color custom section');
    }
  };

  const handleColorUISettings = async () => {
    if (headerText === initialHeaderText) {
      message.info('No changes to save');
      return;
    }

    try {
      await dispatch(updateJobColor({ headerText })).unwrap();
      message.success('Header text saved successfully!');
    } catch (error) {
      message.error('Failed to save header text');
      console.error('Save error:', error);
    }
  };

  const handleCancelHeaderText = () => {
    setHeaderText(initialHeaderText);
  };
  const columns = useMemo(
    () => [
      { title: 'Column Name', dataIndex: 'columnName' },
      {
        title: 'Options',
        dataIndex: 'displayOption',
      },
      {
        title: 'Sort Order',
        dataIndex: 'sortOrder',
      },
      {
        title: 'Width',
        dataIndex: 'width',
      },
      {
        title: 'Edit',
        key: 'edit',
        render: (_, record: JobColorColumnType) => (
          <Button icon={<IconEdit />} type="link" onClick={() => handleEdit(record)} />
        ),
      },
    ],
    [jobColorColumn]
  );

  const customSectionColumns = [
    {
      title: 'Section Name',
      dataIndex: 'sectionName',
      key: 'sectionName',
    },
    {
      title: 'Attachments',
      key: 'attachments',
      render: (record: JobColorSection) => <p>{record.attachments?.[0]?.name}</p>,
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: JobColorSection) => (
        <Space>
          <Button
            type="text"
            icon={<IconEdit size={18} />}
            onClick={() => {
              setEditingCustomSection(record);
              customForm.setFieldsValue(record);
              setIsModalOpen('colorSection');
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete custom section?"
            onConfirm={() => handleDeleteCustomSection(record.jobColorColumnSectionId)}
          >
            <Button type="text" danger icon={<IconTrash size={18} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Color PDF Settings</h3>

      {/* Switches */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center justify-between border p-3 rounded-md">
          <span>Hide color item images</span>
          <Switch
            checked={settings?.hideColorItemImages || false}
            onChange={val => handleSwitchChange('hideColorItemImages', val)}
          />
        </div>
        <div className="flex items-center justify-between border p-3 rounded-md">
          <span>Hide color item Price</span>
          <Switch
            checked={settings?.hideColorItemPrice || false}
            onChange={val => handleSwitchChange('hideColorItemPrice', val)}
          />
        </div>
        <div className="flex items-center justify-between border p-3 rounded-md">
          <span>Edit Color Code</span>
          <Switch
            checked={settings?.exitColorCode || false}
            onChange={val => handleSwitchChange('exitColorCode', val)}
          />
        </div>
        <div className="flex items-center justify-between border p-3 rounded-md">
          <span>
            Page Orientation (PDF)
            <span className="ml-1 text-gray-500 text-sm">Landscape (Default) / Portrait</span>
          </span>
          <Switch
            checked={settings?.pageOrientationPortrait || false}
            onChange={val => handleSwitchChange('pageOrientationPortrait', val)}
          />
        </div>
      </div>

      {/* Save Button */}
      {showSave?.setting && (
        <div className="flex gap-3 mb-6">
          <Button onClick={handleCancelSettings} disabled={status.update === Status.PENDING}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSaveSettings}
            loading={status.update === Status.PENDING}
          >
            Save Changes
          </Button>
        </div>
      )}

      {/* Table */}
      <Table
        bordered
        size="middle"
        columns={columns}
        dataSource={jobColorColumn}
        pagination={false}
        className="rounded-lg"
        loading={jobColorColumnStatus.fetch === Status.PENDING}
      />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Custom Section</h3>
            <span className="text-red-500 text-sm">
              Note: Please don't attach password protected PDF documents
            </span>
          </div>
          <Button type="primary" icon={<IconPlus size={16} />} onClick={handleAddCustomSection}>
            New
          </Button>
        </div>

        <Table
          bordered
          size="middle"
          columns={customSectionColumns}
          dataSource={jobColorSection}
          pagination={false}
          className="rounded-lg mb-8"
          loading={jobColorSectionStatus.fetch === Status.PENDING}
        />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Color UI Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Text (Screen)
              </label>
              <Input.TextArea
                value={headerText}
                onChange={e => setHeaderText(e.target.value)}
                rows={4}
                maxLength={500}
                showCount
                placeholder="Enter header text..."
                className="w-full"
              />
            </div>
            {showSave?.header && (
              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleCancelHeaderText}
                  disabled={status.update === Status.PENDING}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={handleColorUISettings}
                  loading={status.update === Status.PENDING}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen === 'colorColumn' && (
        <ActionDialogmodel
          title="Edit Color"
          open={isModalOpen === 'colorColumn'}
          isEditing={true}
          onCancel={() => setIsModalOpen(null)}
          onSubmit={handleModalOk}
          submitButtonText="Save"
          initialValues={editingRow}
          fields={colorSettingFields(currentDisplayOption, value => setCurrentDisplayOption(value))}
          loading={jobColorColumnStatus.update === Status.PENDING}
        />
      )}

      {isModalOpen === 'colorSection' && (
        <ActionDialogmodel
          title={editingCustomSection ? 'Edit Section' : 'Add Section'}
          open={isModalOpen === 'colorSection'}
          onCancel={() => {
            setIsModalOpen(null);
            setEditingCustomSection(null);
            customForm.resetFields();
          }}
          onSubmit={editingCustomSection ? handleEditCustomSection : handleCustomModalSave}
          submitButtonText="Save"
          isEditing={editingCustomSection !== null}
          initialValues={editingCustomSection || undefined}
          fields={colorSettingCustomFields()}
          loading={jobColorSectionStatus.update === Status.PENDING}
        />
      )}
    </div>
  );
};
