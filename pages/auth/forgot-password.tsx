import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Form, Input, message } from "antd";
import { IconLoader } from "@tabler/icons-react";
import { auth_forgot_password } from "/public/images";
import { ForgetPasswordThunk } from "@redux/feature/auth/authThunk";
import { useAppDispatch } from "@hooks/redux";
import SystemRoutes from "@lib/constants/Routes";

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: true,
    },
  };
}

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  const handleForgetPassword = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response = await dispatch(ForgetPasswordThunk(values)).unwrap();
      message.success(response.message);
      router.push(SystemRoutes.LOGIN);
    } catch (error: any) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-center sm:mb-6 mb-4">
        <Image
          src={auth_forgot_password}
          width="240"
          height="178"
          alt="forgot password"
        />
      </div>
      <p className="sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2 text-center">
        Forgot password?
      </p>
      <p className="text-center sm:mb-12 mb-6 text-font-color-100">
        Enter the email address you used when you joined and we'll send you
        instructions to reset your password.
      </p>
      <Form
        layout="vertical"
        name="signin"
        form={form}
        onFinish={handleForgetPassword}
        className="w-full"
        requiredMark={false}
      >
        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Enter a valid email!" },
          ]}
        >
          <Input placeholder="name@example.com" />
        </Form.Item>

        {/* Submit button */}
        <Form.Item>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-secondary large w-full uppercase"
          >
            {loading ? <IconLoader /> : ""}
            forgot password
          </button>
        </Form.Item>
      </Form>
      <div className="text-center sm:mt-30 mt-6">
        <Link href="/auth/sign-in" className="text-primary">
          Back to Sign in
        </Link>
      </div>
    </>
  );
}
