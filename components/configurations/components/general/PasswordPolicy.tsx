import React, { useEffect } from 'react';
import { Form, InputNumber, Button, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import {
  fetchPasswordPolicy,
  updatePasswordPolicy,
} from '@redux/feature/admin/general/passwordPolicy/passwordPolicyThunk';
import { Status } from '@lib/constants/enum';
import { passwordPolicy } from '@redux/feature/admin/general/passwordPolicy/IPasswordPolicyState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const PasswordPolicy: React.FC = () => {
  const [form] = Form.useForm();
  const { passwordPolicy, status } = useAppSelector(
    (state: RootState) => state.general.passwordPolicy
  );
  const maxAlertDays = Form.useWatch('expiresInDays', form);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchPolicy();
    }
    if (passwordPolicy) {
      form.setFieldsValue(passwordPolicy);
    }
  }, [status.fetch]);

  async function fetchPolicy() {
    try {
      await dispatch(fetchPasswordPolicy()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Password Policy');
    }
  }
  const onFinish = async (values: passwordPolicy) => {
    try {
      const { isUpdated, updatedFields } = getUpdatedFields<passwordPolicy>(values, passwordPolicy);
      if (!isUpdated) {
        message.info('No changes detected');
        return;
      }
      await dispatch(
        updatePasswordPolicy({
          data: updatedFields,
          passwordPolicyId: passwordPolicy.passwordPolicyId,
        })
      ).unwrap();
      message.success('Password Policy updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update password policy');
    }
  };

  return (
    <div className="p-6 md:p-10 w-full min-h-screen">
      <div className=" mx-auto">
        <Form
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          initialValues={passwordPolicy}
          labelCol={{ xs: 24, md: 10 }}
          wrapperCol={{ xs: 24, md: 14 }}
          labelAlign="left"
          className="space-y-4"
        >
          <Form.Item
            label="Expires (in days)"
            name="expiresInDays"
            rules={[
              { required: true, message: 'Please enter number of days' },
              {
                type: 'number',
                min: 1,
                max: 365,
                message: 'Expiry days must be between 1 and 365',
              },
            ]}
          >
            <InputNumber
              min={1}
              addonAfter="days"
              className="w-full rounded-lg shadow-sm"
              disabled={status.update === Status.PENDING}
            />
          </Form.Item>

          <Form.Item
            label="Number of invalid attempts"
            name="invalidAttemptLimit"
            rules={[
              { required: true, message: 'Please enter number of attempts' },
              {
                type: 'number',
                min: 1,
                max: 10,
                message: 'Invalid Attempts must be between 1 and 10',
              },
            ]}
          >
            <InputNumber
              min={1}
              className="w-full rounded-lg shadow-sm"
              disabled={status.update === Status.PENDING}
            />
          </Form.Item>

          <Form.Item
            label="Display alert from number of days"
            name="alertBeforeExpiryDays"
            rules={[
              { required: true, message: 'Please enter number of days' },
              {
                type: 'number',
                min: 1,
                max: maxAlertDays - 1,
                message: 'Alert days must be less than expiry days',
              },
            ]}
          >
            <InputNumber
              min={1}
              addonAfter="days"
              className="w-full rounded-lg shadow-sm"
              disabled={status.update === Status.PENDING}
            />
          </Form.Item>

          <Form.Item
            label="Number of passwords stored in history"
            name="passwordHistoryCount"
            rules={[
              { required: true, message: 'Please enter a number' },
              {
                type: 'number',
                min: 1,
                max: 20,
                message: 'Password history count must be less than 20',
              },
            ]}
          >
            <InputNumber
              min={1}
              className="w-full rounded-lg shadow-sm"
              disabled={status.update === Status.PENDING}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{ xs: 24, md: { offset: 10, span: 14 } }}
            className="pt-4 w-full flex justify-end  items-center pr-40 "
          >
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-lg font-semibold"
              loading={status.update === Status.PENDING}
            >
              Save Policy
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
