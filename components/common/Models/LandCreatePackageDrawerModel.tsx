import FloorPlanCard from '@/components/leadDetail/FloorPlanCard';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { getFacades } from '@redux/feature/facade/facadeThunk';
import { fetchFloorPlans } from '@redux/feature/floorPlan/floorPlanThunk';
import { RootState } from '@redux/feature/store';
import { IconX } from '@tabler/icons-react';
import { Button, Card, Checkbox, Drawer, Form, Input, message, Select } from 'antd';
import { useEffect } from 'react';
import Image from 'next/image';
import RangeSelect from '../custom-selects/RangeSelect';
import DwellingTypeSelect from '../custom-selects/DwellingTypeSelect';
import { fetchAllLandPackageGroup } from '@redux/feature/land/landThunk';

const LandCreatePackageDrawerModel = ({ title, open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const { packageGroup, status: packageGroupStatus } = useAppSelector((state: RootState) => state.land);
  const { floorPlans, status } = useAppSelector((state: RootState) => state.floorPlan);
  const { facades, status: facadeStatus } = useAppSelector(state => state.facade);
  const floorplan = Form.useWatch('floorPlanId', form);
  const facade = Form.useWatch('facadeId', form);
  const packageGroupOptions = packageGroup.map((item) => ({ label: item.groupName, value: item.lotPackageGroupId }));

  const dispatch = useAppDispatch();

  const fetchPackageGroupData = async () => {
    try {
      await dispatch(fetchAllLandPackageGroup()).unwrap()
    }
    catch (error) {
      message.error(error || 'failed to fetch package group');
    }
  }

  const fetchFloorPlansData = async () => {
    try {
      await dispatch(fetchFloorPlans({})).unwrap()
    }
    catch (error) {
      message.error(error || 'failed to fetch floorplan');
    }
  }

  const fetchFacadesData = async () => {
    try {
      await dispatch(getFacades({})).unwrap()
    }
    catch (error) {
      message.error(error || 'failed to fetch faacde');
    }
  }

  useEffect(() => {
    if (status.floorPlan.fetch === Status.IDLE) {
      fetchFloorPlansData()
    }
    if (facadeStatus === Status.IDLE) {
      fetchFacadesData()
    }
    if (packageGroupStatus.packageGroup === Status.IDLE) {
      fetchPackageGroupData()
    }
  }, [dispatch, status.floorPlan.fetch, facadeStatus, packageGroupStatus.packageGroup]);


  const handleSubmit = async values => {
    onSubmit(values);
    form.resetFields();
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
              <Form.Item label="Package Name" name="title" className="!text-red-500">
                <Input />
              </Form.Item>
              <Form.Item label="Dwelling Type" name="dwellingTypeId">
                <DwellingTypeSelect />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2 ">
              <Form.Item label="Inclusion" name="packageGroupId" className="!text-red-500">
                <Select options={packageGroupOptions} />
              </Form.Item>
              <Form.Item label="Range" name="rangeId">
                <RangeSelect />
              </Form.Item>
            </div>
            <Form.Item label="Disclamier" name="disclaimerType">
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
              <Form.Item name="floorPlanId">
                <div className="flex gap-2 overflow-x-auto mt-3">
                  {floorPlans?.map(plan => (
                    <div
                      key={plan.floorPlanId}
                      className={`${floorplan === plan.floorPlanId ? 'border-2 border-primary' : ''}`}
                    >
                      <FloorPlanCard
                        key={plan.floorPlanId}
                        plan={plan}
                        isSelected={false}
                        onClick={() => {
                          form.setFieldValue('floorPlanId', plan.floorPlanId);

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
                  <Checkbox checked={true} onChange={e => { }}>
                    Standard
                  </Checkbox>
                  <Checkbox checked={false} onChange={e => { }}>
                    Upgrade
                  </Checkbox>
                </div>
              </div>
              <Form.Item name="facadeId">
                <div className="flex gap-2 overflow-x-auto mt-3">
                  {facades?.map(item => (
                    <div
                      key={item.facadeId}
                      className={`h-full ${facade === item.facadeId ? 'border-2 border-primary' : ' '}`}
                    >
                      <Card
                        hoverable
                        onClick={() => {
                          form.setFieldValue('facadeId', item.facadeId);
                        }}
                        className="h-full flex flex-col cursor-pointer transition-all"
                        cover={
                          <div className="relative h-40 w-full">
                            <Image
                              src={item.image || '/images/no_image_found.png'}
                              alt={item.name || 'Facade'}
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
                        <Card.Meta title={item.name} className="flex-grow" />
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
