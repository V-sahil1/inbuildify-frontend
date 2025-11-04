'use client';
import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Input,
  Select,
  Typography,
  Divider,
  Row,
  Col,
  DatePicker,
  Switch,
} from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';

const { Title } = Typography;
const { Option } = Select;

export const SettingPage = () => {
  const [form] = Form.useForm();
  const [optionalForm] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);
  const [checklistStageChanged, setChecklistStageChanged] = useState(false);
  const [isOptionalChanged, setIsOptionalChanged] = useState(false);

  // Simulated initial values from API
  const initialValues = {
    makeSupplierMandatory: true,
    allowChecklistWithoutSupplier: true,
    showWarningSupplierSameDay: false,
    emailPrivateInspector: true,
    inspectionChecklistMandatory: false,
    includeWeekend: true,
    includeHoliday: false,
    includeOnHold: false,
    allowStageDateChange: true,
    defaultLeadTime: '7',
    allowMoveWithoutChecklist: true,
    rebookOnDateChange: true,
    sendEmailWhenStageCompleted: true,
    autoMoveToConstruction: true,
    recalcDatesOnDelay: true,
    enableForecast: false,
  };

  const optionalInitial = {
    rolesSupervisor: ['Builder', 'Site Supervisor'],
    rolesCoordinator: [],
    permitLabel: '',
    siteStartDays: '90 days',
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    optionalForm.setFieldsValue(optionalInitial);
  }, []);

  const handleValuesChange = (_, allValues) => {
    const changed = Object.keys(initialValues).some(key => allValues[key] !== initialValues[key]);
    setIsChanged(changed);
  };

  const handleOptionalChange = (_, allValues) => {
    const changed = Object.keys(optionalInitial).some(
      key => JSON.stringify(allValues[key]) !== JSON.stringify(optionalInitial[key])
    );
    setIsOptionalChanged(changed);
  };

  const handleSave = () => {
    console.log('Saving main form:', form.getFieldsValue());
    setIsChanged(false);
  };

  const handleOptionalSave = () => {
    console.log('Saving optional settings:', optionalForm.getFieldsValue());
    setIsOptionalChanged(false);
  };

  //   for the model open
  const allowMoveWithoutChecklist = Form.useWatch('allowMoveWithoutChecklist', form);
  const makeSupplierMandatory = Form.useWatch('makeSupplierMandatory', form);
  useEffect(() => {
    if (allowMoveWithoutChecklist !== undefined) {
      setChecklistStageChanged(
        allowMoveWithoutChecklist !== initialValues.allowMoveWithoutChecklist
      );
    }
  }, [allowMoveWithoutChecklist]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <Title level={5}>Checklist and Stage Settings</Title>

        <InputSwitch
          name="makeSupplierMandatory"
          label="Make Suppliers/Tradies selection mandatory to complete the checklist."
          description="A Supplier or Tradie must be selected for each checklist item. The system will not allow the checklist to be completed without this selection."
        />

        {makeSupplierMandatory && (
          <InputSwitch
            name="allowChecklistWithoutSupplier"
            label="Allow to complete the checklist even the Suppliers/Tradies has not responded"
            description={
              <div className="flex flex-col gap-2">
                <p>
                  When the toggle is ON-System will allow the user to complete the checklist even if
                  the booking status is pending acceptance.
                </p>
                <p>
                  When the toggle is OFF-User can complete the checklist only when the booking
                  status is changed to manually accepted.
                </p>
              </div>
            }
          />
        )}

        <InputSwitch
          name="showWarningSupplierSameDay"
          label="Show a warning when a supplier or trade is booked on the same day for other checklist."
          description="The system shows a warning if the same supplier or trade is already booked on the same day for other checklists or jobs."
        />

        <InputSwitch
          name="emailPrivateInspector"
          label="Sending an email to the Private Inspector is mandatory,"
          description="An email must be sent to the assigned Private Inspector after completing the stage. The job can't move to next stage until the email has been sent."
        />

        <InputSwitch
          name="inspectionChecklistMandatory"
          label="Make Inspection Checklist Mandatory"
          description="Inspection checklist mandatory option works for stage start inspection type only"
        />

        <InputSwitch
          name="includeWeekend"
          label="Include Weekend Date"
          description={
            <div className="flex flex-col gap-2">
              <p>If weekend is turned on-Estimated date calculation will consider weekends.</p>
              <p>
                If weekend is turned off - Estimated date calculation will not consider weekends.
              </p>
              <p>
                Ex: If days given for Base stage is 31 days- Estimated start date is 1st of January
                and there are 4 weekend (8 days)
              </p>
              <p>
                Estimated end date will be 31st of January if weekend is turned on. Estimated end
                date will be 10th of February if weekend is turned off.
              </p>
            </div>
          }
        />

        <InputSwitch
          name="includeHoliday"
          label="Include Holiday Date"
          description={
            <div className="flex flex-col gap-2">
              <p>
                If holidays is turned on - Estimated date calculation will consider company holidays
              </p>
              <p>
                If holidays is turned off - Estimated date calculation will not consider the company
                holidays.
              </p>
              <p>
                Note: If any company holiday falls under weekend and include weekend is turned on it
                will considered as holiday only.
              </p>
              <p>
                Ex: If days given for Base stage is 31 days-Estimated start date is 1st of January
                and 14 & 15-January is marked as holiday Estimated end date will be 31st of January
                if holiday is turned on. Estimated end date will be 2nd of February if holiday is
                turned off.
              </p>
            </div>
          }
        />

        <InputSwitch
          name="includeOnHold"
          label="Include OnHold Date"
          description={
            <div>
              <p>
                If On Hold is turned on - Estimated date calculation will consider on hold period.
              </p>
              <p>
                If On Hold is turned off - Estimated date calculation will not consider on hold
                period.
              </p>
              <p>
                Note: if on hold period has weekend and include weekend is turned on it will be
                considered as on hold period only.
              </p>
              <p>
                Ex: If days given for Base stage is 31 days- Estimated start date is 1st of January
                and construction is marked on hold on 15 January and resumed on 20-January Estimated
                end date will be 31st of January if on hold is turned on. Estimated end date will be
                5th of February if on hold is turned off.
              </p>
            </div>
          }
        />

        <InputSwitch
          name="allowStageDateChange"
          label="Allow Stage Date Change"
          description="Allow to change the construction stage dates."
        />

        <InputSwitch
          name="defaultLeadTime"
          label="Default Lead Time for any Supplier/Trade"
          description={
            <div>
              <p>
                This will show you the advance booking dates for each Supplier/Trade based on the
                number of days provided.
              </p>
              <p>
                Example: If reminder days is set to 14 days and if a supplier/trade needs to be on
                the site on 15th Jan then the system shows to book this supplier/trade for 1st Jan
                in the ToDo list.
              </p>
            </div>
          }
        />

        <Form.Item label="No. of remider days" name="defaultLeadTime">
          <Select>
            <Option value="3">3 days</Option>
            <Option value="7">7 days</Option>
            <Option value="14">14 days</Option>
          </Select>
        </Form.Item>

        <Divider />

        <InputSwitch
          name="allowMoveWithoutChecklist"
          label="Allow to Move to Next Stage even if Checklists are not Completed"
          description={
            <div>
              <p>
                If allow to move to next stage is turned ON-Site supervisors can move the job to
                next stage even if checklists are not completed but claim is done, In the next stage
                new button will be provided to mark as current stage.
              </p>
              <p>
                If allow to move to next stage is turned OFF-Site supervisors are not allowed to
                move to next stage until all checklists are completed.
              </p>
            </div>
          }
        />

        <InputSwitch
          name="rebookOnDateChange"
          label="Rebook the Confirmed Bookings on Date Changes (rescheduling)"
          description="When the toggle is ON- Confirmed bookings will be cancelled and rebooked wherever the checklists are rescheduled.
When the toggle is OFF-Confirmed bookings won't be affected when the checklists are rescheduled."
        />

        <InputSwitch
          name="sendEmailWhenStageCompleted"
          label="Send email when stage is completed"
          description="An automated email will be sent to the assigned supervisor once the stage is completed."
        />

        <InputSwitch
          name="autoMoveToConstruction"
          label="Move the jobs automatically from Ready for Construction to Under Construction"
          description={
            <div>
              <p>
                When the toggle is ON-Jobs will be automatically moved to under construction if any
                update in the job.
              </p>
              <p>When the toggle is OFF-Need to move all the jobs manually.</p>
            </div>
          }
        />

        <InputSwitch
          name="recalcDatesOnDelay"
          label="Recalculate Stage Dates and Construction Days When Delays Are Captured"
          description={
            <div>
              <p>
                When the toggle is ON-The Expected End Date of the current stage will be extended by
                the number of delay days. The Expected Start and End Dates of subsequent stages will
                be recalculated.
              </p>
              <p>The overall remaining construction days will be updated accordingly.</p>
              <p>
                When the toggle is OFF-The captured delay will not affect the stage dates or
                construction days.
              </p>
            </div>
          }
        />

        <InputSwitch
          name="enableForecast"
          label="Enable Forecast Dates"
          description={
            <div>
              <p>
                When enabled, forecast start and end dates will be calculated automatically for each
                stage based on actual completion of previous stages.
              </p>
              <p>Variances between forecast and actual dates will also be displayed.</p>
            </div>
          }
        />

        <Form.Item label="Number of days for Site Start from Title Date" name="siteStartDays">
          <Input placeholder="90 days" />
        </Form.Item>
        <Form.Item label="Label for permit received date" name="permitLabel" className="w-full">
          <DatePicker placeholder="Permit Received Date" />
        </Form.Item>

        {isChanged && (
          <div className="text-right mt-6">
            <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </Form>

      <Divider />

      <Form form={optionalForm} layout="vertical" onValuesChange={handleOptionalChange}>
        <Title level={5}>Optional Settings</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Roles for Site Supervisor" name="rolesSupervisor">
              <Select mode="multiple">
                <Option value="Builder">Builder</Option>
                <Option value="Company Administrator">Company Administrator</Option>
                <Option value="Site Supervisor">Site Supervisor</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Actual stage completion Date" name="rolesCoordinator">
              <Select placeholder="select">
                <Option value="Admin Coordinator">Claim</Option>
                <Option value="Project Manager">Move to next stage</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Role for admin coordinator" name="permitLabel" className="w-full">
              <Select placeholder="Choose Roles">
                <Option value="Admin Coordinator">Claim</Option>
                <Option value="Project Manager">Move to next stage</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {isOptionalChanged && (
          <div className="text-right mt-6">
            <Button type="primary" onClick={handleOptionalSave}>
              Save Optional Settings
            </Button>
          </div>
        )}
      </Form>

      <ConfirmationContentModal
        title="Confirmation"
        open={checklistStageChanged}
        onClose={() => setChecklistStageChanged(false)}
        onSubmit={() => {
          setChecklistStageChanged(false);
        }}
        okText="Yes"
        cancelText="No"
        content={
          <div className=" space-y-2">
            <p>Are you sure you want to update the following details?</p>
            <div className="flex gap-2 items-center">
              <Switch size="small" onChange={e => console.log(e)} />
              <p>Apply this change to all existing job</p>
            </div>
          </div>
        }
      />
    </div>
  );
};
