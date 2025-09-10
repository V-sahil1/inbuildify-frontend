"use client";
import { FC, useState } from "react";
import { Button, Switch, Upload, DatePicker, Select } from "antd";
const { Option } = Select;
import { IconUpload } from "@tabler/icons-react";
import { NoteDetails } from "data/types";
import dayjs from "dayjs";
import type { UploadProps } from "antd";
import type { UploadFile, UploadFileStatus } from "antd/es/upload/interface";

interface AddNotesCardProps {
    onSave: (note: NoteDetails) => void;
    onCancel: () => void;
    initialData?: NoteDetails;
}

const AddNotesCard: FC<AddNotesCardProps> = ({ onSave, onCancel, initialData }) => {
    const [description, setDescription] = useState(initialData?.message || "");
    const [sendToCustomer, setSendToCustomer] = useState(initialData?.sendToCustomer || false);
    const [createFollowUpTask, setCreateFollowUpTask] = useState(initialData?.createFollowUpTask || false);
    const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(
        initialData?.task?.dueDate ? dayjs(initialData.task.dueDate) : null
    );
    // const [title, setTitle] = useState(initialData?.title || "Note Added");
    const [fileList, setFileList] = useState<UploadFile[]>(
        initialData?.attachment ? initialData.attachment.map(file => ({ ...file, status: file.status as UploadFileStatus })) : []
    );
    const [tags, setTags] = useState<string[]>(initialData?.tags || ["Note"]);
    
    // Common tags that will be shown as options
    const commonTags = [
        'Important',
        'Follow Up',
        'Customer',
        'Internal',
        'Urgent',
        'Question',
        'Idea'
    ];

    const handleSave = () => {
        onSave({
            // title: title,
            message:description,
            tags,
            sendToCustomer,
            createFollowUpTask,
            attachment: fileList,
            ...(createFollowUpTask && dueDate && { task:{ dueDate: dueDate.format("YYYY-MM-DD") } }),
        });
    };

    const uploadProps: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList((prev) => [...prev, file]);
            return false;
        },
        fileList,
        multiple: true,
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Title Input */}
            {/* <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title"
                />
            </div> */}

            {/* Description */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type your notes"
                rows={4}
                className="w-full border rounded px-2 py-1 text-sm mb-3"
            />

            {/* Tags */}
            <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Tags</label>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Add tags"
                    value={tags}
                    onChange={setTags}
                    tokenSeparators={[',']}
                    className="w-full"
                >
                    {commonTags.map(tag => (
                        <Option key={tag} value={tag}>
                            {tag}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="flex gap-4">
                {/* File Upload */}
                <div className="flex-1">
                    <Upload {...uploadProps} listType="picture" maxCount={3}>
                        <Button icon={<IconUpload />}>
                            Attach Files
                        </Button>
                    </Upload>
                </div>

                {/* Switches */}
                <div className="flex flex-col gap-2 items-start flex-1">
                    <label className="flex items-center gap-2 text-sm">
                        <Switch checked={sendToCustomer} onChange={setSendToCustomer} />
                        Send this note to customer
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <Switch checked={createFollowUpTask} onChange={setCreateFollowUpTask} />
                        Create follow-up task
                    </label>
                    {createFollowUpTask && (
                        <>
                            <label className="flex items-center gap-2 text-sm">Due Date</label>
                            <DatePicker
                                required
                                value={dueDate}
                                onChange={(date) => setDueDate(date)}
                                className="w-full max-w-52"
                                placeholder="Select due date"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="primary" onClick={handleSave}>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default AddNotesCard;
