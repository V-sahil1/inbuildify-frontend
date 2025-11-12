import { IconArrowUp, IconPaperclip } from '@tabler/icons-react';
import { Button, Dropdown, Form, Input, InputRef } from 'antd';
import RichTextEditor from '../common/rich-text-editor/RichTextEditor';
import { useRef, useState } from 'react';
import { ActionDialogmodel } from '../common/Models/ActionDialogModel';
import { campaignFooterfields } from '../formFields/campaignFields';
import { InsertAtCursor } from '../../lib/utils/InsertAtCursor';

const CampaignDetail = ({ current, setCurrent }) => {
  const [editedContent, setEditedContent] = useState('');
  const [footerOpen, setFooterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Email');
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();
  const toggleButtons = ['Email', 'SMS'];
  const initialValues = {
    footerName: 'hiiii',
    footerContent: 'ok',
    backgroundColor: '#50d535',
    default: 'true',
  };
  return (
    <div>
      <div className="border border-border-color bg-card-color mt-8 p-4 mb-3">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-medium">Campaign Details</h1>
          <div className="gap-2 flex">
            <Button type="primary">Save</Button>
            <Button type="primary" onClick={() => setCurrent(current + 1)}>
              Next
            </Button>
          </div>
        </div>
        <Form form={form}>
          <div className="flex-col flex gap-3">
            <div className="flex">
              <p className="w-[200px]">Campaign By</p>
              <div className="w-[500px]">
                <Form.Item name="sendOption">
                  {toggleButtons.map((btn, index) => (
                    <Button
                      key={index}
                      className={` ${
                        activeTab === btn ? 'bg-primary' : 'bg-white text-primary'
                      } rounded-none`}
                      type="primary"
                      onClick={() => setActiveTab(btn)}
                    >
                      {btn}
                    </Button>
                  ))}
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <p className="w-[200px]">Campaign Name</p>
              <Form.Item name="campaignName">
                <Input className=" w-[500px]" />
              </Form.Item>
            </div>
            <div className="flex">
              <p className="w-[200px]">Subject</p>
              <Form.Item name="subject">
                <Input
                  ref={inputRef}
                  className=" w-[500px]"
                  value={form.getFieldValue('subject')}
                  onChange={e => form.setFieldValue('subject', e.target.value)}
                />
              </Form.Item>

              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'Insert Contact Name',
                      label: 'Insert Contact Name',
                    },
                  ],
                  onClick: e => {
                    form.setFieldValue(
                      'subject',
                      InsertAtCursor(inputRef, e.key, form.getFieldValue('subject') || '', 'input')
                    );
                  },
                }}
                className="ml-2"
              >
                <Button type="primary"> Insert Personalization</Button>
              </Dropdown>
            </div>
            <div className="flex">
              <p className="w-[200px]">Import HTML</p>
              <Button icon={<IconArrowUp size={15} />} />
            </div>
            <div className="flex">
              <p className="w-[200px]">Attachment</p>
              <Button icon={<IconPaperclip size={15} />} />
            </div>
            <Form.Item>
              <RichTextEditor value={editedContent} onChange={setEditedContent} maxHeight="400px" />
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="flex justify-between mx-3">
        <p className="cursor-pointer">Campaign Footer</p>
        <div>
          <p className="text-blue cursor-pointer">Choose Footer</p>
          <p>Standard Footer</p>
        </div>
        <p className="text-blue cursor-pointer" onClick={() => setFooterOpen(true)}>
          Create Footer
        </p>
      </div>
      {footerOpen && (
        <ActionDialogmodel
          title="Footer"
          open={footerOpen}
          onCancel={() => setFooterOpen(false)}
          onSubmit={values => {
            setFooterOpen(false);
            console.log(values);
          }}
          fields={campaignFooterfields}
          initialValues={initialValues}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default CampaignDetail;
