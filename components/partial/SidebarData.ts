import SystemRoutes from '@lib/constants/Routes';
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
        url: `/configuration/document`,
      },
      {
        icon: IconPlugConnected,
        link: 'Integration',
        roles: commonRoles,
        url: `/configuration/integration`,
      },
      {
        icon: IconTemplate,
        link: 'Templates',
        roles: commonRoles,
        url: `/configuration/templates`,
      },
      {
        icon: IconCalendarTime,
        link: 'Scheduler',
        roles: commonRoles,
        url: `/configuration/scheduler`,
      },
      {
        icon: IconWorldWww,
        link: 'Portal',
        roles: commonRoles,
        url: `/configuration/portal`,
      },

      {
        icon: IconDotsCircleHorizontal,
        link: 'Others',
        roles: commonRoles,
        url: `/configuration/others`,
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
        // {
        //   link: "Dashboard",
        //   url: "/dashboard",
        //   roles: ["builder", "contractor", "customer"],
        // },
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
              url: `/sales/lead-focus`,
              roles: commonRoles,
            },
            {
              link: 'Quotation Report',
              url: `/sales/quotation`,
              roles: commonRoles,
            },
            {
              link: 'Floor Plan & Facade Report',
              url: `/sales/floorplan-facade`,
              roles: commonRoles,
            },
            {
              link: 'Performance Report',
              url: `/sales/performance`,
              roles: commonRoles,
            },
            {
              link: 'Agent Summary Report',
              url: `/sales/agent-summary`,
              roles: commonRoles,
            },
            {
              link: 'No Action Leads Report',
              url: `/sales/no-action-leads`,
              roles: commonRoles,
            },
            {
              link: 'Commission Report',
              url: `/sales/commission`,
              roles: commonRoles,
            },
          ],
        },

        {
          link: 'Workflow',
          roles: commonRoles,
          children: [
            {
              link: 'WorkFlow Status Report',
              url: `/workflow/status`,
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
              url: `/job/customer-status`,
              roles: commonRoles,
            },
            {
              link: 'Job Status Report',
              url: `/job/job-status`,
              roles: commonRoles,
            },
            {
              link: 'No action Jobs Report',
              url: `/job/no-action-jobs`,
              roles: commonRoles,
            },
            {
              link: 'Contract Report',
              url: `/job/contract`,
              roles: commonRoles,
            },
            {
              link: 'Invoices & Payments Report',
              url: '/job/invoices-payments',
              roles: commonRoles,
            },
            {
              link: 'Commission Report',
              url: `/job/commission`,
              roles: commonRoles,
            },
            {
              link: 'Cost Summary Report',
              url: `/job/cost-summary`,
              roles: commonRoles,
            },
            {
              link: 'Land Title Forecast Report',
              url: `/job/land-title-forecast`,
              roles: commonRoles,
            },

            {
              link: 'Variation Report',
              url: `/variation`,
              roles: commonRoles,
            },
            {
              link: 'Delay / Extension Notice Report',
              url: `/delay-extension-notice`,
              roles: commonRoles,
            },
            {
              link: 'Survey Report',
              url: `/survey`,
              roles: commonRoles,
            },
          ],
        },
        {
          link: 'Maintenance',
          roles: commonRoles,
          children: [
            {
              link: 'Maintenance Report',
              url: `/maintenance/base`,
              roles: commonRoles,
            },
            {
              link: 'Maintenance Detailed Report',
              url: `/maintenance/detailed`,
              roles: commonRoles,
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
