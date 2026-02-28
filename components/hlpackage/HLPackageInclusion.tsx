import { IconPencil, IconSearch, IconTable } from "@tabler/icons-react";
import { Button, Checkbox, Form, Input, Select, Tag, Tooltip } from "antd";
import { InclusinList } from "data/HLPackageDeatilData";
const { TextArea } = Input

export const HLPackageInclusion = ({ editOpen, setEditOpen, form, filters, setParams, activeTab, setActiveTab }) => {
  const filterButtons = ['All', 'Selected', 'UnSelected'];
  return (
    <div className="bg-card-color p-4 m-2">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <p>This Package inclusions: </p>
          <IconPencil size={20} />
        </div>
        <div className="rounded-2xl flex gap-2 p-1 border border-primary">
          {filterButtons.map((btn, index) => (
            <Button
              key={index}
              className={`rounded-xl text-xs ${activeTab === btn ? 'bg-primary' : 'bg-white text-primary'} `}
              type="primary"
              size="small"
              onClick={() => setActiveTab(btn)}
            >
              {btn}
            </Button>
          ))}
        </div>
        <div className="text-blue">
          <Tooltip title="Inclusion List">
            <IconTable size={20} />
          </Tooltip>
        </div>
      </div>
      <div className="grid grid-cols-2 items-center gap-4 mt-3">
        <Input
          addonBefore={<IconSearch size={20} />}
          placeholder="Search Inclusions"
          size="small"
          value={filters.inclusion}
          onChange={e => setParams({ inclusion: e.target.value })}
        />
        <div>
          {editOpen?.group ? (
            <Form.Item name="group" className="pt-3">
              <Select
                className="w-full"
                showSearch
                options={[{ label: 'Turnkey Inclusion', value: 'Turnkey Inclusion' }]}
                onChange={value => {
                  setEditOpen(prev => ({ ...prev, group: false }));
                }}
                placeholder="Please Select Option"
              />
            </Form.Item>
          ) : form.getFieldValue('group') ? (
            <div>
              <p className="text-primary">{form.getFieldValue('group')}</p>
              <p className="text-xs">Group</p>
            </div>
          ) : (
            <p className="text-blue cursor-pointer" onClick={() => setEditOpen(prev => ({ ...prev, group: true }))}>
              Choose Group
            </p>
          )}
        </div>
      </div>
      <div>
        <div className="flex gap-2 items-center mb-2">
          <Checkbox /> Select All
        </div>
        {InclusinList.map((list, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <Checkbox checked />
            <div>
              <p>{list.title}</p>
              <Tag color="blue">{list.group}</Tag>
            </div>
          </div>
        ))}
      </div>

      <TextArea
        rows={4}
        style={{ resize: 'none' }}
        showCount
        className="my-2"
        maxLength={500}
      />

    </div>
  )
}