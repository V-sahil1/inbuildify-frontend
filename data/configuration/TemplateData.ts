export const emailTemplateData = [
  {
    key: 1,
    templateName: '1st Follow-up',
    additionalRecipients: '',
    description: '',
    type: 'Customized',
  },
  {
    key: 2,
    templateName: '2nd Follow-up',
    additionalRecipients: '',
    description: '',
    type: 'Customized',
  },
  {
    key: 3,
    templateName: 'Acknowledgment mail to customer',
    additionalRecipients: '',
    description:
      'Email sent when the Maintenance tasks completed and sent Acknowledgement to customer.',
    type: 'Standard',
    template: {
      additionalRecipient: [
        '4ee3de64-552b-492f-95f9-529fbde1c590',
        '7a41ccd7-b0c6-4ed8-bcee-9d4c00cbdd56',
      ],
      subject: '[Logged User Name][jobAddress][First Name]',
      content: `<img src=x onerror="alert('Hacked!')" /><script>alert('XSS')</script><b>Bold text</b>`,
    },
  },
  {
    key: 4,
    templateName: 'Agent Summary report',
    additionalRecipients: '',
    description: '',
    type: 'Standard',
  },
  {
    key: 5,
    templateName: 'Appointment booked with Customer',
    additionalRecipients: '',
    description: 'Email sent to the Customer when they are included in an appointment booking.',
    type: 'Standard',
  },
  {
    key: 6,
    templateName: 'Appointment Booked with ReferralPartner',
    additionalRecipients: '',
    description: 'Email sent to the Referral Partner when an appointment is booked.',
    type: 'Standard',
  },
  {
    key: 7,
    templateName: 'Appointment Cancellation',
    additionalRecipients: '',
    description:
      'When an appointment is cancelled then this email is sent to the customer (if sent initially) and if any users are included in the appointment.',
    type: 'Customized',
  },
  {
    key: 8,
    templateName: 'Appointment with client',
    additionalRecipients: '',
    description: '',
    type: 'Customized',
  },
  {
    key: 9,
    templateName: 'Book Color Appointment',
    additionalRecipients: '',
    description: '',
    type: 'Customized',
  },
  {
    key: 10,
    templateName: 'Book Supplier',
    additionalRecipients: '',
    description:
      "Email sent when a supplier / tradie is booked for a construction checklist item under any stage of construction. Please don't delete {SupplierResponseLink} if you want to get a response for the booking from the supplier or a tradie.",
    type: 'Customized',
  },
];

export const notesTemplateData = [
  {
    key: 1,
    notestemplate: 'Request Quote Sign',
    content: `Hi [FirstName],
    This is a follow-up to your quotation.
    Please sign the quote and send it back asap.`,
  },
  {
    key: 2,
    notestemplate: 'Construction update',
    content: `Update for [Address] .....`,
  },
  {
    key: 3,
    notestemplate: 'Base update',
    content: `Hello [FullName],
    ergtryhj`,
  },
  {
    key: 4,
    notestemplate: 'Client Update',
    content: `Hi [FirstName],
    Update on the [Address]`,
  },
  {
    key: 5,
    notestemplate: 'Supervisor Details to Client',
    content: `Your Supervisor details below,
    Name: [SiteSupervisorName]`,
  },
];

export const PdfTemplateData = [
  { key: 1, name: 'Invoice Format' },
  { key: 2, name: 'Receipt Format' },
  { key: 3, name: 'Variation Format' },
  { key: 4, name: 'Color Format' },
  { key: 5, name: 'Maintenance Format' },
];

export const personalizationList = [
  'LoggedInUserName',
  'Company Logo',
  'Role',
  'Office Phone',
  'Email',
  'Application URL',
  'LoggedIn User Phone',
  'Company Address',
  'Signature Logo',
  'Designation',
  'CompanyWebsite',
  'User Address',
];
