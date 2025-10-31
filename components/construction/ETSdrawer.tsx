import { IconPlus, IconUpload } from '@tabler/icons-react';
import { Button, Drawer, Form, Input, InputNumber, Select, Switch, Upload } from 'antd';
import { useState } from 'react';
import { ETSItem } from './ETSItem';
const { TextArea } = Input;
const ETSdrawer = ({ title, open, onCancel }) => {
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [items, setItems] = useState([{}]);
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(0);
  const [confirmedTotals, setConfirmedTotals] = useState({});
  const handleAddItem = () => {
    setItems(prev => [...prev, {}]);
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = form.getFieldValue('items') || [];
    currentItems.splice(index, 1);
    form.setFieldsValue({ items: currentItems });
    setItems(prev => prev.filter((_, i) => i !== index));
    setConfirmedTotals(prev => {
      const updated = { ...prev };
      const prevTotal = prev[index] || 0;
      setAmount(prevAmount => prevAmount - prevTotal);
      delete updated[index];
      const newObj = Object.values(updated).reduce((acc, val, index) => {
        acc[index] = val;
        return acc;
      }, {});
      return newObj;
    });
  };

  const handleConfirmItem = (index, newTotal) => {
    setConfirmedTotals(prev => {
      const prevTotal = prev[index] || 0;
      const diff = newTotal - prevTotal;
      setAmount(prevAmount => prevAmount + diff);
      return { ...prev, [index]: newTotal };
    });
  };

  type DataType = {
    description: string;
    reason: string;
    constCenter: string;
    quantity: number;
    price: number;
    total: number;
  };

  function handleSubmit(values) {
    console.log(values);
  }

  const tableHeaderField = [
    { label: 'Description', name: 'description', type: 'text' },
    {
      label: 'Reason',
      name: 'reason',
      options: [
        { label: 'reason1', value: 'reason1' },
        { label: 'reason2', value: 'reason2' },
      ],
      type: 'select',
    },
    {
      label: 'Cost Center',
      name: 'costCenter',
      options: [
        { label: 'cost1', value: 'cost1' },
        { label: 'cost2', value: 'cost2' },
      ],
      type: 'select',
    },
    { label: 'Quantity', name: 'quantity', type: 'number' },
    { label: 'Price Exc GST($)', name: 'price', type: 'number' },
    { label: 'Total', name: 'total', type: 'number', disabled: 'true' },
  ];

  return (
    <Drawer title={title} open={open} onClose={onCancel} size="large" className="w-[900px]">
      <div>
        <Form
          form={form}
          onFinish={handleSubmit}
          onValuesChange={(changed, all) => {
            const items = all.items?.map(item => ({
              ...item,
              total: (item.quantity || 0) * (item.price || 0),
            }));
            form.setFieldsValue({ items });
            if (changed.rechargeAmount !== undefined) {
              const amount = Number(changed.rechargeAmount) || 0;
              const gst = amount * 0.1;
              const total = amount + gst;

              form.setFieldsValue({
                rechargeGST: gst.toFixed(2),
                rechargeTotal: total.toFixed(2),
              });
            }
          }}
        >
          <div className="flex gap-6 items-center">
            <div>
              <p>Supplier/Tradie</p>
              <Form.Item name="supplier" className="w-[200px]">
                <Select
                  placeholder="Please Select"
                  options={[{ label: 'supplier1', value: 'supplier1' }]}
                />
              </Form.Item>
            </div>
            <div className="flex gap-2">
              <Form.Item name="variation">
                <Switch size="small" />
              </Form.Item>
              <p className="mt-1">Variation Required</p>
            </div>
          </div>
          {/* Table */}
          <div className="w-full overflow-y-auto  " style={{ scrollbarWidth: 'none' }}>
            <div className="table w-full border-collapse">
              {/* Table Head */}
              <div className="table-header-group bg-card-color text-sm font-medium text-font-color border-b border-gray-200">
                <div className="table-row">
                  <div className="table-cell text-left p-3  w-[100px]">Sr. No.</div>
                  {tableHeaderField.map(field => (
                    <div className="table-cell text-left p-3  w-[100px]">{field.label}</div>
                  ))}
                  <div className="table-cell text-left p-3 w-[100px]">
                    <Button onClick={handleAddItem}>
                      <IconPlus />
                      New
                    </Button>{' '}
                  </div>
                </div>
              </div>
              {/* Table Body */}
              <div className="table-row-group overflow-y-auto">
                {items.map((_, index) => (
                  <ETSItem
                    key={index}
                    onRemove={() => handleRemoveItem(index)}
                    index={index}
                    form={form}
                    tableHeaderField={tableHeaderField}
                    onConfirm={total => handleConfirmItem(index, total)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <div className="w-[200px]">
              <p>Amount Excluding GST</p>
              <p>GCT</p>
              <p>Total</p>
            </div>
            <div>
              <p>{amount}</p>
              <p>{(amount * 0.1).toFixed(2)}</p>
              <p>{(amount * 1.1).toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-2">
            <p>Comments</p>
            <Form.Item name="comments">
              <TextArea rows={4} maxLength={1000} showCount />
            </Form.Item>
          </div>
          <div className="flex gap-2 mt-4 items-center">
            <Switch
              checked={rechargeOpen}
              onChange={() => setRechargeOpen(!rechargeOpen)}
              size="small"
            />
            <p>Recharge Notification</p>
          </div>
          <div style={{ display: rechargeOpen ? 'block' : 'none' }}>
            <div className="flex justify-between gap-1 mt-3">
              <div className="w-[150px]">
                <p>Supplier/Tradie</p>
                <Form.Item name="rechargeSupplier">
                  <Select
                    className="w-[110px]"
                    options={[{ label: 'supplier', value: 'supplier' }]}
                  />
                </Form.Item>
              </div>
              <div className="w-[150px]">
                <p>Recharge By</p>
                <Form.Item name="rechargeBy">
                  <Select className="w-[110px]" options={[{ label: 'abc', value: 'abc' }]} />
                </Form.Item>
              </div>
              <div className="w-[150px]">
                <p>Amount Excluding GST</p>
                <Form.Item name="rechargeAmount">
                  <InputNumber
                    style={{ width: '150px' }}
                    formatter={value => `$ ${value}`}
                    parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </div>
              <div className="w-[100px]">
                <p>GST</p>
                <Form.Item name="rechargeGST" shouldUpdate>
                  <InputNumber disabled addonBefore="$" />
                </Form.Item>
              </div>
              <div className="w-[100px]">
                <p>Total</p>
                <Form.Item name="rechargeTotal" shouldUpdate>
                  <InputNumber disabled addonBefore="$" />
                </Form.Item>
              </div>
            </div>
            <div className="mt-2">
              <p>Description</p>
              <Form.Item name="rechargeDescription">
                <TextArea rows={4} maxLength={1000} showCount />
              </Form.Item>
            </div>
          </div>
          <Form.Item name="files">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".jpg,.jpeg,.png,.gif,.webp"
              listType="picture"
            >
              <Button className="mt-3 cursor-pointer" icon={<IconUpload />}>
                Attach Files
              </Button>
            </Upload>
          </Form.Item>

          <div className="flex gap-3 justify-end mt-2">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Drawer>
  );
};
export default ETSdrawer;
