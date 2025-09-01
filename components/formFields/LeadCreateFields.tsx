import { LeadSource } from "@lib/constants/enum";
import {
  emailRules,
  leadSourceRules,
  nameRules,
  phoneRules,
} from "@lib/constants/formInputValidations";
import { CreateFormField } from "@/components/common/Models/CreateFormModel";

export type LeadFormField = Omit<CreateFormField, 'type'> & {
  type?: 'email' | 'phone' | 'select';
};

const leadCreateFields = ({isEmailDisable}: {isEmailDisable: boolean} = {isEmailDisable: false}): readonly LeadFormField[] => {
  return [
    {
      label: "Full Name",
      name: "name",
      placeholder: "John Doe",
      rules: nameRules,
    },
    {
      label: "Email",
      name: "email",
      placeholder: "john@example.com",
      type: "email",
      rules: emailRules,
      disabled: isEmailDisable,
    },
    {
      label: "Phone",
      name: "phone",
      placeholder: "+1 555 0100",
      type: "phone",
      rules: phoneRules,
    },
    {
      label: "Lead Source",
      name: "leadSource",
      placeholder: "e.g. Social Media, Referral, etc.",
      type: "select",
      options: LeadSource,
      rules: leadSourceRules,
    },
  ] as const;
};

export default leadCreateFields;