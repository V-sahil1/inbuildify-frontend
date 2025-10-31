import { FormField } from "../common/Models/ActionDialogModel";

export const InvoiceSettingFields: FormField[] = [
    {
      label: "Description",
      name: "description",
      type: "text",
    },
    {
      label: "Percentage",
      name: "percentage",
      type: "number",
      rules: [
        {
          min: 0,
          max: 100,
          message: "Percentage must be between 0 and 100",
        },
      ],
    },
    {
      label: "Sort Order",
      name: "sortOrder",
      type: "number",
    },
    {
      label: "Is Deposit",
      name: "isDeposit",
      type: "switch",
    },
  ];