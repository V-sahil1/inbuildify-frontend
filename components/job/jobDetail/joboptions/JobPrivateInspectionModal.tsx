import { Form, Modal, Select, Input, Row, Col, message } from 'antd';
import { useCountryHook } from '@hooks/useCountryHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getStatesByCountryIdThunk } from '@redux/feature/location/locationThunk';

export const JobPrivateInspectionModal = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const { countryOptions } = useCountryHook();
  const { states } = useAppSelector(state => state.location);
  const dispatch = useAppDispatch();

  const onFinish = values => {
    console.log('Received values of form (Submit Successful):', values);
    onCancel();
  };

  const handleCountryChange = async (value: string) => {
    try {
      await dispatch(getStatesByCountryIdThunk(value));
    } catch (error) {
      message.error(error || 'Failed to fetch states');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      okText="Save Details"
      onOk={() => form.submit()}
      title="Private Inspector Details"
      centered
      width={900}
    >
      <Form layout="vertical" onFinish={onFinish} form={form} style={{ marginTop: 20 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="contactName"
              label="Contact Name"
              rules={[{ required: true, message: 'Contact Name is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="companyName" label="Company Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="country" label="Country">
              <Select
                onChange={value => {
                  handleCountryChange(value);
                }}
                options={countryOptions}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="stateRegion" label="State / Region">
              <Select
                options={states.map(state => ({
                  value: state.stateId,
                  label: state.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="address1" label="Address1">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="address2" label="Address2">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="citySuburb" label="City / Suburb">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="zipPostalCode" label="Zip/Postal Code">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="abn" label="ABN">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="acn" label="ACN">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <p className="text-red-500">
        Please update Construction Type to select Private Inspection applicable stages
      </p>
    </Modal>
  );
};
