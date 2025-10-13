export interface QuotationDataType {
    key: string;
    slugId: string;
    refrenceId: string;
    customerName: string;
    propertyAddress: string; 
    contactAddress: string; 
    approver: {
        name: string;
      };
    created: string; 

    assignee: {
      name: string;
    };
  }
  
  export const quotationDummyData: QuotationDataType[] = [
    {
      key: "1",
      slugId: "FKENSKN21",
      refrenceId: "REF-001",
      customerName: "PowerTech Ltd",
      propertyAddress: "123 Main St, Sydney",
      contactAddress: "Tech Park",
      created: "2023-10-01",
      approver: {
        name: "John Smith"
      },
      assignee: {
        name: "John Smith"
      }
    },
    {
      key: "2",
      slugId: "FKENSKN22",
      refrenceId: "REF-002",
      customerName: "GreenBuild Co",
      propertyAddress: "456 Oak Ave, Melbourne",
      contactAddress: "Green Valley",
      created: "2023-09-15",
      approver: {
        name: "Sarah Johnson"
      },
      assignee: {
        name: "Sarah Johnson"
      }
    },
    {
      key: "3",
      slugId: "FKENSKN23",
      refrenceId: "REF-003",
      customerName: "Urban Design",
      propertyAddress: "789 Pine Rd, Brisbane",
      contactAddress: "City Center",
      created: "2023-10-05",
      approver: {
        name: "Mike Brown"
      },
      assignee: {
        name: "Mike Brown"
      }
    },
    {
      key: "4",
      slugId: "FKENSKN24",
      refrenceId: "REF-004",
      customerName: "Skyline Constructions",
      propertyAddress: "321 Hill St, Perth",
      contactAddress: "Ocean View", 
      created: "2023-09-20",
      approver: {
        name: "Emma Wilson"
      },
      assignee: {
        name: "Emma Wilson"
      }
    },
    {
      key: "5",
      slugId: "FKENSKN25",
      refrenceId: "REF-005",
      customerName: "Heritage Builders",
      propertyAddress: "654 Heritage Ln, Adelaide",
      contactAddress: "Historic District",
      created: "2023-08-10",
      approver: {
        name: "David Lee"
      },
      assignee: {
        name: "David Lee"
      }
    },
    {
      key: "6",
      slugId: "FKENSKN26",
      refrenceId: "REF-006",
      customerName: "Modern Spaces",
      propertyAddress: "987 Design St, Sydney",
      contactAddress: "Innovation Hub",
      created: "2023-10-02",
      approver: {
        name: "Lisa Chen"
      },
      assignee: {
        name: "Lisa Chen"
      }
    }
  ];
  