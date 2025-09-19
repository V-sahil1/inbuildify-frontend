import { abnRules, acceptOnlyImageRule, licenseRules, nameRules, phoneRules } from "@lib/constants/formInputValidations";
import { CreateFormField } from "../common/Models/CreateFormModel";

export const profileFields = (): CreateFormField[] => {
  return [
    {
      label: "Logo",
      name: "logo",
      type: "image",
      acceptFileType: acceptOnlyImageRule,
      rules: [{ required: true, message: "Please upload image" }],
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
      rules: nameRules,
    },
    {
      label: "Phone",
      name: "phone",
      type: "phone",
      placeholder: "1234567890",
      rules:phoneRules,
    },
    {
      label: "License Number",
      name: "license_number",
      type: "number",
      placeholder: "Enter your license number",
      rules:licenseRules,
    },
    {
      label: "ABN Number",
      name: "abn_number",
      type: "number",
      placeholder: "Enter your ABN number",
      rules: abnRules,
    },
    
  ];
};
