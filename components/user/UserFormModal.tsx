import { Button, DatePicker, Drawer, Form, Input, Select, Switch, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { CustomBulkSelect } from '../common/CustomBulkSelect';
import dayjs from 'dayjs';
export const UserFormModal = ({
  open,
  onCancel,
  onSubmit,
  setModalOpen,
  isEditing,
  initialValue,
}) => {
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [showform, setShowForm] = useState(true);
  const [form] = Form.useForm();
  const companyAddress = Form.useWatch('companyAddress', form);
  const passwordGenerate = Form.useWatch('passwordGenerate', form);

  useEffect(() => {
    isEditing && form.setFieldsValue(initialValue);
  }, []);
  async function handleSubmit() {
    const values = await form.validateFields();
    onSubmit(values);
  }
  return (
    <Drawer
      open={open}
      onClose={onCancel}
      title={
        <div className="flex justify-between items-center">
          <p>{showform ? 'Manage User' : 'Reset Password'}</p>

          {isEditing && showform && (
            <div className="flex gap-2">
              <Button type="primary" onClick={() => setShowForm(false)}>
                Reset Password
              </Button>
              <Button type="primary" onClick={() => setModalOpen('resetLoginId')}>
                Change Login Id
              </Button>
            </div>
          )}
        </div>
      }
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {showform && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Form.Item label="Name" name="name">
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>
              <Form.Item label="Login ID" name="loginId">
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Form.Item label="Initials" name="initials">
                <Input />
              </Form.Item>
              <Form.Item label="Select Builders" name="builders">
                <CustomBulkSelect
                  options={[
                    { label: 'My Home', value: 'My Home' },
                    { label: 'Home', value: 'Home' },
                  ]}
                  onChange={() => {}}
                />
              </Form.Item>
            </div>
            <Form.Item label="Role" name="role">
              <Select
                options={[
                  { label: 'abc', value: 'abc' },
                  { label: 'pqr', value: 'pqr' },
                  { label: 'My Home-Company Admin', value: 'My Home-Company Admin' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Reporting To" name="reportingTo">
              <Select
                options={[
                  { label: 'abc', value: 'abc' },
                  { label: 'pqr', value: 'pqr' },
                  { label: 'My Home-Company Admin', value: 'My Home-Company Admin' },
                ]}
              />
            </Form.Item>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex place-items-start gap-2">
                <Form.Item name="companyAddress" valuePropName="checked" initialValue={true}>
                  <Switch />
                </Form.Item>
                <p>Use Company Address</p>
              </div>

              <p
                onClick={() => setShowAdvancedDetails(prev => !prev)}
                className="cursor-pointer text-blue"
              >
                {showAdvancedDetails ? 'Hide' : 'Show'} Advance Details
              </p>
            </div>
            {!companyAddress && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item label="Country" name="country">
                    <Select options={[{ label: 'Australia', value: 'Australia' }]} />
                  </Form.Item>
                  <Form.Item label="State/Region" name="state">
                    <Select options={[{ label: 'Victoria', value: 'Victoria' }]} />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item label="Address1" name="address1">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Address2" name="address2">
                    <Input />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item label="City/Suburb" name="city">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Zip/Postal Code" name="zipcode">
                    <Input />
                  </Form.Item>
                </div>
              </>
            )}
            {showAdvancedDetails && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item label="Date of Joining" name="joiningDate"  getValueProps={(value) => ({ value: value ? dayjs(value) : null })}>
                    <DatePicker />
                  </Form.Item>
                  <Form.Item label="Date of Birth" name="dob"  getValueProps={(value) => ({ value: value ? dayjs(value) : null })}>
                    <DatePicker/>
                  </Form.Item>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item label="Designation" name="designation">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Secondary Phone" name="secondaryPhone">
                    <Input />
                  </Form.Item>
                </div>
                <Form.Item label="Remarks" name="remarks">
                  <Input />
                </Form.Item>
                <Form.Item label="Consultant Bio" name="consultant_bio">
                  <Input />
                </Form.Item>
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item label="Photo" name="image">
                    <Upload>
                      <Button>Click To Upload</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item label="Signature" name="signature">
                    <Upload>
                      <Button>Click To Upload</Button>
                    </Upload>
                  </Form.Item>
                </div>
              </>
            )}
          </>
        )}

        {(!isEditing || !showform) && (
          <>
            <div className="flex place-items-start gap-2">
              <Form.Item name="passwordGenerate" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
              <div className="space-y-1">
                <p>Automatically generate a password and send an email to the user</p>
                {!passwordGenerate && (
                  <>
                    <Form.Item name="password">
                      <Input />
                    </Form.Item>
                    <p className="text-sm">Your password must have : </p>
                    <div className=" text-gray-400">
                      <p>8 or more characters</p>
                      <p>Upper and Lower letters</p>
                      <p>At least one number</p>
                      <p>At least one special character [! @ # $ % ^ & * -]</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {!passwordGenerate && (
              <>
                <div className="flex place-items-start gap-2 mt-1">
                  <Form.Item name="changeAtNxtLogin" valuePropName="checked" initialValue={false}>
                    <Switch />
                  </Form.Item>
                  <p>Ask for a password change at the next login</p>
                </div>
                <div className="flex place-items-start gap-2">
                  <Form.Item name="emailPassword" valuePropName="checked" initialValue={false}>
                    <Switch />
                  </Form.Item>
                  <p>Email the Password</p>
                </div>
              </>
            )}
          </>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              showform ? onCancel() : setShowForm(true);
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};
