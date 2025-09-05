import { CreateFormField } from "@/components/common/Models/CreateFormModel";

const rangeAndDwellingTypeFields = (): CreateFormField[] => {
  return [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter name",
      rules: [
        {
          required: true,
          message: "Please enter name",
        },
      ],
    },
  ];
};

export default rangeAndDwellingTypeFields;
