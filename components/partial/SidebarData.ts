import {
  IconHome,
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
    link: "Contractor",
    url: "/contractor",
    roles: ["builder", "contractor", "customer"],
  },
    {
    icon: IconUsers,
    link: "User",
    url: "/user",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconUsers,
    link: "Customer",
    url: "/customer",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconUsers,
    link: "Leads",
    url: "/leads",
    roles: ["builder", "contractor", "customer"],
  },
  {
    icon: IconBuildingSkyscraper,
    link: "Setting",
    url: "/setting",
    roles: ["builder"],
  }
];