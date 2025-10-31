import { IconArrowUp, IconPaperclip } from '@tabler/icons-react';
import { Button, Dropdown, Input } from 'antd';
import RichTextEditor from '../common/rich-text-editor/RichTextEditor';
import { useState } from 'react';
import { CreateFormField, CreateFormModal } from '../common/Models/CreateFormModel';

const CampaignDetail = ({ current, setCurrent }) => {
  const [editedContent, setEditedContent] = useState('');
  const [footerOpen, setFooterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Email');
  const fields: CreateFormField[] = [
    { label: 'Footer Name', name: 'footerName', type: 'text' },
    { label: 'Footer Content', name: 'footerContent', type: 'textEditor' },
    { label: 'Set Background Color', name: 'backgroundColor', type: 'color' },
    { label: 'Set as Default', name: 'default', type: 'switch' },
  ];
  const initialValues = {
    footerName: 'hiiii',
    footerContent: 'ok',
    backgroundColor: '#3548D5',
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
        <div className="flex-col flex gap-3">
          <div className="flex">
            <p className="w-[200px]">Campaign By</p>
            <div className="w-[500px]">
              <Button
                className={` ${activeTab === 'Email' ? 'bg-primary' : 'bg-white text-primary'
                  } rounded-none`}
                type="primary"
                onClick={() => setActiveTab('Email')}
              >
                Email
              </Button>
              <Button
                className={` ${activeTab === 'SMS' ? 'bg-primary' : 'bg-white text-primary'
                  } rounded-none`}
                type="primary"
                onClick={() => setActiveTab('SMS')}
              >
                SMS
              </Button>
            </div>
          </div>
          <div className="flex">
            <p className="w-[200px]">Campaign Name</p>
            <Input className=" w-[500px]" />
          </div>
          <div className="flex">
            <p className="w-[200px]">Subject</p>
            <Input
              className=" w-[500px]"
              addonAfter={
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'Insert Contact Name',
                        label: 'Insert Contact Name',
                        onClick: () => { },
                      },
                    ],
                  }}
                >
                  Insert Personalization
                </Dropdown>
              }
            />
          </div>
          <div className="flex">
            <p className="w-[200px]">Import HTML</p>
            <Button icon={<IconArrowUp size={15} />} />
          </div>
          <div className="flex">
            <p className="w-[200px]">Attachment</p>
            <Button icon={<IconPaperclip size={15} />} />
          </div>
          <RichTextEditor value={editedContent} onChange={setEditedContent} maxHeight="400px" />
        </div>
      </div>
      <div className="flex justify-between mx-3">
        <p>Campaign Footer</p>
        <div>
          <p className="text-blue">Choose Footer</p>
          <p>Standard Footer</p>
        </div>
        <p className="text-blue" onClick={() => setFooterOpen(true)}>
          Create Footer
        </p>
      </div>
      <CreateFormModal
        title="Footer"
        open={footerOpen}
        onCancel={() => setFooterOpen(false)}
        onSubmit={(values) => {
          setFooterOpen(false)
          console.log(values);
        }}
        fields={fields}
        initialValues={initialValues}
        isEditing={true}
      />
    </div>
  );
};

export default CampaignDetail;
