import { IconPlus } from "@tabler/icons-react";
import { MenuProps } from "antd";

export const paymentOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    {
      label: "Personal - Online Transfer",
      value: "Personal - Online Transfer",
    },
    { label: "Loan - Online Transfer", value: "Loan - Online Transfer" },
    { label: "EFTPOS", value: "EFTPOS" },
  ];

  export const TemplateDummyOptions: MenuProps["items"] = [
    {
      key: "1",
      label: "Template 1",
      icon: <IconPlus />,
    },
    {
      type: "divider",
    },
    {
      key: "manage",
      label: "Manage Templates",
    },
  ];