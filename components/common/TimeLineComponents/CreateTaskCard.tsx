"use client";
import { FC, useState } from "react";
import { Button, DatePicker, TimePicker, Input, Select, Switch, Upload } from "antd";
import dayjs from "dayjs";
import { IconUpload } from "@tabler/icons-react";
import { TaskDetails } from "data/types";

interface CreateTaskCardProps {
    onSave: (task: TaskDetails) => void;
    onCancel: () => void;
    initialData?: TaskDetails;
}

const priorityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
];

const assigneeOptions = [
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
];

const CreateTaskCard: FC<CreateTaskCardProps> = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState<TaskDetails>({
        name: initialData?.name || "",
        dueDate: initialData?.dueDate || dayjs().format("YYYY-MM-DD"),
        time: initialData?.time || dayjs().format("HH:mm"),
        priority: initialData?.priority || "Medium",
        description: initialData?.description || "",
        assignee: initialData?.assignee || "",
        files: initialData?.files || [],
    });

    const handleChange = (field: keyof TaskDetails, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Name */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Task Name</label>
                <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Task Name"
                />
            </div>

            {/* Due Date and Time */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                    <DatePicker
                        value={dayjs(formData.dueDate)}
                        onChange={(date, dateString) => handleChange("dueDate", dateString)}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Time</label>
                    <TimePicker
                        value={dayjs(formData.time, "HH:mm")}
                        onChange={(time, timeString) => handleChange("time", timeString)}
                        format="HH:mm"
                        className="w-full"
                    />
                </div>
            </div>

            {/* Priority */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Priority</label>
                <Select
                    options={priorityOptions}
                    value={formData.priority}
                    onChange={(value) => handleChange("priority", value)}
                    placeholder="Select Priority"
                    className="w-full"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <Input.TextArea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Task Description"
                    rows={3}
                />
            </div>

            {/* Assignee */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Assignee</label>
                <Select
                    options={assigneeOptions}
                    value={formData.assignee}
                    onChange={(value) => handleChange("assignee", value)}
                    placeholder="Select Assignee"
                    className="w-full"
                />
            </div>

            <div className="flex justify-between items-end gap-3">
                {/* File Upload */}
                <Upload>
                    <Button icon={<IconUpload />}>Attach Files</Button>
                </Upload>

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

export default CreateTaskCard;
