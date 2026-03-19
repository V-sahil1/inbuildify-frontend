import { Status } from '@lib/constants/enum';
import {
  emailRules,
  leadSourceRules,
  nameRules,
  optionalEmailRule,
  optionalNotesRule,
  optionalPhoneRule,
  phoneRules,
} from '@lib/constants/formInputValidations';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useEffect } from 'react';
import { message } from 'antd';
import { setAddInstSourceModal } from '@redux/feature/lead/leadSlice';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { FormField } from '../common/Models/ActionDialogModel';
import { fetchAllleadSource } from '@redux/feature/admin/sales/leadSource/leadSourceThunk';

export type LeadFormField = Omit<FormField, 'type'> & {
  type?: 'email' | 'phone' | 'select' | 'textarea' | 'checkbox';
};

export const useLeadCreateFields = (
  { isEmailDisable }: { isEmailDisable: boolean } = { isEmailDisable: false },
  form?: any
): readonly FormField[] => {
  const dispatch = useAppDispatch();
  const { leadSource, status } = useAppSelector(state => state.sales.leadSource);
  const { setting } = useAppSelector(state => state.sales.setting);
  const isOptional = (type: 'email' | 'phone') => {
    const option = setting?.leadMandatoryOption;

    if (!option) return false;

    if (option === 'email_and_phone') return false;

    if (option === 'email_not_mandatory' && type === 'email') return true;
    if (option === 'phone_not_mandatory' && type === 'phone') return true;

    if (option === 'email_and_phone_not_mandatory') return true;

    if (option === 'either_email_or_phone') return true;

    return false;
  };

  const getEmailRules = () => {
    if (setting?.leadMandatoryOption === 'either_email_or_phone') {
      return [
        ...optionalEmailRule,
        {
          validator: (_: any, value: string) => {
            const phoneValue = form?.getFieldValue?.('phone');
            if (!value && !phoneValue) {
              return Promise.reject(
                new Error('Either email or phone is required')
              );
            }
            return Promise.resolve();
          },
        },
      ];
    }

    return isOptional('email') ? optionalEmailRule : emailRules;
  };

  const getPhoneRules = () => {
    return isOptional('phone') ? optionalPhoneRule : phoneRules;
  };

  const emailFieldRules = getEmailRules();
  const phoneFieldRules = getPhoneRules();

  const LeadSourceOptions =
    leadSource &&
    leadSource.length > 0 &&
    leadSource
      ?.filter(i => i.isActive)
      ?.map(item => ({
        label: enumToReadable(item?.name),
        value: item?.leadSourceId,
      }));

  async function getLeadSources() {
    try {
      await dispatch(fetchAllleadSource({})).unwrap();
    } catch (error) {
      message.error(error || 'failed to fetch the Lead sources');
    }
  }

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      getLeadSources();
    }
  }, [status.fetch]);

  const handleAddSource = () => {
    dispatch(setAddInstSourceModal(true));
  };

  return [
    {
      label: 'Full Name',
      name: 'name',
      placeholder: 'John Doe',
      rules: nameRules,
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: 'john@example.com',
      type: 'email',
      rules: emailFieldRules,
      disabled: isEmailDisable,
    },
    {
      label: 'Phone',
      name: 'phone',
      placeholder: '1234567890',
      type: 'phone',
      rules: phoneFieldRules,
    },
    {
      label: 'Lead Source',
      name: 'leadSourceId',
      placeholder: 'e.g. Social Media, Referral, etc.',
      type: 'select',
      options: LeadSourceOptions,
      rules: leadSourceRules,
      onClick: handleAddSource,
      button: 'Add Source',
    },
    {
      label: 'Notes',
      name: 'notes',
      placeholder: 'e.g. Social Media, Referral, etc.',
      type: 'textarea',
      rules: optionalNotesRule,
    },
    {
      label: 'Send Welcome Letter to Customer',
      name: 'sendLetter',
      type: 'checkbox',
      initialValue: false,
    },
  ] as const;
};

export default useLeadCreateFields;
