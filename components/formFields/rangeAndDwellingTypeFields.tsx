import React from "react";

const rangeAndDwellingTypeFields = (activeTab: string) => {
  return [
    {
      label: activeTab === "range" ? "Range Name" : "Dwelling Type Name",
      name: "name",
      type: "text" as const, // Use 'as const' to ensure type literal
      rules: [
        {
          required: true,
          message: `Please enter ${
            activeTab === "range" ? "range" : "dwelling type"
          } name`,
        },
      ],
    },
  ];
};

export default rangeAndDwellingTypeFields;
