'use client';
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Row, Col, Select, Radio, Typography, Button, Switch } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialData?: any;
}

const PartnerDetailModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [createLogin, setCreateLogin] = useState(true);
  const [genPassword, setGenPassword] = useState(false);
  const [emailPassword, setEmailPassword] = useState(false);
  const [partnerChange, setPartnerChange] = useState(false);

  const hasLogin = initialData?.loginId ? true : false;

  const [form] = Form.useForm();

  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [changeIdOpen, setChangeIdOpen] = useState(false);
  const [resetForm] = Form.useForm();
  const [changeForm] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue(initialData);
        setCreateLogin(hasLogin);
        if (typeof initialData.genPassword === 'boolean') setGenPassword(initialData.genPassword);
        if (typeof initialData.emailPassword === 'boolean') setEmailPassword(initialData.emailPassword);
        if (typeof initialData.partnerChange === 'boolean') setPartnerChange(initialData.partnerChange);
      } else {
        form.resetFields();
        form.setFieldsValue({ isActive: true });
        setCreateLogin(true);
        setGenPassword(false);
        setEmailPassword(false);
        setPartnerChange(false);
      }
    }
  }, [initialData, open, hasLogin, form]);

  const handleSave = () => {
    form.validateFields().then(values => {
      const payload = {
        ...values,
        hasLogin: createLogin,
        genPassword,
        emailPassword,
        partnerChange,
      };
      onSubmit(payload);
      form.resetFields();
    });
  };

  const openResetPasswordModal = () => {
    const currentPassword = form.getFieldValue('password');
    resetForm.setFieldsValue({ password: currentPassword });
    setResetPwdOpen(true);
  };

  const saveResetPasswordModal = async () => {
    if (!genPassword) {
      await resetForm.validateFields();
      const { password } = resetForm.getFieldsValue();
      form.setFieldsValue({ password });
    } else {
      form.setFieldsValue({ password: undefined });
    }
    setResetPwdOpen(false);
  };

  const openChangeIdModal = () => {
    const currentLoginId = form.getFieldValue('loginId');
    changeForm.setFieldsValue({ loginId: currentLoginId });
    setChangeIdOpen(true);
  };

  const saveChangeIdModal = async () => {
    await changeForm.validateFields();
    const { loginId } = changeForm.getFieldsValue();
    form.setFieldsValue({ loginId });
    setChangeIdOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        width={950}
        destroyOnClose
        footer={
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save</Button>
          </div>
        }
      >
        <div className="flex items-center mb-4 gap-[10%]">
          <Title level={4} className="!mb-0">Agent/Referral Partner Details</Title>

          {hasLogin && (
            <div className="flex gap-2 mr-6">
              <Button type="primary" onClick={openResetPasswordModal}>Reset Password</Button>
              <Button type="primary" onClick={openChangeIdModal}>Change Login ID</Button>
            </div>
          )}
        </div>

        <div className="h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <Form layout="vertical" form={form}>
            <Row gutter={16}>
              {/* Personal Info */}
              <Col span={8}><Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="email" label="Email" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="phone" label="Phone" rules={[{ required: true }]}><Input /></Form.Item></Col>

              {/* Address */}
              <Col span={8}><Form.Item name="country" label="Country"><Select><Option value="Australia">Australia</Option></Select></Form.Item></Col>
              <Col span={8}><Form.Item name="address1" label="Address1" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="address2" label="Address2"><Input /></Form.Item></Col>

              <Col span={8}><Form.Item name="city" label="City/Suburb"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="state" label="State/Region"><Select><Option value="Victoria">Victoria</Option></Select></Form.Item></Col>
              <Col span={8}><Form.Item name="zipcode" label="Zip / Postal Code" rules={[{ required: true }]}><Input /></Form.Item></Col>

              {/* Bank */}
              <Col span={8}><Form.Item name="accountName" label="Account Name"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="accountBSB" label="Account BSB"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="accountNumber" label="Account Number"><Input /></Form.Item></Col>

              <Col span={8}><Form.Item name="abn" label="ABN"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="company" label="Company Name"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="referredUser" label="Referred User"><Select><Option value="kishan">Kishan</Option></Select></Form.Item></Col>

              {initialData && (
                <Col span={8}>
                  <Form.Item name="isActive" label="Status" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio value={true}>Active</Radio>
                      <Radio value={false}>Inactive</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              )}
            </Row>

            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <Switch checked={createLogin} onChange={setCreateLogin} disabled={hasLogin} />
                <Text className="font-medium">Create Login Details</Text>
              </div>

              {createLogin && (
                <>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item name="loginId" label="Login ID" rules={[{ required: true }]}>
                        <Input disabled={hasLogin} />
                      </Form.Item>
                    </Col>
                  </Row>

                  {!hasLogin && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Switch checked={genPassword} onChange={() => setGenPassword(!genPassword)} />
                        <Text>Automatically generate a password and send email</Text>
                      </div>

                      {!genPassword && (
                        <>
                          <Row gutter={16}>
                            <Col span={8}>
                              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                                <Input.Password />
                              </Form.Item>
                            </Col>
                          </Row>

                          <div className="text-xs text-gray-500 ml-1 mb-2">
                            <p>Your password must have:</p>
                            <p>• 8+ characters</p>
                            <p>• Upper & lower letters</p>
                            <p>• Number</p>
                            <p>• Special character [!@#$%^&*-]</p>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Switch checked={partnerChange} onChange={() => setPartnerChange(!partnerChange)} />
                            <Text>Ask for partner change at next login</Text>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Switch checked={emailPassword} onChange={() => setEmailPassword(!emailPassword)} />
                            <Text>Email the Password</Text>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </Form>
        </div>
      </Modal>

      <Modal
        open={resetPwdOpen}
        onCancel={() => setResetPwdOpen(false)}
        destroyOnClose
        centered
        title="Reset Password"
        footer={
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button onClick={() => setResetPwdOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={saveResetPasswordModal}>Save</Button>
          </div>
        }
      >
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <Switch checked={genPassword} onChange={() => setGenPassword(!genPassword)} />
            <Text>Automatically generate a password and send email</Text>
          </div>

          {!genPassword && (
            <>
              <Form form={resetForm} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>

              <div className="text-xs text-gray-500 ml-1 mb-2">
                <p>Your password must have:</p>
                <p>• 8+ characters</p>
                <p>• Upper & lower letters</p>
                <p>• Number</p>
                <p>• Special character [!@#$%^&*-]</p>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Switch checked={partnerChange} onChange={() => setPartnerChange(!partnerChange)} />
                <Text>Ask for partner change at next login</Text>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Switch checked={emailPassword} onChange={() => setEmailPassword(!emailPassword)} />
                <Text>Email the Password</Text>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        open={changeIdOpen}
        onCancel={() => setChangeIdOpen(false)}
        destroyOnClose
        centered
        title="Change Login ID"
        footer={
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button onClick={() => setChangeIdOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={saveChangeIdModal}>Save</Button>
          </div>
        }
      >
        <Form form={changeForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="loginId" label="Login ID" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default PartnerDetailModal;
