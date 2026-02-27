import useDwellingAndRangeHook from "@hooks/useDwellingAndRangeHook";
import { IconTable } from "@tabler/icons-react";
import { Form, Select, Tag, Tooltip } from "antd";

export const HLPackageHeader = ({ form, headerEditOpen, setHeaderEditOpen }) => {
    const { rangeOptions } = useDwellingAndRangeHook({ type: 'range' });
    const { dwellingTypeOptions } = useDwellingAndRangeHook({ type: 'dwellingType' });

    const SelectEditableField = ({ open, onChange, name, onClick, options }) => (
        <div>
            {open ? (
                <Form.Item name={name}>
                    <Select
                        className="w-full"
                        options={options}
                        onChange={onChange}
                        placeholder="Please Select"
                    />
                </Form.Item>
            ) : (
                <p onClick={onClick} className="cursor-pointer">
                    {options.find(option => option.value === form.getFieldValue(name))?.label}
                </p>
            )}
        </div>
    );
    return (
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
                House & Land Package <Tag color="blue">Available</Tag>
            </h1>
            <div>
                <div className="grid grid-cols-3 gap-8 text-primary">
                    <SelectEditableField
                        open={headerEditOpen.range || !form.getFieldValue('rangeId')}
                        name="rangeId"
                        options={rangeOptions}
                        onChange={() => {
                            setHeaderEditOpen(prev => ({ ...prev, range: false }));
                        }}
                        onClick={() => setHeaderEditOpen(prev => ({ ...prev, range: true }))}
                    />
                    <SelectEditableField
                        open={headerEditOpen.dwellingType || !form.getFieldValue('dwellingTypeId')}
                        name="dwellingTypeId"
                        options={dwellingTypeOptions}
                        onChange={() => {
                            setHeaderEditOpen(prev => ({ ...prev, dwellingType: false }));
                        }}
                        onClick={() => setHeaderEditOpen(prev => ({ ...prev, dwellingType: true }))}
                    />
                    <SelectEditableField
                        open={headerEditOpen.template || !form.getFieldValue('templateId')}
                        name="templateId"
                        options={[{ label: 'Template 1', value: 'template1' }, { label: 'Template 2', value: 'template2' }]}
                        onChange={() => {
                            setHeaderEditOpen(prev => ({ ...prev, template: false }));
                        }}
                        onClick={() => setHeaderEditOpen(prev => ({ ...prev, template: true }))}
                    />
                </div>
                <div className="grid grid-cols-3 gap-8 text-xs">
                    <p>Range</p>
                    <p>Dwelling Type</p>
                    <p>Template</p>
                </div>
            </div>
            <div className="text-primary border border-primary p-1 rounded-lg">
                <Tooltip title="Go to Listing">
                    <IconTable />
                </Tooltip>
            </div>
        </div>
    )
}