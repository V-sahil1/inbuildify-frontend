import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { JobRoleAssignUserModal } from './JobRoleAssignUserModel';
import { JobPrivateInspectionModal } from './JobPrivateInspectionModal';
import { jobAddressFields } from '@/components/formFields/jobAddressFields';
import { jobPciHandoverDatesFields } from '@/components/formFields/jobpciHandoverDatesFields';
import { jobPermitDatesFields } from '@/components/formFields/jobpermitDatesFields';
import { JobChangeStatusModel } from './JobChangeStatusModel';
import JobDocumentModal from './JobDocumentModal';
import CustomerFeedback from './CustomerFeedback';
import DelayExtensionNotice from './DelayExtensionNotice';
import MailSendModal from '@/components/common/Models/MailSendModal';
import { useAppSelector } from '@hooks/redux';
import { jobTransferFields } from '@/components/formFields/jobTransferFIelds';
import { useUsersHook } from '@hooks/useUserData';

export const jobOptionRenderer = ({ activeAction, onCancel, open }) => {
  const { leadDetail } = useAppSelector(state => state.lead);
  const { users } = useUsersHook();
  const jobTransferField = jobTransferFields();

  //   add all the submit logic here

  switch (activeAction) {
    case 'commencementLetter':
      return (
        <MailSendModal
          open={open}
          onCancel={onCancel}
          onSend={onCancel}
          title="Commencement Letter"
        />
      );
    case 'delayExtensionNotice':
      return <DelayExtensionNotice open={open} onCancel={onCancel} />;
    case 'customerFeedback':
      return <CustomerFeedback open={open} onCancel={onCancel} />;
    case 'jobDocument':
      return <JobDocumentModal open={open} onCancel={onCancel} />;
    case 'transferJob':
      return (
        <ActionDialogmodel
          title="Transfer Job"
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={jobTransferField}
        />
      );
    case 'changeStatus':
      return <JobChangeStatusModel open={open} onCancel={onCancel} />;
    case 'permitDates':
      return (
        <ActionDialogmodel
          title="Permit Received Date / Site start Date"
          submitButtonText="Permit"
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={jobPermitDatesFields()}
        />
      );
    case 'pciHandoverDates':
      return (
        <ActionDialogmodel
          headerMessage="Are you sure you want to mark this job as completed?"
          title="Permit Received Date / Site start Date"
          submitButtonText="Save"
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={jobPciHandoverDatesFields()}
        />
      );
    case 'privateInspection':
      return <JobPrivateInspectionModal open={open} onCancel={onCancel} />;
    case 'jobAddress':
      return (
        // in this component there is state/region field currently we cant get states without the country and when we can then add the options in the fields file
        <ActionDialogmodel
          title="Job Address"
          submitButtonText="Save"
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={jobAddressFields()}
        />
      );
    case 'landTitle':
      return (
        <ActionDialogmodel
          title="Land Title Details"
          submitButtonText="Save"
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={[
            {
              label: 'Title Status',
              name: 'titleStatus',
              type: 'select',
              options: [
                { label: 'Estimated', value: 'estimated' },
                { label: 'Titled', value: 'titled' },
                { label: 'Confirmed', value: 'confirmed' },
              ],
              rules: [{ required: true, message: 'Title Status is required' }],
            },
            {
              label: 'Title Date',
              name: 'titleDate',
              type: 'date',
              rules: [{ required: true, message: 'Title Date is required' }],
            },
          ]}
        />
      );
    case 'contractDate':
      return (
        <ActionDialogmodel
          title="Contract Details"
          submitButtonText="Save"
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={[
            {
              label: 'Prepared Date',
              name: 'preparedDate',
              type: 'date',
              rules: [{ required: true, message: 'Prepared Date is required' }],
            },
            {
              label: 'Signed Date',
              name: 'signedDate',
              type: 'date',
              rules: [{ required: true, message: 'Signed Date is required' }],
            },
          ]}
        />
      );
    case 'referenceId':
      return (
        <ActionDialogmodel
          title="Change Reference ID"
          submitButtonText="Save"
          open={open}
          headerMessage={`System Refrence ID: MH2BB3`}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={[
            {
              label: 'Customer Reference ID',
              name: 'referenceId',
              type: 'text',
              rules: [
                {
                  required: true,
                  message: 'Customer Reference ID is required',
                },
              ],
            },
          ]}
        />
      );
    case 'assignRoleUser':
      return <JobRoleAssignUserModal open={open} onCancel={onCancel} />;
    case 'changeBuilder':
      return (
        // here in the select only builder user is coming and this component will be hidden based on the condition check the video job detail menu video from time 57:00
        <ActionDialogmodel
          title="Change Builder"
          submitButtonText="Save"
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={[
            {
              label: 'Builder',
              name: 'builder',
              type: 'select',
              options: users?.map(user => ({
                label: user.name,
                value: user.usersId,
              })),
              rules: [{ required: true, message: 'Builder is required' }],
            },
          ]}
        />
      );
    case 'changeLeadName':
      return (
        // initialvalue is dynamically seted but the due to direct redrirecting to this route from the lead page so lead detail api not called so not setting the initial value
        <ActionDialogmodel
          title="Change Lead Name"
          submitButtonText="Save"
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          initialValues={{ leadName: leadDetail?.lead?.name }}
          fields={[
            {
              label: 'Lead Name',
              name: 'leadName',
              type: 'text',
              rules: [
                {
                  required: true,
                  message: 'Lead Name is required',
                },
              ],
            },
          ]}
        />
      );
    case 'sketchNumber':
      return (
        <ActionDialogmodel
          title="Sketch Number"
          submitButtonText="Save"
          headerMessage={`Quotation Reference No: MH443SFF`}
          open={open}
          onCancel={onCancel}
          onSubmit={onCancel}
          fields={[
            {
              label: 'Sketch Number',
              name: 'sketchNumber',
              type: 'text',
              rules: [
                {
                  required: true,
                  message: 'Sketch Number is required',
                },
              ],
            },
          ]}
        />
      );
    default:
      return null;
  }
};
