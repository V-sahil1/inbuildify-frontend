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
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
];

const assigneeOptions = [
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
];

const CreateTaskCard: FC<CreateTaskCardProps> = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState<TaskDetails>({
        task: {
            name: initialData?.task?.name || "",
            dueDate: initialData?.task?.dueDate || dayjs().format("YYYY-MM-DD"),
            time: initialData?.task?.time || dayjs().format("HH:mm"),
            priority: initialData?.task?.priority || "MEDIUM",
            description: initialData?.task?.description || "",
            assignee: initialData?.task?.assignee || "",
        },
        attachment: initialData?.attachment || [],
    });

    const handleTaskChange = (field: keyof TaskDetails['task'], value: any) => {
        setFormData(prev => ({
            ...prev,
            task: {
                ...prev.task,
                [field]: value
            }
        }));
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
                    value={formData.task.name}
                    onChange={(e) => handleTaskChange("name", e.target.value)}
                    placeholder="Task Name"
                />
            </div>

            {/* Due Date and Time */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                    <DatePicker
                        value={dayjs(formData.task.dueDate)}
                        onChange={(date) => handleTaskChange("dueDate", date?.format("YYYY-MM-DD") || "")}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Time</label>
                    <TimePicker
                        value={dayjs(formData.task.time, "HH:mm")}
                        onChange={(time) => handleTaskChange("time", time?.format("HH:mm") || "")}
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
                    value={formData.task.priority}
                    onChange={(value) => handleTaskChange("priority", value)}
                    placeholder="Select Priority"
                    className="w-full"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <Input.TextArea
                    value={formData.task.description}
                    onChange={(e) => handleTaskChange("description", e.target.value)}
                    placeholder="Task Description"
                    rows={3}
                />
            </div>

            {/* Assignee */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Assignee</label>
                <Select
                    options={assigneeOptions}
                    value={formData.task.assignee}
                    onChange={(value) => handleTaskChange("assignee", value)}
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
