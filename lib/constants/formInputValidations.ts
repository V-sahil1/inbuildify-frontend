import dayjs from "dayjs";
import type { Rule } from 'antd/es/form';
export const passwordRules = [
  { required: true, message: "Password is required" },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();

      const hasMinLength = value.length >= 8;
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[^A-Za-z0-9.]/.test(value); // exclude dot
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);

      if (!hasMinLength) {
        return Promise.reject("Password must be at least 8 characters long");
      }
      if (!hasNumber) {
        return Promise.reject("Password must contain at least one number");
      }
      if (!hasSpecial) {
        return Promise.reject(
          "Password must contain at least one special symbol (not '.')"
        );
      }
      if (!hasUpper) {
        return Promise.reject("Password must contain an uppercase letter");
      }
      if (!hasLower) {
        return Promise.reject("Password must contain a lowercase letter");
      }

      return Promise.resolve();
    },
  },
];

export const nameRules = [
  { required: true, message: "Please enter full name" },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve(); 
      const cleaned = value.trim().replace(/\s+/g, " "); 
      const lettersOnly = cleaned.replace(/\s/g, ""); 
      const isValid = /^[a-zA-Z\s]+$/.test(cleaned) && lettersOnly.length >= 3;

      if (!isValid) {
        return Promise.reject(
          "Name must be at least 3 letters and can only contain letters and spaces"
        );
      }
      return Promise.resolve();
    },
  },
];

export const emailRules: Rule[] = [
  { required: true, message: "Please enter email" },
  { type: "email", message: "Please enter a valid email" },
];

export const phoneRules = [
  { required: true, message: "Please enter phone" },
  {
    pattern: /^\d{10,15}$/,
    message: "Phone number must be number and between 10 to 15 digits",
  },
];

export const leadSourceRules = [
  { required: true, message: "Please enter lead source" },
];

export const addressRules = [
  { required: true, message: "Please enter address" },
  { min: 10, message: "Address must be at least 10 characters" },
];

const noWhitespace = {
  validator: (_: any, value: string) => {
    if (value && !value.trim()) {
      return Promise.reject("Input cannot be only whitespace");
    }
    return Promise.resolve();
  },
};

export const taskNameRules = [
  { required: true, message: "Please enter title" },
  { min: 3, message: "Title must be at least 3 characters" },
  { max: 80, message: "Title must be at most 80 characters" },
];

export const descriptionRules = [
  {
    validator: (_: any, value: string) => {
      if (!value || !value.trim()) {
        return Promise.reject("Please enter description");
      }

      const trimmed = value.trim();
      if (trimmed.length < 5) {
        return Promise.reject("Description must be at least 5 characters");
      }
      if (trimmed.length > 500) {
        return Promise.reject("Description must be at most 500 characters");
      }

      return Promise.resolve();
    },
  },
];

export const dueDateRules = [
  { required: true, message: "Due date is required" },
  {
    validator: (_: any, value: any) => {
      if (!value) return Promise.resolve();
      const isValid = dayjs(value, "YYYY-MM-DD", true).isValid();
      return isValid
        ? Promise.resolve()
        : Promise.reject("Date must be in format YYYY-MM-DD");
    },
  },
];

export const timeRules = [
  { required: true, message: "Time is required" },
  {
    validator: (_: any, value: any) => {
      if (!value) return Promise.resolve();
      const isValid = dayjs(value, "HH:mm", true).isValid();
      return isValid
        ? Promise.resolve()
        : Promise.reject("Time must be in format HH:mm");
    },
  },
];

export const priorityRules = [
  { required: true, message: "Priority is required" },
];

export const roleRules = [{ required: true, message: "Please select a role" }];

export const abnRules = [
  { required: true, message: "Please enter your ABN number" },
  {
    pattern: /^[0-9]{11}$/,
    message: "ABN number must be exactly 11 digits",
  },
]
  
export const licenseRules =  [
  { required: true, message: "Please enter your license number" },
  {
    pattern: /^[0-9]{6,12}$/,
    message: "License number must be between 6 and 12 digits",
  },
]

export const numberRules = [
  { required: true, message: "Please enter a number" },
  { pattern: /^\d+$/, message: "Please enter a valid number" },
] 
  

export const optionalEmailRule = [
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve(); // empty is ok
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value)
        ? Promise.resolve()
        : Promise.reject(new Error("Please enter a valid email address"));
    },
  },
];

export const optionalPhoneRule = [
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve(); // empty is ok
      const regex = /^\d{10,15}$/; 
      return regex.test(value)
        ? Promise.resolve()
        : Promise.reject(new Error("Phone number must be number and between 10 to 15 digits"));
    },
  },
];

export const optionalNotesRule = [
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();  
      const trimmed = value.trim();
      if (trimmed.length === 0) return Promise.resolve(); 
      if (trimmed.length < 3) {
        return Promise.reject(
          new Error("Notes should be at least 3 characters")
        );
      }
      if (trimmed.length > 500) {
        return Promise.reject(
          new Error("Notes cannot be more than 500 characters")
        );
      }
      return Promise.resolve();
    },
  },
];

export const locationRules = [
  { required: true, message: "Please enter location" },
  {
    validator: (_: any, value:string) =>
      value && value.length > 200
        ? Promise.reject(new Error("Location cannot exceed 200 characters"))
        : Promise.resolve(),
  },
];
  