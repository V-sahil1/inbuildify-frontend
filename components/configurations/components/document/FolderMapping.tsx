'use client';
import { useEffect, useState, useMemo } from 'react';
import { Select, Switch, Button, Tooltip, Form, message } from 'antd';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchFolderMapping,
  updateFolderMapping,
} from '@redux/feature/admin/document/folderMapping/folderMappingThunk';
import { Status } from '@lib/constants/enum';
import { IDocumentFolderMapping } from '@redux/feature/admin/document/folderMapping/IFolderMappingState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { fetchAllDocumentArea } from '@redux/feature/admin/document/area/documentAreaThunk';

export const FolderMapping = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [isChanged, setIsChanged] = useState(false);
  const { commonFolder, status } = useAppSelector(state => state.document.area);
  const { folderMapping, status: folderMappingStatus } = useAppSelector(
    state => state.document.folderMapping
  );
  const folderOptions =
    commonFolder &&
    commonFolder.length > 0 &&
    commonFolder.map(folder => ({ label: folder.name, value: folder.documentCommonFolderId }));

  const fetchFolderMappingData = async () => {
    try {
      await dispatch(fetchFolderMapping()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch folder mapping');
    }
  };

  const fetchFolderData = async () => {
    try {
      await dispatch(fetchAllDocumentArea()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch drives');
    }
  };

  useEffect(() => {
    if (folderMappingStatus.fetch === Status.IDLE) {
      fetchFolderMappingData();
    }
    if (folderMapping) {
      form.setFieldsValue(folderMapping);
    }

    if (status.fetch === Status.IDLE) {
      fetchFolderData();
    }
  }, [status.fetch, folderMappingStatus.fetch]);

  const initialGroups = useMemo(
    () => [
      {
        title: 'Signed Documents Mapping',
        items: [
          {
            label: 'Signed Quotation',
            value: '',
            options: folderOptions,
            name: 'signedQuotation',
          },
          {
            label: 'Signed Color',
            value: '',
            options: folderOptions,
            name: 'signedColor',
          },
          {
            label: 'Signed Variation',
            value: '',
            options: folderOptions,
            name: 'signedVariation',
          },
          {
            label: 'Signed Maintenance',
            value: '',
            options: folderOptions,
            name: 'signedMaintenance',
          },
          {
            label: 'Signed Contract Document',
            value: '',
            options: folderOptions,
            name: 'signedContractDocument',
          },
        ],
      },
      {
        title: 'Construction Documents Mapping',
        items: [
          {
            label: 'Compliance Certificate',
            info: true,
            value: '',
            options: folderOptions,
            name: 'complianceCertificate',
          },
          {
            label: 'Purchase Order',
            info: true,
            value: '',
            options: folderOptions,
            name: 'purchaseOrder',
          },
          {
            label: 'Job Documents',
            info: true,
            value: '',
            options: folderOptions,
            name: 'jobDocuments',
          },
        ],
      },
    ],
    [folderOptions]
  );

  const handleChange = (name, value) => {
    setIsChanged(value !== folderMapping?.[name]);
  };

  const handleSave = async () => {
    const values: IDocumentFolderMapping = await form.validateFields();
    try {
      const { isUpdated, updatedFields } = getUpdatedFields(values, folderMapping);
      if (!isUpdated) {
        message.error('No changes detected');
        setIsChanged(false);
        return;
      }
      await dispatch(updateFolderMapping(updatedFields)).unwrap();
      message.success('Folder mapping updated successfully');
      setIsChanged(false);
    } catch (error) {
      message.error(error || 'Failed to update folder mapping');
    }
  };

  return (
    <div className="w-full p-6 bg-card-color rounded-md">
      <Form
        form={form}
        initialValues={folderMapping}
        disabled={folderMappingStatus.create === Status.PENDING}
      >
        {initialGroups.map(group => (
          <div key={group.title} className="mb-8">
            <h3 className="text-base font-semibold text-font-color mb-3">{group.title}</h3>
            <div className="grid grid-cols-2 gap-y-4">
              {group.items.map((item, iIdx) => (
                <div key={item.label} className="contents">
                  <div className="flex items-center text-font-color-100">
                    {item.label}
                    {item.info && (
                      <Tooltip title="Information about this mapping">
                        <IconInfoCircle size={16} className="ml-1 text-font-color-400" />
                      </Tooltip>
                    )}
                  </div>
                  <Form.Item name={item.name}>
                    <Select
                      className="w-full"
                      value={item.value || undefined}
                      placeholder="Please select a folder"
                      onChange={val => handleChange(item.name, val)}
                      options={item.options}
                    />
                  </Form.Item>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3 mt-6 border-t border-border-color pt-4">
          <Form.Item name="selectAllFilesFromFolder" valuePropName="checked">
            <Switch onChange={checked => handleChange('selectAllFilesFromFolder', checked)} />
          </Form.Item>

          <div className="text-sm text-font-color">
            <p className="font-medium">Select all the files from the Folder</p>
            <p className="text-font-color-100">
              When the toggle is <strong>ON</strong> – Files will be auto-selected by default.
              <br />
              When the toggle is <strong>OFF</strong> – Files won’t be selected by default but will
              be manually available.
            </p>
          </div>
        </div>
      </Form>

      {isChanged && (
        <div className="mt-6 text-right">
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSave}
            loading={folderMappingStatus.create === Status.PENDING}
            disabled={folderMappingStatus.create === Status.PENDING}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};
