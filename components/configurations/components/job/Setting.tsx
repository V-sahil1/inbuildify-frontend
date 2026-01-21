'use client';
import React, { useEffect, useState } from 'react';
import { Switch, InputNumber, Select, Button, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchJobSetting,
  updateJobSetting,
} from '@redux/feature/admin/job/jobSetting/jobSettingThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { JobSettings } from '@redux/feature/admin/job/jobSetting/IJobSettingState';

export const Setting: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobSetting, status } = useAppSelector(state => state.job.jobSetting);
  const [settings, setSettings] = useState<JobSettings | null>(jobSetting);

  const fetchJobSettingData = async () => {
    try {
      await dispatch(fetchJobSetting()).unwrap();
    } catch (error) {
      message.error('Failed to fetch job settings');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchJobSettingData();
    }
  }, []);

  useEffect(() => {
    if (jobSetting && !settings) {
      setSettings(jobSetting);
    }
  }, [jobSetting, settings]);

  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    if (jobSetting && settings) {
      const { isUpdated } = getUpdatedFields(settings, jobSetting);
      setIsChanged(isUpdated);
    }
  }, [settings, jobSetting]);

  const handleChange = (key: keyof JobSettings, value: string | number | boolean) => {
    setSettings(prev => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!settings || !jobSetting) return;
    const { isUpdated, updatedFields } = getUpdatedFields(settings, jobSetting);
    if (!isUpdated) {
      message.info('No changes to save');
      return;
    }

    try {
      await dispatch(updateJobSetting(updatedFields)).unwrap();
      message.success('Settings saved successfully!');
    } catch (error) {
      message.error(error || 'Failed to save settings');
    }
  };

  const handleCancel = () => {
    setSettings(jobSetting);
  };

  return (
    <div className="p-6 space-y-8 text-gray-800">
      {/* Move to Maintenance */}
      <div className="flex items-start gap-4">
        <Switch
          checked={settings?.autoMoveToMaintenance}
          onChange={val => handleChange('autoMoveToMaintenance', val)}
        />
        <div>
          <div className="font-medium text-base">
            Move the Job to Maintenance Automatically when the Construction is Completed
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <Switch
          checked={settings?.autoMarkCompleted}
          onChange={val => handleChange('autoMarkCompleted', val)}
        />
        <div>
          <div className="font-medium text-base">Automatically Mark Job as Completed</div>
          <div className="text-sm text-gray-500 mt-1">
            Once all activities in the Final Stage of the Job Process are completed, the job status
            will automatically change to Completed.
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <Switch
          checked={settings?.autoArchiveAfterCompletion}
          onChange={val => handleChange('autoArchiveAfterCompletion', val)}
        />
        <div className="flex flex-col gap-1">
          <div className="font-medium text-base">Automatically Archive Job After Completion</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>After</span>
            {settings?.autoArchiveAfterCompletion && (
              <InputNumber
                min={1}
                value={settings?.autoArchiveAfterDays}
                onChange={val => handleChange('autoArchiveAfterDays', val)}
              />
            )}
            <span>days, job will automatically move to Archived status.</span>
          </div>
          <div className="text-sm text-gray-500">
            Ex: If the auto-archive period is set to 15 days and a job is completed on June 1st, it
            will be archived on June 16th.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 ml-10">
        <div className="font-medium text-base">Status of Milestone Task/Checklist</div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Report will be generated after</span>
          <InputNumber
            min={1}
            value={settings?.milestoneStatusCheckDays}
            onChange={val => handleChange('milestoneStatusCheckDays', val)}
          />
          <span>days for all referred jobs.</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 ml-10">
        <div className="font-medium text-base">Customize The Job Status Report And Email</div>
        <div className="grid grid-cols-3 gap-6 mt-2 text-sm text-gray-600">
          <div>
            <div className="font-medium">Number Of Days</div>
            <InputNumber
              min={1}
              value={settings?.reportCustomDays}
              onChange={val => handleChange('reportCustomDays', val)}
            />
          </div>
          <div>
            <div className="font-medium">Status</div>
            <Select
              value={settings?.reportStatusFilter}
              options={['all', 'completed', 'incompleted'].map(item => ({
                label: item,
                value: item,
              }))}
              onChange={val => handleChange('reportStatusFilter', val)}
              className="w-full mt-1"
            />
          </div>
          <div>
            <div className="font-medium">Date</div>
            <Select
              value={settings?.reportIncludeDate}
              options={[
                { label: 'included', value: true },
                { label: 'excluded', value: false },
              ].map(item => ({
                label: item.label,
                value: item.value,
              }))}
              onChange={val => handleChange('reportIncludeDate', val)}
              className="w-full mt-1"
            />
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2 leading-snug">
          The report will be produced for the days immediately preceding and following those
          mentioned, in addition to satisfying any other filter criteria.
          <br />
          Ex: If today is Jan 15th and the report is configured to cover a 15-day timeframe, it will
          include all tasks from the previous 15 days (starting from Jan 1st), as well as any
          forthcoming tasks that are planned to be finished within the next 15 days (until Jan
          30th).
        </div>
      </div>

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
