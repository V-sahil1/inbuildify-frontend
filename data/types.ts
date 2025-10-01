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

// export interface NoteDetails {
//   // title: string;
//   // description: string;
//   type?: string;
//   message: string;
//   tags: string[];
//   sendToCustomer?: boolean;
//   createFollowUpTask?: boolean;
//   task:{
//     due_date?: string;
//     name?: string;
//     priority?: string;
//     dueDate?: string;
//   }
//   attachment?: Array<{ uid: string; name: string; status?: string; url?: string }>;
//   // attachment?: { uid: string; name: string; status?: string; url?: string };
// }

// export interface AppointmentDetails {
//   type?: string;
//   title: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   location: string;
//   user: string;
//   notes: string;
//   sendToCustomer?: boolean;
// }

// export interface TaskDetails {
//   type?: string;
//   task:{
//     name: string;
//     dueDate: string;
//     time: string;
//     priority: "LOW" | "MEDIUM" | "HIGH";
//     description: string;
//     assignee: string;
//   }
//   attachment?: any[]; // You might want to define a more specific type for files
// }

// export interface SmsDetails {
//   type?: string;
//   message: string;
//   recipient: string;
// }
export interface NoteTag {
  name: string;
}
export interface NoteAttachment {
  uid: string;
  name: string;
  status?: string;
  url?: string;
}

export interface NoteTask {
  due_date?: string; // sometimes API may return this snake_case
  dueDate?: string;  // sometimes camelCase
  name?: string;
  priority?: string;
}
export interface NoteDetails {
  actionId?: string;
  notesId?: string;
  type?: string;
  message: string;
  tags: NoteTag[]; 
  sendToCustomer?: boolean;
  createFollowUpTask?: boolean;
  task?: NoteTask;
  attachment?: NoteAttachment[];
}

export interface AppointmentDetails {
  actionId?: string;
  appointmentId?: string;
  type?: string;
  title: string;
  date: string; // e.g. "2025-09-15"
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "11:00"
  location: string;
  selectUsers: {id:string,name:string}[];
  notes: string;
  sendToCustomer?: boolean;
}

export interface TaskDetails {
  actionId?: string;
  taskId?: string;
  type?: string;
  name: string; // ✅ you directly use task[0].name
  dueDate: string; // ✅ formatted with dayjs in TimelineCard
  time: string; // "HH:mm" or "HH:mm:ss"
  priority: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  assignee: {id:string,name:string};
  attachment?: { uid: string; name: string; url?: string }[];
}

export interface SmsDetails {
  actionId?: string;
  smsId?: string;
  type?: string;
  message: string;
  recipient?: { id: string; name: string }[];  
}

// New: normalized item shape used by TimelineCard for display
export interface TimelineItem {
  type: "NOTES" | "APPOINTMENT" | "TASK" | "SMS";
  createdBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
  notes?: NoteDetails[];
  appointment?: AppointmentDetails[];
  task?: TaskDetails[];
  sms?: SmsDetails[];
}

export interface BaseTimelineCardProps {
  date: string;
  createdBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
  item?: TimelineItem; // optional to allow rendering empty form state
  status?: "completed" | "pending" | "working" | "";
  onEdit?: (updated: TimelineCardProps) => void; // send updated values to parent
  onReschedule?: () => void;
  children?: React.ReactNode;
}

// export type TimelineCardProps =
//   | (BaseTimelineCardProps & { type: "NOTES"; notes: NoteDetails })
//   | (BaseTimelineCardProps & { type: "APPOINTMENT"; appointment: AppointmentDetails })
//   | (BaseTimelineCardProps & { type: "TASK"; task: TaskDetails })
//   | (BaseTimelineCardProps & { type: "SMS"; sms: SmsDetails });
export interface TimelineCardProps extends BaseTimelineCardProps {
  type: "NOTES" | "APPOINTMENT" | "TASK" | "SMS";
  actionId?: string;
}

  // Lead Detail Quotation
  export type QuotationStatus = "approved" | "pending" | "rejected" | "all";
 
  export interface QuotationVersionBasic {
    quotationVersionId: string;
    versionNumber: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
  }

  export interface QuotationVersionItem {
    quotationVersionItemId: string;
    notes: string | null;
    categoryId: string;
    caterogyName: string;
    categoryDescription: string;
    quantity: number;
    categoryItemId: string;
    categoryItemDescription: string;
    categoryItemShortDescription: string;
    categoryItemQuantity: number | null;
    categoryItemCostType: "VARIABLE" | "FIXED" | string;
    categoryItemCost: string;
    categoryItemCostTypeText: string | null;
    categoryItemCostOption: "NONE" | string;
    categoryItemIncludeByDefault: boolean | null;
    categoryItemShowInHlPackage: boolean;
    categoryItemPackageOnly: boolean | null;
    categoryItemUom: string | null;
    categoryItemSortOrder: number | null;
    categoryItemRangeId: string;
    categoryItemDwellingTypeId: string;
    categoryItemCreatedAt: string;
    categoryItemUpdatedAt: string;
    createdAt: string;
    updatedAt: string;
  }

  export type QuotationVersions = Record<string, QuotationVersionItem[]>;

  export interface QuotationVersion {
    quotationVersionItemId: string;
    notes: string;
    categoryId: string;
    caterogyName: string; // typo in API? should it be `categoryName`?
    categoryDescription: string;
    categoryItemId: string;
    categoryItemDescription: string;
    categoryItemShortDescription: string;
    categoryItemQuantity: number | null;
    categoryItemCostType: "VARIABLE" | "FIXED" | string; // enum?
    categoryItemCost: string;
    categoryItemCostTypeText: string | null;
    categoryItemCostOption: "NONE" | string;
    categoryItemIncludeByDefault: boolean | null;
    categoryItemShowInHlPackage: boolean;
    versionNumber: string;
    quantity?: number;
    totalAmount?: string;
    categoryItemPackageOnly: boolean | null;
    categoryItemUom: string | null;
    categoryItemSortOrder: number | null;
    categoryItemRangeId: string;
    categoryItemDwellingTypeId: string;
    categoryItemCreatedAt: string; // ISO date
    categoryItemUpdatedAt: string; // ISO date
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
  };
  

// export interface Quotation {
//   quotationId: string;
//   property: string;
//   versions: QuotationVersion[];
// }

export interface JobVariationType {
    ReferenceID: string;
    Amount: number;
    RequestedBy: string;
    DelayedBy: string;
    DrawingChanges: string;
    Created: {
    user: string;
    date: string;
  };
  Approved: {
    user: string;
    date: string;
  };

  Status: string;
  Invoice: string;

}

export interface JobWorkFlowChecklist {
  id: number;
  workflowProcessTaskId: string;
  workflowProcessId: string;
  task: string;
  tag: string;
  estimatedDate: string;
  actualDate: string;
  attachment?: string;
  actionId?: string;
  dueDate?: Date | string;
  name: string;
  priority: string;
  description: string;
  assignee: string;
  time: string;
  link: string;
  user: string;
  status: string;
}

export interface WorkStepsChecklist{
  title: string;
  checkList: JobWorkFlowChecklist[];
}

export interface JobVariationDataType {
  ReferenceID: string;
  Amount: number;
  RequestedBy: string;
  DelayedBy: string;
  DrawingChanges: string;
  Created: { user: string; date: string };
  Approved: { user: string; date: string };
  Status: string;
  Invoice: string;
  Profile: string;
}

export interface JobVariationItems {
  key: string;
  additional: string;
  siteCost: string;
  cost: string;
  drawingChanges: boolean;
  quantity: number;
  price: number;
  total: number;
}