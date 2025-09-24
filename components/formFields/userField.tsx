import { CreateFormField } from "@/components/common/Models/CreateFormModel";
import { Roles } from "@lib/constants/enum";
import { emailRules, roleRules } from "@lib/constants/formInputValidations";
import { DetailField } from "../common/DetailModal";
export type userInviteFormField = Omit<CreateFormField, "type"> & {
    type?: "email" | "select";
};

export type userDetailModelFied = Omit<DetailField,"isLink">&{
   isLink?:'email' 
};

export const userInviteFormFields = (): readonly userInviteFormField[] => {
    return [{
        label: "Role",
        name: "role",
        rules: roleRules,
        type: "select",
        placeholder: "Select Role",
        disabled: false,
        options: Roles,
    },
    {
        label: "Email",
        name: "email",
        type: "email",
        rules: emailRules,
        placeholder: "john@example.com",
        disabled: false,
    },
    ]
};

export const userDetailModelFields =() : userDetailModelFied[]=>{
    return[
            { label: "Name", key: "name" },
            { label: "Email", key: "email", isLink: "email" },
            { label: "Verified", key: "isVerified", type: "boolean" },
            { label: "Role", key: "role" },
            { label: "Joined On", key: "createdAt", type: "date" }
          ]
} 


