'use client';
import { FC, useEffect } from 'react';
import { Button, Switch, Upload, DatePicker, Select, Input, Form } from 'antd';
const { Option } = Select;
import { IconUpload } from '@tabler/icons-react';
import { NoteDetails } from 'data/types';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getActionTags } from '@redux/feature/action/actionThunk';
import { Status } from '@lib/constants/enum';
import { descriptionRules, dueDateRules, taskNameRules } from '@lib/constants/formInputValidations';
import { disablePastDates } from '@lib/utils/getDisabledTimeDate';
import dayjs from 'dayjs';

interface AddNotesCardProps {
  onSave: (note: NoteDetails) => void;
  loading: boolean;
  onCancel: () => void;
  initialData?: NoteDetails;
}

const AddNotesCard: FC<AddNotesCardProps> = ({ onSave, loading, onCancel, initialData }) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const dispatch = useAppDispatch();
  const { tags, tagStatus } = useAppSelector(state => state.action);
  async function getTags() {
    try {
      await dispatch(getActionTags());
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (tagStatus === Status.IDLE) {
      getTags();
    }
  }, [tagStatus]);

  const handleSave = async values => {
    await form.validateFields();
    values.type = 'NOTES';
    if (initialData) {
      values.actionId = initialData.actionId;
      values.action_type_id = initialData?.notesId;
    }
    if (values.task?.name) {
      values.task = {
        ...values.task,
        priority: 'HIGH',
        due_date: values.task?.due_date?.format('YYYY-MM-DD'),
      };
    }
    values.attachment = values?.attachment ? values?.attachment[0]?.originFileObj : null;
    onSave(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSave}
      initialValues={{
        sendToCustomer: false,
        createFollowUpTask: false,
      }}
    >
      {/* Description */}
      <Form.Item
        label="Notes"
        name="message"
        rules={descriptionRules}
        initialValue={initialData?.message}
      >
        <TextArea rows={4} placeholder="Type your notes" className="!resize-none" />
      </Form.Item>

      {/* Tags */}
      <Form.Item label="Tags" name="tags" initialValue={initialData?.tags?.map(t => t.name) ?? []}>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Add tags"
          tokenSeparators={[',']}
        >
          {tags?.map((tag, idx) => (
            <Option key={idx} value={tag.name}>
              {tag.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <div className="flex gap-4">
        <Form.Item
          label="Attach Files"
          name="attachment"
          className="flex-1 max-w-[500px]"
          valuePropName="fileList"
          getValueFromEvent={e => e.fileList}
          initialValue={
            initialData?.attachment
              ? [
                  {
                    uid: '-1',
                    name: 'attachment.jpg',
                    status: 'done',
                    url: initialData?.attachment,
                  },
                ]
              : []
          }
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            accept=".jpg,.jpeg,.png,.gif,.webp"
            listType="picture"
          >
            <Button icon={<IconUpload />}>Attach Files</Button>
          </Upload>
        </Form.Item>
        <div className="flex flex-col gap-3 flex-1">
          {!initialData && (
            <>
              <div className="flex items-center gap-2 text-sm text-font-color-100">
                <Form.Item
                  name="sendToCustomer"
                  valuePropName="checked"
                  initialValue={initialData?.sendToCustomer || true}
                  noStyle
                >
                  <Switch />
                </Form.Item>
                <span>Send this note to customer</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-font-color-100">
                <Form.Item
                  name="createFollowUpTask"
                  valuePropName="checked"
                  initialValue={initialData?.createFollowUpTask || true}
                  noStyle
                >
                  <Switch />
                </Form.Item>
                <span>Create follow-up task</span>
              </div>
            </>
          )}

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue('createFollowUpTask') ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Form.Item
                    label="Task Name"
                    name={['task', 'name']}
                    rules={taskNameRules}
                    className="mb-2"
                    initialValue={initialData?.task?.name}
                  >
                    <Input placeholder="Enter task name" />
                  </Form.Item>

                  <Form.Item
                    label="Due Date"
                    name={['task', 'due_date']}
                    rules={dueDateRules}
                    className="mb-0"
                    initialValue={
                      initialData?.task?.dueDate ? dayjs(initialData?.task?.dueDate) : null
                    }
                  >
                    <DatePicker
                      className="w-full max-w-52"
                      placeholder="Select due date"
                      disabledDate={disablePastDates}
                    />
                  </Form.Item>
                </div>
              ) : null
            }
          </Form.Item>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel}>Cancel</Button>
        <Button loading={loading} disabled={loading} type="primary" htmlType="submit">
          {initialData ? 'Update' : 'Send'}
        </Button>
      </div>
    </Form>
  );
};

export default AddNotesCard;
