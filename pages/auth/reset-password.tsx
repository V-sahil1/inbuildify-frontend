"use client";

import SystemRoutes from "@lib/constants/Routes";
import { Form, Input, message } from "antd";
import Link from "next/link";
import { auth_two_step } from "/public/images";
import { useState, useEffect } from "react";
import { IconEye, IconEyeOff, IconLoader } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { passwordRules } from "./sign-up";
import Image from "next/image";
import { ResetPasswordThunk } from "@redux/feature/auth/authThunk";
import { useAppDispatch } from "@hooks/redux";

export async function getStaticProps() {
    return {
        props: {
            isAuthRoute: true,
        },
    };
}

const ResetPassword = () => {
    const [form] = Form.useForm();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string>("");
    const dispatch = useAppDispatch()

    // useEffect(() => {
    //     const urlToken = searchParams.get('token');
    //     if (!urlToken) {
    //         message.error("Invalid or missing reset token");
    //         router.push(SystemRoutes.FORGOT_PASSWORD);
    //         return;
    //     }
    //     setToken(urlToken);
    // }, [searchParams, router]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        if (!token) {
            message.error("Invalid or expired token");
            return;
        }

        setLoading(true);
        try {
            const response = await dispatch(ResetPasswordThunk({ token, newPassword: values.newPassword })).unwrap();
            message.success(response.message);
            router.push(SystemRoutes.LOGIN);
        } catch (error: any) {
            console.error('Error resetting password:', error);
            message.error(error.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    // if (!token) {
    //     return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    // }

    return (
        <>
            <div className="flex justify-center sm:mb-6 mb-4">
                <Image src={auth_two_step} width={240} height={178} alt="forgot password" />
            </div>
            <div className="sm:mb-8 mb-6 text-center">
                <div className="sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2">
                    Reset Password
                </div>
                <span className="text-font-color-100 inline-block">
                    Enter your new password below.
                </span>
            </div>

            <Form
                layout="vertical"
                name="resetPassword"
                form={form}
                onFinish={onFinish}
                className="w-full"
                requiredMark={false}
            >
                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={passwordRules}
                >
                    <Input.Password
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        iconRender={(visible) =>
                            visible ?
                                <IconEyeOff onClick={togglePasswordVisibility} className="cursor-pointer" /> :
                                <IconEye onClick={togglePasswordVisibility} className="cursor-pointer" />
                        }
                    />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        iconRender={(visible) =>
                            visible ?
                                <IconEyeOff onClick={togglePasswordVisibility} className="cursor-pointer" /> :
                                <IconEye onClick={togglePasswordVisibility} className="cursor-pointer" />
                        }
                    />
                </Form.Item>

                <Form.Item>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-secondary large w-full uppercase"
                    >
                        {loading ? <IconLoader className="animate-spin" /> : "Reset Password"}
                    </button>
                </Form.Item>
            </Form>

            <div className="text-center sm:mt-30 mt-6 text-font-color-100">
                <p>Remember your password?</p>
                <Link href={SystemRoutes.LOGIN} className="text-primary">
                    Sign in here
                </Link>
            </div>
        </>
    );
};

export default ResetPassword;
