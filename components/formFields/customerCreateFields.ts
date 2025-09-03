import { CreateFormField } from "@/components/common/Models/CreateFormModel";
import { addressRules, emailRules, nameRules, phoneRules } from "@lib/constants/formInputValidations";

export const customerCreateFields: CreateFormField[] = [
    {
        name: "fullName",
        label: "Full Name",
        placeholder: "john doe",
        rules: nameRules,

    },
   
    {
        name: "phone",
        label: "Phone",
        placeholder: "1234567890",
        rules: phoneRules,

    },
    {
        name: "address",
        label: "Address",
        placeholder: "Australia",
        rules: addressRules,

    },
]