import React from 'react';
import { Modal, Select, Button, Form } from 'antd';
import { useUsersHook } from '@hooks/useUserHook';

// this is not dummy date it is being used for the form label and the selected label value name
const rolesList = [
  { label: 'Accounts', value: 'accounts' },
  { label: 'Builder', value: 'builder' },
  { label: 'Color Consultant', value: 'colorConsultant' },
  { label: 'Company Administrator', value: 'companyAdmin' },
  { label: 'Construction Manager - MH', value: 'constructionManagerMH' },
  { label: 'Contract Admin', value: 'contractAdmin' },
  { label: 'My Home - Company Admin', value: 'myHomeCompanyAdmin' },
  { label: 'My Home Admin', value: 'myHomeAdmin' },
  { label: 'Permits', value: 'permits' },
];

export const JobRoleAssignUserModal = ({ open, onCancel }) => {
  const [form] = Form.useForm();

  const handleFinish = () => {
    form.validateFields().then(values => {
      console.log(values);
      onCancel();
    });
  };
  const { userOptions } = useUsersHook();

  return (
    <Modal
      title="Assign Roles"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      centered
      okText="save"
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <div className="flex flex-col gap-4">
          {rolesList.map(role => (
            <div
              key={role.value}
              className="flex items-center justify-between rounded-lg px-4 py-2"
            >
              <span className="font-medium text-gray-800">{role.label}</span>
              <Form.Item name={['roles', role.value]} noStyle rules={[{ required: false }]}>
                {/* here dynamic user options are we are getting but the user will be based on the role we have to filter it */}
                <Select
                  placeholder="Select user"
                  style={{ width: 220 }}
                  options={userOptions}
                />
              </Form.Item>
            </div>
          ))}
        </div>
      </Form>
    </Modal>
  );
};
