'use client'

import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Form, Select } from 'antd'
import RichTextEditor from '../rich-text-editor/RichTextEditor'

interface MailSendModalProps {
    open: boolean
    onCancel: () => void
    onSend: (data: { to: string[]; subject: string; content: string }) => void
    title?: string
}

const MailSendModal: React.FC<MailSendModalProps> = ({
    open,
    onCancel,
    onSend,
    title = 'Send Mail'
}) => {
    const [form] = Form.useForm()
    const [toEmails, setToEmails] = useState<string[]>([])
    const [inputValue, setInputValue] = useState('')
    const [editedContent, setEditedContent] = useState('')

    const handleInputConfirm = () => {
        const email = inputValue.trim()

        if (email && !toEmails.includes(email)) {
            setToEmails(prev => [...prev, email])
        }

        setInputValue('')
    }

    const handleEmailsChange = (values: string[]) => {
        setToEmails(values)
    }

    const handleSearch = (value: string) => {
        setInputValue(value)
    }

    const handleSend = () => {
        form.validateFields()
            .then(() => {
                onSend({
                    to: toEmails,
                    subject: form.getFieldValue('subject'),
                    content: editedContent
                })
                form.resetFields()
                setToEmails([])
                setEditedContent('')
                setInputValue('')
            })
            .catch(err => {
                console.log('Validation failed', err)
            })
    }

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="send" type="primary" onClick={handleSend}>Send</Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="To"
                    name="to"
                    rules={[{ required: true, message: 'Please add at least one recipient' }]}
                >
                    <Select
                        mode="tags"
                        placeholder="Enter recipient(s)"
                        style={{ width: '100%' }}
                        value={toEmails}
                        onChange={handleEmailsChange}
                        tokenSeparators={[',', ';']}
                        onSearch={handleSearch}
                        onInputKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleInputConfirm()
                            }
                        }}
                        onBlur={handleInputConfirm}
                    />
                </Form.Item>

                <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[{ required: true, message: 'Please enter subject' }]}
                >
                    <Input placeholder="Enter subject" />
                </Form.Item>

                <Form.Item label="Message" name="message">
                    <RichTextEditor
                        value={editedContent}
                        onChange={setEditedContent}
                        placeholder="Enter your message"
                        maxHeight="300px"
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default MailSendModal