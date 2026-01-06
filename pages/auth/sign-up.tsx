'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { Form, Input, Checkbox, Select, message } from 'antd';
import SystemRoutes from '@lib/constants/Routes';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RegisterUser } from '@redux/feature/auth/IAuthState';
import { Status } from '@lib/constants/enum';
import { fetchRole } from '@redux/feature/admin/role/roleThunk';
import { SignUpThunk } from '@redux/feature/auth/authThunk';
import { useRouter } from 'next/navigation';

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: true,
    },
  };
}

const passwordRules = [
  { required: true, message: 'Password is required' },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();

      const hasMinLength = value.length >= 8;
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[^A-Za-z0-9.]/.test(value); // exclude dot
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);

      if (!hasMinLength) {
        return Promise.reject('Password must be at least 8 characters long');
      }
      if (!hasNumber) {
        return Promise.reject('Password must contain at least one number');
      }
      if (!hasSpecial) {
        return Promise.reject("Password must contain at least one special symbol (not '.')");
      }
      if (!hasUpper) {
        return Promise.reject('Password must contain an uppercase letter');
      }
      if (!hasLower) {
        return Promise.reject('Password must contain a lowercase letter');
      }

      return Promise.resolve();
    },
  },
];

export default function Signup() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const { role, status } = useAppSelector(state => state.role);
  const roleOptions = role.map(item => ({
    label: item.name,
    value: item.roleId,
  }));
  const fetchRoleData = async () => {
    try {
      await dispatch(fetchRole()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch role');
    }
  };
  useEffect(() => {
    if (status === Status.IDLE) {
      fetchRoleData();
    }
  }, [status]);
  const onFinish = async (values: RegisterUser) => {
    await form.validateFields();
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        roleId: values.roleId,
      };
      await dispatch(SignUpThunk(payload)).unwrap();
      message.success('Verification email has been sent to your email');
      form.resetFields();
      router.push(SystemRoutes.LOGIN);
    } catch (error) {
      message.error(error || 'Failed to sign up');
    }
  };

  return (
    <>
      <div className="sm:mb-8 mb-6 text-center">
        <div className="sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2">
          Create Account
        </div>
        <span className="text-font-color-100 inline-block">Free access to our dashboard.</span>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="signup-form">
        <div className="w-full flex gap-15">
          <Form.Item
            label="Name"
            name="name"
            className="form-control w-full"
            rules={[{ required: true, message: 'Firstname is required' }]}
          >
            <Input placeholder="John" className="form-input" />
          </Form.Item>

          {/* <Form.Item
            label="Lastname"
            name="lastName"
            className="form-control w-full"
            rules={[{ required: true, message: "Lastname is required" }]}
          >
            <Input placeholder="Parker" className="form-input" />
          </Form.Item> */}
        </div>

        <Form.Item
          label="Email"
          name="email"
          className="form-control mb-15"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email address' },
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
          <Input.Password placeholder="8+ characters required" className="form-input" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          className="form-control mb-15"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Confirm Password is required' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Passwords do not match');
              },
            }),
          ]}
        >
          <Input.Password placeholder="8+ characters required" className="form-input" />
        </Form.Item>
        <Form.Item label="Role" name="roleId">
          <Select options={roleOptions} />
        </Form.Item>
        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject('You must accept Terms and Conditions'),
            },
          ]}
        >
          <Checkbox className="form-check-input">
            I accept the{' '}
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

      <div className="text-center sm:mt-30 mt-6 text-font-color-100">
        <p>Already have an account?</p>
        <Link href={SystemRoutes.LOGIN} className="text-primary">
          Sign in here
        </Link>
      </div>
    </>
  );
}
