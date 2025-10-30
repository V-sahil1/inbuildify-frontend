import { Modal } from "antd";

export function ConfirmationContentModal({ content, open, onClose, title, okText, onSubmit }) {
    return (
        <Modal title={title} okText={okText} open={open} onCancel={onClose} onOk={onSubmit} centered>
            {content}
        </Modal>
    )
}