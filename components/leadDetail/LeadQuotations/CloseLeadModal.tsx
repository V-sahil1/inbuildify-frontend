import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Radio, Select, Alert, message } from 'antd';
import type { TabsProps } from 'antd';
import { Quotation, QuotationResponse } from '@redux/feature/quotation/IQuotationState';
import { IconFileText } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { convertLeadToJobThunk } from '@redux/feature/lead/leadThunk';
import { useAppDispatch } from '@hooks/redux';
import { enumToReadable } from '@lib/utils/enumToRedable';
import SystemRoutes from '@lib/constants/Routes';

const { TextArea } = Input;
const { Option } = Select;

interface CloseLeadModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  leadData?: any;
  active?: string;
  quotations?: Quotation[];
}

const CloseLeadModal: React.FC<CloseLeadModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  leadData,
  active,
  quotations,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>(active || 'WON');
  const [selectedQuotation, setSelectedQuotation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const [sendEmailNotification, setSendEmailNotification] =
  //   useState<boolean>(true);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    form.resetFields();
  };

  const handleSave = async values => {
    await form.validateFields();
    if (activeTab === 'WON') {
      try {
        setLoading(true);
        const response = await dispatch(
          convertLeadToJobThunk({
            leadId: leadData?.leadId,
            message: values.message,
            quotation_version_id: selectedQuotation,
            status: 'WON',
          })
        ).unwrap();
        message.success(response?.response?.message);
        form.resetFields();
        router.push(`${SystemRoutes.JOB}/${leadData?.leadId}`);
        setIsModalOpen(false);
      } catch (err) {
        message.error(err);
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'LOST') {
      try {
        setLoading(true);
        const response = await dispatch(
          convertLeadToJobThunk({
            leadId: leadData?.leadId,
            message: values.message,
            status: 'LOST',
          })
        ).unwrap();
        form.resetFields();
        message.success('Lead mark as lost successfully');
        router.push(`/leads`);
        setIsModalOpen(false);
      } catch (err) {
        message.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const closedWonContent = (
    <div>
      <div className="mb-6">
        <label className="block mb-2 font-medium">Quotations</label>
        <Alert
          message="Choose the final quotation to approve and close the sale. Remaining quotations will be cancelled automatically."
          type="warning"
          className="mb-4"
        />
        <div className="border border-gray-300 rounded-md overflow-hidden w-full">
          <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200">
            <div className="flex items-center lg:gap-56 max-[1024px]:gap-44 max-[620px]:gap-24 gap-7 p-2 font-medium ml-11 mr-11 ">
              <div>Reference ID</div>
              <div>Status</div>
              <div>Cost</div>
              {/* <div>Sketch Number</div> */}
            </div>
          </div>

          <div className="max-h-full overflow-y-auto">
            {quotations?.length > 0 ? (
              <>
                <Form.Item
                  name="quotationId"
                  rules={[
                    {
                      required: activeTab === 'WON',
                      message: 'Please select a quotation',
                    },
                  ]}
                  className="m-0"
                >
                  <Radio.Group
                    onChange={e => setSelectedQuotation(e.target.value)}
                    value={selectedQuotation}
                  >
                    {quotations?.map((quotation, index) => {
                      return (
                        <Radio
                          key={index}
                          className="flex items-center ml-10 p-2  font-medium"
                          value={(quotation?.versions[0] as any)?.quotationVersionId}
                        >
                          <div
                            key={quotation?.referenceNumber}
                            className={`py-2 items-center ${index < quotations.length - 1 ? 'border-b border-gray-100 ' : ''}`}
                          >
                            <div className="flex items-center justify-between lg:gap-48 max-[1024px]:gap-36 max-[620px]:gap-16 gap-7  ">
                              <div className="ml-2">
                                {quotation.referenceNumber} (V
                                {(quotation?.versions[0] as any)?.versionNumber})
                              </div>
                              <div
                                // className={`px-2 py-0.5 rounded text-xs font-medium ${quotation?. === 'COMPLETED' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}
                              >
                                {/* {quotation?.leadStatus} */}
                              </div>
                              <div>
                                $
                                {quotation?.totalAmount?.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                          </div>
                        </Radio>
                      );
                    })}
                  </Radio.Group>
                </Form.Item>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <IconFileText />
                <p className=" text-sm text-gray-500 text-center">No quotations found</p>
                <p className="text-xs text-gray-400 mt-1">Create a quotation to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Notes</label>
        <Form.Item name="message" className="m-0" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Add notes..." maxLength={1000} showCount />
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
          rules={[{ required: true, message: 'Please select a lost reason' }]}
          className="m-0"
        >
          <Select placeholder="None" className="w-full">
            <Option value="lostToCompetitor">Lost to Competitor</Option>
            <Option value="noBudget">No Budget / Lost Funding</Option>
            <Option value="noDecision">No Decision / Non-Response</Option>
            <Option value="price">Price</Option>
            <Option value="other">Other</Option>
            <Option value="outsideOfBuildingZone">Outside of building zone</Option>
          </Select>
        </Form.Item>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Comments</label>
        <Form.Item
          name="message"
          className="m-0"
          rules={[{ required: true, message: 'Please add a comment' }]}
        >
          <TextArea rows={4} placeholder="Add comments..." maxLength={1000} showCount />
        </Form.Item>
      </div>

      <Alert
        message="Please Note: All pending tasks/appointments will be cancelled"
        type="error"
        className="mb-4"
      />
    </div>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'WON',
      label: 'Won',
      children: closedWonContent,
    },
    {
      key: 'LOST',
      label: 'Lost',
      children: closedLostContent,
    },
  ];

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      title={`Close as ${enumToReadable(activeTab)}`}
      width={800}
      confirmLoading={loading}
      onOk={() => form.submit()}
      okText="Save"
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <div className="mb-4">
          {/* <label className="block mb-2 font-medium">Stage</label> */}
          <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} size="small" />
        </div>
      </Form>
    </Modal>
  );
};

export default CloseLeadModal;
