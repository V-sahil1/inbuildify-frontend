"use client";

import Link from "next/link";
import React from "react";
import { Form, Input, Checkbox } from "antd";
import SystemRoutes from "@lib/constants/Routes";
import { passwordRules } from "@lib/constants/formInputValidations";
// import { useAppDispatch } from "@hooks/redux";
// import { SignUpThunk } from "@redux/feature/auth/authThunk";

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: true,
    },
  };
}

export default function Signup() {
  const [form] = Form.useForm();
  // const dispatch = useAppDispatch();

  const onFinish = () => {
    form.validateFields().then((values) => {
      // try {
      //   dispatch(SignUpThunk(values)).unwrap();
      // } catch (error) {
      //   console.log(error);
      // }
    });
  };

  return (
    <>
      <div className="sm:mb-8 mb-6 text-center">
        <div className="sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2">
          Create Account
        </div>
        <span className="text-font-color-100 inline-block">
          Free access to our dashboard.
        </span>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="signup-form"
      >
        <div className="w-full flex gap-15">
          <Form.Item
            label="Firstname"
            name="firstName"
            className="form-control w-full"
            rules={[{ required: true, message: "Firstname is required" }]}
          >
            <Input placeholder="John" className="form-input" />
          </Form.Item>

          <Form.Item
            label="Lastname"
            name="lastName"
            className="form-control w-full"
            rules={[{ required: true, message: "Lastname is required" }]}
          >
            <Input placeholder="Parker" className="form-input" />
          </Form.Item>
        </div>

        <Form.Item
          label="Email"
          name="email"
          className="form-control mb-15"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email address" },
          ]}
        >
          <Input placeholder="name@example.com" className="form-input" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          className="form-control mb-15"
          rules={passwordRules}
        >
          <Input.Password
            placeholder="8+ characters required"
            className="form-input"
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          className="form-control mb-15"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Confirm Password is required" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="8+ characters required"
            className="form-input"
          />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject("You must accept Terms and Conditions"),
            },
          ]}
        >
          <Checkbox className="form-check-input">
            I accept the{" "}
            <Link href="/" className="text-primary">
              Terms and Conditions
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <button type="submit" className="btn btn-secondary large w-full uppercase">
            Sign Up
          </button>
        </Form.Item>
      </Form>

      {/* <div className="text-center sm:mt-30 mt-6 text-font-color-100">
        <p>Already have an account?</p>
        <Link href={SystemRoutes.LOGIN} className="text-primary">
          Sign in here
        </Link>
      </div> */}
    </>
  );
}
