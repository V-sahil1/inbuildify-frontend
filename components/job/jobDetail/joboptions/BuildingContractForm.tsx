import React from "react";
import {
  Form,
  Typography,
  Input,
  Radio,
  Space,
  Divider,
  Card,
} from "antd";
import { IconAlertTriangle } from "@tabler/icons-react";
import { CONTRACT_QUESTIONS, Question } from "data/buildingcontractData";
const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

interface QuestionRendererProps {
  question: Question;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question }) => {
  if (question.type === "paragraph" && question.warning) {
    return (
      <Card
        className="my-6"
        style={{ backgroundColor: "#fffbe6", borderColor: "#ffe58f" }}
      >
        <Space>
          <IconAlertTriangle />
          <Paragraph className="!mb-0 text-gray-800">
            {question.warning}
          </Paragraph>
        </Space>
      </Card>
    );
  }

  if (question.type === "paragraph" && question.label) {
    return (
      <Title level={5} className="!mt-8 !mb-2 text-gray-700 uppercase">
        {question.label}
      </Title>
    );
  }

  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <Form.Item
        name={question.name}
        className="!mb-0"
        colon={false}
        rules={[
          {
            required: question.type === "radio",
            message: "Please select an option.",
          },
        ]}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <Text className="block text-gray-800" style={{ lineHeight: "1.4" }}>
              {question.label}
            </Text>
            {question.note && (
              <Paragraph className="!mb-0 text-xs text-gray-500 italic mt-1">
                {question.note}
              </Paragraph>
            )}
          </div>

          <div
            className="flex-shrink-0"
            style={{ width: question.type === "radio" ? "auto" : "200px" }}
          >
            {question.type === "radio" && (
              <Radio.Group className="flex space-x-4">
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            )}
            {question.type === "input" && (
              <Input
                placeholder={question.placeholder}
                style={{ width: "100%" }}
              />
            )}
            {question.type === "textArea" && (
              <TextArea rows={3} placeholder={question.placeholder} />
            )}
          </div>
        </div>
      </Form.Item>
    </div>
  );
};

export default function ChecklistForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    console.log("Form Submitted successfully!");
  };

  const handleSelectAll = (value: "yes" | "no") => {
    const updates = {};
    CONTRACT_QUESTIONS.forEach((q) => {
      if (q.type === "radio" && q.name) {
        updates[q.name] = value;
      }
    });

    // Set all values at once
    form.setFieldsValue(updates);

    // Force a re-render of the form
    form.validateFields();
  };

  return (
    <div className="min-h-screen">
      <Form
        form={form}
        name="contract_checklist"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          q1_insurance: "yes",
          q2_finance_approval: "yes",
          q18_guide_date: "10/05/2025",
        }}
      >
        <Card className="p-0 border-none shadow-none">
          {CONTRACT_QUESTIONS.map((q) => {
            if (q.id === "header_1") {
              return (
                <div key={q.id}>
                  <Title
                    level={5}
                    className="!mt-8 !mb-2 text-gray-700 uppercase"
                  >
                    {q.label}
                    <span className="float-right text-sm font-normal">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectAll("yes");
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Select All
                      </a>
                      {" / "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectAll("no");
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Select None
                      </a>
                    </span>
                  </Title>
                </div>
              );
            }
            return <QuestionRenderer key={q.id} question={q} />;
          })}
        </Card>

        <Divider className="!my-6" />
      </Form>
    </div>
  );
}
