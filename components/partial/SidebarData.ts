import SystemRoutes from '@lib/constants/Routes';
import { ContractReport } from '@lib/utils/Reports/job/contractReport';
import { CostSummaryReport } from '@lib/utils/Reports/job/costSummary';
import { CustomerStatusReport } from '@lib/utils/Reports/job/customerStatusReport';
import { DelayExtensionNoticeReport } from '@lib/utils/Reports/job/delayExtensionNoticeReport';
import { InvoicePaymentsReport } from '@lib/utils/Reports/job/invoicePaymentsReport';
import { JobStatusReport } from '@lib/utils/Reports/job/jobStatusReport';
import { LandTitleForcastReport } from '@lib/utils/Reports/job/landTitleForcastReport';
import { NoActionJobReport } from '@lib/utils/Reports/job/noActionJobReport';
import { SurveyReport } from '@lib/utils/Reports/job/surveyReport';
import { VariationReport } from '@lib/utils/Reports/job/variationReport';
import { MaintenanceDetailedReport } from '@lib/utils/Reports/maintenance/maintenanceDetailedReport';
import { MaintenanceDetailReport } from '@lib/utils/Reports/maintenance/maintenanceDetailReport';
import { AgentSummaryReport } from '@lib/utils/Reports/sales/agentSummaryReport';
import { CommissionReport } from '@lib/utils/Reports/sales/commissionReport';
import { FloorPlanFacadeReport } from '@lib/utils/Reports/sales/floorPlanFacadeReport';
import { LeadFocusReport } from '@lib/utils/Reports/sales/LeadFocusReport';
import { NoActionLeadsReport } from '@lib/utils/Reports/sales/noActionLeadsReport';
import { PerformanceReport } from '@lib/utils/Reports/sales/performanceReport';
import { QuotationReport } from '@lib/utils/Reports/sales/quotationReport';
import {
  IconHome,
  IconBuildingSkyscraper,
  IconCrane,
  IconTools,
  IconDiamond,
  IconCalendar,
  IconShieldCheck,
  IconChartHistogram,
  IconSettings,
  IconShoppingCart,
  IconBriefcase,
  IconFolderOpen,
  IconFileDescription,
  IconPlugConnected,
  IconTemplate,
  IconWorldWww,
  IconCalendarTime,
  IconDotsCircleHorizontal,
  IconBuildingCog,
} from '@tabler/icons-react';

