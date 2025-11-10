'use client';
import React from 'react';
import { Form, Input, Select, Row, Col, Upload, Button, InputNumber, Divider } from 'antd';
import { ColorPicker } from 'antd';
import { IconInfoSquareFilled, IconUpload } from '@tabler/icons-react';
import InputSwitch from '@/components/common/InputSwitch';

const { TextArea } = Input;
const { Option } = Select;

const PdfFormatForm = ({ templateName, goBack }: any) => {
  const [form] = Form.useForm();

  return (
    <div className="bg-white p-6 rounded-md shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Template Name - {templateName}</h3>
      </div>
      <Form form={form} layout="vertical">
        <Divider orientation="left">Show Details</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Account">
              <Select placeholder="Select">
                <Option value="builderInfo">Builder Info</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Address">
              <Select placeholder="Select">
                <Option value="header">Header</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Contact">
              <Select placeholder="Select">
                <Option value="none">None</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            {templateName !== 'Color Format' && templateName !== 'Maintenance Format' && (
              <Form.Item label="Bank Information">
                <Select placeholder="Select">
                  <Option value="bottom">Bottom</Option>
                </Select>
              </Form.Item>
            )}
            {templateName === 'Color Format' && (
              <Form.Item label="User Label Information">
                <InputSwitch name="userlabelinformation" label="" />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Divider orientation="left">Page Header</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Background Color">
              <ColorPicker />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Font Color">
              <ColorPicker defaultValue="#000000" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Font Size">
              <Select defaultValue={10}>
                {[8, 10, 12, 14].map(s => (
                  <Option key={s}>{s}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {templateName !== 'Variation Format' && (
            <Col span={6}>
              <Form.Item label="Title">
                <Input />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Divider orientation="left">Page Footer</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Background Color">
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Font Color">
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Font Size">
              <Select defaultValue={10}>
                {[8, 10, 12, 14].map(size => (
                  <Option key={size}>{size}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Logo Settings</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Alignment">
              <Select defaultValue="left">
                <Option value="left">Left</Option>
                <Option value="left">Right</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Height">
              <InputNumber placeholder="130" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Width">
              <InputNumber placeholder="150" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Padding">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Logo Image">
              <Upload>
                <Button icon={<IconUpload />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Watermark Image">
              <Upload>
                <Button icon={<IconUpload />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {templateName !== 'Receipt Format' && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Divider orientation="left">List Items - Header</Divider>
              </Col>
              {templateName !== 'Maintenance Format' && (
                <Col span={12}>
                  <Divider orientation="left">List Items - Footer</Divider>
                </Col>
              )}
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Background Color">
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Font Color">
                  <ColorPicker />
                </Form.Item>
              </Col>

              {templateName !== 'Maintenance Format' && (
                <>
                  <Col span={6}>
                    <Form.Item label=" Background Color">
                      <ColorPicker />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item label="Font Color">
                      <ColorPicker />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          </>
        )}
        {templateName === 'Variation Format' && (
          <>
            <Divider orientation="left">Sub Items - Header</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Background Color">
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Font Color">
                  <ColorPicker />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Show Unit Option">
                  <Select defaultValue="hide">
                    <Option value="hide">Don't show units</Option>
                    <Option value="show">Show units</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {templateName === 'Color Format' && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Divider orientation="left">Cost Type - Standard</Divider>
              </Col>
              <Col span={12}>
                <Divider orientation="left">Cost Type - Upgrade</Divider>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Background Color">
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Font Color">
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label=" Background Color">
                  <ColorPicker />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Font Color">
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {templateName !== 'Color Format' && templateName !== 'Maintenance Format' && (
          <Form.Item label="Bank Header Text">
            <Input placeholder="Bank Details" />
          </Form.Item>
        )}
        {templateName !== 'Maintenance Format' && (
          <Form.Item label="Custom Text">
            <TextArea rows={4} />
          </Form.Item>
        )}
        {templateName === 'Variation Format' && (
          <Form.Item label="Total Cost Custom Text">
            <TextArea rows={4} />
          </Form.Item>
        )}

        {templateName === 'Invoice Format' && (
          <Form.Item
            label={
              <div className="flex items-center gap-1">
                {' '}
                Initial Diposite Discription <IconInfoSquareFilled size={15} />{' '}
              </div>
            }
          >
            <TextArea rows={4} />
          </Form.Item>
        )}

        {templateName !== 'Invoice Format' &&
          templateName !== 'Maintenance Format' &&
          templateName !== 'Receipt Format' && (
            <InputSwitch name="buildersignature" label="Enable Builder Signature" />
          )}

        <div className="flex gap-2 mt-4 justify-end">
          <Button type="default" onClick={goBack}>
            cancel
          </Button>
          <Button type="primary">Save</Button>
        </div>
      </Form>
    </div>
  );
};

export default PdfFormatForm;
