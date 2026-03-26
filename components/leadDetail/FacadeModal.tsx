import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createFacade, getFacades } from '@redux/feature/facade/facadeThunk';
import { Button, Checkbox, Form, Modal, Radio, Tabs, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import AvailableFacadesTab from './AvailableFacadesTab';
import CustomFacadeForm from './forms/CustomFacadeForm';
import { setQuotationFacade } from '@redux/feature/quotation/quotationSlice';
import { setSelectedFilters } from '@redux/feature/facade/facadeSlice';
import { IFacadeState } from '@redux/feature/facade/IFacadeState';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

const { Title } = Typography;

interface FacadeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (data: IFacadeState | { type: string; facade: IFacadeState }) => void;
  selectedFacade?: IFacadeState;
}

const FacadeModal: React.FC<FacadeModalProps> = ({ visible, onCancel, onSave, selectedFacade }) => {
  const dispatch = useAppDispatch();
  const { facades, selectedFilters } = useAppSelector(state => state.facade);
  const [form] = Form.useForm();
  const { selectedFilters: quoteFilters } = useAppSelector(state => state.quotation);
  const [activeTab, setActiveTab] = useState<'available' | 'custom'>('available');
  const [selected, setSelected] = useState<IFacadeState>(selectedFacade || null);
  const [formValues, setFormValues] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      dispatch(
        getFacades({
          status: true,
          dwelling_type_id: quoteFilters?.dwellingType,
          range_id: quoteFilters?.range,
          cost_type: selectedFilters?.standard
            ? 'standard'
            : selectedFilters?.upgrade
              ? 'upgrade'
              : undefined,
        })
      )
        .unwrap()
        .catch(console.error);
    }
  }, [dispatch, visible, quoteFilters, selectedFilters]);

  const handleSave = async () => {
    if (activeTab === 'available') {
      if (!selected) {
        message.warning('Please select a facade before saving.');
        return;
      }
      onSave(selected);
      dispatch(setQuotationFacade(selected));
      onCancel();
    } else {
      await form.validateFields();
      if (!formValues) {
        message.warning('Please fill the form before saving.');
        return;
      }
      try {
        const formData = formDataGenerator({
          ...formValues,
          image: formValues.image[0].originFileObj,
        });
        setLoading(true);
        const response = await dispatch(createFacade(formData)).unwrap();
        dispatch(setQuotationFacade(response));
        setFormValues(null);
        message.success('Facade created successfully');
        onSave(response);
        onCancel();
      } catch (error) {
        message.error(`${error}` || 'Failed to create facade');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      title={
        <div className="bg-blue-500 text-white p-2 rounded">
          <Title level={4}>Facade</Title>
        </div>
      }
      centered
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          Save
        </Button>,
      ]}
      className="facade-modal"
    >
      <Tabs
        activeKey={activeTab}
        onChange={key => setActiveTab(key as 'available' | 'custom')}
        tabBarExtraContent={
          activeTab === 'available' && (
            <div className="flex gap-4">
              <Radio.Group
                value={
                  selectedFilters.standard ? 'standard' : selectedFilters.upgrade ? 'upgrade' : ''
                }
                options={[
                  { label: 'Standard', value: 'standard' },
                  { label: 'Upgrade', value: 'upgrade' },
                ]}
                onChange={e => {
                  dispatch(
                    setSelectedFilters({
                      standard: e.target.value === 'standard',
                      upgrade: e.target.value === 'upgrade',
                    })
                  );
                  setSelected(null);
                }}
              />
              {/* Second Variation */}
              {/* {
                            activeTab === "available" && (
                                <>
                                    <Segmented
                                        value={selectedFilters.standard}
                                        onChange={(val) => dispatch(setSelectedFilters({ standard: val }))}
                                        options={[
                                            { label: "All", value: "all" },
                                            { label: "Standard", value: "true" },
                                            { label: "Exclude Standard", value: "false" },
                                        ]}
                                    />

                                    <Segmented
                                        value={selectedFilters.upgrade}
                                        onChange={(val) => dispatch(setSelectedFilters({ upgrade: val }))}
                                        options={[
                                            { label: "All", value: "all" },
                                            { label: "Upgrade", value: "true" },
                                            { label: "Exclude Upgrade", value: "false" },
                                        ]}
                                    />
                                </>
                            )
                        } */}
            </div>
          )
        }
        items={[
          {
            key: 'available',
            label: 'Available',
            children: (
              <AvailableFacadesTab
                facades={facades}
                selectedFacade={selected}
                onSelect={setSelected}
              />
            ),
          },
          {
            key: 'custom',
            label: 'Custom',
            children: (
              <CustomFacadeForm
                initialValues={formValues}
                onFormChange={setFormValues}
                form={form}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default FacadeModal;
