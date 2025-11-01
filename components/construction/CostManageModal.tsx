import { IconPlus } from '@tabler/icons-react';
import { Button, Drawer, Empty, Form } from 'antd';
import { CostManageItem } from './ConstManageItem';
import { useState } from 'react';

const CostManageModal = ({ title, open, onCancel }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [confirmedTotals, setConfirmedTotals] = useState({});
  const [form] = Form.useForm();
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
      setTotal(prevAmount => prevAmount - prevTotal);
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
      setTotal(prevAmount => prevAmount + diff);
      return { ...prev, [index]: newTotal };
    });
  };

  function handleSubmit(values) {
    console.log('cost manage submit', values);
  }

  return (
    <Drawer title={title} open={open} onClose={onCancel} size="large">
      <div>
        <Form
          form={form}
          onFinish={handleSubmit}
          onValuesChange={(changed, all) => {
            const items = all.items?.map(item => {
              const estimatedCost = Number(item.estimatedCost) || 0;
              const actualCost = Number(item.actualCost) || 0;

              const estimatedGST =
                item.getPrefrence === 'no' ? 0 : +(estimatedCost * 0.1).toFixed(2);
              const actualGST = item.getPrefrence === 'no' ? 0 : +(actualCost * 0.1).toFixed(2);

              const estimatedTotal =
                item.getPrefrence === 'included'
                  ? +(estimatedCost + estimatedGST).toFixed(2)
                  : estimatedCost;

              const actualTotal =
                item.getPrefrence === 'included'
                  ? +(actualCost + actualGST).toFixed(2)
                  : actualCost;

              return {
                ...item,
                estimatedGST,
                estimatedTotal,
                actualGST,
                actualTotal,
              };
            });

            form.setFieldsValue({ items });
          }}
        >
          <div className="flex gap-3 justify-end items-center">
            <p>Total Cost : $ {total} </p>
            <Button type="primary" onClick={handleAddItem}>
              <IconPlus />
              New
            </Button>
          </div>
          {/* table */}
          <div className="w-full overflow-y-auto mt-2 " style={{ scrollbarWidth: 'none' }}>
            <div className="table w-full border-collapse">
              {/* Table Head */}
              <div className="table-header-group bg-card-color text-sm font-medium text-font-color border-b border-gray-200">
                <div className="table-row">
                  <div className="table-cell text-center p-3 w-[130px]">Checklist Name</div>
                  <div className="table-cell text-center p-3 w-[130px] ">GST Prefrence</div>
                  <div className="table-cell text-center p-3 w-[170px]">
                    <div className="text-center">Estimated $</div>
                    <div className="table-cell mt-2">
                      <div className="table-cell text-center p-3 ">Cost</div>
                      <div className="table-cell text-center p-3 ">GST</div>
                      <div className="table-cell text-center p-3 ">Total</div>
                    </div>
                  </div>
                  <div className="table-cell w-[170px] p-3">
                    <div className="text-center">Actual $</div>
                    <div className="table-cell mt-2">
                      <div className="table-cell text-left p-3  ">Cost</div>
                      <div className="table-cell text-left p-3 ">GST</div>
                      <div className="table-cell text-left p-3  ">Total</div>
                    </div>
                  </div>
                  <div className="table-cell"></div>
                </div>
              </div>
              {/* Table Body */}

              {items.length > 0 ? (
                <div className="table-row-group overflow-y-auto">
                  {items.map((_, index) => (
                    <CostManageItem
                      key={index}
                      onRemove={() => handleRemoveItem(index)}
                      index={index}
                      form={form}
                      onConfirm={total => handleConfirmItem(index, total)}
                      onSubmit={handleSubmit}
                    />
                  ))}
                </div>
              ) : (
                <div>{/* no data found */}</div>
              )}
            </div>
          </div>
        </Form>
      </div>
    </Drawer>
  );
};

export default CostManageModal;
