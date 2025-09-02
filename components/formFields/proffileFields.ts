import { CreateFormField } from "../common/Models/CreateFormModel";

export const profileFields = (): CreateFormField[] => {
  return [
    {
      label: "Logo",
      name: "logo",
      type: "image",
    },
    {
      label: "Firm Name",
      name: "firmName",
      type: "text",
      placeholder: "Enter your firm name",
      rules: [{ required: true, message: "Please enter your firm name" }],
    },
    {
      label: "Slogan",
      name: "slogan",
      type: "text",
      placeholder: "Enter your firm slogan",
      rules: [{ required: true, message: "Please enter your firm slogan" }],
    },
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter your full name",
      rules: [{ required: true, message: "Please enter your name" }],
    },
    {
      label: "Phone",
      name: "phone",
      type: "number",
      placeholder: "Enter your phone number",
      rules: [{ required: true, message: "Please enter your phone number" }],
    },
    {
      label: "License Number",
      name: "license_number",
      type: "number",
      placeholder: "Enter your license number",
      rules: [{ required: true, message: "Please enter your license number" }],
    },
    {
      label: "ABN Number",
      name: "abn_number",
      type: "number",
      placeholder: "Enter your ABN number",
      rules: [{ required: true, message: "Please enter your ABN number" }],
    },
  ];
};
