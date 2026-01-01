import MailSendModal from '@/components/common/Models/MailSendModal';
import SystemRoutes from '@lib/constants/Routes';
import {
  IconPlus,
  IconRuler,
  IconUserSquareRounded,
  IconBuilding,
  IconCalendar,
  IconClock,
  IconClipboardList,
  IconEdit,
  IconFileText,
  IconMail,
  IconMapPin,
  IconMessageCircle,
  IconRefresh,
  IconTag,
  IconUser,
  IconSwitch,
} from '@tabler/icons-react';
import { MenuProps } from 'antd';

export const paymentOptions = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Cheque', value: 'Cheque' },
  {
    label: 'Personal - Online Transfer',
    value: 'Personal - Online Transfer',
  },
  { label: 'Loan - Online Transfer', value: 'Loan - Online Transfer' },
  { label: 'EFTPOS', value: 'EFTPOS' },
];

export const TemplateDummyOptions: MenuProps['items'] = [
  {
    key: '1',
    label: 'Template 1',
    icon: <IconPlus />,
  },
  {
    type: 'divider',
  },
  {
    key: 'manage',
    label: 'Manage Templates',
  },
];

export const RatingOptions = [
  { label: 'Hot', value: 'hot' },
  { label: 'Cold', value: 'cold' },
  { label: 'Warm', value: 'warm' },
];

export const YesNoOptions = [
  { label: 'None', value: 'none' },
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export const PurposeOptions = [
  { label: 'Own House', value: 'ownhouse' },
  { label: 'Investment Property', value: 'investmentproperty' },
];

export const RegionOptions = [
  { label: 'Sydney East', value: 'sydneyeast' },
  { label: 'Melbourne North', value: 'melbournenorth' },
  { label: 'Brisbane South', value: 'brisbanesouth' },
];

export const ClientTypeOptions = [
  { label: 'None', value: 'none' },
  { label: 'Renovator', value: 'renovator' },
  { label: 'New Build', value: 'newbuild' },
  { label: 'First Home Buyer', value: 'firsthomebuyer' },
  { label: 'Second Home Buyer', value: 'secondhomebuyer' },
  { label: 'Fourth Home Buyer', value: 'fourthhomebuyer' },
  { label: 'Investor', value: 'investor' },
];

export const JobOptions = [
  {
    title: 'Customer Notification',
    items: [
      {
        key: 'commencementLetter',
        label: 'Commencement Letter',
        icon: <IconMail size={20} />,
        color: 'text-blue-500',
      },
      {
        key: 'delayExtensionNotice',
        label: 'Delay / Extension Notice',
        icon: <IconMail size={20} />,
        color: 'text-blue-500',
      },
      {
        key: 'customerFeedback',
        label: 'Customer Feedback',
        icon: <IconMessageCircle size={20} />,
        color: 'text-blue-500',
      },
    ],
  },
  {
    title: 'Quick Update',
    items: [
      {
        key: 'financeApproval',
        label: 'Finance Approval Received',
        icon: <IconSwitch size={20} />,
        color: 'text-green-500',
        hasToggle: true,
      },
    ],
  },
  {
    title: 'Custom Documents',
    items: [
      {
        key: 'buildingContract',
        label: 'Building Contract',
        icon: <IconFileText size={20} />,
        color: 'text-purple-500',
        href: SystemRoutes.BUILDING_CONTRACT,
      },
      {
        key: 'jobDocument',
        label: 'Job Document',
        icon: <IconFileText size={20} />,
        color: 'text-purple-500',
      },
    ],
  },
  {
    title: 'Job Information',
    items: [
      {
        key: 'transferJob',
        label: 'Transfer Job',
        icon: <IconRefresh size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'changeStatus',
        label: 'Change Status',
        icon: <IconTag size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'permitDates',
        label: 'Permit Received Date / Site Start Date',
        icon: <IconCalendar size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'pciHandoverDates',
        label: 'PCI and Handover Dates',
        icon: <IconClock size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'privateInspection',
        label: 'Private Inspection',
        icon: <IconClipboardList size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'jobAddress',
        label: 'Job Address',
        icon: <IconMapPin size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'landTitle',
        label: 'Land Title',
        icon: <IconBuilding size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'contractDate',
        label: 'Contract Date',
        icon: <IconCalendar size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'referenceId',
        label: 'Reference ID',
        icon: <IconEdit size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'assignRoleUser',
        label: 'Assign Role and User',
        icon: <IconUser size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'changeBuilder',
        label: 'Change Builder',
        icon: <IconBuilding size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'changeLeadName',
        label: 'Change Lead Name',
        icon: <IconUserSquareRounded size={20} />,
        color: 'text-yellow-500',
      },
      {
        key: 'sketchNumber',
        label: 'Sketch Number',
        icon: <IconRuler size={20} />,
        color: 'text-yellow-500',
      },
    ],
  },
];

export const componentMap = {
  CommencementLetter: MailSendModal,
};

export const JobDelayReasonOptions = [
  { value: 'privateInspection', label: 'Private Inspection' },
  { value: 'materials', label: 'Materials' },
  { value: 'weather', label: 'Weather' },
  { value: 'variation', label: 'Variation' },
  { value: 'permits', label: 'Permits' },
  { value: 'other', label: 'Other' },
];

export const JobCustomerFeedbackOptions = [
  { value: 'quality', label: 'Quality Feedback' },
  { value: 'customersales', label: 'Customer sales Feedback' },
];

export const JobDocumentOptions = [
  {
    id: 'quotation',
    title: 'Quotation',
    checked: true,
    status: 'Approved',
    isSigned: true,
    options: [
      'Quotation',
      'Quotation With Specification',
      'Preliminary Agreement',
      'Quotation with Builder Cost',
    ],
    selectedOption: 'Quotation with Builder Cost',
  },
  {
    id: 'color',
    title: 'Color',
    checked: true,
    status: 'Approved',
    isSigned: true,
    selectedOption: 'Color Palette',
  },
  {
    id: 'variations',
    title: 'Variations',
    status: 'Approved',
    checked: true,
    isSigned: true,
  },
  {
    id: 'invoices',
    title: 'Invoices',
    checked: true,
  },
  {
    id: 'receipts',
    title: 'Receipts',
    checked: false,
  },
];
