import { IconDotsVertical, IconPinFilled } from '@tabler/icons-react';
import { Checkbox, DatePicker, Dropdown, Form } from 'antd';

export function ChecklistSubtaskItem({ ind, checkind, values }) {
  const subtaskItem = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
    { key: 'notApplicable', label: 'Mark As Not Applicable' },
  ];

  return (
    <>
      <div className="table-row bg-card-color px-3">
        <div className="table-cell  px-3 w-[100px]">
          <div className="flex gap-1 items-center">
            <IconPinFilled size={15} />
            <p className="text-black">{values.subchecklist}</p>
          </div>
        </div>
        <div className="table-cell px-3 w-[100px]"> </div>
        <div className="table-cell px-3 w-[100px]">
          <Form.Item name={['cheklist', checkind, 'subtask', ind, 'start']}>
            <DatePicker
              className="!pl-0 text-blue"
              variant="borderless"
              suffixIcon={null}
              allowClear={true}
            />
          </Form.Item>
        </div>
        <div className="table-cell px-3 w-[100px]">
          <Form.Item name={['cheklist', checkind, 'subtask', ind, 'finish']}>
            <DatePicker
              className="!pl-0 text-blue"
              variant="borderless"
              suffixIcon={null}
              allowClear={true}
            />
          </Form.Item>
        </div>
        <div className="table-cell px-3 w-[100px]">
          <Form.Item
            name={['cheklist', checkind, 'subtask', ind, 'complete']}
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox />
          </Form.Item>
        </div>
        <div className="table-cell px-3 w-[100px]"> </div>
        <div className="table-cell px-3 w-[100px]">
          {/* <Button
              type="text"
              onClick={handleSave}
              icon={subTaskSave ? <IconPencil size={15} /> : <IconCheck size={15} />}
            ></Button> */}
          <Dropdown menu={{ items: subtaskItem }} trigger={['click']}>
            <IconDotsVertical size={15} className="text-blue cursor-pointer" />
          </Dropdown>
        </div>
      </div>
    </>
  );
}
