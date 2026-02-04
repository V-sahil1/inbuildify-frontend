import { Button, Drawer, Select } from 'antd';

export const JobStageDeleteDrawer = ({ open, onClose, onSubmit }) => {
  return (
    <Drawer title="Deleting the Stage" open={open} onClose={onClose} size="large">
      <div className="text-font-color">
        <p>
          Are you sure you want to delete this stage? Completed stages will remain in existing jobs,
          while stages that have not started will be removed from existing jobs.
        </p>
        <p className="my-2">Please note:</p>
        <div className="ml-3">
          <p>
            Since the stage has task dependencies, please review and update the predecessor mapping
            to ensure workflow continuity.
          </p>
          <p>
            By default, the last task of the previous stage will be linked to the first task of the
            next stage. You may manually select a different task if needed.
          </p>
        </div>

        <p className="my-3">Predecessor Mapping</p>
        <div className="flex justify-between items-center">
          <p>Request Working Drawer</p>
          <Select placeholder="Please Select" />
        </div>
        <div className="flex gap-2 justify-end mt-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Delete</Button>
        </div>
      </div>
    </Drawer>
  );
};
