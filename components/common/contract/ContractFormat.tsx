import { ContractSectionColumn } from '@/components/table-columns/ContractSectionColumn';
import SystemRoutes from '@lib/constants/Routes';
import { IconPencil } from '@tabler/icons-react';
import { Button, Divider, Form, Input, Radio, Select, Space, Tabs, Table, message } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ActionDialogmodel } from '../Models/ActionDialogModel';
import ConfirmationModal from '../ConfirmationModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { ContractFormatType } from '@redux/feature/contractFormat/IContractFormatState';
import {
  createContractFormat,
  updateContractFormat,
  fetchAllContractFormatById,
  fetchAllContractFormatSection,
} from '@redux/feature/contractFormat/contractFormatThunk';
import { useBuildersHook } from '@hooks/useBuildersHook';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { clearContractDetail } from '@redux/feature/contractFormat/contractFormatSlice';
type ContractFormatProps = {
  id?: string;
};
const ContractFormat: React.FC<ContractFormatProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();
  const { contractDetail, contractDetailStatus, contractSectionStatus, status } = useAppSelector(
    state => state.contractFormat
  );
  const [isEdited, setIsEdited] = useState(id ? false : true);
  const [sectionOpen, setSectionOpen] = useState<{ type: 'create' | 'delete' | null; data: {} }>();
  const { builderOptions } = useBuildersHook();

  const {
    columns: sectionColumn,
    handleDelete,
    handleSectionSubmit,
    handleDeleteClose,
  } = ContractSectionColumn({
    sectionOpen,
    setSectionOpen,
    contractDetail,
  });
  useEffect(() => {
    if (contractDetailStatus === Status.IDLE && id) {
      fetchContractDetail();
      fetchContractSection();
    }
  }, [contractDetailStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearContractDetail());
    };
  }, []);

  const fetchContractDetail = async () => {
    try {
      await dispatch(fetchAllContractFormatById(id)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch contract document');
    }
  };

  const fetchContractSection = async () => {
    try {
      await dispatch(fetchAllContractFormatSection(id)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch contract section');
    }
  };
  const handleSave = async (values: ContractFormatType) => {
    try {
      if (!!id) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, contractDetail);
        if (!isUpdated) {
          setIsEdited(false);
          return;
        }
        await dispatch(updateContractFormat({ id, data: updatedFields })).unwrap();
        message.success('Contract document updated successfully');
      } else {
        await dispatch(createContractFormat(values)).unwrap();
        message.success('Contract document created successfully');
      }
      setIsEdited(false);
    } catch (error) {
      message.error(error || 'Failed to save contract document');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contract Format</h1>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              router.push(`${SystemRoutes.CONTRACT}`);
            }}
          >
            Go to Listing
          </Button>
        </Space>
      </div>
      <p>Format Details</p>
      <Divider className="!my-2" />
      <Form
        form={form}
        onFinish={handleSave}
        initialValues={{
          builderName: contractDetail?.builder,
          formatName: contractDetail?.formatName,
          status: contractDetail?.status || 'Active',
          contract: contractDetail?.defaultFormat || 'yes',
        }}
        disabled={status.create === Status.PENDING}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="flex gap-3">
              <p className="sm:min-w-[150px]">Builder Name</p>
              {isEdited ? (
                <Form.Item name="builder">
                  <Select options={builderOptions} style={{ minWidth: '200px' }} />
                </Form.Item>
              ) : (
                <p>{contractDetail?.builderName}</p>
              )}
            </div>
            <div className="flex gap-3">
              <p className="sm:min-w-[150px]">Format Name</p>
              {isEdited ? (
                <Form.Item name="formatName">
                  <Input style={{ minWidth: '200px' }} />
                </Form.Item>
              ) : (
                <p>{contractDetail?.formatName}</p>
              )}
            </div>
            <div className="flex gap-3">
              <p className="sm:min-w-[150px]">Status</p>
              {isEdited ? (
                <Form.Item name="status">
                  <Radio.Group
                    defaultValue="Active"
                    options={[
                      { label: 'Active', value: true },
                      { label: 'InActive', value: false },
                    ]}
                  />
                </Form.Item>
              ) : (
                <p>{contractDetail?.status ? 'Active' : 'Inactive'}</p>
              )}
            </div>
            <div className="flex gap-3">
              <p className="sm:min-w-[150px]">Contracte</p>
              {isEdited ? (
                <Form.Item name="defaultFormat">
                  <Radio.Group
                    defaultValue="yes"
                    options={[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false },
                    ]}
                  />
                </Form.Item>
              ) : (
                <p>{contractDetail?.defaultFormat ? 'Yes' : 'No'}</p>
              )}
            </div>
          </div>
          <div className="mr-4">
            {isEdited ? (
              <div className="flex gap-2">
                {!!contractDetail && (
                  <Button
                    onClick={() => setIsEdited(false)}
                    disabled={status.create === Status.PENDING}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={status.create === Status.PENDING}
                  disabled={status.create === Status.PENDING}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                className="text-blue"
                size="small"
                type="text"
                icon={<IconPencil size={20} />}
                onClick={() => setIsEdited(true)}
              />
            )}
          </div>
        </div>
      </Form>
      <div className="text-end">
        <Button
          onClick={() => setSectionOpen(prev => ({ ...prev, type: 'create' }))}
          disabled={!contractDetail || isEdited}
        >
          New Section
        </Button>
      </div>
      <Tabs
        className="mt-3"
        defaultActiveKey="contract"
        type="card"
        tabBarStyle={{ margin: '0px', marginRight: '10px' }}
        tabBarGutter={10}
        size="large"
      >
        <TabPane tab="Default Sections" key="contract" className="border border-t-0">
          <div className="bg-white">
            <Table
              columns={sectionColumn}
              dataSource={contractDetail?.sections}
              loading={contractSectionStatus.fetch === Status.PENDING}
            />
          </div>
        </TabPane>
      </Tabs>
      {sectionOpen?.type === 'create' && (
        <ActionDialogmodel
          title="Section Details"
          open={sectionOpen.type === 'create'}
          onCancel={handleDeleteClose}
          onSubmit={values => {
            handleSectionSubmit(values);
          }}
          fields={[
            {
              label: 'Section Name',
              name: 'sectionName',
              type: 'select',
              options: [{ label: 'Attach PDF', value: 'attach_pdf' }],
            },
            { label: 'Sort Order', name: 'sortOrder', type: 'number' },
            { label: 'Upload', name: 'sectionUrl', type: 'image', acceptFileType: 'image/*' },
          ]}
          initialValues={sectionOpen.data}
          isEditing={!!sectionOpen.data}
        />
      )}
      {sectionOpen?.type === 'delete' && (
        <ConfirmationModal
          open={sectionOpen.type === 'delete'}
          onClose={() => setSectionOpen({ type: null, data: null })}
          onConfirm={handleDelete}
          type="danger"
          title="Confirm Deletion"
          message={
            <>
              <p>Default Section Name: {sectionOpen.data['sectionName']}</p>
              <p className="text-[15px]">Are you sure you want to delete this default section?</p>
            </>
          }
          confirmText="Delete"
          loading={contractSectionStatus.create === Status.PENDING}
        />
      )}
    </div>
  );
};

export default ContractFormat;
