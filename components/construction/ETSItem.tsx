import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { Form, Input, InputNumber, Popconfirm, Select } from 'antd';
import { useState } from 'react';

export const ETSItem = ({ onRemove, index, form, onConfirm, tableHeaderField }) => {
  const [isdisabled, setIsDisabled] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    const total = form.getFieldValue(['items', index, 'total']) || 0;
    onConfirm(total);
    setConfirmed(true);
  };
  return (
    <div className="table-row hover:bg-card-color ">
      <div className="table-cell text-center p-3 align-middle">{index + 1}</div>
      {tableHeaderField.map((field, index) => (
        <div key={index} className="table-cell text-center p-3 align-middle">
          <Form.Item name={['items', index, field.name]}>
            {field.type === 'text' ? (
              <Input className="w-[100px]" disabled={confirmed ? isdisabled : false} />
            ) : field.type === 'number' ? (
              <InputNumber
                placeholder="0"
                className="w-[100px]"
                disabled={field?.disabled || (confirmed ? isdisabled : false)}
              />
            ) : field.type === 'select' ? (
              <Select
                placeholder="Please Select"
                className="w-[100px]"
                options={field.options}
                disabled={confirmed ? isdisabled : false}
              />
            ) : (
              ''
            )}
          </Form.Item>
        </div>
      ))}
      {confirmed ? (
        <div className="flex gap-3 text-center p-3 align-middle">
          <IconPencil
            size={20}
            color="green"
            onClick={() => {
              setIsDisabled(false);
              setConfirmed(false);
            }}
            className="cursor-pointer"
          />
          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            onConfirm={onRemove}
            okText="Yes"
            cancelText="No"
          >
            {' '}
            <IconTrash size={20} color="red" className="cursor-pointer" />
          </Popconfirm>
        </div>
      ) : (
        <div className="flex gap-3 text-center p-3 align-middle">
          <IconCheck
            size={20}
            color="green"
            onClick={() => {
              handleConfirm();
            }}
            className="cursor-pointer"
          />
          <IconX size={20} color="red" onClick={onRemove} className="cursor-pointer" />
        </div>
      )}
    </div>
  );
};
