"use client";

import { useState } from "react";
import { Card, Form, Input, Button, Typography, Alert } from "antd";

const { Text, Paragraph } = Typography;

export const Configuration = () => {
  const [configuredEmail, setConfiguredEmail] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFinish = (values: { email: string; password: string }) => {
    setConfiguredEmail(values.email);
    setIsEditing(false);
    // TODO: call backend API to save/update
    // console.log("Saved config:", values);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>

      {!configuredEmail && !isEditing && (
        <Card>
          <Alert
            message="No email configured"
            description="You have not added any email yet. Configure your email to send messages directly from your account."
            type="info"
            showIcon
          />
          <Button
            type="primary"
            className="mt-4"
            onClick={() => setIsEditing(true)}
          >
            Add Email Configuration
          </Button>
        </Card>
      )}

      {configuredEmail && !isEditing && (
        <Card>
          <Paragraph>
            <Text strong>Configured Email:</Text> {configuredEmail}
          </Paragraph>
          <Paragraph type="secondary">
            Your emails will be sent using this configuration.
          </Paragraph>
          <Button type="link" onClick={() => setIsEditing(true)}>
            Edit Configuration
          </Button>
        </Card>
      )}

      {isEditing && (
        <Card>
          <Form layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
              initialValue={configuredEmail || ""}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password / App Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Enter your email password or app password" />
            </Form.Item>

            <div className="flex gap-2">
              <Button type="primary" htmlType="submit">
                {configuredEmail ? "Update" : "Save"}
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default Configuration;
