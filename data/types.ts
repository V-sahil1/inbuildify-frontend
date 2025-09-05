// export interface Quotation {
//     id: string;
//     version: string;
//     status: 'Draft' | 'Approved' | 'Sent';
//     // range: string;
//     // dwellingType: string;
//     expiryDate: string;
//     total: number;
//   }
  
  export interface LeadDetails {
    lead_id?: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    contacts?: any[];
    country: string;
    city: string;
    state: string;
    zipCode: string;
    source: string;
    status: string;
    notes: string;
    lead_source?: string;
  }
  
  export interface PropertyDetails {
    lead_id?: string;
    leadId?: string;
    propertyId?: string;
    lot: string;
    location: string;
    titleDate: string;
    type: string;
    widthM?: string;
    depthM?: string;
    totalSizeM2?: string;
    country?: string;
    address1?: string;
    address2?: string;
    citySuburb?: string;
    stateRegion?: string;
    zipPostalCode?: string;
    estateName?: string;
    titleStatus?: string;
    compactionReport?: string;
    landType?: string;
    siteFallMm?: string;
    landFillMm?: string;
    bushFire?: string;
    cornerBlock?: string;
  }
  
  export interface Plan {
    id: string;
    name: string;
    bedrooms: number;
    bathrooms: number;
    beds?: number;
    bath?: number;
    carPark?: number;
    garage: number;
    area: string;
  }
  
  // export interface Facade {
  //   id: string;
  //   name: string;
  //   type: string;
  // }
  
//   export interface PackageItem {
//   id: string;
//   name: string;
//   description?: string;
//   quantity?: number;
//   unit?: string;
// }

// export interface Package {
//   id: string;
//   name: string;
//   price: number;
//   description?: string;
//   items?: PackageItem[];
// }

// For TimeLine Functionality
export type ActionType = "addNotes" | "sendSms" | "bookAppointment" | "createTask" | null;
export type TimelineType = "Tasks" | "Notes" | "Sms" | "Appointments";

export interface NoteDetails {
  title: string;
  description: string;
  tags: string[];
  sendToCustomer?: boolean;
  createFollowup?: boolean;
  dueDate?: string;
  files?: Array<{ uid: string; name: string; status?: string; url?: string }>;
}

export interface AppointmentDetails {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  user: string;
  notes: string;
  sendToCustomer: boolean;
}

export interface TaskDetails {
  name: string;
  dueDate: string;
  time: string;
  priority: "Low" | "Medium" | "High";
  description: string;
  assignee: string;
  files: any[]; // You might want to define a more specific type for files
}

export interface SmsDetails {
  message: string;
  recipient: string;
}

export interface BaseTimelineCardProps {
  date: string;
  createdBy: string;
  createdAt: string;
  status?: "completed" | "pending" | "working";
  onEdit?: (updated: TimelineCardProps) => void; // send updated values to parent
  onReschedule?: () => void;
  children?: React.ReactNode;
}

export type TimelineCardProps =
  | (BaseTimelineCardProps & { type: "Notes"; data: NoteDetails })
  | (BaseTimelineCardProps & { type: "Appointments"; data: AppointmentDetails })
  | (BaseTimelineCardProps & { type: "Tasks"; data: TaskDetails })
  | (BaseTimelineCardProps & { type: "Sms"; data: SmsDetails });

  // Lead Detail Quotation
  export type QuotationStatus = "approved" | "pending" | "rejected" | "all";
  export interface QuotationVersion {
    id: string;
    version: string;
    status: QuotationStatus;
    totalCost: string;
    createdBy: string;
    createdAt: string;
  }

export interface Quotation {
  quotationId: string;
  property: string;
  versions: QuotationVersion[];
}