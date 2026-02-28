import { IconMail, IconPhone } from "@tabler/icons-react";
import { Form, Select, Switch } from "antd";

export const HLPackageContact = ({ editOpen, form, contactOptions, contact, setEditOpen, setHasChanges }) => {
  return (
    <div className="p-4 text-sm">
      <div className="mb-2">
        {editOpen.contact || !form.getFieldValue('contactId') ? (
          <Form.Item name="contactId">
            <Select
              className="w-full"
              showSearch
              options={
                contactOptions
              }
              onChange={value => {
                form.setFieldValue('contactId', value);
                setEditOpen(prev => ({ ...prev, contact: false }));
                setHasChanges(true);
              }}
              placeholder="Please Select Option"
            />
          </Form.Item>
        ) : (
          <div className="flex flex-col gap-2">
            <p onClick={() => setEditOpen(prev => ({ ...prev, contact: true }))} className="cursor-pointer hover:text-blue">
              {contactOptions.find(item => item.value === form.getFieldValue('contactId'))?.label || 'Select Contact'}
            </p>
            {form.getFieldValue('contactId') && (
              <>
                <div className="flex gap-2 items-center">
                  <IconMail size={20} />
                  <p>{contact?.find(item => item.usersId === form.getFieldValue('contactId'))?.email}</p>
                </div>

                <div className="flex gap-2 items-center">
                  <IconPhone size={20} />
                  <p>{contact?.find(item => item.usersId === form.getFieldValue('contactId'))?.phone}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Switch size="small" />
                  <p>Show in pdf</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}