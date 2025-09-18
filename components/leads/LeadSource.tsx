import { Divider, message } from 'antd'
import { useEffect, useState } from 'react';
import { mapToOptions } from '@lib/utils/rangeAndDwellingObjToOptions';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getLeadSourcesThunk, updateLeadThunk } from '@redux/feature/lead/leadThunk';
import { Status } from '@lib/constants/enum';
import { RootState } from "@redux/feature/store";
import LeadUpdateDetail from '../leadDetail/LeadUpdateDetail';
import EditableField from './EditableField';
import { notesRules, leadSourceRules } from '@lib/constants/formInputValidations';

export const LeadSource = () => {
    const { leadDetail, leadSources } = useAppSelector((state: RootState) => state.lead);
    const getLeadSourceStatus = useAppSelector((state: RootState) => state.lead.status.leadSources);
    const updateLeadStatus = useAppSelector((state: RootState) => state.lead.status.updateLeadSource);
    const [isLeadEditing, setIsLeadEditing] = useState({ leadSource: false, notes: false });
    const dispatch = useAppDispatch();
    const LeadSourceOptions = mapToOptions(leadSources);

    useEffect(() => {
        async function fetchLeadSource() {
            if (getLeadSourceStatus === Status.IDLE) {
                try {
                    const res = await dispatch(getLeadSourcesThunk()).unwrap();
                } catch (error) {
                    message.error(error || 'Failed to fetch lead sources');
                }
            }
        }
        fetchLeadSource();
    }, [dispatch, getLeadSourceStatus]);

    const handleLeadSourceEdit = async (values) => {
        try {
            const res = await dispatch(updateLeadThunk({ id: leadDetail.lead.leadId, details: { lead_source: values.leadSource, notes: values?.notes?.trim() } })).unwrap();
            message.success("lead updated successfully")
            setIsLeadEditing({ leadSource: false, notes: false })
        }
        catch (error) {
            message.error(error || 'Failed to update lead');
        }
    }
    return (
        <div className='flex flex-col md:flex-row  lg:flex-col m-3 p-1'>
            <div className='flex-1'>
                <div className='text-md font-bold lg:mt-6'><p>More Info</p></div>
                <Divider className='bg-border-color my-3'></Divider>
                <EditableField
                    label='Lead Source'
                    name='leadSource'
                    value={leadDetail.lead?.leadSource}
                    rules={leadSourceRules}
                    isleadEditing={isLeadEditing.leadSource}
                    setIsLeadEditing={setIsLeadEditing}
                    loading={updateLeadStatus === Status.PENDING}
                    options={LeadSourceOptions}
                    initialValues={{ "leadSource": leadDetail.lead?.leadSource || '' }}
                    type='Select'
                    onSave={handleLeadSourceEdit}
                />
                <EditableField
                    label='Notes'
                    name='notes'
                    value={leadDetail.lead?.notes}
                    rules={notesRules}
                    isleadEditing={isLeadEditing.notes}
                    setIsLeadEditing={setIsLeadEditing}
                    loading={updateLeadStatus === Status.PENDING}
                    initialValues={{ "notes": leadDetail.lead?.notes || '' }}
                    type='TextArea'
                    onSave={handleLeadSourceEdit}
                />
            </div>
            <div className=' flex-1 mt-[80px] md:mt-[0px] lg:mt-[100px]' >
                <div className='text-md font-bold'><p>People</p></div>
                <Divider className='bg-border-color my-3'></Divider>
                <LeadUpdateDetail label="Assignee" value={leadDetail.lead?.assigneeName} />
                <LeadUpdateDetail label="Created" value={leadDetail.lead?.createdByName} />
                <LeadUpdateDetail label="Updated" value={leadDetail.lead?.updatedByName} />
            </div>
        </div>
    );
};  