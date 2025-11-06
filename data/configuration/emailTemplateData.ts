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
        'fa2e24a4-ca88-49f6-ac22-254eeffadaf2',
        '7d9e9d88-ae81-4f81-b7d2-731fc53e4fbc',
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
