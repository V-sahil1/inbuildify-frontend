"use client";

import { Form, Input, message } from "antd";
import { IconLoader } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { passwordRules } from "./sign-up";
import { useAppDispatch } from "@hooks/redux";
import { AcceptInviteThunk } from "@redux/feature/user/userThunk";

export async function getStaticProps() {
    return {
        props: {
            isAuthRoute: true,
        },
    };
}

export default function AcceptInvite() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();


   
    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const response = await dispatch(AcceptInviteThunk({
                ...values,
                token: searchParams.get('token')
            })).unwrap();

            message.success(response.message || 'Invitation accepted successfully!');
            // router.push("/");
        } catch (error: any) {
            message.error(error );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="sm:mb-8 mb-6 text-center">
                <div className="sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-2">
                    Accept Invitation
                </div>
                <span className="text-font-color-100 inline-block">
                    Set up your password to complete your account setup.
                </span>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="form-control"
            >
                <Form.Item
                    label="Full Name"
                    name="name"
                    className="form-control mb-15"
                    rules={[{ required: true, message: "Full name is required" }]}
                >
                    <Input placeholder="John Doe" className="form-input" />
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

                <button
                    type="submit"
                    className="btn btn-secondary large w-full uppercase"
                    disabled={loading}
                >
                    {loading ? <IconLoader /> : "Accept Invitation"}
                </button>

            </Form>

            <div className="text-center sm:mt-30 mt-6 text-font-color-100">
                <p>Already have an account?</p>
                <Link href="/login" className="text-primary">
                    Sign in here
                </Link>
            </div>
        </>
    );
}