'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Button, message } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchJobWorkflow, updateJobWorkflow } from '@redux/feature/admin/job/jobWorkflow/jobWorkflowThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { JobWorkflow } from '@redux/feature/admin/job/jobWorkflow/IJobWorkflowState';

const { Text } = Typography;

export const Workflow = () => {
  const dispatch = useAppDispatch();
  const { jobWorkflow, status } = useAppSelector(state => state.job.jobWorkflow);
  const [settings, setSettings] = useState<JobWorkflow | null>(jobWorkflow);
  const [isChanged, setIsChanged] = useState(false);

  const fetchJobWorkflowData = useCallback(async () => {
    try {
      await dispatch(fetchJobWorkflow()).unwrap();
    } catch (error) {
      message.error('Failed to fetch job workflow settings');
    }
  }, [dispatch]);

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchJobWorkflowData();
    }
  }, [status.fetch, fetchJobWorkflowData]);

  useEffect(() => {
    if (jobWorkflow && !settings) {
      setSettings(jobWorkflow);
    }
  }, [jobWorkflow, settings]);

  useEffect(() => {
    if (jobWorkflow && settings) {
      const changedValues = getUpdatedFields(settings, jobWorkflow);
      const hasChanges = Object.keys(changedValues).length > 0;
      setIsChanged(hasChanges);
    }
  }, [settings, jobWorkflow]);

  const handleChange = (key: keyof JobWorkflow, value: boolean) => {
    setSettings(prev => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  const handleSave = async () => {
    if (!settings || !jobWorkflow) return;
    const changedValues = getUpdatedFields(settings, jobWorkflow);

    if (Object.keys(changedValues).length === 0) {
      message.info('No changes to save');
      return;
    }

    try {
      await dispatch(updateJobWorkflow(changedValues)).unwrap();
      message.success('Workflow settings saved successfully!');
    } catch (error) {
      message.error(error || 'Failed to save workflow settings');
      console.error('Save error:', error);
    }
  };

  const handleCancel = () => {
    setSettings(jobWorkflow);
  };

  return (
    <div>
      <InputSwitch
        name="showAllTasksToAllRoles"
        label="Show all Tasks to all Roles"
        description=""
        value={settings?.showAllTasksToAllRoles || false}
        onChange={val => handleChange('showAllTasksToAllRoles', val)}
      />

      <InputSwitch
        name="includeWeekendDate"
        label="Include Weekend Date"
        description={
          <>
            <Text type="secondary">
              If weekend is turned on – Estimated date calculation will consider weekends.
              <br />
              If weekend is turned off – Estimated date calculation will not consider weekends.
              <br />
              <b>Ex:</b> If days given for task is 31 days – Estimated date is 1st January and
              there are 4 weekends (8 days). Estimated date will be 31st January if weekend is
              on, 10th February if off.
            </Text>
          </>
        }
        value={settings?.includeWeekendDate || false}
        onChange={val => handleChange('includeWeekendDate', val)}
      />

      <InputSwitch
        name="includeHolidayDate"
        label="Include Holiday Date"
        description={
          <>
            <Text type="secondary">
              If holidays is turned on – Estimated date calculation will consider company
              holidays.
              <br />
              If holidays is turned off – it won't consider company holidays.
              <br />
              <b>Note:</b> If a holiday falls under weekend and weekend is turned on, it's
              counted as a holiday.
              <br />
              <b>Ex:</b> If task days are 31 – Estimated date is 1st January and 14–15 January
              are holidays. Date will be 31st Jan if on, 2nd Feb if off.
            </Text>
          </>
        }
        value={settings?.includeHolidayDate || false}
        onChange={val => handleChange('includeHolidayDate', val)}
      />

      <InputSwitch
        name="recalculateEstimatedEndDatesFutureTasks"
        label="Re-calculate the Estimated End dates of Future Tasks"
        description={
          <Text type="secondary">
            Changing the estimated end date of any task will change the estimated end date of
            further tasks.
          </Text>
        }
        value={settings?.recalculateEstimatedEndDatesFutureTasks || false}
        onChange={val => handleChange('recalculateEstimatedEndDatesFutureTasks', val)}
      />

      <InputSwitch
        name="recalculateEstimatedDatesBasedOnActualChanges"
        label="Re-calculate the Estimated dates automatically based on Actual date changes"
        description={
          <Text type="secondary">
            When turned ON: Future estimated dates will be automatically recalculated based on
            actual date changes.
            <br />
            When turned OFF: A confirmation popup will appear before applying changes.
            <br />
            <b>Note:</b> This controls how estimated dates are recalculated when actual dates
            are updated.
          </Text>
        }
        value={settings?.recalculateEstimatedDatesBasedOnActualChanges || false}
        onChange={val => handleChange('recalculateEstimatedDatesBasedOnActualChanges', val)}
      />

      {isChanged && (
        <div className="flex justify-end gap-3 pt-6 border-t mt-10">
          <Button
            size="large"
            onClick={handleCancel}
            disabled={status.update === Status.PENDING}
            className="px-10"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            loading={status.update === Status.PENDING}
            className="px-10"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
