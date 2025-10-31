import { Button, Input, Modal, Switch } from 'antd';

const HLPackageCopyModal = ({ title, open, onCancel, onOk }) => {
  return (
    <Modal open={open} onCancel={onCancel} title={title} okText="Copy" onOk={onOk} centered>
      <div className="p-3">
        <div className="mb-4">
          <Button type="primary">Link Lot</Button>
          <Button>Copy Lot</Button>
        </div>
        <div>
          <p className="mb-1">Title</p>
          <Input />
        </div>
        <p className="text-red-500">Note: Linked lot details can't be modified</p>
        <p className="mt-3">Are you sure you want to copy this package?</p>
        <div className="my-3 flex gap-2">
          <Switch /> <p>Get price from master</p>
        </div>
        <p className="text-red-500">
          Note: TBA,TBC and Additional items will be copied to the new package with the old price.
          Please review the new package and update the costs for applicable items.
        </p>
      </div>
    </Modal>
  );
};

export default HLPackageCopyModal;
