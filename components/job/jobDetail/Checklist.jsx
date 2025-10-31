import { IconPencil, IconPlus } from '@tabler/icons-react';
import { Button, Checkbox, Input, Select } from 'antd';
import { useState } from 'react';
const { TextArea } = Input;

const CheckList = ({ title, type }) => {
  const [isNotesOpen, setNotesOpen] = useState(false);
  const [isEditNotesopen, setIsEditNotesOpen] = useState(false);

  const handleNotesEdit = () => {
    setIsEditNotesOpen(true);
    setNotesOpen(false);
  };

  const handleNotesDelete = () => {};

  return (
    <div className="border-b-2 border-border-color p-3">
      <div className="flex justify-between ">
        <div>{title}</div>
        <div className="flex">
          {type === 'dropdown' && (
            <Select
              placeholder="Please Select"
              options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
                { value: 'N/A', label: 'N/A' },
              ]}
              className="w-[130px]"
            />
          )}
          {type === 'checkbox' && <Checkbox />}
        </div>
      </div>
      <div className="flex gap-2 items-center" onClick={() => setNotesOpen(true)}>
        <div className="rounded-full text-sm w-4 h-4  text-white bg-primary flex items-center justify-center">
          {' '}
          <IconPlus size={15} />{' '}
        </div>
        <div>Notes</div>
        {isEditNotesopen && <IconPencil size={20} />}
      </div>
      {isNotesOpen && (
        <div className="bg-card-color p-3 ">
          <TextArea showCount maxLength={500} />
          <div className="flex gap-2 justify-end mt-6">
            <Button onClick={() => setNotesOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleNotesEdit}>
              {' '}
              OK
            </Button>
            {isEditNotesopen && (
              <Button type="primary" onClick={handleNotesDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default CheckList;
