import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import {
  addressRules,
  nameRules,
  phoneRules,
} from "@lib/constants/formInputValidations";
import {
  getCountriesThunk,
  getStatesByCountryIdThunk,
} from "@redux/feature/location/locationThunk";
import { RootState } from "@redux/feature/store";
import {
  IconMail,
  IconPhone,
  IconPlus,
  IconUserCheck,
} from "@tabler/icons-react";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
} from "antd";
import { useEffect, useMemo, useState } from "react";

const { Option } = Select;

const LeadDetailsForm: React.FC<any> = ({
  open,
  loading = false,
  isEditing = false,
  initialValues = {},
  onCancel,
  onSubmit,
}) => { 
  const [form] = Form.useForm();
  const [showContactForm, setShowContactForm] = useState(false);
  const [hideAddressForm, setHideAddressForm] = useState(true);
  const [selectedCountryId, setSelectedCountryId] = useState<string>();
  const { countries, states, status } = useAppSelector(
    (state: RootState) => state.location
  );
  const dispatch = useAppDispatch();

  const countryMap = useMemo(
    () =>
      countries.reduce<Record<string, string>>((acc, c) => {
        acc[c.countryId] = c.name;
        return acc;
      }, {}),
    [countries]
  );

  const stateMap = useMemo(
    () =>
      states.reduce<Record<string, string>>((acc, s) => {
        acc[s.stateId] = s.name;
        return acc;
      }, {}),
    [states]
  );

  useEffect(() => {
    const loadCountries = async () => {
      try {
        await dispatch(getCountriesThunk()).unwrap();
      } catch (error) {
        message.error(error?.message || "Failed to fetch countries");
      }
    };

    if (status === Status.IDLE) {
      loadCountries();
    }
  }, [dispatch, status]);

  const handleCountryChange = async (countryId: string) => {
    setSelectedCountryId(countryId);
    try {
      await dispatch(getStatesByCountryIdThunk(countryId)).unwrap();
    } catch (error) {
      message.error(error?.message || "Failed to fetch states");
    }
  };

  useEffect(() => {
    if (countries.length > 0 && !selectedCountryId) {
      const defaultCountry = countries[0];
      setSelectedCountryId(defaultCountry.countryId);
      dispatch(getStatesByCountryIdThunk(defaultCountry.countryId));
    }
  }, [countries, dispatch, selectedCountryId]);

  const handleAddressToggle = (checked: boolean) => {
    setHideAddressForm(checked);
    form.setFieldsValue({
      address1: undefined,
      address2: undefined,
      city: undefined,
      zip: undefined,
      countryId: undefined,
      stateId: undefined,
    });
  };

  const handleContactClick = () => {
    setShowContactForm(true);
    setHideAddressForm(true);
    form.setFieldsValue({
      name: undefined,
      email: undefined,
      phone: undefined,
      secondary_phone: undefined,
    });
  };

  useEffect(() => {
    if (open) {
      if (isEditing && initialValues) {
        form.resetFields();
        form.setFieldsValue(initialValues);
      } else if (!isEditing) {
        form.resetFields();
      }
    }
  }, [open, isEditing, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const country = values.countryId
        ? countryMap[values.countryId]
        : undefined;
      const state = values.stateId ? stateMap[values.stateId] : undefined;

      let payload: any = {
        ...values,
        type: showContactForm ? "add" : "update",
      };

      if (country) payload.country = country;
      if (state) payload.state = state;

      // When contact is clicked, use initialValues for address fields
      if (showContactForm && initialValues && hideAddressForm) {
        payload = {
          ...payload,
          address1: initialValues.address1 || '',
          address2: initialValues.address2 || '',
          city: initialValues.city || '',
          zip: initialValues.zip || '',
          country: initialValues.countryName || '',
          state: initialValues.stateName || '',
        };
      }

      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      const { countryId, stateId, ...rest } = payload;
      await onSubmit(rest);

      setShowContactForm(false);
    } catch (err) {
      if (err.errorFields) {
        message.error("Please fill all required fields");
      } else {
        message.error("An error occurred. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    onCancel();
    if (!isEditing) {
      form.resetFields();
    }
  };

  return (
    <Modal
      title={
        <div className="flex w-full justify-between">
          <div>
            <h1 className="text-left">Contact Details</h1>
          </div>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={handleContactClick}
            className="mr-6"
          >
            Contact
          </Button>
        </div>
      }
      open={open}
      onOk={handleOk}
      centered
      onCancel={handleCancel}
      okText={showContactForm ? "Add" : isEditing ? "Update" : "Create"}
      className="p-6 max-w-4xl mx-auto md:min-w-[800px] h-[70vh] flex flex-col"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item label="Name" name="name" rules={nameRules}>
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
            ]}
          >
            <Input type="email" placeholder="Enter email" />
          </Form.Item>

          <Form.Item label="Phone" name="phone" rules={phoneRules}>
            <Input type="number" placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item label="Secondary Phone" name="secondary_phone">
            <Input
              type="number"
              placeholder="Enter secondary phone (optional)"
            />
          </Form.Item>

          {showContactForm && (
            <div className="col-span-2">
              <Form.Item
                className="mb-4"
                name="hideAddressForm"
                valuePropName="checked"
                initialValue={true}
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hideAddressForm}
                    onChange={handleAddressToggle}
                  />
                  <span>
                    {hideAddressForm ? "Show" : "Hide"} address fields
                  </span>
                </div>
              </Form.Item>
            </div>
          )}

          {!showContactForm || !hideAddressForm ? (
            <>
              <Form.Item label="Address 1" name="address1" rules={addressRules}>
                <Input placeholder="Enter address line 1" />
              </Form.Item>

              <Form.Item
                label="Address 2"
                name="address2"
                rules={[
                  {
                    min: 10,
                    message: "Address must be at least 10 characters",
                  },
                ]}
              >
                <Input placeholder="Enter address line 2" />
              </Form.Item>

              <Form.Item
                label="City / Suburb"
                name="city"
                rules={[
                  { required: true, message: "Please enter city or suburb" },
                ]}
              >
                <Input placeholder="Enter city/suburb" />
              </Form.Item>

              <Form.Item
                label="Zip / Postal Code"
                name="zip"
                rules={[
                  { required: true, message: "Please enter postal code" },
                  {max: 4, message: "Postal code must be at most 4 characters"}
                ]}
              >
                <Input
                  placeholder="Enter zip/postal code"
                  // maxLength={4}
                  type="number"
                />
              </Form.Item>

              <Form.Item
                label="Country"
                name="countryId"
                rules={[{ required: true, message: "Please select country" }]}
              >
                <Select
                  placeholder="Select country"
                  onChange={(value) => {
                    form.setFieldsValue({ stateId: undefined });
                    handleCountryChange(value);
                  }}
                  loading={status === Status.PENDING}
                >
                  {countries?.map((country) => (
                    <Option key={country.countryId} value={country.countryId}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="State / Region"
                name="stateId"
              rules={[
                { required: true, message: "Please select state/region" },
              ]}
            >
              <Select
                loading={status === Status.PENDING}
                disabled={!selectedCountryId}
              >
                {states.map((state) => (
                  <Option key={state.stateId} value={state.stateId}>
                    {state.name}
                  </Option>
                ))}
                </Select>
              </Form.Item>
            </>
          ) : (
            <div className="col-span-2 w-full">
              <Card className="w-full rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center">
                  <div className="col-span-1">
                    <h3 className="font-semibold text-[16px]">
                      {initialValues?.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {initialValues?.address}
                    </p>
                  </div>

                  <div className="col-span-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <IconPhone size={16} className="text-gray-500" />
                        <span className="text-sm">{initialValues?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconMail size={16} className="text-gray-500" />
                        <span className="text-sm">{initialValues?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-end gap-4">
                    <Button
                      type="text"
                      icon={<IconUserCheck size={18} />}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setHideAddressForm(false)}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default LeadDetailsForm;
