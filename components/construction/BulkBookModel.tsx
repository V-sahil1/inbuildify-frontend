import { Button, Checkbox, Drawer, Form, Popconfirm, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import TimelineActionsBar from '../common/TimeLineComponents/TimelineActionsBar';
import { IconPaperclip } from '@tabler/icons-react';
import dayjs from 'dayjs';
const BulkBookModel = ({
  title,
  open,
  onCancel,
  checkItems,
  checkSupplierItems,
  editCheckStatus,
}) => {
  const [form] = Form.useForm();
  type FilterType = 'currentStage' | 'allStages';
  const [activeFilter, setActiveFilter] = useState<{
    type: FilterType;
    label: string;
    count?: number;
  }>({ type: 'currentStage', label: 'Current Stage' });

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
      { type: 'currentStage', label: 'Current Stage', count: 0 },
      { type: 'allStages', label: 'All Stages', count: 0 },
    ];
  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
    setActiveFilter(filterOptions.find(f => f.type === selectedType) || activeFilter);
  };
  const data = [
    {
      checklist: 'new checklist',
      supplier: 'a&l windows',
      start: '02/10/25',
      finish: '03/10/25',
      stage: 'Base Stage',
    },
  ];
  console.log('index', checkSupplierItems[1]);
  console.log(checkItems, checkSupplierItems);

  const bookContent = (
    <div className="max-w-[300px]">
      <p>Are you sure you want to book the suppliers? Before preceeding, Please Confirm.</p>
      <div className="flex gap-2 justify-center mt-2">
        <Button>Yes</Button>
        <Button>No</Button>
      </div>
    </div>
  );

  async function handleSubmit() {
    const values = await form.validateFields();
    editCheckStatus(values);
    onCancel();
    console.log('book', values);
  }
  return (
    <Drawer title={title} open={open} onClose={onCancel} size="large">
      <div>
        <Form form={form}>
          <TimelineActionsBar
            tabs={filterOptions.map(f => ({ type: f.type, label: f.label, count: f.count }))}
            activeTab={activeFilter.type}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />
          <div className="mt-2">
            {checkItems.map((item, index) => (
              <div className="flex justify-between">
                <Form.Item
                  name={item.values.checklist}
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox />
                </Form.Item>
                <div>
                  <p>{item.values.checklist}</p>
                  <Tag color="orange">Base Stage</Tag>
                </div>
                {checkSupplierItems?.checklist?.[index] && (
                  <>
                    <p>{checkSupplierItems?.checklist[index]?.supplier}</p>
                    <p>
                      {dayjs(checkSupplierItems?.checklist[index]?.start).format('DD-MM-YYYY')} -{' '}
                      {dayjs(checkSupplierItems?.checklist[index]?.finish).format('DD-MM-YYYY')}
                    </p>
                  </>
                )}

                <Tooltip title="View/Upload files">
                  {' '}
                  <IconPaperclip size={15} className="text-blue cursor-pointer" />
                </Tooltip>
              </div>
            ))}
          </div>
          {checkItems.length > 0 && (
            <div className="flex justify-end gap-2 mt-3">
              <Button>Cancel</Button>
              <Popconfirm
                title="Are you sure you want to book the suppliers?"
                onConfirm={handleSubmit}
                onCancel={() => { }}
                okText="Yes"
                cancelText="No"
              >
                <Button>Book</Button>
              </Popconfirm>
            </div>
          )}
        </Form>
      </div>
    </Drawer>
  );
};

export default BulkBookModel;
