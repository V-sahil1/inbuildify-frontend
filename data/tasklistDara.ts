export interface DataType {
  key: string;
  name: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedToId: number;
  assignedTo: string;
  tags: string[];
  contactName: string;
  phone: string;
}

export const data: DataType[] = [
    {
      key: "1",
      name: "Task 1",
      status: "open",
      priority: "High",
      dueDate: "2023-10-15",
      assignedTo: "John Doe",
      assignedToId: 1,
      contactName: "John Doe",
      phone: "123-456-7890",
      tags: ["urgent", "important"],
    },
    {
      key: "2",
      name: "Task 2",
      status: "open",
      priority: "High",
      dueDate: "2023-10-14",
      assignedTo: "John Doe",
      assignedToId: 2,
      contactName: "John Doe",
      phone: "123-456-7890",
      tags: ["urgent", "important"],
    },
    {
      key: "3",
      name: "Task 3",
      status: "open",
      priority: "High",
      dueDate: "2023-10-16",
      assignedTo: "John Doe",
      assignedToId: 3,
      contactName: "John Doe",
      phone: "123-456-7890",
      tags: ["urgent", "important"],
    },
    // Add more mock data
  ];