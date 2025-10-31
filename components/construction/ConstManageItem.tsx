import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { Button, Form, Input, Select, Tag } from 'antd';
import { useState } from 'react';

export function CostManageItem({ onRemove, index, form, onConfirm, onSubmit }) {
  const [confirmed, setConfirmed] = useState(false);
  const handleConfirm = async () => {
    setConfirmed(true);
    const values = await form.validateFields();
    const total = form.getFieldValue(['items', index, 'actualTotal']);
    onConfirm(total);
    onSubmit(values);
  };
  return (
    <div className="table-row hover:bg-card-color ">
      <div className="table-cell text-center p-3 w-[130px] ">
        <Form.Item name={['items', index, 'checklist']}>
          <Input disabled={confirmed} />
        </Form.Item>
        {confirmed && <Tag color="orange">Base Stage</Tag>}
      </div>
      <div className="table-cell text-center p-3 ">
        <Form.Item name={['items', index, 'getPrefrence']}>
          {/* gst prefrence options are notshown in video */}
          <Select
            options={[
              { label: 'With GST', value: 'included' },
              { label: 'Without GST', value: 'notincluded' },
              { label: 'No GST', value: 'no' },
            ]}
            disabled={confirmed}
          />
        </Form.Item>
      </div>
      <div className="table-cell p-3 text-center">
        <div className="table-cell text-center ">
          <Form.Item name={['items', index, 'estimatedCost']}>
            <Input disabled={confirmed} />
          </Form.Item>
        </div>
        <div className="table-cell text-center  ">
          <Form.Item name={['items', index, 'estimatedGST']}>
            <Input disabled />
          </Form.Item>
        </div>
        <div className="table-cell text-center   ">
          <Form.Item name={['items', index, 'estimatedTotal']}>
            <Input disabled />
          </Form.Item>
        </div>
      </div>
      <div className="table-cell p-3 text-center">
        <div className="table-cell text-center ">
          <Form.Item name={['items', index, 'actualCost']}>
            <Input disabled={confirmed} />
          </Form.Item>
        </div>
        <div className="table-cell text-center ">
          <Form.Item name={['items', index, 'actualGST']}>
            <Input disabled />
          </Form.Item>
        </div>
        <div className="table-cell text-center ">
          <Form.Item name={['items', index, 'actualTotal']}>
            <Input disabled />
          </Form.Item>
        </div>
      </div>
      {confirmed ? (
        <div className="flex gap-3 text-center p-3 align-middle">
          <Button
            type="text"
            icon={
              <IconPencil
                size={20}
                color="green"
                onClick={() => {
                  setConfirmed(false);
                }}
              />
            }
          />
          <Button type="text" icon={<IconTrash size={20} color="red" onClick={onRemove} />} />
        </div>
      ) : (
        <div className="flex gap-3 text-center p-3 align-middle">
          <Button
            htmlType="submit"
            type="text"
            icon={
              <IconCheck
                size={20}
                color="green"
                onClick={() => {
                  handleConfirm();
                }}
              />
            }
          />
          <Button type="text" icon={<IconX size={20} color="red" onClick={onRemove} />} />
        </div>
      )}
    </div>
  );
}
