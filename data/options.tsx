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

export const RatingOptions = [
  { label: "Hot", value: "hot" },
  { label: "Cold", value: "cold" },
  { label: "Warm", value: "warm" },
];

export const YesNoOptions = [
  { label: "None", value: "none" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const PurposeOptions = [
  { label: "Own House", value: "ownhouse" },
  { label: "Investment Property", value: "investmentproperty" },
];

export const RegionOptions = [
  { label: "Sydney East", value: "sydneyeast" },
  { label: "Melbourne North", value: "melbournenorth" },
  { label: "Brisbane South", value: "brisbanesouth" },
];

export const ClientTypeOptions = [
  { label: "None", value: "none" },
  { label: "Renovator", value: "renovator" },
  { label: "New Build", value: "newbuild" },
  { label: "First Home Buyer", value: "firsthomebuyer" },
  { label: "Second Home Buyer", value: "secondhomebuyer" },
  { label: "Fourth Home Buyer", value: "fourthhomebuyer" },
  { label: "Investor", value: "investor" },
];