import {
  IconCheck,
  IconDotsVertical,
  IconMessage,
  IconPaperclip,
  IconPencil,
  IconPinFilled,
  IconPlus,
  IconTruck,
} from '@tabler/icons-react';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Dropdown,
  Tag,
  Badge,
  Tooltip,
} from 'antd';
import BookingSupplierDrawer from './BookingSupplierDrawer';
import { useState } from 'react';
import EmailContent from './EmailContent';
import ChecklistNotesModal from './ChecklisrNotesModal';
import { ChecklistSubtaskModal } from './ChecklistSubtaskModal';
import { ChecklistSubtaskItem } from './ChecklistSubtaskItem';
import { color } from 'framer-motion';
import { ConfirmationContentModal } from '../common/ConfirmationContentModal';
import ConstructionChecklistModal from './ConstructionChecklistModal';

const ConstructionChecklistItem = ({
  values,
  index,
  form,
  isDefect,
  onSubmit,
  onEditChecklist,
}) => {
  const [supplierBookOpen, setSupplierBookOpen] = useState(false);
  const [supplierMessageOpen, setSupplierMessageOpen] = useState(false);
  const [subtaskItems, setSubtaskItems] = useState([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [subtaskOpen, setSubtaskOpen] = useState(false);
  const [supplierStatus, setSupplierStatus] = useState({ status: '', color: '' });
  const [confimationOpen, setConfirmationOpen] = useState(false);
  const [save, setSave] = useState(false);
  const [supplierAccept, setSupplierAccept] = useState(false);
  const [checklistEdit, setChecklistEdit] = useState(false);
  const { TextArea } = Input;
  const items = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
    { key: 'notes', label: 'Add Notes' },
    { key: 'subtask', label: 'Add Subtask Item' },
    { key: 'notApplicable', label: 'Mark As Not Applicable' },
  ];
  function addSubtaskItem(values) {
    setSubtaskItems(prev => [...prev, { values: values }]);
  }

  const ConfirmationContent = (
    <div className="p-3 text-center">
      <p>There is already an existing booking associated with this checklist.</p>
      <p className="mt-4">
        Are you sure you want to cancel the current booking and mark this checklist as Not
        Applicable?
      </p>
    </div>
  );
  const supplierAcceptContent = (
    <div className="p-2">
      <p>Notes</p>
      <TextArea rows={3} showCount maxLength={500} className="mt-2" />
      <p className="mt-4 text-center">Are you sure supplier accepted the booking?</p>
    </div>
  );
  async function handleSave() {
    const values = await form.validateFields();
    onSubmit(values);
    setSave(!save);
  }

  function handleSubmit(editedvalues) {
    onEditChecklist(index, editedvalues);
    setChecklistEdit(false);
  }
  return (
    <>
      <div className="table-row bg-card-color">
        <div className="table-cell p-3 w-[100px]">
          <div>
            <div className="flex">
              {isDefect && <Tag color="orange">Defect</Tag>}
              <p className="text-black">{values?.checklist}</p>
            </div>
            <p className="flex items-center gap-1 text-xs text-blue mt-1 cursor-pointer">
              {' '}
              <div className="rounded-full w-3 h-3 bg-blue text-white">
                <IconPlus size={12} />
              </div>
              Notes
            </p>
          </div>
        </div>
        <div className="table-cell p-3 text-left w-[130px] ">
          <div className="flex justify-between items-baseline">
            <Form.Item name={['checklist', index, 'supplier']}>
              {save ? (
                <Dropdown
                  menu={{
                    items: [
                      { key: 'accepted', label: 'Mark As Accepted' },
                      { key: 'cancel', label: 'Cancel Booking' },
                    ],
                    onClick: e => {
                      if (e.key === 'accepted') {
                        setSupplierAccept(true);
                      }
                    },
                  }}
                >
                  <p> {form.getFieldValue(['checklist', index, 'supplier'])}</p>
                </Dropdown>
              ) : (
                <Select
                  placeholder="Assign Supplier"
                  options={[
                    { label: 'supplier1', value: 'supplier1' },
                    { label: 'supplier2', value: 'supplier2' },
                  ]}
                  disabled={save}
                />
              )}
            </Form.Item>
            <Tooltip title="Send Message">
              {' '}
              <IconMessage
                size={20}
                className="text-blue cursor-pointer"
                onClick={() => setSupplierMessageOpen(true)}
              />
            </Tooltip>

            {form.getFieldValue(['checklist', index, 'supplier']) ? (
              <Tooltip title="Book Supplier">
                <Badge
                  color="red"
                  count={
                    <IconCheck
                      size={12}
                      style={{
                        backgroundColor: `${supplierStatus.color}`,
                        borderRadius: '100%',
                        color: 'white',
                      }}
                    />
                  }
                >
                  <IconTruck
                    size={20}
                    className="text-blue cursor-pointer"
                    onClick={() => setSupplierBookOpen(true)}
                  />
                </Badge>
              </Tooltip>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="table-cell p-3 text-left w-[130px]">
          <Form.Item name={['checklist', index, 'start']}>
            <DatePicker
              className="!pl-0 text-blue"
              variant="borderless"
              suffixIcon={null}
              allowClear={true}
              disabled={save}
            />
          </Form.Item>
        </div>
        <div className="table-cell p-3 text-left w-[130px]">
          <Form.Item name={['checklist', index, 'finish']}>
            <DatePicker
              className="!pl-0 text-blue"
              variant="borderless"
              suffixIcon={null}
              allowClear={true}
              disabled={save}
            />
          </Form.Item>
        </div>
        <div className="table-cell p-3  w-[130px]">
          {supplierStatus.status === 'notApplicable' ? (
            <Tag color="yellow">Not Applicable</Tag>
          ) : (
            <Form.Item
              name={['checklist', index, 'complete']}
              initialValue={false}
              valuePropName="checked"
            >
              <Checkbox disabled={save} />
            </Form.Item>
          )}
        </div>
        <div className="table-cell p-3 text-center w-[130px]"> </div>
        <div className="table-cell p-3  w-[130px]">
          <div className="flex gap-3">
            <Button
              type="text"
              onClick={handleSave}
              icon={save ? <IconPencil size={15} /> : <IconCheck size={15} />}
            ></Button>
            <Button type="text" className="text-blue" icon={<IconPaperclip size={15} />} />
            <Dropdown
              menu={{
                items,
                onClick: e => {
                  if (e.key === 'notes') {
                    setNotesOpen(true);
                  } else if (e.key === 'subtask') {
                    setSubtaskOpen(true);
                  } else if (e.key === 'notApplicable') {
                    setConfirmationOpen(true);
                  } else if (e.key === 'edit') {
                    setChecklistEdit(true);
                  }
                },
              }}
              trigger={['click']}
            >
              <Button type="text" className="text-blue" icon={<IconDotsVertical size={15} />} />
            </Dropdown>
          </div>
        </div>
      </div>

      {/* subtask */}
      {subtaskItems.map((item, ind) => (
        <ChecklistSubtaskItem ind={ind} checkind={index} values={item.values} />
      ))}
      <BookingSupplierDrawer
        title={`Booking Supplier - ${values?.checklist}`}
        open={supplierBookOpen}
        onCancel={() => setSupplierBookOpen(false)}
        values={form.getFieldValues}
        onSubmit={() => {
          console.log('helo');
          setSupplierStatus({ status: 'pending', color: 'yellow' });
        }}
      />
      <EmailContent
        title={`Supplier - ${values?.checklist}`}
        open={supplierMessageOpen}
        onCancel={() => setSupplierMessageOpen(false)}
        onSubmit={() => { setSupplierMessageOpen(false) }}
        initialValues={{}}
      />
      <ChecklistNotesModal
        open={notesOpen}
        onCancel={() => setNotesOpen(false)}
        onSubmit={() => { setNotesOpen(false) }}
      />
      <ChecklistSubtaskModal
        open={subtaskOpen}
        onCancel={() => setSubtaskOpen(false)}
        onSubmit={addSubtaskItem}
      />
      <ConfirmationContentModal
        content={ConfirmationContent}
        open={confimationOpen}
        onClose={() => {
          setConfirmationOpen(false);
        }}
        onSubmit={() => {
          setSupplierStatus({ status: 'notApplicable', color: 'yellow' });
          setConfirmationOpen(false);
        }}
        okText="Mark As Not Applicable"
        title="Confirmation"
      />
      <ConfirmationContentModal
        content={supplierAcceptContent}
        open={supplierAccept}
        onClose={() => setSupplierAccept(false)}
        onSubmit={() => {
          setSupplierStatus({ status: 'accepted', color: 'green' });
          setSupplierAccept(false);
        }}
        title="Confirmation"
        okText="Mark As Supplier Accepted"
      />
      <ConstructionChecklistModal
        key={JSON.stringify(values)}
        title={isDefect ? 'Edit Defect Checklist' : 'Edit Checklist'}
        open={checklistEdit}
        onCancel={() => {
          setChecklistEdit(false);
        }}
        onSubmit={handleSubmit}
        initialValues={values}
        isDefect={isDefect}
      />
    </>
  );
};

export default ConstructionChecklistItem;
