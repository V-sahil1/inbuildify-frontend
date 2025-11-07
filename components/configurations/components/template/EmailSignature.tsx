'use client';

import React, { useState } from 'react';
import { Button, Select, message } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import RichTextEditor from '@/components/common/rich-text-editor/RichTextEditor';
import { personalizationList } from "data/configuration/TemplateData";

const { Option } = Select;

const EmailSignatureSettings = () => {
    const [formState, setFormState] = useState({
        includeSignature: true,
        signatureContent: `<p>Regards</p><p>[Designation] | [LoggedInUserName]</p>`
    });

    const [showConfirm, setShowConfirm] = useState(false);

    const updateField = (key: string, value: any) => {
        setFormState(prev => ({ ...prev, [key]: value }));
    };

    const insertTag = (tag: string) => {
        updateField('signatureContent', formState.signatureContent + ` [${tag}]`);
    };

    const handleSave = () => {
        console.log("✅ Saved Email Signature Settings:", formState);
        message.success("Email signature settings saved successfully");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">

            <InputSwitch
                name="includeSignature"
                label="Include Email Signature"
                description={
                    <div>
                        <p>
                            When turned ON, the system automatically adds the configured email signature 
                            to all customizable emails.<br />
                            When turned OFF, customizable emails are sent without an email signature.
                        </p>
                    </div>
                }
            />

            {formState.includeSignature && (
                <div className="space-y-2 mt-4">

                    <div className="flex justify-end">
                        <Select
                            placeholder="Insert Personalization"
                            style={{ width: 230 }}
                            size="small"
                            onSelect={insertTag}
                        >
                            {personalizationList.map(item => (
                                <Option key={item} value={item}>{item}</Option>
                            ))}
                        </Select>
                    </div>

                    <RichTextEditor
                        value={formState.signatureContent}
                        onChange={(val: string) => updateField("signatureContent", val)}
                        maxHeight="280px"
                        placeholder="Write your email signature..."
                    />
                </div>
            )}

            <div className="flex justify-end gap-3 pt-3">
                <Button type="primary" onClick={() => setShowConfirm(true)}>
                    Save
                </Button>
            </div>

            <ConfirmationContentModal
                title="Confirm Save"
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                onSubmit={() => {
                    handleSave();
                    setShowConfirm(false);
                }}
                okText="Yes"
                cancelText="No"
                content={<p>Are you sure you want to update this email signature?</p>}
            />
        </div>
    );
};

export default EmailSignatureSettings;
