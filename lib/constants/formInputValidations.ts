import dayjs from 'dayjs';
import type { Rule } from 'antd/es/form';

export const passwordRules = [
  { required: true, message: 'Password is required' },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();

      const hasMinLength = value.length >= 8;
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[^A-Za-z0-9.]/.test(value); // exclude dot
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);

      if (!hasMinLength) {
        return Promise.reject('Password must be at least 8 characters long');
      }
      if (!hasNumber) {
        return Promise.reject('Password must contain at least one number');
      }
      if (!hasSpecial) {
        return Promise.reject("Password must contain at least one special symbol (not '.')");
      }
      if (!hasUpper) {
        return Promise.reject('Password must contain an uppercase letter');
      }
      if (!hasLower) {
        return Promise.reject('Password must contain a lowercase letter');
      }

      return Promise.resolve();
    },
  },
];

export const nameRules = [
  { required: true, message: 'Please enter name' },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();
      const cleaned = value.trim().replace(/\s+/g, ' ');
      const lettersOnly = cleaned.replace(/\s/g, '');
      const isValid =
        /^[a-zA-Z\s]+$/.test(cleaned) && lettersOnly.length >= 2 && lettersOnly.length <= 100;

      if (!isValid) {
        return Promise.reject(
          'Name must be at least 2 letters and at most 100 letters and can only contain letters and spaces'
        );
      }
      if (value.startsWith(' ') || value.endsWith(' ')) {
        return Promise.reject('Name cannot start or end with spaces');
      }
      return Promise.resolve();
    },
  },
];

export const emailRules: Rule[] = [
  { required: true, message: 'Please enter email' },
  { type: 'email', message: 'Please enter a valid email' },
];

export const phoneRules = [
  { required: true, message: 'Please enter phone' },
  {
    pattern: /^\d{10,15}$/,
    message: 'Phone number must be number and between 10 to 15 digits',
  },
];

export const leadSourceRules = [{ required: true, message: 'Please enter lead source' }];

export const addressRules = [
  { required: true, message: 'Please enter address' },
  { min: 10, message: 'Address must be at least 10 characters' },
  { max: 500, message: 'Address must be at most 500 characters' },
];

const noWhitespace = {
  validator: (_: any, value: string) => {
    if (value && !value.trim()) {
      return Promise.reject('Input cannot be only whitespace');
    }
    return Promise.resolve();
  },
};

export const taskNameRules = [
  { required: true, message: 'Please enter title' },
  { min: 2, message: 'Title must be at least 2 characters' },
  { max: 80, message: 'Title must be at most 80 characters' },
];

export const descriptionRules = [
  {
    validator: (_: any, value: string) => {
      if (!value || !value.trim()) {
        return Promise.reject('Please enter description');
      }

      const trimmed = value.trim();
      if (trimmed.length < 5) {
        return Promise.reject('Description must be at least 5 characters');
      }
      if (trimmed.length > 500) {
        return Promise.reject('Description must be at most 500 characters');
      }

      return Promise.resolve();
    },
  },
];

export const optionalDescriptionRules = [
  {
    validator: (_: any, value: string) => {
      if (!value) {
        return Promise.resolve();
      }

      const trimmed = value.trim();

      if (!trimmed) {
        return Promise.reject('Description cannot be only spaces');
      }

      if (trimmed.length < 5) {
        return Promise.reject('Description must be at least 5 characters');
      }

      if (trimmed.length > 500) {
        return Promise.reject('Description must be at most 500 characters');
      }

      return Promise.resolve();
    },
  },
];

export const dueDateRules = [
  { required: true, message: 'Due date is required' },
  {
    validator: (_: any, value: any) => {
      if (!value) return Promise.resolve();
      const isValid = dayjs(value, 'YYYY-MM-DD', true).isValid();
      return isValid ? Promise.resolve() : Promise.reject('Date must be in format YYYY-MM-DD');
    },
  },
];

export const timeRules = [
  { required: true, message: 'Time is required' },
  {
    validator: (_: any, value: any) => {
      if (!value) return Promise.resolve();
      const isValid = dayjs(value, 'HH:mm', true).isValid();
      return isValid ? Promise.resolve() : Promise.reject('Time must be in format HH:mm');
    },
  },
];

