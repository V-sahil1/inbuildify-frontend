
  export interface LeadDataType {
    key: string;
    refrenceId: string;
    propertyAddress: string;
    source: string;
    rating: string;
    created: string;
    updated: string;
    assignedTo: string;
  }
  
  export const leadDummyData: LeadDataType[] = [
    {
      key: "1",
      refrenceId: "123 Main Street, Mumbai",
      propertyAddress: "Electrical Maintenance",
      source: "PowerTech Ltd",
      rating: "2025-10-01",
      created: "2025-10-05",
      updated: "Rajesh Kumar",
      assignedTo: "Rajesh Kumar",
    },
    {
      key: "2",
      refrenceId: "456 Park Avenue, Delhi",
      propertyAddress: "Plumbing Repair",
      source: "WaterWorks Co",
      rating: "2025-09-28",
      created: "2025-10-03",
      updated: "Amit Sharma",
      assignedTo: "Amit Sharma",
    },
    {
      key: "3",
      refrenceId: "789 Green Lane, Bangalore",
      propertyAddress: "HVAC Installation",
      source: "CoolAir Systems",
      rating: "2025-10-02",
      created: "2025-10-07",
      updated: "Neha Singh",
      assignedTo: "Neha Singh", 
    },
    {
      key: "4",
      refrenceId: "321 Ocean View, Chennai",
      propertyAddress: "Painting & Coating",
      source: "ColorPro Pvt Ltd",
      rating: "2025-09-30",
      created: "2025-10-04",
      updated: "Vikram Iyer",
      assignedTo: "Vikram Iyer",
    },
  ];