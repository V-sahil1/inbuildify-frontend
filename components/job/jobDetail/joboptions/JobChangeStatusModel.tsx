import { IconAlertTriangle } from "@tabler/icons-react";
import { Form, Modal, Select, Input } from "antd";
const { TextArea } = Input;

const dummyPendingTasks = [
  "Purchaser's Signature is still missing on the Contract document.",
  "The Progress Payment: Base Stage is still marked as Pending.",
  "Building Insurer Details must be completed.",
  "The Certificate of Occupancy has not yet been issued.",
];

export const JobChangeStatusModel = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const status = Form.useWatch("status", form);

  const onFinish = (values: any) => {
    console.log("Received values of form:", values);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      okText="ok"
      onOk={() => form.submit()}
      title="Change Status"
      centered
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
     
        form={form}
      >
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select
            placeholder="Select Status"
            options={[
              { value: "completed", label: "Completed" },
              { value: "hold", label: "Hold" },
              //   the cancelled option will visible when the job is active got job menu video by the link https://drive.google.com/drive/folders/14MGfoGlO_OXPQIxw_lUFfVzUge246fBG time isfrom 38 minute
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
        </Form.Item>
        <Form.Item name="note" label="Note" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        {status === "completed" && <JobCompletionWarning />}
      </Form>
    </Modal>
  );
};

const JobCompletionWarning = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm text-gray-800">
      <p className="mb-4 text-base">
        The Job cannot be moved to <span className="font-bold">COMPLETED</span>{" "}
        as the below tasks are still{" "}
        <span className="font-bold">Pending / In Progress.</span>
      </p>

      {dummyPendingTasks.length > 0 && (
        <ul className="list-disc list-inside mb-6">
          {dummyPendingTasks.map((task, index) => (
            <li
              key={index}
              className="text-red-600 font-semibold flex items-center"
            >
              <span className="inline-block h-2 w-2 mr-2 rounded-full bg-red-600"></span>{" "}
              {task}
            </li>
          ))}
        </ul>
      )}
      <p className="flex items-center gap-2">
        <IconAlertTriangle /> The Maintenance End Date is in the future.
        Completing the job now may affect warranty tracking.
      </p>
    </div>
  );
};
