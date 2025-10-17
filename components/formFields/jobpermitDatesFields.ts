import { FormField } from "../common/Models/ActionDialogModel";

export const jobPermitDatesFields = (): FormField[] => {
  return [
    {
      label: "Construction Type",
      name: "constructionType",
      type: "select",
      placeholder: "Enter construction type",
      options: [
        { value: "Single", label: "Single story Building (Company Level)" },
      ],
      rules: [{ required: true, message: "Please enter construction type" }],
    },
    {
      label: "Permit Received Date",
      name: "permitReceivedDate",
      type: "date",
      placeholder: "Select permit received date",
      rules: [
        { required: true, message: "Please select permit received date" },
      ],
    },
    {
      label: "Site Start Date",
      name: "siteStartDate",
      type: "date",
      placeholder: "Select site start date",
      rules: [{ required: true, message: "Please select site start date" }],
    },
  ];
};