const commonRoles = ['builder', 'contractor', 'customer'];
export const menuList = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean);
  const isAdminRoute = parts[0] === 'admin';

  if (isAdminRoute) {
    return [
      {
        icon: IconSettings,
        link: 'General',
        roles: commonRoles,
        url: `/admin/general`,
      },

      {
        icon: IconShoppingCart,
        link: 'Sales',
        roles: commonRoles,
        url: `/admin/sales`,
      },

      {
        icon: IconBriefcase,
        link: 'Job',
        roles: commonRoles,
        url: `/admin/job`,
      },
      {
        icon: IconBuildingCog,
        link: 'Construction',
        roles: commonRoles,
        url: `/admin/construction`,
      },

      {
        icon: IconTools,
        link: 'Maintenance',
        roles: commonRoles,
        url: `/admin/maintenance`,
      },
      {
        icon: IconFileDescription,
        link: 'Document',
        roles: commonRoles,
        url: `/admin/document`,
      },
      {
        icon: IconPlugConnected,
        link: 'Integration',
        roles: commonRoles,
        url: `/admin/integration`,
      },
      {
        icon: IconTemplate,
        link: 'Templates',
        roles: commonRoles,
        url: `/admin/templates`,
      },
      {
        icon: IconCalendarTime,
        link: 'Scheduler',
        roles: commonRoles,
        url: `/admin/scheduler`,
      },
      {
        icon: IconWorldWww,
        link: 'Portal',
        roles: commonRoles,
        url: `/admin/portal`,
      },
    ];
  }
  return [
    {
      icon: IconHome,
      link: 'My Dashboard',
      url: '/',
      roles: ['builder', 'contractor', 'customer'],
    },
    {
      icon: IconCalendar,
      link: 'Calendar',
      url: SystemRoutes.CALENDAR,
      roles: ['builder', 'contractor', 'customer'],
    },
    {
      icon: IconDiamond,
      link: 'Sales',
      roles: ['builder', 'contractor', 'customer'],
      children: [
        {
          link: 'Leads',
          url: SystemRoutes.LEADS,
          roles: ['builder', 'contractor', 'customer'],
        },
        {
          link: 'Quotation',
          url: SystemRoutes.QUOTATION,
          roles: ['builder', 'contractor', 'customer'],
        },
        {
          link: 'Campaigns',
          url: SystemRoutes.CAMPAIGN,
          roles: ['builder', 'contractor', 'customer'],
        },
        {
          link: 'HL Package',
          url: SystemRoutes.HLPACKAGE,
          roles: ['builder', 'contractor', 'customer'],
        },
        {
          link: 'Land',
          url: '/land',
          roles: ['builder', 'contractor', 'customer'],
        },
      ],
    },
    {
      icon: IconShieldCheck,
      link: 'Job',
      url: SystemRoutes.JOB,
      roles: ['builder', 'contractor', 'customer'],
    },
    {
      icon: IconCrane,
      link: 'Construction',
      url: '/construction',
      roles: ['builder', 'contractor', 'customer'],
    },
    {
      icon: IconTools,
      link: 'Maintenance',
      url: '/maintenance',
      roles: ['builder', 'contractor', 'customer'],
    },
    {
      icon: IconFolderOpen,
      link: 'S Drive',
      url: '/sdrive',
      roles: ['builder'],
    },
    {
      icon: IconChartHistogram,
      link: 'Reports',
      roles: commonRoles,
      children: [
        {
          link: 'Sales',
          roles: commonRoles,
          children: [
            {
              link: 'Lead / Focus Report',
              roles: commonRoles,
              onClick: () => {
                LeadFocusReport();
              }
            },
            {
              link: 'Quotation Report',
              roles: commonRoles,
              onClick: () => {
                QuotationReport();
              }
            },
            {
              link: 'Floor Plan & Facade Report',
              roles: commonRoles,
              onClick: () => {
                FloorPlanFacadeReport();
              }
            },
            {
              link: 'Performance Report',
              roles: commonRoles,
              onClick: () => {
                PerformanceReport();
              }
            },
            {
              link: 'Agent Summary Report',
              roles: commonRoles,
              onClick: () => {
                AgentSummaryReport();
              }
            },
            {
              link: 'No Action Leads Report',
              roles: commonRoles,
              onClick: () => {
                NoActionLeadsReport();
              }
            },
            {
              link: 'Commission Report',
              roles: commonRoles,
              onClick: () => {
                CommissionReport();
              }
            },
          ],
        },

        {
          link: 'Workflow',
          roles: commonRoles,
          children: [
            {
              link: 'WorkFlow Status Report',
              url: `/reports/workflowStatusReport`,
              roles: commonRoles,
            },
          ],
        },

        {
          link: 'Job',
          roles: commonRoles,
          children: [
            {
              link: 'Customer Status Report',
              roles: commonRoles,
              onClick: () => {
                CustomerStatusReport();
              }
            },
            {
              link: 'Job Status Report',
              roles: commonRoles,
              onClick: () => {
                JobStatusReport();
              }
            },
            {
              link: 'No action Jobs Report',
              roles: commonRoles,
              onClick: () => {
                NoActionJobReport();
              }
            },
            {
              link: 'Contract Report',
              roles: commonRoles,
              onClick: () => {
                ContractReport();
              }
            },
            {
              link: 'Invoices & Payments Report',
              roles: commonRoles,
              onClick: () => {
                InvoicePaymentsReport();
              }
            },
            {
              link: 'Commission Report',
              roles: commonRoles,
              onClick: () => {
                CommissionReport();
              }
            },
            {
              link: 'Cost Summary Report',
              roles: commonRoles,
              onClick: () => {
                CostSummaryReport();
              }
            },
            {
              link: 'Land Title Forecast Report',
              roles: commonRoles,
              onClick: () => {
                LandTitleForcastReport();
              }
            },

            {
              link: 'Variation Report',
              roles: commonRoles,
              onClick: () => {
                VariationReport();
              }
            },
            {
              link: 'Delay / Extension Notice Report',
              roles: commonRoles,
              onClick: () => {
                DelayExtensionNoticeReport();
              }
            },
            {
              link: 'Survey Report',
              roles: commonRoles,
              onClick: () => {
                SurveyReport();
              }
            },
          ],
        },
        {
          link: 'Maintenance',
          roles: commonRoles,
          children: [
            {
              link: 'Maintenance Report',
              roles: commonRoles,
              onClick: () => {
                MaintenanceDetailReport();
              }
            },
            {
              link: 'Maintenance Detailed Report',
              roles: commonRoles,
              onClick: () => {
                MaintenanceDetailedReport();
              }
            },
          ],
        },

        {
          link: 'Others',
          roles: commonRoles,
          children: [
            {
              link: 'Utilization Graph',
              url: `/others/utilization-graph`,
              roles: commonRoles,
            },
          ],
        },
      ],
    },
    {
      icon: IconBuildingSkyscraper,
      link: 'Contractors',
      url: '/contractors',
      roles: ['builder', 'contractor', 'customer'],
    },
    {
      icon: IconSettings,
      link: 'Settings',
      url: '/settings',
      roles: ['builder'],
    },
  ];
};
