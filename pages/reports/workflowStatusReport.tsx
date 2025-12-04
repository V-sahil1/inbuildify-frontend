import React, { useMemo, useState } from 'react';
import { Table } from 'antd';
import { exportToExcel } from '@lib/utils/exportToExcel';
import DynamicHorizontalChart from '@/components/common/charts/DynamicHorizontalChart';
import { useWorkflowStatusColumns } from '@/components/table-columns/WorkflowStatusReportColumns';
import WorkflowStatusHeader from '@/components/workflowstatus/WorkflowStatusReportHeader';

const getDateDataColor = (value: any): string | undefined => {
  if (!value) return undefined;
  const dateColor = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateColor.getTime())) return undefined;
  const year = dateColor.getFullYear();
  if (year < 2024) return 'FFDC3545';
  if (year === 2025) return 'FF198754';
  return 'FF0D6EFD';
};

const WorkflowStatusReport: React.FC = () => {
  const [currentBar, setCurrentBar] = useState<string | null>(null);
  const [isChartMinimized, setIsChartMinimized] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const { columns: allColumns, data } = useWorkflowStatusColumns();

  const handleExport = () => {
    console.log('Workflow export data length:', data.length, data);

    const column = {
      referenceId: { label: 'Reference ID', color: 'FF0023BD' },
      customerName: { label: 'Customer Name', color: 'FF0023BD' },
      jobAddress: { label: 'Job Address', color: 'FF0023BD' },
      dwellingType: { label: 'Dwelling Type', color: 'FF0023BD' },
      assignee: { label: 'Assignee', color: 'FF0023BD' },
      leadSource: { label: 'Lead Source', color: 'FF0023BD' },
      supervisorName: { label: 'Supervisor Name', color: 'FF0023BD' },
      jobCompletionDate: {
        label: 'Job Completion Date',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      uploadAll: {
        label: 'Upload all the documents (Deposit)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      sendInitialDepositReceipt: {
        label: 'Send Initial Deposit Receipt to client (Deposit)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      applyForSoilTest: {
        label: 'Apply for Soil Test and Survey (Deposit)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveSoilTest: {
        label: 'Receive Soil test and Survey (Deposit)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      requestBALTilePack: {
        label: 'Request BAL , Title Pack and Property Info (Deposit)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveBALTilePack: {
        label: 'Receive BAL , Title Pack and Property info (Deposit)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveSecondDeposit: {
        label: 'Receive 2nd Deposit (Deposit)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      requestSketch: {
        label: 'Request for the Sketch (Concept)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveSketch: {
        label: 'Receive Sketch from the Draftperson (Concept)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      sketchSignoff: {
        label: 'Sketch Signoff from client (Concept)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      requestSketchRevision: {
        label: 'Request Sketch revision to Draftee (Concept)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveRevisedSketch: {
        label: 'Receive Revised Sketch (Concept)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      revisedPlanSignoff: {
        label: 'Get Revised Plan signoff from client (Concept)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      updateQuotation: {
        label: 'Update Quotation if any changes in the Sketch (Concept)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      planRevisionRequest: {
        label: 'PLan Revision 1 request (Concept)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      bookColorAppointment: {
        label: 'Book Color Appointment (Color Selection)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      uploadSignedColorDoc: {
        label: 'Upload Signed Color selection document (Color Selection)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      raiseColorVariation: {
        label: 'Raise any color Variations(If required) (Color Selection)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      requestWorkingDrawings: {
        label: 'Request Working Drawing (Contract Drawing)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveWorkingDrawings: {
        label: 'Receive Working Drawings (Contract Drawing)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      confirmDrawings: {
        label: 'Confirm Drawing with clients (Contract Drawing)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      requestRevisedWD: {
        label: 'Request Revised WD (Contract Drawing)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveRevisedWD: {
        label: 'Receive Revised WD (Contract Drawing)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      confirmRevisedWD: {
        label: 'Confirm Revised WD with clients (Contract Drawing)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      requestDAApproval: {
        label: 'Request DA Approval (Approvals and Contract)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveDAApproval: {
        label: 'Receive DA Approval (Approvals and Contract)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      prepareContract: {
        label: 'Prepare Contract (Approvals and Contract)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      bookContractSigning: {
        label: 'Book Contract Signing Appointment (Approvals and Contract)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      uploadSignedContract: {
        label: 'Upload Signed Contract (Approvals and Contract)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveFinanceApproval: {
        label: 'Receive Finance Approval letter (Approvals and Contract)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      requestEngineeringReport: {
        label: 'Request Engineering and Energy Report (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveEngineering: {
        label: 'Receive Engineering (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveEnergyRating: {
        label: 'Receive Energy Rating Report (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      getInsurance: {
        label: 'Get Insurance (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      sendFivePercentInvoice: {
        label: 'Send 5% Invoice to Client (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      receiveAndSendReceipt: {
        label: 'Receive and Send 5% receipt to client (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      applyForPermits: {
        label: 'Apply for Permits (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      permitReceives: {
        label: 'Permits Received (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
      sendCommencementLetter: {
        label: 'Send Commencement letter to client (Permits and Pre Construction)',
        color: 'FF0023BD',
        dataColorFn: value => getDateDataColor(value),
      },
    };

    exportToExcel({
      data: data,
      fileName: 'Workflow Status Report',
      sheetName: 'Workflow Status Report',
      columnHeaders: column,
      title: 'Workflow Status Report',
    });
  };

  const appliedColumns = useMemo(
    () =>
      allColumns
        .filter((col, index) => {
          const key = (col.key as string) || String(col.dataIndex) || String(index);
          const visible = columnVisibility[key];
          return visible !== false;
        })
        .map((col, index) => {
          const key = (col.key as string) || String(col.dataIndex) || String(index);
          const widthStr = columnWidths[key];
          const width = widthStr ? Number(widthStr) : undefined;
          return width ? { ...col, width } : col;
        }),
    [allColumns, columnVisibility, columnWidths]
  );

  const handleBarClick = (status: string) => {
    console.log('Selected status:', status);
    setCurrentBar(status);
  };

  const handleChartToggle = (isMinimized: boolean) => {
    setIsChartMinimized(isMinimized);
  };

  const handleFilterChange = (columns: string[], statusFilters: string[]) => {
    // Add any additional filter logic here if needed
    console.log('Filters changed:', { columns, statusFilters });
  };

  return (
    <div className="p-4">
      <WorkflowStatusHeader
        onChartToggle={handleChartToggle}
        dataLength={data.length}
        columnVisibility={columnVisibility}
        columnWidths={columnWidths}
        onChangeColumnVisibility={(key, visible) =>
          setColumnVisibility(prev => ({
            ...prev,
            [key]: visible,
          }))
        }
        onChangeColumnWidth={(key, width) =>
          setColumnWidths(prev => ({
            ...prev,
            [key]: width,
          }))
        }
        onExport={handleExport}
      />

      {!isChartMinimized && (
        <>
          <DynamicHorizontalChart
            title="Workflow Stage Overview"
            categories={[
              'Deposit',
              'Concept',
              'Color Selection',
              'Contract Drawing',
              'Approvals and Contract',
              'Permits and Pre Construction',
              'Confirmation',
            ]}
            chartType="bar"
            seriesData={[12, 19, 3, 5, 2, 8, 15]}
            onBarClick={handleBarClick}
          />
          {currentBar && <p className="my-4">Selected stage: {currentBar}</p>}
        </>
      )}

      <div className="w-full overflow-x-auto custom-scrollbar">
        <Table
          columns={appliedColumns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 'max-content' }}
          rowKey="key"
          className="min-w-max"
        />
      </div>
    </div>
  );
};

export default WorkflowStatusReport;
