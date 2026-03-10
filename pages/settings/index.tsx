import dynamic from 'next/dynamic';
import {
  IconChartFunnel,
  IconServer2,
  IconProgress,
  IconCalendarMonth,
  IconTool,
  IconLabelImportant,
  IconAdjustmentsCog,
  IconPaint,
} from '@tabler/icons-react';
import TabLayout from '@/components/common/TabLayout';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { message } from 'antd';
import { getDwellingTypes, getRanges } from '@redux/feature/types/typesThunk';
import { Status } from '@lib/constants/enum';

const RangeAndDwelling = dynamic(() => import('./components/RangeAndDwelling'), { ssr: false });
const MasterPriceList = dynamic(() => import('./components/MasterPriceList'), { ssr: false });
const FloorPlan = dynamic(() => import('./components/FloorPlan'), { ssr: false });
const Facade = dynamic(() => import('./components/Facade'), { ssr: false });
const Package = dynamic(() => import('./components/Package'), { ssr: false });
const Service = dynamic(() => import('./components/Service'), { ssr: false });
const LeadSource = dynamic(() => import('./components/LeadSource'), { ssr: false });
const WorkflowProcessPage = dynamic(() => import('./components/WorkflowProcess'), { ssr: false });
const ColourCategoryPage = dynamic(() => import('./components/Colour'), { ssr: false });

const TABS = [
  {
    id: 'range-dwelling',
    label: 'Types',
    icon: IconChartFunnel,
    breadcrumb: 'Types',
    component: RangeAndDwelling,
  },
  {
    id: 'items',
    label: 'Master Pricing',
    icon: IconServer2,
    breadcrumb: 'Master Pricing',
    component: MasterPriceList,
  },
  {
    id: 'floor-plan',
    label: 'Floor Plan',
    icon: IconProgress,
    breadcrumb: 'Floor Plan',
    component: FloorPlan,
  },
  {
    id: 'facade',
    label: 'Facade',
    icon: IconProgress,
    breadcrumb: 'Facade',
    component: Facade,
  },
  {
    id: 'package',
    label: 'Package',
    icon: IconCalendarMonth,
    breadcrumb: 'Package',
    component: Package,
  },
  { id: 'service', label: 'Service', icon: IconTool, breadcrumb: 'Service', component: Service },
  {
    id: 'lead-source',
    label: 'Lead Source',
    icon: IconLabelImportant,
    breadcrumb: 'Lead Source',
    component: LeadSource,
  },
  {
    id: 'workflow-process',
    label: 'Workflow Process',
    icon: IconAdjustmentsCog,
    breadcrumb: 'Workflow Process',
    component: WorkflowProcessPage,
  },
  {
    id: 'colour',
    label: 'Colour',
    icon: IconPaint,
    breadcrumb: 'Colour',
    component: ColourCategoryPage,
  },
];

export default function ProjectList() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state: any) => state.types);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status.range === Status.IDLE) await dispatch(getRanges()).unwrap();
        if (status.dwellingType === Status.IDLE) await dispatch(getDwellingTypes()).unwrap();
      } catch (err: any) {
        message.error(err);
      }
    };
    fetchData();
  }, [dispatch, status]);

  return <TabLayout tabs={TABS} breadcrumbBase={{ link: 'Settings', url: '/settings' }} />;
}
