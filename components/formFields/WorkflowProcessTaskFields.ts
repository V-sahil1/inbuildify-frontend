import {
  acceptOnlyImageRule,
  nameRules,
  optionalDescriptionRules,
  OptionalNumberRules,
} from "@lib/constants/formInputValidations";
import { CreateFormField } from "../common/Models/CreateFormModel";

export const WorkflowProcessTaskFields = (): CreateFormField[] => {
  return [
    {
      name: "name",
      label: "Name",
      type: "text",
      rules: nameRules,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      rules: optionalDescriptionRules,
    },
    {
      name: "image",
      label: "Attachment",
      type: "image",
      acceptFileType: acceptOnlyImageRule,
    },
    {
      name: "timespent",
      label: "Time Spend",
      type: "number",
      rules: [
        ...OptionalNumberRules,
        {
          validator: (_, value) => {
            if (value === undefined || value === null || value === "") {
              return Promise.resolve();
            }
            if (value <= 0) {
              return Promise.reject(new Error("Value must be greater than 0"));
            }
            if (value > 15) {
              return Promise.reject(new Error("Value must be 15 or less"));
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
};
