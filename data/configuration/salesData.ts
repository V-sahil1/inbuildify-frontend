export const leadMandatoryOption = [
    {
      value: "Email and Phone are mandatory",
      label: "Email and Phone are mandatory",
    },
    {
      value: "Either Email or Phone is mandatory",
      label: "Either Email or Phone is mandatory",
    },
    {
      value: "Email is not mandatory",
      label: "Email is not mandatory",
    },
    {
      value: "Phone is not mandatory",
      label: "Phone is not mandatory",
    },
    {
      value: "Email and Phone are not mandatory",
      label: "Email and Phone are not mandatory",
    },
  ];

  export const salesProcessData = [
      {
        id: 1,
        processId: 1,
        name: "New",
        functionality: ["Contact", "Property"],
        category: "Lead",
        sort: 1,
      },
      {
        id: 2,
        processId: 1,
        name: "Working",
        functionality: ["Quotation"],
        category: "Lead",
        sort: 2,
      },
      {
        id: 3,
        processId: 2,
        name: "Proposal",
        functionality: ["Capture Deposit"],
        category: "Opportunity",
        sort: 1,
      },
    ]
    
export const salesProcessProcessesData = [
    { id: 1, name: "Sales", isDefault: true },
    { id: 2, name: "Lead", isDefault: false },
  ];