export const priorityRules = [{ required: true, message: 'Priority is required' }];

export const roleRules = [{ required: true, message: 'Please select a role' }];

export const abnRules = [
  {
    pattern: /^[0-9]{11}$/,
    message: 'ABN number must be exactly 11 digits',
  },
];

export const licenseRules = [
  { required: true, message: 'Please enter your license number' },
  {
    pattern: /^[0-9]{6,12}$/,
    message: 'License number must be between 6 and 12 digits',
  },
];

export const numberRules = [
  { required: true, message: 'Please enter a number' },
  { pattern: /^\d+(\.\d+)?$/, message: 'Please enter a valid number' },
];

export const OptionalNumberRules = [
  {
    pattern: /^\d+(\.\d+)?$/,
    message: 'Value cannot be negative or contain a minus sign',
  },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve(); // empty is ok
      if (value.startsWith('-')) {
        return Promise.reject('Value cannot be negative');
      }
      return Promise.resolve();
    },
  },
];

export const optionalNameRules = [
  {
    validator: (_: any, value: string) => {
      if (value.startsWith(' ') || value.endsWith(' ')) {
        return Promise.reject('Name cannot start or end with spaces');
      }
      if (value.length > 255) {
        return Promise.reject('Name must be at most 255 letters');
      }
      if (value.length <= 0) {
        return Promise.reject('Please enter a name');
      }
      return Promise.resolve();
    },
  },
];

export const optionalEmailRule = [
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve(); // empty is ok
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value)
        ? Promise.resolve()
        : Promise.reject(new Error('Please enter a valid email address'));
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
        : Promise.reject(new Error('Phone number must be number and between 10 to 15 digits'));
    },
  },
];

export const optionalNotesRule = [
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();
      if (value.startsWith(' ') || value.endsWith(' ')) {
        return Promise.reject('Name cannot start or end with spaces');
      }
      const trimmed = value.trim();
      if (trimmed.length === 0) return Promise.resolve();
      if (trimmed.length < 2) {
        return Promise.reject(new Error('Notes should be at least 2 characters'));
      }
      if (trimmed.length > 500) {
        return Promise.reject(new Error('Notes cannot be more than 500 characters'));
      }
      return Promise.resolve();
    },
  },
];

export const locationRules = [
  { required: true, message: 'Please enter location' },
  {
    validator: (_: any, value: string) =>
      value && value.length > 200
        ? Promise.reject(new Error('Location cannot exceed 200 characters'))
        : Promise.resolve(),
  },
];

export const notesRules = [
  {
    validator: (_: any, value: string) => {
      const isValid = /^[a-zA-Z0-9\s.,]{2,500}$/.test(value.trim());
      if (!isValid) {
        return Promise.reject(
          "Notes must be at least 2 characters and doesn't contain special character"
        );
      }
      return Promise.resolve();
    },
  },
];

export const acceptOnlyImageRule = '.jpeg,.jpg,.png,.gif,.webp';

export const costRules = [
  { required: true, message: 'Please enter cost' },
  numberRules,
  {
    validator: (_: any, value: number) => {
      if (value === undefined || value === null) return Promise.resolve();

      if (value > 1000000) {
        return Promise.reject('Cost must not exceed 10,00,000');
      }
      if (value < 0) {
        return Promise.reject('Cost must be greater than 0');
      }

      return Promise.resolve();
    },
  },
];

export const rangeRules = [
  ...numberRules,
  {
    validator: (_: any, value: number) => {
      if (value === undefined || value === null) return Promise.resolve();

      if (value > 100000) {
        return Promise.reject('Range must not exceed 100,000');
      }

      return Promise.resolve();
    },
  },
];

export const getRangeStartRules = (form: any, name: number): Rule[] => [
  {
    validator: async (_, value) => {
      if (value === undefined || value === null) return Promise.resolve();

      if (value > 100000) {
        return Promise.reject('Range must not exceed 100,000');
      }

      const end = form.getFieldValue(['ranges', name, 'range_end']);
      if (end !== undefined && value >= end) {
        return Promise.reject('Range Start must be less than Range End');
      }

      return Promise.resolve();
    },
  },
];

