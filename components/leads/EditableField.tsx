import { Form, Button, Tooltip, Select, Input, message } from 'antd';
import { IconDeviceFloppy, IconEdit } from '@tabler/icons-react';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { useRef, useState } from 'react'
import { useClickOutside } from '@hooks/useClickOutside';
import { Option } from '@lib/utils/rangeAndDwellingObjToOptions';
import { Rule } from 'antd/es/form';
const { TextArea } = Input;

type EditableFieldProps = {
    label: string,
    name: string,
    value: string,
    rules: Rule[],
    loading: boolean,
    type: string,
    options?: Option[],
    initialValues: {},
    onSave: (values:any) => {},
    isleadEditing: boolean,
    setIsLeadEditing: (values) => void
}

const EditableField: React.FC<EditableFieldProps> = ({
    label,
    name,
    value,
    rules,
    loading,
    type,
    options,
    initialValues,
    onSave,
    isleadEditing,
    setIsLeadEditing
}) => {

    const [form] = Form.useForm();
    const [editedValue, setEditedValue] = useState(value);
    const ref = useRef(null)
    const handleSubmit = async (values) => {
        await form.validateFields();
        onSave(values);
    }
    useClickOutside(ref, () => {
        if (isleadEditing) {
            form.setFieldsValue({ [name]: value });
            { name === 'leadSource' && setIsLeadEditing((prev) => ({ ...prev, leadSource: false })) }
            { name === 'notes' && setIsLeadEditing((prev) => ({ ...prev, notes: false })) }
        }
    });
    return (
        <>
            <Form onFinish={handleSubmit} form={form} initialValues={initialValues}>
                <div className='grid grid-cols-8 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 mb-2 items-baseline '>
                    <div className='col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-3 font-semibold text-font-color'>{label}:</div>
                    <div className='col-span-3 sm:col-span-2 lg:col-span-5 items-center' ref={ref}>
                        {isleadEditing ? (
                            <Form.Item name={name} rules={rules} >
                                {
                                    type === 'Select' &&
                                    <Select options={options} defaultValue={value}
                                        disabled={loading}
                                        onChange={(value) => setEditedValue(value)} />
                                }
                                {
                                    type === 'TextArea' &&
                                    <TextArea
                                    className='!resize-none'
                                        name="notes"
                                        disabled={loading}
                                        maxLength={500}
                                        rows={4}
                                        onChange={(e) => setEditedValue(e.target.value.trim())}
                                    />
                                }
                            </Form.Item>
                        ) : (
                            <div className='text-font-color'><Tooltip title={enumToReadable(value) || 'Not Available'}><p className='truncate'>{enumToReadable(value) || 'N/A'}</p></Tooltip></div>
                        )}
                    </div>
                    <div className='col-span-1'>
                        {isleadEditing ? (
                            <Form.Item>
                                <Button type='text' htmlType='submit' disabled={value === editedValue || loading} loading={loading}
                                    icon={<IconDeviceFloppy size={20} />}  ></Button>
                            </Form.Item>
                        ) : (
                            <Button type='text' onClick={() => {
                                { name === 'leadSource' && setIsLeadEditing((prev) => ({ ...prev, leadSource: true })) }
                                { name === 'notes' && setIsLeadEditing((prev) => ({ ...prev, notes: true })) }
                            }} icon={<IconEdit size={20} />} ></Button>
                        )}
                    </div>
                </div>
            </Form>
        </>
    )
}

export default EditableField;