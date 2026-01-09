import { Form, Switch, Typography } from 'antd';
const { Text } = Typography;

const InputSwitch = ({
  label,
  description,
  name,
  value,
  onChange,
}: {
  label: string;
  description?: string | React.ReactNode;
  name: string | string[];
  value?: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  return (
    <div className="w-full mb-5 border-b border-gray-100 pb-3">
      <div className="flex items-start gap-2">
        {value !== undefined && onChange ? (
          <Switch checked={value} onChange={onChange} />
        ) : (
          <Form.Item name={name} valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        )}
        <div className="flex flex-col gap">
          <Text strong>{label}</Text>
          {description && <div className="text-gray-600 text-[13px]">{description}</div>}
        </div>
      </div>
    </div>
  );
};

export default InputSwitch;
