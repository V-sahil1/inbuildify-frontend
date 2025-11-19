import { ContractSectionColumn } from '@/components/table-columns/ContractSectionColumn';
import SystemRoutes from '@lib/constants/Routes';
import { IconPencil } from '@tabler/icons-react';
import { Button, Divider, Form, Input, Radio, Select, Space, Tabs, Table } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { contractdata, contractDataType, sectionFields } from 'data/contractData';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ActionDialogmodel } from '../Models/ActionDialogModel';
import ConfirmationModal from '../ConfirmationModal';
type ContractFormatProps = {
  id?: string | string[];
};
const ContractFormat: React.FC<ContractFormatProps> = ({ id }) => {
  const [isEdited, setIsEdited] = useState(id ? false : true);
  const [sectionOpen, setSectionOpen] = useState<{ type: 'create' | 'delete' | null; data: {} }>();
  const [contractData, setContractData] = useState<contractDataType>(null);
  const {
    columns: sectionColumn,
    data,
    handleDelete,
    handleSectionSubmit,
    handleDeleteClose,
  } = ContractSectionColumn({
    sectionOpen,
    setSectionOpen,
  });
  const [form] = Form.useForm();
  const router = useRouter();
  useEffect(() => {
    if (id) {
      setContractData(contractdata[0]);
    }
  }, [id]);

  function handleSubmit(values) {
    setIsEdited(false);
    setContractData(values);
    console.log('edit contract', values);
  }
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
        onFinish={handleSubmit}
        initialValues={{
          builderName: contractData?.builderName,
          formatName: contractData?.formatName,
          status: contractData?.status || 'Active',
          contract: contractData?.contract || 'yes',
        }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="flex gap-3">
              <p className="sm:min-w-[150px]">Builder Name</p>
              {isEdited ? (
                <Form.Item name="builderName">
                  <Select
                    options={[{ label: 'My Home', value: 'My Home' }]}
                    style={{ minWidth: '200px' }}
                  />
                </Form.Item>
              ) : (
                <p>{contractData?.builderName}</p>
              )}
            </div>
            <div className="flex gap-3">
              <p className="sm:min-w-[150px]">Format Name</p>
              {isEdited ? (
                <Form.Item name="formatName">
                  <Input style={{ minWidth: '200px' }} />
                </Form.Item>
              ) : (
                <p>{contractData?.formatName}</p>
              )}
            </div>
            <div className="flex gap-3">
              <p className="sm:min-w-[150px]">Status</p>
              {isEdited ? (
                <Form.Item name="status">
                  <Radio.Group
                    defaultValue="Active"
                    options={[
                      { label: 'Active', value: 'Active' },
                      { label: 'InActive', value: 'InActive' },
                    ]}
                  />
                </Form.Item>
              ) : (
                <p>{contractData?.status}</p>
              )}
            </div>
            <div className="flex gap-3">
              <p className="sm:min-w-[150px]">Contracte</p>
              {isEdited ? (
                <Form.Item name="contract">
                  <Radio.Group
                    defaultValue="yes"
                    options={[
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]}
                  />
                </Form.Item>
              ) : (
                <p>{contractData?.contract}</p>
              )}
            </div>
          </div>
          <div className="mr-4">
            {isEdited ? (
              <div className="flex gap-2">
                <Button onClick={() => setIsEdited(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
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
        <Button onClick={() => setSectionOpen(prev => ({ ...prev, type: 'create' }))}>
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
            <Table columns={sectionColumn} dataSource={data} />
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
          fields={sectionFields}
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
        />
      )}
    </div>
  );
};

export default ContractFormat;
