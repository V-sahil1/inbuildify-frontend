import { Button, Drawer, Form, Input, Select, Switch } from 'antd';
import CheckList from './Checklist';
import { useState } from 'react';
import { IconCheck, IconPlus, IconX } from '@tabler/icons-react';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
const { TextArea } = Input;

const JobChecklist = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [isnewChecklistOpen, setNewchecklistopen] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();

  type FilterType = 'all' | 'pending' | 'completed';
  const [activeFilter, setActiveFilter] = useState<{
    type: FilterType;
    label: string;
    count?: number;
  }>({ type: 'all', label: 'All' });

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
      { type: 'all', label: 'All', count: data.length },
      { type: 'pending', label: 'Pending', count: data.length },
      { type: 'completed', label: 'Completed', count: data.length },
    ];
  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
    setActiveFilter(filterOptions.find(f => f.type === selectedType) || activeFilter);
  };

  function handleSubmit(values) {
    console.log('values', values);
    setData(prev => [...prev, values]);
    setNewchecklistopen(false);
    form.resetFields();
    console.log('data', data);
  }

  return (
    <>
      <Drawer title="DA Checklist" placement="right" size="large" onClose={onClose} open={open}>
        <div>
          <div className="flex justify-between">
            <div>
              <TimelineActionsBar
                tabs={filterOptions.map(f => ({ type: f.type, label: f.label, count: f.count }))}
                activeTab={activeFilter.type}
                onTabChange={handleFilterTabChange}
                isActionShow={false}
                isCountShow={true}
              />
            </div>
            <div
              className="flex items-center text-primary gap-2 cursor-pointer"
              onClick={() => setNewchecklistopen(true)}
            >
              <div className="rounded-full text-sm w-4 h-4 border border-primary">
                {' '}
                <IconPlus size={15} />{' '}
              </div>
              <div>Checklist</div>
            </div>
          </div>
          {isnewChecklistOpen && (
            <Form form={form} onFinish={handleSubmit}>
              <div className="flex gap-3 justify-between items-center text-xs p-4 m-2 bg-body-color">
                <div>
                  <p>Description</p>
                  <Form.Item name="description">
                    <TextArea rows={1} />
                  </Form.Item>
                </div>
                <div>
                  <p>Notes</p>
                  <Form.Item name="notes" valuePropName="valu e">
                    <Switch />
                  </Form.Item>
                </div>
                <div>
                  <p>Required</p>
                  <Form.Item name="required" valuePropName="value">
                    <Switch />
                  </Form.Item>
                </div>
                <div>
                  <p>Type</p>
                  <Form.Item name="type">
                    <Select
                      options={[
                        { value: 'checkbox', label: 'Checkbox' },
                        { value: 'dropdown', label: 'Dropdown' },
                      ]}
                      placeholder="Please Select"
                    />
                  </Form.Item>
                </div>
                <div className="flex gap-2">
                  <div>
                    <Button htmlType="submit" type="text" icon={<IconCheck />}></Button>
                  </div>
                  <div onClick={() => setNewchecklistopen(false)}>
                    <Button type="text" icon={<IconX />}></Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
          {data.map(obj => (
            <>
              <CheckList
                title={obj.description}
                type={obj.type}
                isnotes={obj.notes}
                isrequired={obj.required}
                form={form}
              />
            </>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default JobChecklist;
