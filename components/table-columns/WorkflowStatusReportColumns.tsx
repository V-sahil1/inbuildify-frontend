import { Input, Select } from 'antd';
import React from 'react';
import { debouncedURL } from '@lib/utils/debounceURL';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import CustomAvtar from '../common/CustomAvtar';
import { IconLoader, IconCircleCheck } from '@tabler/icons-react';

const dateColumn = {
  render: (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const year = dateObj.getFullYear();

    let color = 'inherit';
    let Icon = IconLoader;

    if (date) {
      if (year < 2024) {
        color = 'var(--danger)';
      } else if (year === 2025) {
        color = 'var(--success)';
        Icon = IconCircleCheck;
      } else {
        color = 'var(--blue)';
      }
    }

    return (
      <div style={{ color }}>
        <div>
          <Icon />
        </div>
        {date instanceof Date ? date.toLocaleDateString() : date}
      </div>
    );
  },
};

const { Option } = Select;

export interface WorkflowStatusType {
  key: string;
  referenceId: string;
  customerName: string;
  jobAddress: string;
  dwellingType: string;
  assignee: string;
  leadSource: string;
  supervisorName: string;
  jobCompletionDate: string;
  uploadAll: Date | string;
  sendInitialDepositReceipt: Date | string;
  applyForSoilTest: Date | string;
  receiveSoilTest: Date | string;
  requestBALTilePack: Date | string;
  receiveBALTilePack: Date | string;
  receiveSecondDeposit: Date | string;
  requestSketch: Date | string;
  receiveSketch: Date | string;
  sketchSignoff: Date | string;
  requestSketchRevision: Date | string;
  receiveRevisedSketch: Date | string;
  revisedPlanSignoff: Date | string;
  updateQuotation: Date | string;
  planRevisionRequest: Date | string;
  bookColorAppointment: Date | string;
  uploadSignedColorDoc: Date | string;
  raiseColorVariation: Date | string;
  requestWorkingDrawings: Date | string;
  receiveWorkingDrawings: Date | string;
  confirmDrawings: Date | string;
  requestRevisedWD: Date | string;
  receiveRevisedWD: Date | string;
  confirmRevisedWD: Date | string;
  requestDAApproval: Date | string;
  receiveDAApproval: Date | string;
  prepareContract: Date | string;
  bookContractSigning: Date | string;
  uploadSignedContract: Date | string;
  receiveFinanceApproval: Date | string;
  requestEngineeringReport: Date | string;
  receiveEngineering: Date | string;
  receiveEnergyRating: Date | string;
  getInsurance: Date | string;
  sendFivePercentInvoice: Date | string;
  receiveAndSendReceipt: Date | string;
  applyForPermits: Date | string;
  permitReceives: Date | string;
  sendCommencementLetter: Date | string;
}

