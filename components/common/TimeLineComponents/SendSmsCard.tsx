"use client";
import { FC, useState } from "react";
import { Button, Input, Select } from "antd";
import { SmsDetails } from "data/types";

interface SendSmsCardProps {
    onSave: (sms: SmsDetails) => void;
    onCancel: () => void;
    initialData?: SmsDetails;
}

const recipientOptions = [
    { label: "Customer A", value: "Customer A" },
    { label: "Customer B", value: "Customer B" },
];

const SendSmsCard: FC<SendSmsCardProps> = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState<SmsDetails>({
        message: initialData?.message || "",
        recipient: initialData?.recipient || "",
    });

    const handleChange = (field: keyof SmsDetails, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Recipient */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Recipient</label>
                <Select
                    options={recipientOptions}
                    value={formData.recipient}
                    onChange={(value) => handleChange("recipient", value)}
                    placeholder="Select Recipient"
                    className="w-full"
                />
            </div>

            {/* Message */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Message</label>
                <Input.TextArea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Type your SMS message"
                    rows={4}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="primary" onClick={handleSave}>
                    Send SMS
                </Button>
            </div>
        </div>
    );
};

export default SendSmsCard;
