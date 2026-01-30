import FloorPlanCard from '@/components/leadDetail/FloorPlanCard';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { getFacades } from '@redux/feature/facade/facadeThunk';
import { fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { RootState } from '@redux/feature/store';
import { IconX } from '@tabler/icons-react';
import { Button, Card, Checkbox, Drawer, Form, Input, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import RangeSelect from '../custom-selects/RangeSelect';
import DwellingTypeSelect from '../custom-selects/DwellingTypeSelect';

const LandCreatePackageDrawerModel = ({ title, open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const { floorPlans, status, filters } = useAppSelector((state: RootState) => state.floorPlan);
  const { facades, selectedFilters } = useAppSelector(state => state.facade);
  const facadeStatus = useAppSelector(state => state.facade.status);
  const typesStatus = useAppSelector(state => state.types.status);
  const [selectedFacade, setSelectedFacade] = useState(null);
  const [selectedFloorplan, setSelectedFloorplan] = useState(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status.floorPlan.fetch === Status.IDLE) {
      try {
        dispatch(fetchFloorPlans(undefined)).unwrap();
      } catch (error) {
        message.error(error || 'failed to fetch floorplan');
      }
    }
  }, [dispatch, status, filters]);

  useEffect(() => {
    if (facadeStatus === Status.IDLE) {
      try {
        dispatch(getFacades(selectedFilters)).unwrap();
      } catch (error) {
        message.error(error || 'failed to fetch faacde');
      }
    }
  }, [dispatch, facadeStatus, selectedFilters]);

  const handleSubmit = async values => {
    console.log(values);
    onSubmit(values);
    form.resetFields();
    setSelectedFacade('');
    setSelectedFloorplan('');
  };

  return (
    <div>
      <Drawer
        title={title}
        open={open}
        onClose={onClose}
        closeIcon={false}
        extra={<IconX style={{ cursor: 'pointer' }} onClick={onClose} size={20} />}
      >
        <div>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="grid grid-cols-2 gap-2 ">
              <Form.Item label="Package Name" name="packageName" className="!text-red-500">
                <Input />
              </Form.Item>
              <Form.Item label="Dwelling Type" name="dwellingType">
                <DwellingTypeSelect />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2 ">
              <Form.Item label="Inclusion" name="inclusion" className="!text-red-500">
                <Select options={[{ label: 'Turnkey Inclusion', value: 'turnkeyInclusion' }]} />
              </Form.Item>
              <Form.Item label="Range" name="range">
                <RangeSelect />
              </Form.Item>
            </div>
            <Form.Item label="Disclamier" name="disclamier">
              <Select
                options={[
                  { label: 'Validity', value: 'validity' },
                  { label: 'Standard', value: 'standard' },
                ]}
              />
            </Form.Item>
            {/* floor plan */}
            <div>
              <p>Floor Plan</p>
              <Form.Item name="floorplan">
                <div className="flex gap-2 overflow-x-auto mt-3">
                  {floorPlans?.map(plan => (
                    <div
                      key={plan.floorPlanId}
                      className={`${selectedFloorplan === plan.floorPlanId ? 'border-2 border-primary' : ''}`}
                    >
                      <FloorPlanCard
                        key={plan.floorPlanId}
                        plan={plan}
                        isSelected={false}
                        onClick={() => {
                          form.setFieldValue('floorplan', plan.floorPlanId);
                          setSelectedFloorplan(plan.floorPlanId);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Form.Item>
            </div>

            {/* facade */}
            <div className="mt-3">
              <div className="flex justify-between">
                <p>Facade</p>
                <div className="flex gap-4">
                  <Checkbox checked={true} onChange={e => {}}>
                    Standard{' '}
                  </Checkbox>
                  <Checkbox checked={false} onChange={e => {}}>
                    Upgrade{' '}
                  </Checkbox>
                </div>
              </div>
              <Form.Item name="facade">
                <div className="flex gap-2 overflow-x-auto mt-3">
                  {facades?.map(facade => (
                    <div
                      key={facade.facadeId}
                      className={`h-full ${selectedFacade === facade.facadeId ? 'border-2 border-primary' : ' '}`}
                    >
                      <Card
                        hoverable
                        onClick={() => {
                          form.setFieldValue('facade', facade.facadeId);
                          setSelectedFacade(facade.facadeId);
                        }}
                        className="h-full flex flex-col cursor-pointer transition-all"
                        cover={
                          <div className="relative h-40 w-full">
                            <Image
                              src={facade.image || '/images/no_image_found.png'}
                              alt={facade.name || 'Facade'}
                              loading="lazy"
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover rounded-t"
                              placeholder="blur"
                              blurDataURL="/images/blur-placeholder.png"
                            />
                          </div>
                        }
                      >
                        <Card.Meta title={facade.name} className="flex-grow" />
                      </Card>
                    </div>
                  ))}
                </div>
              </Form.Item>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </Drawer>
    </div>
  );
};

export default LandCreatePackageDrawerModel;
