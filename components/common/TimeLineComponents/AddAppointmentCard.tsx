"use client";
import { FC, useState } from "react";
import { Button, DatePicker, TimePicker, Input, Select, Switch } from "antd";
import dayjs from "dayjs";
import { AppointmentDetails } from "data/types";

interface AddAppointmentCardProps {
    onSave: (appointment: AppointmentDetails) => void;
    onCancel: () => void;
    initialData?: AppointmentDetails;
}

const userOptions = [
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
];

const AddAppointmentCard: FC<AddAppointmentCardProps> = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState<AppointmentDetails>({
        title: initialData?.title || "",
        date: initialData?.date || dayjs().format("YYYY-MM-DD"),
        startTime: initialData?.startTime || dayjs().format("HH:mm"),
        endTime: initialData?.endTime || dayjs().add(1, "hour").format("HH:mm"),
        location: initialData?.location || "",
        user: initialData?.user || "",
        notes: initialData?.notes || "",
        sendToCustomer: initialData?.sendToCustomer || false,
    });

    const handleChange = (field: keyof AppointmentDetails, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Title */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <Input
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Appointment Title"
                />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                    <TimePicker
                        value={dayjs(formData.startTime, "HH:mm")}
                        onChange={(time, timeString) => handleChange("startTime", timeString)}
                        format="HH:mm"
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">End Time</label>
                    <TimePicker
                        value={dayjs(formData.endTime, "HH:mm")}
                        onChange={(time, timeString) => handleChange("endTime", timeString)}
                        format="HH:mm"
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <DatePicker
                        value={dayjs(formData.date)}
                        onChange={(date, dateString) => handleChange("date", dateString)}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Location</label>
                    <Input
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="Location"
                    />
                </div>
            </div>

            {/* User */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">User</label>
                <Select
                    options={userOptions}
                    value={formData.user}
                    onChange={(value) => handleChange("user", value)}
                    placeholder="Select User"
                    className="w-full"
                />
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Notes</label>
                <Input.TextArea
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Additional notes"
                    rows={3}
                />
            </div>

            {/* Send to Customer Switch */}
            <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm">
                    <Switch
                        checked={formData.sendToCustomer}
                        onChange={(checked) => handleChange("sendToCustomer", checked)}
                    />
                    Send this appointment to customer
                </label>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddAppointmentCard;
