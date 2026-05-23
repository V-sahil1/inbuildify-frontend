'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Form, Input, message } from 'antd';
import { useRef } from 'react';
import { auth_two_step } from '/public/images';
import { useRouter, useSearchParams } from 'next/navigation';
import { ResendOtpThunk, VerifyEmailThunk } from '@redux/feature/auth/authThunk';
import { useAppDispatch } from '@hooks/redux';

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: true,
    },
  };
}

export default function VerifyEmail() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');

    if (!pasteData) return;
    const values: Record<string, string> = {};
    pasteData
      .split('')
      .slice(0, 6)
      .forEach((char, idx) => {
        values[`otp-${idx}`] = char;
      });

    form.setFieldsValue(values);
    if (pasteData.length >= 6) {
      inputsRef.current[5]?.focus();
    } else {
      inputsRef.current[pasteData.length]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/^\d?$/.test(value)) {
      form.setFieldsValue({ [`otp-${index}`]: value });

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      form.setFieldsValue({ [`otp-${index}`]: '' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Backspace') {
      const currentValue = form.getFieldValue(`otp-${index}`);
      if (!currentValue && index > 0) {
        form.setFieldsValue({ [`otp-${index - 1}`]: '' });
        inputsRef.current[index - 1]?.focus();
      } else if (currentValue) {
        form.setFieldsValue({ [`otp-${index}`]: '' });
      }
    } else if (/^\d$/.test(e.key)) {
      form.setFieldsValue({ [`otp-${index}`]: e.key });
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    } else if (
      ![
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'Delete',
        'Backspace',
        'Home',
        'End',
        'Ctrl',
        'v',
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const getOtpString = (values: Record<string, string>) => {
    const otp = [];
    for (let i = 0; i < 6; i++) {
      const digit = values[`otp-${i}`];
      if (!digit || !/^\d$/.test(digit)) {
        return null;
      }
      otp.push(digit);
    }
    return otp.join('');
  };

  const onFinish = async (values: Record<string, string>) => {
    const otp = getOtpString(values);
    if (!otp) {
      message.error('Please enter the complete 6-digit code.');
      return;
    }
    try {
      await dispatch(VerifyEmailThunk({ otp: otp, email })).unwrap();
      message.success('Verification successful! OTP');
      router.push('/onboarding');
    } catch (error) {
      message.error(error || 'Failed to verify OTP');
    }
  };

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await dispatch(ResendOtpThunk({ email })).unwrap();
      message.success('A new verification code has been sent to your email.');
      form.resetFields();
    } catch (error) {
      message.error(error || 'Failed to resend OTP');
    }
  };

  return (
    <>
      <div className="flex justify-center sm:mb-6 mb-4">
        <Image src={auth_two_step} width={240} height={178} alt="forgot password" />
      </div>
      <p className="sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2 text-center">
        2-step Verification
      </p>
      <p className="text-center sm:mb-12 mb-6 text-font-color-100">
        We sent a verification code to your email. Enter the code from the email in the field below.
      </p>
      <Form form={form} onFinish={onFinish} className="w-full" autoComplete="off">
        <div className="flex gap-3 justify-center mb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Form.Item
              key={index}
              name={`otp-${index}`}
              rules={[{ required: true, message: '' }]}
              className="!mb-0"
            >
              <Input
                ref={(el: any) => (inputsRef.current[index] = el)}
                maxLength={1}
                onChange={e => handleChange(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={e => e.target.select()}
                className="!w-12 !h-12 text-center text-lg"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
                tabIndex={index + 1}
              />
            </Form.Item>
          ))}
        </div>
        <button type="submit" className="btn btn-secondary large w-full uppercase">
          Verify my account
        </button>
      </Form>
      <div className="text-center sm:mt-30 mt-6 text-font-color-100">
        <p>Haven&apos;t received it?</p>
        <Link href="#" className="text-primary" onClick={handleResend}>
          Resend a new code.
        </Link>
      </div>
    </>
  );
}
