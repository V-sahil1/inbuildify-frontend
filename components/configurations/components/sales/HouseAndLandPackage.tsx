'use client';

import React, { useState, useEffect } from 'react';
import { Switch, Button, Typography, message } from 'antd';

const { Text } = Typography;

export const HouseAndLandPackage: React.FC = () => {
  const [includeFacadeCost, setIncludeFacadeCost] = useState(false);
  const [initialValue, setInitialValue] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      // Example API call:
      // const response = await api.get('/settings/include-facade-cost');
      const currentValue = true; // assume fetched
      setIncludeFacadeCost(currentValue);
      setInitialValue(currentValue);
    };
    fetchSetting();
  }, []);

  const handleToggle = (checked: boolean) => {
    setIncludeFacadeCost(checked);
    setIsChanged(checked !== initialValue);
  };

  const handleSave = async () => {
    try {
      // await api.post('/settings/include-facade-cost', { includeFacadeCost });
      console.log('Saving setting:', includeFacadeCost);
      message.success('Setting saved successfully');
      setInitialValue(includeFacadeCost);
      setIsChanged(false);
    } catch {
      message.error('Failed to save setting');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Text strong>Include the Facade Cost in the Total Package Cost</Text>
        <Switch checked={includeFacadeCost} onChange={handleToggle} />
      </div>

      {isChanged && (
        <div className="text-right mt-6">
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      )}
    </>
  );
};
