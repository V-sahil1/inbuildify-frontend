import { Col, Form, Row, Select } from 'antd';

export const ChecklistHeader = () => {
  return (
    <Form layout="vertical" className="mb-6">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Builder" required>
            <Select
              placeholder="Select Builder"
              options={[
                { label: 'Company Level', value: 'companyLevel' },
                { label: 'Project Level', value: 'projectLevel' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Construction Types" required>
            <Select
              placeholder="Select Construction Type"
              options={[
                { label: 'Single Storey Build', value: 'singleStoreyBuilding' },
                { label: 'Multi Storey Build', value: 'multiStoreyBuilding' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Stage" required>
            <Select
              placeholder="Select Stage"
              options={[
                { label: 'Base Stage', value: 'baseStage' },
                { label: 'Project Stage', value: 'projectLevel' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
