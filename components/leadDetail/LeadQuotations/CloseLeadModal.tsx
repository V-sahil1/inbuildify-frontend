import React, { useState } from "react";
import {
  Modal,
  Tabs,
  Form,
  Input,
  Radio,
  Select,
  Checkbox,
  Button,
  Alert,
  Space,
} from "antd";
import type { TabsProps } from "antd";
import { QuotationResponse } from "@redux/feature/quotation/IQuotationState";
import { IconFileText } from "@tabler/icons-react";

const { TextArea } = Input;
const { Option } = Select;

interface CloseLeadModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  leadData?: any;
  quotations?: QuotationResponse[];
}

const CloseLeadModal: React.FC<CloseLeadModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  leadData,
  quotations,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>("closedWon");
  const [selectedQuotation, setSelectedQuotation] = useState<string>("");
  const [sendEmailNotification, setSendEmailNotification] =
    useState<boolean>(true);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    form.resetFields();
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        console.log("Active tab:", activeTab);
        console.log("Send email notification:", sendEmailNotification);
        // Handle form submission logic here
        setIsModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const closedWonContent = (
    <div>
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-0 border border-gray-300 rounded overflow-hidden">
          {/* Header Row */}
          <div className="px-3 py-2 bg-gray-100 border-r border-gray-300 font-medium text-xs text-gray-600">
            Description
          </div>
          <div className="px-3 py-2 bg-gray-100 border-r border-gray-300 font-medium text-xs text-gray-600">
            Deposit Date
          </div>
          <div className="px-3 py-2 bg-gray-100 font-medium text-xs text-gray-600">
            Deposit Amount ($)
          </div>

          {/* Data Row */}
          <div className="px-3 py-3 border-r border-gray-300 border-t ">
            <div className="font-medium text-sm mb-1">
              {leadData?.id || "MYH00492-I1"}
            </div>
            <div className="text-gray-500 text-xs">Initial Deposit</div>
          </div>
          <div className="px-3 py-3 border-r border-gray-300 border-t text-sm">
            {leadData?.depositDate || "27-07-2023"}
          </div>
          <div className="px-3 py-3 border-t border-gray-300 text-sm">
            {leadData?.initialDeposit || "5000.00"}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Quotations</label>
        <Alert
          message="Choose the final quotation to approve and close the sale. Remaining quotations will be cancelled automatically."
          type="warning"
          className="mb-4"
        />

        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="grid grid-cols-[40px_1fr_120px_120px] px-4 py-3 bg-gray-50 font-medium">
              <div></div>
              <div>Reference ID</div>
              <div>Cost</div>
              <div>Sketch Number</div>
            </div>
          </div>

          <div className="max-h-100 overflow-y-auto">
            {quotations?.length > 0 ? (
              quotations?.map((quotation, index) => (
                <div
                  key={quotation?.slugId}
                  className={`grid grid-cols-[40px_1fr_120px_120px] px-4 py-3 items-center ${
                    index < quotations.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <Radio
                    checked={selectedQuotation === quotation?.quotationId}
                    onChange={() =>
                      setSelectedQuotation(quotation?.quotationId)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <span>{quotation.slugId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        quotation?.leadStatus === "COMPLETED"
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}
                    >
                      {quotation?.leadStatus}
                    </span>
                  </div>
                  <div>
                    $
                    {quotation?.totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div>
                    <Input onChange={(e) => {}} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <IconFileText />
                <p className=" text-sm text-gray-500 text-center">
                  No quotations found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Create a quotation to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Notes</label>
        <Form.Item name="notes" className="m-0">
          <TextArea
            rows={4}
            placeholder="Add notes..."
            maxLength={1000}
            showCount
          />
        </Form.Item>
      </div>
    </div>
  );

  const closedLostContent = (
    <div>
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Lost Reason <span className="text-red-500">*</span>
        </label>
        <Form.Item
          name="lostReason"
          rules={[{ required: true, message: "Please select a lost reason" }]}
          className="m-0"
        >
          <Select placeholder="None" className="w-full">
            <Option value="lostToCompetitor">Lost to Competitor</Option>
            <Option value="noBudget">No Budget / Lost Funding</Option>
            <Option value="noDecision">No Decision / Non-Response</Option>
            <Option value="price">Price</Option>
            <Option value="other">Other</Option>
            <Option value="outsideOfBuildingZone">
              Outside of building zone
            </Option>
          </Select>
        </Form.Item>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Comments</label>
        <Form.Item name="comments" className="m-0">
          <TextArea
            rows={4}
            placeholder="Add comments..."
            maxLength={1000}
            showCount
          />
        </Form.Item>
      </div>

      <Alert
        message="Please Note: All pending tasks/appointments will be cancelled"
        type="error"
        className="mb-4"
      />
    </div>
  );

  const tabItems: TabsProps["items"] = [
    {
      key: "closedWon",
      label: "Closed Won",
      children: closedWonContent,
    },
    {
      key: "closedLost",
      label: "Closed Lost",
      children: closedLostContent,
    },
  ];

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      title="Close"
      width={800}
      footer={
        <div className="flex justify-between items-center">
          <Checkbox
            checked={sendEmailNotification}
            onChange={(e) => setSendEmailNotification(e.target.checked)}
          >
            Send an email notification to customer
          </Checkbox>
          <Space>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Stage</label>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            size="small"
          />
        </div>
      </Form>
    </Modal>
  );
};

export default CloseLeadModal;
