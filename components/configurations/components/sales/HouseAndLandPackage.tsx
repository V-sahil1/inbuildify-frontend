'use client';

import React, { useState, useEffect } from 'react';
import { Switch, Button, Typography, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchhlPackageSetting,
  updatehlPackageSetting,
} from '@redux/feature/admin/sales/hlPackage/hlPackageThunk';
import { Status } from '@lib/constants/enum';

const { Text } = Typography;

export const HouseAndLandPackage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hlPackageSetting, status } = useAppSelector(state => state.sales.hlPackageSetting);
  const [includeFacadeCost, setIncludeFacadeCost] = useState(false);
  const [initialValue, setInitialValue] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        await dispatch(fetchhlPackageSetting()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch setting');
      }
    };
    if (status.fetch === Status.IDLE) {
      fetchSetting();
    }
    if (hlPackageSetting) {
      setIncludeFacadeCost(hlPackageSetting.includeFacadeCostInTotal);
      setInitialValue(hlPackageSetting.includeFacadeCostInTotal);
    }
  }, [status.fetch]);

  const handleToggle = (checked: boolean) => {
    setIncludeFacadeCost(checked);
    setIsChanged(checked !== initialValue);
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updatehlPackageSetting({
          data: { includeFacadeCostInTotal: includeFacadeCost },
          id: hlPackageSetting.houseLandPackageSettingsId,
        })
      ).unwrap();
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
        <Text strong className="text-font-color-100">
          Include the Facade Cost in the Total Package Cost
        </Text>
        <Switch
          checked={includeFacadeCost}
          onChange={handleToggle}
          disabled={status.update === Status.PENDING}
        />
      </div>

      {isChanged && (
        <div className="text-right mt-6">
          <Button type="primary" onClick={handleSave} loading={status.update === Status.PENDING}>
            Save
          </Button>
        </div>
      )}
    </>
  );
};
