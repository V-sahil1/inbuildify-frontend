import { CreateFormField } from "@/components/common/Models/CreateFormModel";
import { addressRules, emailRules, nameRules, phoneRules } from "@lib/constants/formInputValidations";

export const customerCreateFields: CreateFormField[] = [
    {
        name: "fullName",
        label: "Full Name",
        rules: nameRules,

    },
   
    {
        name: "phone",
        label: "Phone",
        rules: phoneRules,

    },
    {
        name: "address",
        label: "Address",
        rules: addressRules,

    },
]