export const getRangeEndRules = (form: any, name: number): Rule[] => [
  {
    validator: async (_, value) => {
      if (value === undefined || value === null) return Promise.resolve();

      if (value > 100000) {
        return Promise.reject('Range must not exceed 100,000');
      }

      const start = form.getFieldValue(['ranges', name, 'range_start']);
      if (start !== undefined && value <= start) {
        return Promise.reject('Range End must be greater than Range Start');
      }

      return Promise.resolve();
    },
  },
];

export const settingNameRules = [
  {
    validator: (_: any, value: string) => {
      if (!value) {
        return Promise.reject('Please enter a name');
      }
      // Check for spaces at start or end
      if (value.startsWith(' ') || value.endsWith(' ')) {
        return Promise.reject('Name cannot start or end with spaces');
      }
      const pattern = /^[a-zA-Z0-9\s]+$/;
      if (!pattern.test(value)) {
        return Promise.reject('Name can only contain letters, numbers, and spaces');
      }

      if (value.length < 2) {
        return Promise.reject('Name must be at least 2 letters');
      }

      if (value.length > 100) {
        return Promise.reject('Name must be at most 100 letters');
      }

      return Promise.resolve();
    },
  },
];

export const planNumberRange = [
  {
    validator: (_: any, value: number) => {
      if (value > 100000) {
        return Promise.reject('Value must be lower than 100,000');
      }

      return Promise.resolve();
    },
  },
];

export const planMeasureRange = [
  {
    validator: (_: any, value: number) => {
      if (value > 1000000) {
        return Promise.reject('Value must be lower than 10,00,000');
      }

      return Promise.resolve();
    },
  },
];


export const leadAddressRules = [
  {
    required: true,
    message: 'Please enter Address',
  },
  {
    validateFirst: true,
    validator: (_: any, value: string) => {
      if (!value) {
        return Promise.resolve();
      }

      if (value.length < 2) {
        return Promise.reject('Address must be at least 2 letters');
      }

      if (value && value.length > 255) {
        return Promise.reject('Address must be at most 255 letters');
      }
      return Promise.resolve();
    },
  },
];

export const CityNameRules = [
  { required: true, message: 'Please enter city name' },
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve();
      const cleaned = value.trim().replace(/\s+/g, ' ');
      const lettersOnly = cleaned.replace(/\s/g, '');
      const isValid =
        /^[a-zA-Z\s]+$/.test(cleaned) && lettersOnly.length <= 100 && lettersOnly.length >= 1;
      if (value.length >= 100) {
        return Promise.reject('City name must be less then 100 character');
      }
      if (!isValid) {
        return Promise.reject('City name must be valid string');
      }
      return Promise.resolve();
    },
  },
];

export const firmSloganRules = [
  {
    validator: (_: any, value: string) => {
      if (!value) {
        return Promise.reject('Please enter your firm slogan');
      }
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return Promise.reject('Slogan must contain only letters and spaces');
      }
      if (value.length < 2) {
        return Promise.reject('Slogan must be at least 2 characters');
      }
      if (value.length > 500) {
        return Promise.reject('Slogan must be at most 500 characters');
      }
      return Promise.resolve();
    },
  },
];

export const firmNameRules = [
  {
    validator: (_: any, value: string) => {
      if (!value) {
        return Promise.reject('Please enter your firm name');
      }
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return Promise.reject('Firm name must contain only letters and spaces');
      }
      if (value.length < 2) {
        return Promise.reject('Firm name must be at least 2 characters');
      }
      if (value.length > 255) {
        return Promise.reject('Firm name must be at most 255 characters');
      }
      return Promise.resolve();
    },
  },
];

export const accountNumberRules = [
  { min: 6, message: 'Account number must be at least 6 characters long' },
  { max: 10, message: 'Account number must not exceed 10 characters' },
];

