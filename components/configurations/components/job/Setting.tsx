'use client';
import React, { useEffect, useState } from 'react';
import { Switch, InputNumber, Select, Button, message } from 'antd';

export const Setting: React.FC = () => {
  const [settings, setSettings] = useState({
    moveToMaintenance: true,
    markCompleted: true,
    autoArchive: true,
    archiveDays: 90,
    milestoneDays: 15,
    reportDays: 15,
    status: 'all',
    date: 'included',
  });

  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    setIsChanged(settings.moveToMaintenance !== settings.moveToMaintenance);
  }, [settings.moveToMaintenance]);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      if (JSON.stringify(updated) !== JSON.stringify(prev)) {
        setIsChanged(true);
      }
      return updated;
    });
  };

  const handleSave = () => {
    console.log('✅ Saved Settings:', settings);
    message.success('Settings saved successfully!');
    setIsChanged(false);
  };

  return (
    <div className="p-6 space-y-8 text-gray-800">
      {/* Move to Maintenance */}
      <div className="flex items-start gap-4">
        <Switch
          checked={settings.moveToMaintenance}
          onChange={val => handleChange('moveToMaintenance', val)}
        />
        <div>
          <div className="font-medium text-base">
            Move the Job to Maintenance Automatically when the Construction is Completed
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <Switch
          checked={settings.markCompleted}
          onChange={val => handleChange('markCompleted', val)}
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
        <Switch checked={settings.autoArchive} onChange={val => handleChange('autoArchive', val)} />
        <div className="flex flex-col gap-1">
          <div className="font-medium text-base">Automatically Archive Job After Completion</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>After</span>
            <InputNumber
              min={1}
              value={settings.archiveDays}
              onChange={val => handleChange('archiveDays', val)}
            />
            <span>days, the job will automatically move to Archived status.</span>
          </div>
          <div className="text-sm text-gray-500">
            Ex: If the auto-archive period is set to 15 days and the job is completed on June 1st,
            it will be archived on June 16th.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 ml-10">
        <div className="font-medium text-base">Status of Milestone Task/Checklist</div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Report will be generated after</span>
          <InputNumber
            min={1}
            value={settings.milestoneDays}
            onChange={val => handleChange('milestoneDays', val)}
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
              value={settings.reportDays}
              onChange={val => handleChange('reportDays', val)}
            />
          </div>
          <div>
            <div className="font-medium">Status</div>
            <Select
              value={settings.status}
              options={['all', 'completed', 'incompleted'].map(item => ({
                label: item,
                value: item,
              }))}
              onChange={val => handleChange('status', val)}
              className="w-full mt-1"
            />
          </div>
          <div>
            <div className="font-medium">Date</div>
            <Select
              value={settings.date}
              options={['included', 'excluded'].map(item => ({
                label: item,
                value: item,
              }))}
              onChange={val => handleChange('date', val)}
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
        <div className="flex justify-end pt-6 border-t mt-10">
          <Button type="primary" size="large" onClick={handleSave} className="px-10">
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
