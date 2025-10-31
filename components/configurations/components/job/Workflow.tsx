import React, { useEffect, useState } from 'react';
import { Form, Switch, Typography, Button, Space } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';

const { Text } = Typography;

export const Workflow = () => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  const defaultValues = {
    showAllTasks: true,
    includeWeekend: false,
    includeHoliday: false,
    recalcFutureTasks: true,
    recalcAutomatically: true,
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
    setInitialValues(defaultValues);
  }, [form]);

  const handleValuesChange = (_, allValues) => {
    const changed = Object.keys(allValues).some(key => allValues[key] !== initialValues[key]);
    setIsChanged(changed);
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    console.log('✅ Saved Values:', values);
    setInitialValues(values);
    setIsChanged(false);
  };

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        initialValues={defaultValues}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="showAllTasks" valuePropName="checked" noStyle>
          <InputSwitch name="showAllTasks" label="Show all Tasks to all Roles" description="" />
        </Form.Item>

        {/* 🔹 2. Include weekend */}
        <Form.Item name="includeWeekend" valuePropName="checked" noStyle>
          <InputSwitch
            name="includeWeekend"
            label="Include Weekend Date"
            description={
              <>
                <Text type="secondary">
                  If weekend is turned on – Estimated date calculation will consider weekends.
                  <br />
                  If weekend is turned off – Estimated date calculation will not consider weekends.
                  <br />
                  <b>Ex:</b> If days given for task is 31 days – Estimated date is 1st January and
                  there are 4 weekends (8 days). Estimated date will be 31st January if weekend is
                  on, 10th February if off.
                </Text>
              </>
            }
          />
        </Form.Item>

        {/* 🔹 3. Include holiday */}
        <Form.Item name="includeHoliday" valuePropName="checked" noStyle>
          <InputSwitch
            name="includeHoliday"
            label="Include Holiday Date"
            description={
              <>
                <Text type="secondary">
                  If holidays is turned on – Estimated date calculation will consider company
                  holidays.
                  <br />
                  If holidays is turned off – it won’t consider company holidays.
                  <br />
                  <b>Note:</b> If a holiday falls under weekend and weekend is turned on, it’s
                  counted as a holiday.
                  <br />
                  <b>Ex:</b> If task days are 31 – Estimated date is 1st January and 14–15 January
                  are holidays. Date will be 31st Jan if on, 2nd Feb if off.
                </Text>
              </>
            }
          />
        </Form.Item>

        {/* 🔹 4. Recalculate future tasks */}
        <Form.Item name="recalcFutureTasks" valuePropName="checked" noStyle>
          <InputSwitch
            name="recalcFutureTasks"
            label="Re-calculate the Estimated End dates of Future Tasks"
            description={
              <Text type="secondary">
                Changing the estimated end date of any task will change the estimated end date of
                further tasks.
              </Text>
            }
          />
        </Form.Item>

        {/* 🔹 5. Recalculate automatically */}
        <Form.Item name="recalcAutomatically" valuePropName="checked" noStyle>
          <InputSwitch
            name="recalcAutomatically"
            label="Re-calculate the Estimated dates automatically based on Actual date changes"
            description={
              <Text type="secondary">
                When turned ON: Future estimated dates will be automatically recalculated based on
                actual date changes.
                <br />
                When turned OFF: A confirmation popup will appear before applying changes.
                <br />
                <b>Note:</b> This controls how estimated dates are recalculated when actual dates
                are updated.
              </Text>
            }
          />
        </Form.Item>
        {isChanged && (
          <div className="flex justify-end w-full">
            <Button type="primary" onClick={handleSave} disabled={!isChanged}>
              Save
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};
