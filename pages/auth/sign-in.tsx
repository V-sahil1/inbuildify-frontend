'use client';
import React, { useState } from 'react';
import { Form, Input, Divider, message } from 'antd';
import { IconBrandGoogleFilled, IconEye, IconEyeOff, IconLoader } from '@tabler/icons-react';
import Link from 'next/link';
import SystemRoutes from '@lib/constants/Routes';
import { useAppDispatch } from '@hooks/redux';
import { getUserThunk, SignInThunk } from '@redux/feature/auth/authThunk';
import { useRouter } from 'next/navigation';

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: true,
    },
  };
}

export default function Signin() {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await dispatch(SignInThunk(values)).unwrap();
      await dispatch(getUserThunk()).unwrap();
      message.success(response.message);
      router.push('/');
    } catch (error: any) {
      message.error(error || 'sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sm:mb-8 mb-6 text-center">
        <div className="sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2">Sign In</div>
        <span className="text-font-color-100 inline-block">Free access to our dashboard.</span>
      </div>
      <div className="sm:mb-6 mb-4 text-center">
        <button className="btn btn-white !border-border-color">
          <IconBrandGoogleFilled className="fill-font-color-100" />
          Sign in with Google
        </button>
        <Divider>OR</Divider>
      </div>

      <Form
        layout="vertical"
        name="signin"
        form={form}
        onFinish={onFinish}
        className="w-full"
        requiredMark={false}
      >
        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Enter a valid email!' },
          ]}
        >
          <Input placeholder="name@example.com" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter the password"
            suffix={
              <span
                onClick={togglePasswordVisibility}
                className="cursor-pointer text-font-color-100"
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </span>
            }
          />
        </Form.Item>

        {/* Remember + Forgot password */}
        <div className="flex items-center justify-between mb-6">
          {/* <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
          <Link
            href={SystemRoutes.FORGOT_PASSWORD}
            className="text-primary sm:text-[16px]/[24px] text-[14px]/[20px]"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit button */}
        <Form.Item>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-secondary large w-full uppercase"
          >
            {loading ? <IconLoader /> : ''}
            Sign In
          </button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="text-center sm:mt-30 mt-6 text-font-color-100">
        {/* <p>Don't have an account?</p> */}
        {/* <Link href={SystemRoutes.SIGNUP} className="text-primary">
          Sign up here
        </Link> */}
      </div>
    </>
  );
}