export const useWorkflowStatusColumns = () => {
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    delay: 500,
    filtersKey: [
      'referenceId',
      'customerName',
      'jobAddress',
      'dwellingType',
      'assignee',
      'leadSource',
      'supervisorName',
      'jobCompletionDate',
    ],
  });

  React.useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const data: WorkflowStatusType[] = [
    {
      key: '1',
      referenceId: 'REF-001',
      customerName: 'John Doe',
      jobAddress: '123 Main St, Sydney',
      dwellingType: 'Single Story',
      assignee: 'Alex Johnson',
      leadSource: 'Website',
      supervisorName: 'Mike Brown',
      jobCompletionDate: '2023-12-15',
      uploadAll: '2025-12-10',
      sendInitialDepositReceipt: '2023-12-12',
      applyForSoilTest: '2023-12-13',
      receiveSoilTest: '2023-12-15',
      requestBALTilePack: '2023-12-16',
      receiveBALTilePack: '2023-12-18',
      receiveSecondDeposit: '2023-12-20',
      requestSketch: '2023-12-21',
      receiveSketch: '2023-12-23',
      sketchSignoff: '2023-12-25',
      requestSketchRevision: '2023-12-26',
      receiveRevisedSketch: '2023-12-28',
      revisedPlanSignoff: '2023-12-30',
      updateQuotation: '2024-01-02',
      planRevisionRequest: '2024-01-03',
      bookColorAppointment: '2024-01-05',
      uploadSignedColorDoc: '2024-01-07',
      raiseColorVariation: '2024-01-08',
      requestWorkingDrawings: '2024-01-10',
      receiveWorkingDrawings: '2024-01-15',
      confirmDrawings: '2024-01-16',
      requestRevisedWD: '2024-01-17',
      receiveRevisedWD: '2024-01-20',
      confirmRevisedWD: '2024-01-21',
      requestDAApproval: '2024-01-22',
      receiveDAApproval: '2024-01-25',
      prepareContract: '2024-01-26',
      bookContractSigning: '2024-01-27',
      uploadSignedContract: '2024-01-28',
      receiveFinanceApproval: '2024-01-29',
      requestEngineeringReport: '2024-01-30',
      receiveEngineering: '2024-02-01',
      receiveEnergyRating: '2024-02-02',
      getInsurance: '2024-02-03',
      sendFivePercentInvoice: '2024-02-04',
      receiveAndSendReceipt: '2024-02-05',
      applyForPermits: '2024-02-06',
      permitReceives: '2024-02-10',
      sendCommencementLetter: '2024-02-12',
    },
    {
      key: '2',
      referenceId: 'REF-002',
      customerName: 'Jane Smith',
      jobAddress: '456 Oak Ave, Melbourne',
      dwellingType: 'Double Story',
      assignee: 'Sarah Wilson',
      leadSource: 'Referral',
      supervisorName: 'Mike Brown',
      jobCompletionDate: '2024-01-15',
      uploadAll: '2024-01-05',
      sendInitialDepositReceipt: '2024-01-07',
      applyForSoilTest: '2024-01-08',
      receiveSoilTest: '2024-01-10',
      requestBALTilePack: '2024-01-11',
      receiveBALTilePack: '2024-01-13',
      receiveSecondDeposit: '2024-01-15',
      requestSketch: '2024-01-16',
      receiveSketch: '2024-01-18',
      sketchSignoff: '2024-01-20',
      requestSketchRevision: '2024-01-21',
      receiveRevisedSketch: '2024-01-23',
      revisedPlanSignoff: '2024-01-25',
      updateQuotation: '2024-01-26',
      planRevisionRequest: '2024-01-27',
      bookColorAppointment: '2024-01-28',
      uploadSignedColorDoc: '2024-01-29',
      raiseColorVariation: '2024-01-30',
      requestWorkingDrawings: '2024-01-31',
      receiveWorkingDrawings: '2024-02-02',
      confirmDrawings: '2024-02-03',
      requestRevisedWD: '2024-02-04',
      receiveRevisedWD: '2024-02-06',
      confirmRevisedWD: '2024-02-07',
      requestDAApproval: '2024-02-08',
      receiveDAApproval: '2024-02-10',
      prepareContract: '2024-02-11',
      bookContractSigning: '2024-02-12',
      uploadSignedContract: '2024-02-13',
      receiveFinanceApproval: '2024-02-14',
      requestEngineeringReport: '2024-02-15',
      receiveEngineering: '2024-02-16',
      receiveEnergyRating: '2024-02-17',
      getInsurance: '2024-02-18',
      sendFivePercentInvoice: '2024-02-19',
      receiveAndSendReceipt: '2024-02-20',
      applyForPermits: '2024-02-21',
      permitReceives: '2024-02-25',
      sendCommencementLetter: '2024-02-27',
    },
  ];

  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span>Reference ID</span>
          <Input
            size="small"
            value={filters.referenceId}
            onChange={e => setParams({ referenceId: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'referenceId',
      key: 'referenceId',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Customer Name</span>
          <Input
            size="small"
            value={filters.customerName}
            onChange={e => setParams({ customerName: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Job Address</span>
          <Input
            size="small"
            value={filters.jobAddress}
            onChange={e => setParams({ jobAddress: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'jobAddress',
      key: 'jobAddress',
      width: 250,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Dwelling Type</span>
          <Select
            size="small"
            allowClear
            value={filters.dwellingType}
            onChange={val => setParams({ dwellingType: val ?? '' })}
          >
            <Option value="Single Story">Single Story</Option>
            <Option value="Double Story">Double Story</Option>
            <Option value="Multi-Level">Multi-Level</Option>
          </Select>
        </div>
      ),
      dataIndex: 'dwellingType',
      key: 'dwellingType',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Assignee</span>
          <Input
            size="small"
            value={filters.assignee}
            onChange={e => setParams({ assignee: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'assignee',
      key: 'assignee',
      width: 150,
      render: (assignee: string) => (
        <div className="flex items-center gap-2">
          <CustomAvtar label={assignee} />
          {assignee}
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Lead Source</span>
          <Select
            size="small"
            allowClear
            value={filters.leadSource}
            onChange={val => setParams({ leadSource: val ?? '' })}
          >
            <Option value="Website">Website</Option>
            <Option value="Referral">Referral</Option>
            <Option value="Walk-in">Walk-in</Option>
            <Option value="Phone">Phone</Option>
          </Select>
        </div>
      ),
      dataIndex: 'leadSource',
      key: 'leadSource',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Supervisor Name</span>
          <Input
            size="small"
            value={filters.supervisorName}
            onChange={e => setParams({ supervisorName: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'supervisorName',
      key: 'supervisorName',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Job Completion Date</span>
          <DateFilterDropdown
            onFilter={type => {
              setParams({ jobCompletionDate: type });
            }}
            onClear={() => setParams({ jobCompletionDate: '' })}
          />
        </div>
      ),
      dataIndex: 'jobCompletionDate',
      key: 'jobCompletionDate',
      width: 190,
    },
    {
      title: 'Upload all the documents (Deposit)',
      dataIndex: 'uploadAll',
      key: 'uploadAll',
      width: 150,
      render: dateColumn.render,
    },
    {
      title: 'Send Initial Deposit Receipt to client (Deposit)',
      dataIndex: 'sendInitialDepositReceipt',
      key: 'sendInitialDepositReceipt',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Apply for soil test and survey (Deposit)',
      dataIndex: 'applyForSoilTest',
      key: 'applyForSoilTest',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Receive soil test and survey (Deposit)',
      dataIndex: 'receiveSoilTest',
      key: 'receiveSoilTest',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Request BAL, Title pack and property info (Deposit)',
      dataIndex: 'requestBALTilePack',
      key: 'requestBALTilePack',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Receive BAL, Title pack and property info (Deposit)',
      dataIndex: 'receiveBALTilePack',
      key: 'receiveBALTilePack',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Receive 2nd deposit (Deposit)',
      dataIndex: 'receiveSecondDeposit',
      key: 'receiveSecondDeposit',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Request for the sketch (Concept)',
      dataIndex: 'requestSketch',
      key: 'requestSketch',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Receive sketch from the draftsperson (Concept)',
      dataIndex: 'receiveSketch',
      key: 'receiveSketch',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Sketch signoff from client (Concept)',
      dataIndex: 'sketchSignoff',
      key: 'sketchSignoff',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Request sketch revision from draftee (Concept)',
      dataIndex: 'requestSketchRevision',
      key: 'requestSketchRevision',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Receive revised sketch (Concept)',
      dataIndex: 'receiveRevisedSketch',
      key: 'receiveRevisedSketch',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Get revised plan signoff from client (Concept)',
      dataIndex: 'revisedPlanSignoff',
      key: 'revisedPlanSignoff',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Update quotation if any changes in the sketch (Concept)',
      dataIndex: 'updateQuotation',
      key: 'updateQuotation',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Plan revision request (Concept)',
      dataIndex: 'planRevisionRequest',
      key: 'planRevisionRequest',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Book color appointment (Color Selection)',
      dataIndex: 'bookColorAppointment',
      key: 'bookColorAppointment',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Upload signed color selection document (Color Selection)',
      dataIndex: 'uploadSignedColorDoc',
      key: 'uploadSignedColorDoc',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Raise any color variation (if required) (Color Selection)',
      dataIndex: 'raiseColorVariation',
      key: 'raiseColorVariation',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Request working drawings (Contract Drawing)',
      dataIndex: 'requestWorkingDrawings',
      key: 'requestWorkingDrawings',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Receive working drawings (Contract Drawing)',
      dataIndex: 'receiveWorkingDrawings',
      key: 'receiveWorkingDrawings',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Confirm drawing with clients (Contract Drawing)',

      dataIndex: 'confirmDrawings',
      key: 'confirmDrawings',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Request revised WD (Contract Drawing)',

      dataIndex: 'requestRevisedWD',
      key: 'requestRevisedWD',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Receive revised WD (Contract Drawing)',
      dataIndex: 'receiveRevisedWD',
      key: 'receiveRevisedWD',
      width: 200,
      render: dateColumn.render,
    },
    {
      title: 'Confirm revised WD with client (Contract Drawing)',

      dataIndex: 'confirmRevisedWD',
      key: 'confirmRevisedWD',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Request DA approval (Approvals and Contract)',

      dataIndex: 'requestDAApproval',
      key: 'requestDAApproval',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Receive DA approval (Approvals and Contract)',

      dataIndex: 'receiveDAApproval',
      key: 'receiveDAApproval',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Prepare contract (Approvals and Contract)',
      dataIndex: 'prepareContract',
      key: 'prepareContract',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Book contract signing appointment (Approvals and Contract)',
      dataIndex: 'bookContractSigning',
      key: 'bookContractSigning',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Upload signed contract (Approvals and Contract)',
      dataIndex: 'uploadSignedContract',
      key: 'uploadSignedContract',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Receive finance approval letter (Approvals and Contract)',
      dataIndex: 'receiveFinanceApproval',
      key: 'receiveFinanceApproval',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Request engineering and energy report (Permits and Pre-Construction)',
      dataIndex: 'requestEngineeringReport',
      key: 'requestEngineeringReport',
      width: 350,
      render: dateColumn.render,
    },
    {
      title: 'Receive engineering (Permits and Pre-Construction)',
      dataIndex: 'receiveEngineering',
      key: 'receiveEngineering',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Receive energy rating report (Permits and Pre-Construction)',
      dataIndex: 'receiveEnergyRating',
      key: 'receiveEnergyRating',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Get insurance (Permits and Pre-Construction)',
      dataIndex: 'getInsurance',
      key: 'getInsurance',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Send 5% invoice to client (Permits and Pre-Construction)',
      dataIndex: 'sendFivePercentInvoice',
      key: 'sendFivePercentInvoice',
      width: 300,
      render: dateColumn.render,
    },
    {
      title: 'Receive and send 5% receipt to client (Permits and Pre-Construction)',
      dataIndex: 'receiveAndSendReceipt',
      key: 'receiveAndSendReceipt',
      width: 350,
      render: dateColumn.render,
    },
    {
      title: 'Apply for permits (Permits and Pre-Construction)',
      dataIndex: 'applyForPermits',
      key: 'applyForPermits',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Permit receives (Permits and Pre-Construction)',
      dataIndex: 'permitReceives',
      key: 'permitReceives',
      width: 250,
      render: dateColumn.render,
    },
    {
      title: 'Send commencement letter to client (Permits and Pre-Construction)',
      dataIndex: 'sendCommencementLetter',
      key: 'sendCommencementLetter',
      width: 350,
      render: dateColumn.render,
    },
  ];

  return { columns, data };
};
