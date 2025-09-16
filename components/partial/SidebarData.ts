import {
  IconHome,
  IconBuildingSkyscraper,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

export const menuList = [
  // {
  //   devider: "Main",
  // },
  {
    icon: IconHome,
    link: "My Dashboard",
    url: "/",
    roles: ["builder", "contractor", "customer"],
    // children: [
    //   {
    //     link: "Analysis",
    //     url: ,
    //     roles: ["builder", "contractor", "customer"],
    //   },
    //   {
    //     link: "My Wallet",
    //     url: "/dashboard/my-wallet",
    //     roles: ["builder", "contractor", "customer"],
    //   },
    //   {
    //     link: "Smart IOT",
    //     url: "/dashboard/smart-iot",
    //     roles: ["builder", "contractor", "customer"],
    //   },
    // ],
  },
  {
    icon: IconBuildingSkyscraper,
    link: "Contractors",
    url: "/contractors",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconUsers,
    link: "Leads",
    url: "/leads",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconUsersGroup,
    link: "Users",
    url: "/users",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconBuildingSkyscraper,
    link: "Settings",
    url: "/settings",
    roles: ["builder"],
  }
];