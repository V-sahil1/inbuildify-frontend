import SystemRoutes from "@lib/constants/Routes";
import {
  IconHome,
  IconBuildingSkyscraper,
  IconUsersGroup,
  IconCrane,
  IconTools,
  IconDiamond,
  IconCalendar,
  IconShieldCheck,
  IconFolderOpen,
  IconChartHistogram,
} from "@tabler/icons-react";
const commonRoles = ["builder", "contractor", "customer"];
export const menuList = [
  {
    icon: IconHome,
    link: "My Dashboard",
    url: "/",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconCalendar,
    link: "Calendar",
    url: "/calendar",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconDiamond,
    link: "Sales",
    roles: ["builder", "contractor", "customer"],
    children: [
      {
        link: "Dashboard",
        url: "/dashboard",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Leads",
        url: SystemRoutes.LEADS,
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Quotation",
        url: SystemRoutes.QUOTATION,
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Compaigns",
        url: "/compaigns",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "HL Package",
        url: "/hlpackage",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Land",
        url: "/land",
        roles: ["builder", "contractor", "customer"],
      },
    ],
  },
  {
    icon: IconShieldCheck,
    link: "Job",
    url: SystemRoutes.JOB,
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconCrane,
    link: "Construction",
    url: "/construction",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconTools,
    link: "Maintenance",
    url: "/maintenance",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconFolderOpen,
    link: "S Drive",
    url: "/sdrive",
    roles: ["builder"],
  },
  {
    icon: IconChartHistogram,
    link: "Reports",
    roles: commonRoles,
    children: [
      {
        link: "Sales",
        roles: commonRoles,
        children: [
          {
            link: "Lead / Focus Report",
            url: `/sales/lead-focus`,
            roles: commonRoles,
          },
          {
            link: "Quotation Report",
            url: `/sales/quotation`,
            roles: commonRoles,
          },
          {
            link: "Floor Plan & Facade Report",
            url: `/sales/floorplan-facade`,
            roles: commonRoles,
          },
          {
            link: "Performance Report",
            url: `/sales/performance`,
            roles: commonRoles,
          },
          {
            link: "Agent Summary Report",
            url: `/sales/agent-summary`,
            roles: commonRoles,
          },
          {
            link: "No Action Leads Report",
            url: `/sales/no-action-leads`,
            roles: commonRoles,
          },
          {
            link: "Commission Report",
            url: `/sales/commission`,
            roles: commonRoles,
          },
        ],
      },

      {
        link: "Workflow",
        roles: commonRoles,
        children: [
          {
            link: "WorkFlow Status Report",
            url: `/workflow/status`,
            roles: commonRoles,
          },
        ],
      },

      {
        link: "Job",
        roles: commonRoles,
        children: [
          {
            link: "Customer Status Report",
            url: `/job/customer-status`,
            roles: commonRoles,
          },
          {
            link: "Job Status Report",
            url: `/job/job-status`,
            roles: commonRoles,
          },
          {
            link: "No action Jobs Report",
            url: `/job/no-action-jobs`,
            roles: commonRoles,
          },
          {
            link: "Contract Report",
            url: `/job/contract`,
            roles: commonRoles,
          },
          {
            link: "Invoices & Payments Report",
            url: "/job/invoices-payments",
            roles: commonRoles,
          },
          {
            link: "Commission Report",
            url: `/job/commission`,
            roles: commonRoles,
          },
          {
            link: "Cost Summary Report",
            url: `/job/cost-summary`,
            roles: commonRoles,
          },
          {
            link: "Land Title Forecast Report",
            url: `/job/land-title-forecast`,
            roles: commonRoles,
          },

          {
            link: "Variation Report",
            url: `/variation`,
            roles: commonRoles,
          },
          {
            link: "Delay / Extension Notice Report",
            url: `/delay-extension-notice`,
            roles: commonRoles,
          },
          {
            link: "Survey Report",
            url: `/survey`,
            roles: commonRoles,
          },
        ],
      },
      {
        link: "Construction",
        roles: commonRoles,
        children: [
          {
            link: "Construction Report",
            url: `/construction/base`,
            roles: commonRoles,
          },
          {
            link: "Construction Detailed Report",
            url: `/construction/detailed`,
            roles: commonRoles,
          },
          {
            link: "Claims Report",
            url: `/construction/claims`,
            roles: commonRoles,
          },
          {
            link: "Supplier and Trades Report",
            url: `/construction/supplier-trades`,
            roles: commonRoles,
          },
          {
            link: "Agent Summary Report",
            url: `/construction/agent-summary`,
            roles: commonRoles,
          },
          {
            link: "Site Supervisor Report",
            url: `/construction/site-supervisor`,
            roles: commonRoles,
          },
          {
            link: "Site Supervisor OH&S Report",
            url: `/construction/site-supervisor-ohs`,
            roles: commonRoles,
          },
          {
            link: "Site Supervisor Notes Report",
            url: `/construction/site-supervisor-notes`,
            roles: commonRoles,
          },
          {
            link: "ETS Report",
            url: `/construction/ets`,
            roles: commonRoles,
          },
        ],
      },

      {
        link: "Maintenance",
        roles: commonRoles,
        children: [
          {
            link: "Maintenance Report",
            url: `/maintenance/base`,
            roles: commonRoles,
          },
          {
            link: "Maintenance Detailed Report",
            url: `/maintenance/detailed`,
            roles: commonRoles,
          },
        ],
      },

      {
        link: "Others",
        roles: commonRoles,
        children: [
          {
            link: "Utilization Graph",
            url: `/others/utilization-graph`,
            roles: commonRoles,
          },
        ],
      },
    ],
  },
  {
    icon: IconBuildingSkyscraper,
    link: "Settings",
    url: "/settings",
    roles: ["builder"],
  },
  {
    icon: IconBuildingSkyscraper,
    link: "Contractors",
    url: "/contractors",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconUsersGroup,
    link: "Users",
    url: "/users",
    roles: ["builder", "contractor", "customer"],
  },
];
