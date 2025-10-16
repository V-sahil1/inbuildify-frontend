import { ContentCard } from "@/components/common/card/ContentCard";
import { UserInfoCard } from "@/components/common/card/UserInfoCard";
import { IconPlus, IconX } from "@tabler/icons-react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Row,
  Col,
  Radio,
  Table,
  Button,
  Space,
  Modal,
} from "antd";
import {
  dummyBuilderData,
  dummyPurchaserData,
} from "data/buildingcontractData";
import React from "react";

const { Option } = Select;
const { TextArea } = Input;

// Define a style for form section headings
const sectionStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  margin: "30px 0 15px 0",
  borderBottom: "2px solid #eee",
  paddingBottom: "5px",
};

const BuildingContractForm = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const defaultPaymentStages = [
    { key: "deposit", stage: "Deposit", percent: 5 },
    { key: "base", stage: "Base Stage", percent: 10 },
    { key: "frame", stage: "Frame Stage", percent: 15 },
    { key: "lockup", stage: "Lock-Up Stage", percent: 35 },
    { key: "fixing", stage: "Fixing Stage", percent: 25 },
    { key: "completion", stage: "Completion", percent: 10 },
  ];

  const paymentColumns = [
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      width: "30%",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Percentage Of Contract Price %",
      dataIndex: "percent",
      key: "percent",
      width: "35%",
      render: (_, record) => (
        <Form.Item
          name={["progressPayment", record.key, "percent"]}
          initialValue={record.percent}
          noStyle
        >
          <InputNumber
            min={0}
            max={100}
            style={{ width: "100%", textAlign: "center" }}
          />
        </Form.Item>
      ),
    },
    {
      title: "$ Amount",
      dataIndex: "amount",
      key: "amount",
      width: "35%",
      render: (_, record) => (
        <Form.Item name={["progressPayment", record.key, "amount"]} noStyle>
          <Input prefix="$" placeholder="Amount" />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <Form
        form={form}
        name="building_contract"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          companyName: "My Home",
          abn: "82 156 644 478",
          surveyorName: "Parvaiz Azad Zai",
          siteAddress: "Lot 89, 09 In numquam provident, Ex qui quia aut a",
          insurerState: "Australian Capital Territory",
          depositPaid: "8,000",
          progressMethod: "method1",
          purchaser1FullName: "john wick",
          builderWitnessSame: true,
        }}
        style={{ padding: "20px", backgroundColor: "#fff" }}
      >
        {/* --- CUSTOMER DETAILS (Continued from first image) --- */}
        <div style={sectionStyle}>Customer Details</div>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="homeTelephone" label="Home Telephone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="businessTelephone" label="Business Telephone">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* --- BUILDING PERIOD --- */}
        <div style={sectionStyle}>Building Period (Days)</div>
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item
              name="actualBuildingPeriod"
              label="Actual Building Period"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="delayWeather" label="Delay Weather">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="delayBreaks" label="Delay Breaks">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="delayNature" label="Delay Nature">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="totalBuildingPeriod" label="Total Building Period">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* --- BUILDING WORKS & FEES --- */}
        <div style={sectionStyle}>Building Works & Fees</div>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="garageSize" label="Garage Size">
              <Select placeholder="Please select">
                <Option value="single">Single</Option>
                <Option value="double">Double</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="specPagesCount" label="Spec Pages Count">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="numberOfPagesOfPlans"
              label="Number Of Pages Of Plans"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="payingPlanningApproval"
              label="Paying Planning Approval"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="planningApprovalDays"
              label="Planning Approval Days"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="payingBuilderPermit" label="Paying Builder Permit">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="builderPermitDays" label="Builder Permit Days">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="contractEndedPercent"
              label="Contract Ended Percent"
            >
              <InputNumber
                min={0}
                max={100}
                //   formatter={(value) => `${value}%`}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="progressPaymentDays" label="Progress Payment Days">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="lateInterest" label="Late Interest">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="lateCompletion" label="Late Completion">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="extraWorkPercent" label="Extra Work Percent">
              <InputNumber
                min={0}
                max={100}
                //   formatter={(value) => `${value}%`}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="delayDamage" label="Delay Damage">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="bedroom" label="Bedroom">
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* --- LENDING INFO --- */}
        <div style={sectionStyle}>Lending Info</div>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="lendingBody" label="Lending Body">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="lendingAddress" label="Lending Address">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="lendingFinanceAmount"
              label="Lending Finance Amount"
            >
              <Input prefix="$" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="lendingApprovalDays" label="Lending Approval Days">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* --- BUILDING INSURER --- */}
        <div style={sectionStyle}>Building Insurer</div>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="insurer" label="Insurer">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="insurerAddress1" label="Address 1">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="insurerAddress2" label="Address 2">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="insurerState" label="State">
              <Select>
                <Option value="Australian Capital Territory">
                  Australian Capital Territory
                </Option>
                <Option value="New South Wales">New South Wales</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="postcode" label="Postcode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="nameOfInsured" label="Name of Insured">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* --- COMPANY & SURVEYOR DETAILS --- */}
        <div style={sectionStyle}>Company & Surveyor Details</div>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="companyName" label="Company Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="abn" label="ABN">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="surveyorName" label="Surveyor Name">
              <Select>
                <Option value="Parvaiz Azad Zai">Parvaiz Azad Zai</Option>
                {/* Add more options */}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* --- LAND DETAILS --- */}
        <div style={sectionStyle}>Land Details</div>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="siteAddress" label="Site Address">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="volumeNumber" label="Volume Number">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="folioNumber" label="Folio Number">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="planOfSubdivisionNumber"
              label="Plan Of Subdivision Number"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="covenantsRestrictionsEasements"
              label="Covenants, Restrictions and/or Easements On The Land"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* --- CONTRACT PRICE --- */}
        <div style={sectionStyle}>Contract Price</div>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="priceExcludingGST" label="Price Excluding GST">
              <Input prefix="$" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="gstOnThePrice" label="GST On The Price">
              <Input prefix="$" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="contractPriceIncludingGST"
              label="Contract Price Including GST"
            >
              <Input prefix="$" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="monthsPriceFixed" label="Months Price Fixed">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* --- DEPOSIT DETAILS --- */}
        <div style={sectionStyle}>Deposit Details</div>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="depositDue" label="5% Deposit Due">
              <Input prefix="$" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="depositPaid" label="Deposit Paid">
              <Input prefix="$" />
            </Form.Item>
          </Col>
        </Row>

        {/* --- PROGRESS PAYMENT --- */}
        <div style={sectionStyle}>Progress Payment</div>
        <Form.Item name="progressMethod" label="Payment Method">
          <Radio.Group>
            <Radio value="method1">Method 1</Radio>
            <Radio value="method2">Method 2</Radio>
          </Radio.Group>
        </Form.Item>

        <Table
          columns={paymentColumns}
          dataSource={defaultPaymentStages}
          pagination={false}
          bordered
          summary={() => (
            // The summary row (TOTAL CONTRACT PRICE)
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <strong>
                  TOTAL CONTRACT PRICE ($) / 100% (Including Deposit)
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Form.Item name="totalContractPriceSummary" noStyle>
                  <Input
                    prefix="$"
                    disabled
                    placeholder="Calculated Total"
                    style={{ textAlign: "right" }}
                  />
                </Form.Item>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        {/* --- SIGNATORY DETAILS (Two Columns) --- */}
        <div style={sectionStyle}>Purchaser & Witness Details</div>
        <Row gutter={48}>
          <Col span={12}>
            <h3>Purchaser 1 Details:</h3>
            <Form.Item name="purchaser1FullName" label="Full Name">
              <Input />
            </Form.Item>
          </Col>

          {/* --- RIGHT COLUMN: WITNESS DETAILS --- */}
          <Col span={12}>
            <h3>Purchaser Witness Details:</h3>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="purchaserWitnessFullName" label="Full Name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="purchaserWitnessEmail" label="Email">
                  <Input type="email" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="purchaserWitnessAddress" label="Witness Address">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="builderWitnessSame"
              label="Builder Witness Same as Purchaser Witness"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={48}>
          <Col span={12}>
            <h3>Purchaser 2 Details:</h3>
            <Form.Item name="purchaser2FullName" label="Full Name">
              <Input />
            </Form.Item>
          </Col>

          {/* --- RIGHT COLUMN: WITNESS DETAILS --- */}
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              // Get the value of the Switch field
              const isGuarantorSigned = getFieldValue("builderWitnessSame");
              if (isGuarantorSigned === true) {
                return (
                  <Col span={12}>
                    <h3>Builder Witness Details:</h3>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name="builderWitnessFullName"
                          label="Full Name"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="builderWitnessEmail" label="Email">
                          <Input type="email" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item label="Builder Witness Signature">
                      <div
                        style={{
                          height: 50,
                          border: "1px dashed #ccc",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#999",
                        }}
                      >
                        Signature Block Placeholder
                      </div>
                    </Form.Item>
                    <Form.Item
                      name="builderWitnessAddress"
                      label="Witness Address"
                    >
                      <TextArea rows={4} />
                    </Form.Item>
                  </Col>
                );
              }
              return null;
            }}
          </Form.Item>
        </Row>

        <Row gutter={24}>
          {/* Line 1: Guarantor's Signature (Switch) */}
          <Col span={24}>
            <Form.Item
              name="guarantorSignature"
              label="Guarantor's Signature"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const isGuarantorSigned = getFieldValue("guarantorSignature");

              if (isGuarantorSigned === true) {
                return (
                  <>
                    <Col span={6}>
                      <Form.Item name="lendingBody" label="Lending Body">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name="lendingAddress" label="Lending Address">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="lendingFinanceAmount"
                        label="Lending Finance Amount"
                      >
                        <Input prefix="$" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="lendingApprovalDays"
                        label="Lending Approval Days"
                      >
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </>
                );
              }
              return null;
            }}
          </Form.Item>
        </Row>
        <Row gutter={24}>
          <Col className="flex gap-4">
            <Form.Item name="contractSignedDate" label="Contract Signed Date:">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="contractExpiryDate" label="Contract Expiry Date:">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* --- SPECIAL CONDITIONS (Using Form.List for dynamic additions) --- */}
        <div style={sectionStyle}>Special Conditions</div>
        <Form.List name="specialConditions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div
                    key={key} 
                  className="flex items-start mb-2 p-3 border border-gray-300 rounded"
               
                >
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    fieldKey={[fieldKey, "description"]}
                    className="flex-grow m-0"
                    
                    style={{ width: "100%" }} 
                  >
                    <TextArea
                      placeholder="Description..."
                      rows={3}
                      
                      className="w-full"
                    />
                  </Form.Item>

                  <IconX
                    onClick={() => remove(name)}
                    className="ml-4 text-xl text-red-600 cursor-pointer mt-2"
                  />
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<IconPlus />}
                className="mb-5" 
              >
                Add Special Condition
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item className="mt-10 text-left">
          <Space size="middle">
            <Button size="large" type="primary">
              Save
            </Button>
            <Button size="large">Preview</Button>
            <Button size="large">View Job</Button>
            <Button size="large" onClick={() => setIsModalVisible(true)}>
              eSign
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Modal
        title="Send Email for eSign"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        centered
        width="50%"
        className="px-4 py-7"
        okText="send"
      >
        <ContentCard title="To">
          <UserInfoCard initialValues={dummyPurchaserData} />
        </ContentCard>
        <div className="pb-10" />
        <ContentCard title="Builder">
          <UserInfoCard initialValues={dummyBuilderData} showUserIcon={false} />
        </ContentCard>
      </Modal>
    </>
  );
};

export default BuildingContractForm;
