import { FormField } from "../common/Models/ActionDialogModel";

export const colorSettingCustomFields = (): FormField[] => {
  return [
    {
      label: "Section Name",
      name: "sectionName",
      type: "text",
      placeholder: "Enter section name",
    },
    {
      label: "Sort Order",
      name: "sortOrder",
      type: "number",
    },
    {
      label: "Attachments",
      name: "attachments",
      type: "image",
      acceptFileType: ".pdf,.doc,.docx",
      extra: "Upload documents (PDF/Word, max 5MB)",
    },
    {
      label: "Options",
      name: "options",
      type: "select",
      options: [
        {
          value: "Show as a separate Column",
          label: "Show as a separate Column",
        },
        {
          value: "Show in existing 'Items' Column",
          label: "Show in existing 'Items' Column",
        },
      ],
    },
    {
      label: "Width (%)",
      name: "width",
      type: "number",

      extra: "Column width in percentage (1-100)",
    },
  ];
};
