import { message } from "antd";

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
      // Example: Minimum 3 characters and only letters, spaces allowed
      const isValid = /^[a-zA-Z\s]{3,}$/.test(value);
      if (!isValid) {
        return Promise.reject(
          "Name must be at least 3 characters and contain only letters and spaces"
        );
      }
      return Promise.resolve();
    },
  },
];

export const emailRules = [
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
      if (!value) return Promise.resolve(); // empty is ok
      if (value.length < 3) {
        return Promise.reject(new Error("Notes should be at least 3 characters"));
      }
      return Promise.resolve();
    },
  },
];
