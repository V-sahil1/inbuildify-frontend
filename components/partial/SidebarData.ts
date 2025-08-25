import {
  IconHome,
  IconSitemap,
  IconShieldLock,
  IconApps,
  IconNotebook,
  IconId,
  IconSquares,
  IconLayout2,
  IconChecklist,
  IconTimelineEventPlus,
  IconBuildingSkyscraper,
  IconUsers,
} from "@tabler/icons-react";

export const menuList = [
  {
    devider: "Main",
  },
  {
    icon: IconHome,
    link: "My Dashboard",
    roles: ["builder", "contractor", "customer"],
    children: [
      {
        link: "Analysis",
        url: "/",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "My Wallet",
        url: "/dashboard/my-wallet",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Smart IOT",
        url: "/dashboard/smart-iot",
        roles: ["builder", "contractor", "customer"],
      },
    ],
  },
  {
    icon: IconBuildingSkyscraper,
    link: "Manage Contractor",
    url: "/contractor",
    roles: ["builder", "contractor", "customer"],
  },
    {
    icon: IconUsers,
    link: "Manage User",
    url: "/user",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconUsers,
    link: "Manage Customer",
    url: "/customer",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconUsers,
    link: "Manage Leads",
    url: "/leads",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconApps,
    link: "Applications",
    roles: ["builder", "contractor", "customer"],
    children: [
      {
        link: "Calendar",
        url: "/app/calendar",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Email App",
        url: "/app/email",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Chat App",
        url: "/app/chat",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Campaigns",
        url: "/app/campaign",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Social App",
        url: "/app/social",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "File Manager",
        url: "/app/file-manager",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Todo App",
        url: "/app/todo",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Contact",
        url: "/app/contact",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Task",
        url: "/app/task",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Project List",
        url: "/app/project/list",
        roles: ["builder", "contractor", "customer"],
      },
    ],
  },
  {
    icon: IconNotebook,
    link: "More Pages",
    roles: ["builder", "contractor", "customer"],
    children: [
      {
        link: "My Profile",
        url: "/page/my-profile",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Bookmarks",
        url: "/page/bookmark",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Timeline",
        url: "/page/timeline",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Image Gallery",
        url: "/page/image-gallery",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Pricing",
        url: "/page/pricing",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Teams Board",
        url: "/page/team-board",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Support Ticket",
        url: "/page/support-ticket",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "FAQs",
        url: "/page/faq",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Search Page",
        url: "/page/search-page",
        roles: ["builder", "contractor", "customer"],
      },
      {
        link: "Footers",
        url: "/page/footers",
        roles: ["builder", "contractor", "customer"],
      },
    ],
  },
  {
    icon: IconSitemap,
    link: "Menu Level",
    children: [
      {
        link: "Level 1",
        roles: ["builder", "contractor", "customer"],
        children: [
          {
            link: "Level 2",
            url: "#",
            roles: ["builder", "contractor", "customer"],
          },
        ],
      },
      {
        link: "Level 1",
        url: "#",
        roles: ["builder", "contractor", "customer"],
      },
    ],
  },
  {
    icon: IconBuildingSkyscraper,
    link: "Setting",
    url: "/setting",
    roles: ["builder"],
  },
  {
    devider: "RESOURCES",
  },
  {
    icon: IconSquares,
    link: "Modals Popups",
    url: "/modals",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconLayout2,
    link: "Widget's",
    url: "/widgets",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconChecklist,
    link: "Documentation",
    url: "/documentation",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconTimelineEventPlus,
    link: "Changelog",
    url: "/documentation/change-log",
    roles: ["builder", "contractor", "customer"],
  },
];