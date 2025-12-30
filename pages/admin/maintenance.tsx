import { useEffect, useMemo } from 'react';
import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { SettingPage } from '@/components/configurations/components/maintenance/Setting';
import { MaintenanceAreaPage } from '@/components/configurations/components/maintenance/MaintenanceArea';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchMaintenanceSetting } from '@redux/feature/admin/maintenance/maintenanceSetting/maintenanceSettingThunk';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';

const BASE_TABS = [
  {
    id: 'setting',
    label: tabsLabel('Maintenance Setting', 'manage Maintenance duration'),
    component: SettingPage,
  },
];


export default function MaintenanceConfig() {
  const dispatch = useAppDispatch();
  const { maintenanceSetting, status } = useAppSelector(
    state => state.maintenance.maintenanceSetting
  );

  const fetchData = async () => {
    try {
      await dispatch(fetchMaintenanceSetting()).unwrap();
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch maintenance settings');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchData();
    }
  }, [dispatch, status.fetch]);

  const tabs = useMemo(() => {
    const tabsList = [...BASE_TABS];

    if (maintenanceSetting?.areaEnabled) {
      tabsList.push({
        id: 'maintenance-area',
        label: tabsLabel('Maintenance Area', 'add new area'),
        component: MaintenanceAreaPage,
      });
    }

    return tabsList;
  }, [maintenanceSetting]);

  return <TabLayout tabs={tabs} />;
}
