import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Space, Input, Switch, Upload, Form, Radio, Select, Checkbox } from 'antd';
import { useUsersHook } from '@hooks/useUserHook';
import { TemplateColorItemForm } from './TemplateColorItemForm';
import ConfirmationModal from '@/components/common/ConfirmationModal';


const { Title, Text } = Typography;
const { TextArea } = Input;

interface ColorItem {
  id: string;
  name: string;
  image: string;
  itemCode?: string;
  units?: number;
  suppliers?: string;
  description?: string;
  features?: string;
  isAdded?: boolean;
  notes?: string;
  standard?: boolean;
  customData?: any[];
}

interface TemplateColorItemCardProps {
  templateName: string;
  onEdit: () => void;
  onAddNew: () => void;
  onRemove: (id, item: any) => void;
  onCancel: () => void;
  onUpdateItem: (id: string, field: string, value: any) => void;
  items: ColorItem[];
}

export const TemplateColorItemCard: React.FC<TemplateColorItemCardProps> = ({
  templateName,
  onUpdateItem,
  onRemove,
  onCancel,
  items: propItems,
}) => {
  const { users } = useUsersHook();
  const [addItemTemplate, setAddItemTemplate] = useState<Record<string, any>>({} as Record<string, any>);
  const [removeItem, setRemoveItem] = React.useState<boolean | null>(null);
  const [removeItemId, setRemoveItemId] = React.useState<string | null>(null);
  const [noteToggles, setNoteToggles] = React.useState<Record<string, boolean>>({});
  // Add test customData to items if not provided
  const items = propItems.map(item => ({
    ...item,
    customData: item.customData || [
      {
        fieldName: 'story',
        fieldType: 'text' as const,
        isRequired: true,
        sortOrder: 1
      },
      {
        fieldName: 'isAbsorbing',
        fieldType: 'checkbox' as const,
        isRequired: false,
        sortOrder: 2
      }
    ]
  }));
  const [formValues, setFormValues] = React.useState<Record<string, any>>(
    items.reduce((acc, item) => {
      const itemData: any = {
        itemCode: item.itemCode || '',
        units: item.units || '',
        description: item.description || '',
        features: item.features || '',
        notes: item.notes || ''
      };

      // Add custom data fields with their current values
      if (item.customData) {
        item.customData.forEach(field => {
          itemData[field.fieldName] = item[field.fieldName] !== undefined
            ? item[field.fieldName]
            : (field.fieldType === 'checkbox' ? false : '');
        });
      }

      return {
        ...acc,
        [item.id]: itemData
      };
    }, {})
  );


  useEffect(() => {
    setAddItemTemplate(items);
  }, [users]);

  const handleAddItem = (itemId: string) => {
    const itemToAdd = items.find(item => item.id === itemId);
    if (itemToAdd) {
      const formData = formValues[itemId];

        // Merge customData values
  const updatedCustomData = itemToAdd.customData?.map(field => ({
    ...field,
    value: formData[field.fieldName] ?? field.value
  }));

      console.log(formData);
      const itemWithFormData = {
        ...itemToAdd,
        ...formData,
        customData: updatedCustomData
      };

      console.log('Submitting item with form data:', {
        ...itemWithFormData
      });

      // Update the parent component with the form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          onUpdateItem(itemId, key, value);
        }
      });

      // Mark as added
      onUpdateItem(itemId, 'isAdded', true);
    }
  };

  const handleRemoveItem = () => {
    setRemoveItem(false);
    console.log(removeItemId);
    console.log(addItemTemplate);

    const originalData = addItemTemplate.find(item => item.id === removeItemId);
    // Call onRemove if needed for parent component logic
    console.log("original Data", originalData);
    onRemove(removeItemId, originalData);

    // Reset form data for the removed item
    setFormValues(prev => {
      const newFormValues = { ...prev };
      delete newFormValues[removeItemId];
      return newFormValues;
    });
  };

  const handleInputChange = (itemId: string, field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));

  };
  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} className="mb-4" bodyStyle={{ padding: '16px' }}>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
              <img
                src={item.image || '/images/placeholder.png'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.standard && (
                <div className="absolute z-10 top-1 right-1 flex items-center justify-center bg-slate-200  p-[4px] rounded-sm text-black opacity-50 text-[10px]">Standard</div>
              )}

            </div>

            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-3 gap-x-4 mb-3">
                <div>
                  <Text strong className="uppercase text-sm">
                    {item.name}
                  </Text>
                  <Text type="secondary" className="block text-xs">
                    {item.suppliers ? (
                      item.suppliers
                    ) : (
                      <span>Not set Supplier</span>
                    )}
                  </Text>
                </div>

                <div>
                  <Text className="text-sm block">Item Code</Text>
                  {item.itemCode ? (
                    <Text className="mt-2 text-sm">{item.itemCode}</Text>
                  ) : (
                    <Input
                      placeholder="Enter item code"
                      value={formValues[item.id]?.itemCode || ''}
                      onChange={e => handleInputChange(item.id, 'itemCode', e.target.value)}
                      className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                    />
                  )}
                </div>

                <div>
                  <Text className="text-sm block">Units</Text>
                  {item.units ? (
                    <Text className="mt-2 text-sm">{item.units}</Text>
                  ) : (
                    <Input
                      placeholder="Enter units"
                      value={formValues[item.id]?.units || ''}
                      onChange={e => handleInputChange(item.id, 'units', e.target.value)}
                      className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                    />
                  )}
                </div>
              </div>

              {/* customData */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                {item.customData?.map((field, index) => (
                  <div key={index} className="w-full">
                    <Text className="text-sm block capitalize">
                      {field.fieldName}
                      {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </Text>
                    {field?.value !== undefined ? (
                      <p className="mt-2 text-sm">{field.value}</p>
                    ) : (
                      <>
                   {field?.fieldType === 'text' && (
                      <Input
                        placeholder={`Enter ${field.fieldName}`}
                        value={formValues[item.id]?.[field.fieldName] || ''}
                        onChange={e => handleInputChange(item.id, field.fieldName, e.target.value)}
                        className="mt-1 w-full border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                        required={field.isRequired}
                      />
                    )}
                    {field?.fieldType === 'checkbox' && (
                      <div className="mt-2">
                        <Checkbox
                          checked={formValues[item.id]?.[field.fieldName] || false}
                          onChange={e => handleInputChange(item.id, field.fieldName, e.target.checked)}
                          className="mt-2"
                        />
                      </div>
                    )}
                    {field?.fieldType === 'radio' && (
                      <Radio.Group
                        value={formValues[item.id]?.[field.fieldName]}
                        onChange={e => handleInputChange(item.id, field.fieldName, e.target.value)}
                        className="mt-2"
                      >
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    )}
                    {field?.fieldType === 'dropdown' && (
                      <Select
                        placeholder={`Select ${field.fieldName}`}
                        value={formValues[item.id]?.[field.fieldName]}
                        onChange={value => handleInputChange(item.id, field.fieldName, value)}
                        className="w-full mt-1"
                        options={[
                          { label: 'Option 1', value: 'option1' },
                          { label: 'Option 2', value: 'option2' },
                        ]}
                      />
                    )}
                </>
                  )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-4 mb-3">
                <div>
                  <Text className="text-sm block">Description</Text>
                  {item.description ? (
                    <Text className="mt-2 text-sm">{item.description}</Text>
                  ) : (
                    <TextArea
                      value={formValues[item.id]?.description || ''}
                      onChange={e => handleInputChange(item.id, 'description', e.target.value)}
                      placeholder="Enter description"
                      autoSize={{ minRows: 1, maxRows: 1 }}
                      className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                    />
                  )}
                </div>

                <div>
                  <Text className="text-sm block">Features</Text>
                  {item.features ? (
                    <Text className="mt-2 text-sm">{item.features}</Text>
                  ) : (
                    <TextArea
                      value={formValues[item.id]?.features || ''}
                      onChange={e => handleInputChange(item.id, 'features', e.target.value)}
                      placeholder="Enter features"
                      autoSize={{ minRows: 1, maxRows: 1 }}
                      className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                    />
                  )}
                </div>
              </div>

              {item?.notes && (
                <div className="flex justify-between items-center pt-2">
                  <Space size="middle">
                    <Text className="text-sm">Notes</Text>
                    <Switch
                      size="small"
                      checked={noteToggles[item.id]}
                      onChange={() => setNoteToggles(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                    />
                    <Text type="secondary" className="text-sm">
                      Highlight notes on PDF
                    </Text>
                  </Space>
                  {/* <span className="mt-2 text-sm">{item.notes}</span> */}
                </div>
              )}
              {item?.notes ? (
                <span className="mt-2 text-sm">{item.notes}</span>
              ) : (
                <Input
                  value={formValues[item.id]?.notes || ''}
                  onChange={e => handleInputChange(item.id, 'notes', e.target.value)}
                  placeholder="Add notes here"
                  className="mt-2 border-0 border-b border-gray-300 rounded-none focus:ring-0 text-sm"
                />
              )}
              <div className="w-full mt-3 flex justify-end">

                {item.isAdded ? (
                  <Button
                    type="default"
                    onClick={() => {
                      setRemoveItemId(item.id);
                      setRemoveItem(true)
                    }}
                    className='bg-red-700 text-white hover:!text-red-700 hover:!border-red-700'
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => handleAddItem(item.id)}
                    disabled={item.isAdded}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Card className="mb-4" bodyStyle={{ padding: '16px' }}>
        <TemplateColorItemForm
          templateName={templateName}
          onCancel={onCancel}
          onSubmit={(values) => console.log('New item form submitted:', values)}
          initialValues={{}}
        />

        {removeItem && (
          <ConfirmationModal
            open={removeItem}
            onClose={() => {
              setRemoveItem(null);
              setRemoveItemId(null);
            }}
            onConfirm={handleRemoveItem}
            type="danger"
            message="Are you want to remove this item?"
          />
        )}
      </Card>
    </div>
  );
};