export const accountBsbRules = [
  { min: 6, message: 'Account BSB must be at least 6 characters long' },
  { max: 6, message: 'Account BSB must not exceed 6 characters' },
];

export const cityRules = [
  { required: true, message: 'City is required' },
  { min: 2, message: 'City must be at least 2 characters long' },
  { max: 100, message: 'City must not exceed 100 characters' },
  {
    pattern: /^(?=.*[A-Za-z])[A-Za-z\s.-]+$/,
    message: 'City must contain only letters and valid characters (space, dot, hyphen)',
  },
];

export const zipCodeRules = [
  { required: true, message: 'Please enter your zip code' },
  { min: 4, message: 'Zip code must be at least 4 characters long' },
  { max: 4, message: 'Zip code must not exceed 4 characters' },
];

export const builderPhoneRules = [
  {
    pattern: /^\d{10,14}$/,
    message: 'Phone number must be number and between 10 to 15 digits',
  },
];

export const acnNumberRules = [
  { min: 9, message: 'ACN number must be at least 9 characters long' },
  { max: 9, message: 'ACN number must not exceed 9 characters' },
];

export const hiaMembershipRules = [
  { min: 6, message: 'Number must be at least 6 characters long' },
  { max: 8, message: 'Number must not exceed 8 characters' },
  {
    pattern: /^(?!\s).*\S(?!\s)$/,
    message: 'Number cannot have spaces at the beginning or end'
  },
];

export const registrationNumberRules = [
  { min: 6, message: 'Registration number must be at least 6 characters long' },
  { max: 20, message: 'Registration number must not exceed 20 characters' },
  {
    pattern: /^(?!\s).*\S(?!\s)$/,
    message: 'Registration number cannot have spaces at the beginning or end'
  },
];
export const addressLine1Rules = [
  { required: true, message: 'Address line 1 is required' },
  { min: 10, message: 'Address must be at least 10 characters long' },
  { max: 255, message: 'Address must not exceed 255 characters' },
  {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s,./#-]+$/,
    message: 'Address must contain at least one letter',
  },
];
export const addressLine2Rules = [
  { min: 2, message: 'Address must be at least 2 characters long' },
  { max: 255, message: 'Address must not exceed 255 characters' },
  {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s,./#-]+$/,
    message: 'Address must contain at least one letter',
  },
];

export const builderNameRules = [
  { min: 2, message: 'Name must be at least 2 characters long' },
  { max: 150, message: 'Name must not exceed 150 characters' },
  {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s,./#-]+$/,
    message: 'Please enter valid name',
  },
];

export const optionalNameRule = [
  { min: 3, message: 'Field must be at least 3 characters long' },
  { max: 150, message: 'Field must not exceed 150 characters' },
  {
    pattern: /^(?!\s).*\S(?!\s)$/,
    message: 'Field cannot have spaces at the beginning or end'
  },
];

export const surveyorRegistrationRules = [
  { min: 5, message: 'Registration number must be at least 5 characters long' },
  { max: 100, message: 'Registration number cannot exceed 100 characters.' },
];

export const websiteRules = [
  {
    validator: (_: any, value: string) => {
      if (!value) return Promise.resolve(); // empty is ok

      const trimmed = value.trim();
      if (!trimmed) return Promise.resolve();

      // Website URL validation regex
      const websiteRegex =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

      if (!websiteRegex.test(trimmed)) {
        return Promise.reject('Please enter a valid website URL (e.g., https://www.example.com)');
      }

      return Promise.resolve();
    },
  },
];

/**
 * Creates sort order validation rules with dynamic max value and editing state
 */
export const createSortOrderValidation = (maxValue: number, isEditing: boolean = false) => [
  {
    required: true,
    message: 'Enter Sort Order',
  },
  () => ({
    validator(_: any, value: string | number) {
      const num = Number(value);
      const maxVal = maxValue + (isEditing ? 0 : 1);

      if (isNaN(num) || num < 1) {
        return Promise.reject('Sort order must be at least 1');
      }
      if (num > maxVal) {
        return Promise.reject(`Sort order must be between 1 and ${maxVal}`);
      }
      return Promise.resolve();
    },
  }),
];

