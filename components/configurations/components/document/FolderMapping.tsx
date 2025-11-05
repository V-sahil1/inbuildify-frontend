'use client';
import { useState } from 'react';
import { Select, Switch, Button, Tooltip } from 'antd';
import { IconInfoCircle } from '@tabler/icons-react';

interface MappingItem {
  label: string;
  info?: boolean;
  value?: string;
  options: string[];
}

interface MappingGroup {
  title: string;
  items: MappingItem[];
}

export const FolderMapping = () => {
  const initialGroups: MappingGroup[] = [
    {
      title: 'Signed Documents Mapping',
      items: [
        { label: 'Signed Quotation', value: 'Quotes', options: ['Quotes', 'Invoices', 'Sketches'] },
        { label: 'Signed Color', value: '', options: ['Quotes', 'Invoices', 'Sketches'] },
        { label: 'Signed Variation', value: '', options: ['Quotes', 'Invoices', 'Sketches'] },
        { label: 'Signed Maintenance', value: '', options: ['Quotes', 'Invoices', 'Sketches'] },
        {
          label: 'Signed Contract Document',
          value: '',
          options: ['Quotes', 'Invoices', 'Sketches'],
        },
      ],
    },
    {
      title: 'Construction Documents Mapping',
      items: [
        {
          label: 'Compliance Certificate',
          info: true,
          value: 'Certificates',
          options: ['Certificates', 'Orders', 'Docs'],
        },
        {
          label: 'Purchase Order',
          info: true,
          value: 'Purchase Orders',
          options: ['Certificates', 'Orders', 'Docs'],
        },
        {
          label: 'Job Documents',
          info: true,
          value: 'Final Construction Documents',
          options: ['Certificates', 'Orders', 'Docs'],
        },
      ],
    },
  ];

  const [groups, setGroups] = useState(initialGroups);
  const [selectAll, setSelectAll] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const handleChange = (groupIdx: number, itemIdx: number, newValue: string) => {
    const updated = [...groups];
    updated[groupIdx].items[itemIdx].value = newValue;
    setGroups(updated);
    setIsChanged(true);
  };

  const handleToggle = (checked: boolean) => {
    setSelectAll(checked);
    setIsChanged(true);
  };

  const handleSave = () => {
    console.log('Saved Data:', { groups, selectAll });
    setIsChanged(false);
  };

  return (
    <div className="w-full p-6 bg-white rounded-md">
      {groups.map((group, gIdx) => (
        <div key={group.title} className="mb-8">
          <h3 className="text-base font-semibold text-gray-800 mb-3">{group.title}</h3>
          <div className="grid grid-cols-2 gap-y-4">
            {group.items.map((item, iIdx) => (
              <div key={item.label} className="contents">
                <div className="flex items-center text-gray-700">
                  {item.label}
                  {item.info && (
                    <Tooltip title="Information about this mapping">
                      <IconInfoCircle className="ml-1 text-gray-400" />
                    </Tooltip>
                  )}
                </div>
                <Select
                  className="w-full"
                  value={item.value || undefined}
                  placeholder="Please select a folder"
                  onChange={val => handleChange(gIdx, iIdx, val)}
                  //   the options are of the folder name here as the created folders list for all the select option
                  options={item.options.map(o => ({ label: o, value: o }))}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-start gap-3 mt-6 border-t pt-4">
        <Switch checked={selectAll} onChange={handleToggle} />
        <div className="text-sm text-gray-700">
          <p className="font-medium">Select all the files from the Folder</p>
          <p className="text-gray-500">
            When the toggle is <strong>ON</strong> – Files will be auto-selected by default.
            <br />
            When the toggle is <strong>OFF</strong> – Files won’t be selected by default but will be
            manually available.
          </p>
        </div>
      </div>

      {isChanged && (
        <div className="mt-6 text-right">
          <Button type="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};
