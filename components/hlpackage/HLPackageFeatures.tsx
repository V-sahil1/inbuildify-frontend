import { IconSearch, IconTable } from "@tabler/icons-react"
import { Checkbox, Form, Input, Select } from "antd"
const { TextArea } = Input

export const HLPackageFeatures = ({ filters, setParams, form }) => {
    return (
        <div className="flex-1">
            <div className="p-4 m-2 bg-card-color">
                <div className="flex justify-between my-2">
                    <p>House Features</p>
                    <div className="text-blue">
                        <IconTable size={20} />
                    </div>
                </div>
                <Input
                    addonBefore={<IconSearch size={20} />}
                    placeholder="Search Feature.."
                    size="small"
                    value={filters.houseFeature}
                    onChange={e => setParams({ houseFeature: e.target.value })}
                />
                <div className="mt-2">
                    <div className="flex gap-2">
                        <Checkbox />
                        <p>Select All</p>
                    </div>
                    <div className="flex gap-2">
                        <Checkbox />
                        <p>new</p>
                    </div>
                </div>
            </div>
            <div className="p-4 m-2 bg-card-color">
                <div className="flex justify-between my-1">
                    <p>Disclaimer</p>
                    <div className="text-blue">
                        <IconTable size={20} />
                    </div>
                </div>
                <Form.Item name='disclaimerType'>
                    <Select size="small" options={[{ label: 'Validity', value: 'validity' }, { label: 'Standard', value: 'standard' }]} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name='disclaimerDescription'>
                    <TextArea
                        rows={4}
                        style={{ resize: 'none' }}
                        showCount
                        className="my-2"
                        maxLength={500}
                    />
                </Form.Item>

            </div>
        </div>
    )
}