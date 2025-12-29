'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Switch, Table, Button, Form, Input, Space, UploadFile, message } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { colorSettingCustomFields } from '@/components/formFields/ColorSettingCustomFIelds';
import { colorSettingFields } from '@/components/formFields/ColorSettingFields';
import { ColorSettings } from 'data/configuration/ColorData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchJobColor } from '@redux/feature/admin/job/jobColor/jobColorThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { JobColorSettings } from '@redux/feature/admin/job/jobColor/IJobColorState';

interface CustomSection {
  key: string;
  sectionName: string;
  attachments: UploadFile[];
  sortOrder: number;
  options: string;
  width: number;
}

const initialCustomSections: CustomSection[] = [];

export const Colors: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobColor, status } = useAppSelector(state => state.job.jobColor);
  const [settings, setSettings] = useState<JobColorSettings | null>(jobColor || null);
  const [initialValues] = useState<JobColorSettings | null>(jobColor || null);
  const [headerText, setHeaderText] = useState(jobColor?.headerText || '');
  const [showSave, setShowSave] = useState(false);
  const [tableData, setTableData] = useState(ColorSettings);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customSections, setCustomSections] = useState<CustomSection[]>(initialCustomSections);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [editingCustomSection, setEditingCustomSection] = useState<CustomSection | null>(null);
  const [customForm] = Form.useForm();
  const [form] = Form.useForm();

  const fetchJobColorData = async () => {
    try {
      await dispatch(fetchJobColor()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch job color data');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchJobColorData();
    }
  }, [status.fetch]);

  useEffect(() => {
    if (jobColor) {
      setSettings(jobColor);
      setHeaderText(jobColor.headerText || '');
    }
  }, [jobColor]);

  useEffect(() => {
    if (!settings || !initialValues) {
      setShowSave(false);
      return;
    }
    
    const changedValues = getUpdatedFields(settings, initialValues);
    const hasChanges = Object.keys(changedValues).length > 0;
    setShowSave(hasChanges);
  }, [settings, initialValues]);

  const handleSwitchChange = (key: string, value: boolean) => {
    if (!settings) return;
    setSettings(prev => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSaveSettings = () => {
    console.log('Saved settings:', settings);
    setShowSave(false);
  };

  const handleEdit = (record: any) => {
    setEditingRow(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const updated = tableData.map(item =>
        item.key === editingRow.key ? { ...item, ...values } : item
      );

      // sort logic
      const sorted = [...updated].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      setTableData(sorted);
      setIsModalOpen(false);
    });
  };

  const handleAddCustomSection = () => {
    setEditingCustomSection(null);
    setIsCustomModalOpen(true);
  };

  const handleCustomModalSave = (values: any) => {
    console.log('Custom section saved', values);
    setCustomSections(prev => [
      ...prev,
      {
        ...values,
        key: Date.now().toString(),
      },
    ]);
    setIsCustomModalOpen(false);
    customForm.resetFields();
  };

  const handleEditCustomSection = (values: any) => {
    if (editingCustomSection) {
      setCustomSections(prev =>
        prev.map(section =>
          section.key === editingCustomSection.key
            ? { ...values, key: editingCustomSection.key }
            : section
        )
      );
    } else {
      setCustomSections(prev => [...prev, { ...values, key: Date.now().toString() }]);
    }
    setIsCustomModalOpen(false);
    setEditingCustomSection(null);
    customForm.resetFields();
  };

  const handleDeleteCustomSection = (key: string) => {
    setCustomSections(prev => prev.filter(section => section.key !== key));
  };

  const handleColorUISettings = () => {
    console.log('Color UI settings saved', headerText);
  };
  const columns = useMemo(
    () => [
      { title: 'Column Name', dataIndex: 'columnName' },
      {
        title: 'Options',
        dataIndex: 'options',
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
        render: (_: any, record: any) => (
          <Button icon={<IconEdit />} type="link" onClick={() => handleEdit(record)} />
        ),
      },
    ],
    [tableData]
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
      render: (record: any) => <p>{record.attachments?.[0]?.name}</p>,
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CustomSection) => (
        <Space>
          <Button
            type="text"
            icon={<IconEdit size={18} />}
            onClick={() => {
              setEditingCustomSection(record);
              customForm.setFieldsValue(record);
              setIsCustomModalOpen(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<IconTrash size={18} />}
            onClick={() => handleDeleteCustomSection(record.key)}
          />
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
      {showSave && (
        <div className="mb-6">
          <Button type="primary" onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </div>
      )}

      {/* Table */}
      <Table
        bordered
        size="middle"
        columns={columns}
        dataSource={tableData}
        pagination={false}
        className="rounded-lg"
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
          dataSource={customSections}
          pagination={false}
          className="rounded-lg mb-8"
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
            <div className="flex justify-end">
              <Button type="primary" onClick={handleColorUISettings}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ActionDialogmodel
        title="Edit Color"
        open={isModalOpen}
        isEditing={true}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleModalOk}
        submitButtonText="Save"
        initialValues={editingRow}
        fields={colorSettingFields()}
      />

      <ActionDialogmodel
        title={editingCustomSection ? 'Edit Section' : 'Add Section'}
        open={isCustomModalOpen}
        onCancel={() => {
          setIsCustomModalOpen(false);
          setEditingCustomSection(null);
          customForm.resetFields();
        }}
        onSubmit={editingCustomSection ? handleEditCustomSection : handleCustomModalSave}
        submitButtonText="Save"
        isEditing={editingCustomSection !== null}
        initialValues={editingCustomSection || undefined}
        fields={colorSettingCustomFields()}
      />
    </div>
  );
};
