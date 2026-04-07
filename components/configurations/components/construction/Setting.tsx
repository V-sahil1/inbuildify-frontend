'use client';
import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Select, Typography, Divider, Row, Col, Switch, message } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { ConstructionSetting } from '@redux/feature/admin/construction/construtionSetting/iconstructionSettingState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchConstructionSetting,
  updateConstructionSetting,
} from '@redux/feature/admin/construction/construtionSetting/constructionSettingThunk';
import { Status } from '@lib/constants/enum';
import { useRoleHook } from '@hooks/useRoleHook';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const { Title } = Typography;
const { Option } = Select;

export const SettingPage = () => {
  const dispatch = useAppDispatch();
  const { constructionSetting, status } = useAppSelector(state => state.construction.setting);
  const { roleOptions } = useRoleHook();
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);
  const [checklistStageChanged, setChecklistStageChanged] = useState(false);
  const [applyChangesAllExistingJobs, setApplyChangesAllExistingJobs] = useState(false);
  const defaultLeadTimeForSupplierTrade = Form.useWatch('defaultLeadTimeForSupplierTrade', form);
  const fetchSetting = async () => {
    try {
      await dispatch(fetchConstructionSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch settings');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchSetting();
    }
    if (constructionSetting) {
      form.setFieldsValue(constructionSetting);
      setApplyChangesAllExistingJobs(constructionSetting.applyChangesAllExistingJobs);
    }
  }, [status.fetch]);

  const handleValuesChange = (_, allValues) => {
    const {isUpdated} = getUpdatedFields(allValues, constructionSetting);  
    setIsChanged(isUpdated)
  };

  const handleSave = async () => {
    const values: ConstructionSetting = await form.getFieldsValue();
    try {
      const {isUpdated,updatedFields} = getUpdatedFields(
        { ...values, applyChangesAllExistingJobs },
        constructionSetting
      );
      if (!isUpdated) {
        setIsChanged(false);
        return;
      }
      await dispatch(updateConstructionSetting(updatedFields)).unwrap();
      message.success('Settings updated successfully');
      setIsChanged(false);
    } catch (error) {
      message.error(error || 'Failed to update settings');
    }
  };

  //   for the model open
  const allowMoveNextStageEvenChecklistNotCompleted = Form.useWatch(
    'allowMoveNextStageEvenChecklistNotCompleted',
    form
  );
  const suppliersTradiesMadatoryToCompleteChecklist = Form.useWatch(
    'suppliersTradiesMadatoryToCompleteChecklist',
    form
  );
  useEffect(() => {
    if (allowMoveNextStageEvenChecklistNotCompleted !== undefined) {
      setChecklistStageChanged(
        allowMoveNextStageEvenChecklistNotCompleted !==
          constructionSetting.allowMoveNextStageEvenChecklistNotCompleted
      );
    }
  }, [allowMoveNextStageEvenChecklistNotCompleted]);

  return (
    <div className="p-6 bg-card-color rounded-lg shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={constructionSetting}
      >
        <Title level={5}>Checklist and Stage Settings</Title>

        <InputSwitch
          name="suppliersTradiesMadatoryToCompleteChecklist"
          label="Make Suppliers/Tradies selection mandatory to complete the checklist."
          description="A Supplier or Tradie must be selected for each checklist item. The system will not allow the checklist to be completed without this selection."
        />

        {suppliersTradiesMadatoryToCompleteChecklist && (
          <InputSwitch
            name="allowChecklistEvenSupplierTradiesNotResponded"
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
          name="showWarningWhenSupplierTradeBookedSameDayForChecklist"
          label="Show a warning when a supplier or trade is booked on the same day for other checklist."
          description="The system shows a warning if the same supplier or trade is already booked on the same day for other checklists or jobs."
        />

        <InputSwitch
          name="sendingEmailPrivateInspectorMandatory"
          label="Sending an email to the Private Inspector is mandatory,"
          description="An email must be sent to the assigned Private Inspector after completing the stage. The job can't move to next stage until the email has been sent."
        />

        <InputSwitch
          name="makeInspectionChacklistMandatory"
          label="Make Inspection Checklist Mandatory"
          description="Inspection checklist mandatory option works for stage start inspection type only"
        />

        <InputSwitch
          name="includeWeekendDate"
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
          name="includeHolidayDate"
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
          name="includeOnholdDate"
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
          name="defaultLeadTimeForSupplierTrade"
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

        {defaultLeadTimeForSupplierTrade && (
          <>
            <Form.Item label="No. of reminder days" name="noOfReminderDays">
              <Input type="number" onWheel={(e) => e.currentTarget.blur()} />
            </Form.Item>
            <Divider />
          </>
        )}

        <InputSwitch
          name="allowMoveNextStageEvenChecklistNotCompleted"
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
          name="rebookConfrimedBookingsOnDateChanges"
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
          name="moveJobsFromReadyForConstructionToUnderConstruction"
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
          name="recalculateStageDateConstructionDaysWhenDeleysCaptured"
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
          name="enableForcastDate"
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

        <Form.Item
          label="Number of days for Site Start from Title Date"
          name="numberOfDaysSiteStartFromTitleDate"
        >
          <Input placeholder="90" type="number" />
        </Form.Item>
        <Form.Item
          label="Label for permit received date"
          name="labelForPermitReceivedDate"
          className="w-full"
        >
          <Input placeholder="Permit Received Date" />
        </Form.Item>

        <Divider />

        <Title level={5}>Optional Settings</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Roles for Site Supervisor" name="siteSupervisorRoles">
              <Select mode="multiple" options={roleOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Roles for admin coordinator" name="adminCoordinatorRoles">
              <Select mode="multiple" options={roleOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Actual stage completion Date" name="stageCompletionDate">
              <Select placeholder="select">
                <Option value="claim">Claim</Option>
                <Option value="move_to_next_page">Move to next stage</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {isChanged && (
          <div className="text-right mt-6">
            <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </Form>

      {checklistStageChanged && (
        <ConfirmationContentModal
          title="Confirmation"
          open={checklistStageChanged}
          onClose={() => {
            setApplyChangesAllExistingJobs(constructionSetting.applyChangesAllExistingJobs);
            setChecklistStageChanged(false);
          }}
          onSubmit={() => {
            if (constructionSetting.applyChangesAllExistingJobs !== applyChangesAllExistingJobs) {
              setIsChanged(true);
            }
            setChecklistStageChanged(false);
          }}
          okText="Yes"
          cancelText="No"
          content={
            <div className=" space-y-2">
              <p>Are you sure you want to update the following details?</p>
              <div className="flex gap-2 items-center">
                <Switch
                  size="small"
                  onChange={checked => setApplyChangesAllExistingJobs(checked)}
                  checked={applyChangesAllExistingJobs}
                />
                <p>Apply this change to all existing job</p>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};
