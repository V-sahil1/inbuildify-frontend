import LandLotFormModel from '@/components/common/Models/LandLotFormModel';
import FloorPlanModal from '@/components/leadDetail/FloorPlanModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  IconMail,
  IconMapPin,
  IconPencil,
  IconPhone,
  IconSearch,
  IconTable,
  IconTrash,
} from '@tabler/icons-react';
import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  message,
  Radio,
  Select,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import FacadeModal from '@/components/leadDetail/FacadeModal';
import { clearStandardFilter, clearUpgradeFilter } from '@redux/feature/facade/facadeSlice';
import PriceListDrawer from '@/components/common/Models/PriceListDrawer';
import { CommissionDrawer } from '@/components/job/jobDetail/comission/commissionDrawer';
const { TextArea } = Input;
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import {
  InclusinList,
} from 'data/HLPackageDeatilData';
import { ContentCard } from '@/components/common/card/ContentCard';
import { debouncedURL } from '@lib/utils/debounceURL';
import { HlPackageFooter } from '@/components/hlpackage/hlPackageFooter';
import { HLPackageHeader } from '@/components/hlpackage/HLPackageHeader';
import { useRouter } from 'next/router';
import { useContactHook } from '@hooks/useContactHook';
import { createHLPackageCommission, createHLPackagePricelist, deleteHLPackageCommission, deleteHLPackagPricelist, fetchAllHLPackageCommissionById, fetchAllHLPackagePricelistById, fetchAllLandPackageById, updateLandPackage } from '@redux/feature/land/landThunk';
import { useLotHook } from '@hooks/useLotHook';
import { Status } from '@lib/constants/enum';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

const HLPackageDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { packageDetails, status } = useAppSelector(state => state.land)
  const [editOpen, setEditOpen] = useState<{
    range: boolean, dwellingType: boolean, template: boolean,
    group: boolean, contact: boolean, lot: boolean, floorplan: boolean, facade: boolean, commission: boolean,
    custom: boolean, priceList: boolean, linkLot: boolean,
  }>({
    range: false,
    dwellingType: false,
    template: false,
    group: false,
    contact: false,
    lot: false,
    linkLot: false,
    floorplan: false,
    facade: false,
    commission: false,
    custom: false,
    priceList: false,
  });
  const [deatils, setDeatils] = useState({ lot: null, contact: null, floorplan: null, facade: null });
  const [activeTab, setActiveTab] = useState('All');
  const [form] = Form.useForm();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { contactOptions, contact } = useContactHook()
  const { lotOptions, lot } = useLotHook()
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['inclusion', 'houseFeature'],
  });

  useEffect(() => {
    if (status.packageDetails === Status.IDLE) {
      fetchPackageData()
    }
    if (packageDetails) {
      form.setFieldsValue(packageDetails)
      form.setFieldsValue({
        rangeId: packageDetails?.range?.id,
        dwellingTypeId: packageDetails?.dwellingType?.id,
        templateId: packageDetails?.template?.id,
        contactId: packageDetails?.contact?.id,
      })
    }
    setDeatils(prev => ({ ...prev, lot: packageDetails?.lotDetails, floorplan: packageDetails?.floorPlan, facade: packageDetails?.facade }))
  }, [status.packageDetails]);

  useEffect(() => {
    if (packageDetails) {
      fetchPackageCommissionData();
      fetchPackagePricelistData();
    }
  }, [status.packageDetails])

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const fetchPackageData = async () => {
    try {
      await dispatch(fetchAllLandPackageById(id as string)).unwrap()
    }
    catch (error) {
      message.error(error?.message || 'Failed to fetch package')
    }
  }

  const fetchPackageCommissionData = async () => {
    try {
      await dispatch(fetchAllHLPackageCommissionById(id as string)).unwrap()
    }
    catch (error) {
      message.error(error?.message || 'Failed to fetch package')
    }
  }

  const fetchPackagePricelistData = async () => {
    try {
      await dispatch(fetchAllHLPackagePricelistById(id as string)).unwrap()
    }
    catch (error) {
      message.error(error?.message || 'Failed to fetch package')
    }
  }

  const handleFormChange = () => {
    setHasChanges(true);
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formValues = form.getFieldsValue();
      // Prepare update data
      const updateData = {
        rangeId: form.getFieldValue('rangeId'),
        dwellingTypeId: form.getFieldValue('dwellingTypeId'),
        contactId: form.getFieldValue('contactId'),
        lotId: deatils?.lot?.lotId != packageDetails?.lotDetails?.lotId ? deatils?.lot?.lotId : null,
        floorPlanId: deatils?.floorplan?.floorPlanId != packageDetails?.floorPlanId ? deatils?.floorplan?.floorPlanId : null,
        facadeId: deatils?.facade?.facadeId != packageDetails?.facadeId ? deatils?.facade?.facadeId : null,
        disclaimerType: formValues.disclaimerType,
        disclaimerDescription: formValues.disclaimerDescription
      };
      const formData = formDataGenerator(updateData)
      await dispatch(updateLandPackage({
        data: formData,
        id: id as string
      })).unwrap();
      message.success('Package updated successfully');
      setHasChanges(false);
    } catch (error) {
      message.error(error?.message || 'Failed to update package');
    } finally {
      setIsSaving(false);
    }
  }

  const handleSaveCustomSection = async (values) => {
    try {
      const formData = formDataGenerator({ attachFiles: values.attachFiles })
      await dispatch(updateLandPackage({ data: formData, id: id as string }))
    }
    catch (error) {
      message.error(error?.message || 'Failed to save custom section');
    }
  }

  const createPackageCommission = async (commissionId: string) => {
    try {
      await dispatch(createHLPackageCommission({ houseLandPackageId: id as string, jobCommissionId: commissionId })).unwrap()
      message.success('HL package commission created successfully')
    }
    catch (error) {
      message.error(error?.message || 'Failed to create commission')
    }
  }

  const deletePackageCommission = async (commissionId: string) => {
    try {
      await dispatch(deleteHLPackageCommission({ packageId: id as string, id: commissionId })).unwrap()
      message.success('HL package commission deleted successfully')
    }
    catch (error) {
      message.error(error?.message || 'Failed to delete commission')
    }
  }

  const createPackagePricelist = async (item) => {
    try {
      await dispatch(createHLPackagePricelist({
        houseLandPackageId: id as string,
        priceListItemId: item?.priceListItemId,
        quantity: parseInt(item?.quantity),
        note: item?.note || undefined

      })).unwrap()
      message.success('HL package commission created successfully')
    }
    catch (error) {
      message.error(error?.message || 'Failed to create commission')
    }
  }

  const deletePackagePricelist = async (pricelistId: string) => {
    try {
      await dispatch(deleteHLPackagPricelist({ packageId: id as string, id: pricelistId })).unwrap()
      message.success('HL package commission deleted successfully')
    }
    catch (error) {
      message.error(error?.message || 'Failed to delete commission')
    }
  }

  const DataField = ({ label, value }) => (
    <div className="flex mb-2">
      <p>{label} : </p>
      <p>{value}</p>
    </div>
  );
  const filterButtons = ['All', 'Selected', 'UnSelected'];
  function handleSubmit(values) { }
  return (
    <div className="p-4 pb-0">
      <Form form={form} onFinish={handleSubmit} onValuesChange={handleFormChange}>
        <HLPackageHeader form={form} headerEditOpen={editOpen} setHeaderEditOpen={setEditOpen} />
        <div className='max-h-[550px] overflow-y-auto custom-scrollbar '>
          <div className="grid grid-cols-2">
            <div className="flex">
              <div className="flex-1">
                <ContentCard title="Title">
                  <p className="p-4 text-sm">{packageDetails?.title}</p>
                </ContentCard>
                <ContentCard title="Lot">
                  <div className=" p-4 text-sm ">
                    {deatils?.lot ? (
                      <div>
                        <div className="flex justify-between gap-2 items-center mb-2">
                          <div>
                            <IconMapPin size={20} />
                            <p>{deatils?.lot?.address}</p>
                          </div>
                          <IconTrash size={20} color='red' className='cursor-pointer' onClick={() => {
                            setDeatils(prev => ({ ...prev, lot: null }))
                            setEditOpen(prev => ({ ...prev, lot: false }))
                            setHasChanges(true)
                          }} />
                        </div>
                        <DataField label="Estate" value={deatils?.lot?.estateName} />
                        <DataField label="Stage" value={deatils?.lot?.estateStageName} />
                        <DataField label="Type" value={deatils?.lot?.lotType} />
                        <div className="flex gap-1">
                          <DataField label="W" value={deatils?.lot?.widthM} />
                          <DataField label="D" value={deatils?.lot?.depthM} />
                          <DataField label="Total" value={deatils?.lot?.totalSizeM2} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-blue min-h-[135px] flex justify-center items-center cursor-pointer">
                        <div>
                          <p onClick={() => setEditOpen(prev => ({ ...prev, lot: true }))}>Create Lot</p>
                          {editOpen?.linkLot ?
                            <Select options={lotOptions} className="w-full" onChange={(value) => {
                              setDeatils(prev => ({ ...prev, lot: lot.find(item => item.lotId === value) }))
                              setHasChanges(true)
                            }} />
                            : <p onClick={() => setEditOpen(prev => ({ ...prev, linkLot: true }))}>Link Lot</p>}

                        </div>
                      </div>
                    )}
                  </div>
                </ContentCard>
              </div>
              <div className="flex-1">
                <ContentCard title="Contact">
                  <div className="p-4 text-sm">
                    <div className="mb-2">
                      {editOpen.contact || !form.getFieldValue('contactId') ? (
                        <Form.Item name="contactId">
                          <Select
                            className="w-full"
                            showSearch
                            options={
                              contactOptions
                            }
                            onChange={value => {
                              form.setFieldValue('contactId', value);
                              setEditOpen(prev => ({ ...prev, contact: false }));
                              setHasChanges(true);
                            }}
                            placeholder="Please Select Option"
                          />
                        </Form.Item>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p onClick={() => setEditOpen(prev => ({ ...prev, contact: true }))} className="cursor-pointer hover:text-blue">
                            {contactOptions.find(item => item.value === form.getFieldValue('contactId'))?.label || 'Select Contact'}
                          </p>
                          {form.getFieldValue('contactId') && (
                            <>
                              <div className="flex gap-2 items-center">
                                <IconMail size={20} />
                                <p>{contact?.find(item => item.usersId === form.getFieldValue('contactId'))?.email}</p>
                              </div>

                              <div className="flex gap-2 items-center">
                                <IconPhone size={20} />
                                <p>{contact?.find(item => item.usersId === form.getFieldValue('contactId'))?.phone}</p>
                              </div>
                              <div className="flex gap-2 items-center">
                                <Switch size="small" />
                                <p>Show in pdf</p>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </ContentCard>
                <ContentCard title="Price">
                  <div className="p-3 text-sm ">
                    <div className="flex gap-6 items-center mb-2">
                      <p>Type</p>
                      <Radio.Group
                        block
                        options={[
                          { label: 'Estimate', value: 'estimate' },
                          { label: 'Fixed', value: 'fixed' },
                        ]}
                      />
                    </div>
                    <div className="flex gap-4 mb-2">
                      <p>House</p>
                      <p>${packageDetails?.houseTotal}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex gap-2">
                        <p>Land</p>
                        <p>${packageDetails?.landPrice}</p>
                      </div>
                      <div className="flex gap-2" onClick={() => setEditOpen(prev => ({ ...prev, commission: true }))}>
                        <p>Comm</p>
                        <p className="text-blue">${packageDetails?.commissionTotal}</p>
                      </div>
                    </div>
                  </div>
                </ContentCard>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 h-full">
                <ContentCard title="FloorPlan">
                  <div className="m-3 h-full" onClick={() => setEditOpen(prev => ({ ...prev, floorplan: true }))}>
                    {deatils?.floorplan ? (
                      <div className="h-full flex flex-col gap-4">
                        <div className="flex justify-center">
                          <div
                            onClick={e => {
                              e.stopPropagation();
                            }}
                          >
                            <Image src={deatils?.floorplan.simpleImage} height={190} />
                          </div>
                        </div>
                        <div
                          className="flex justify-between items-center"
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        >
                          <p className="font-medium text-font-color">{deatils?.floorplan?.name}</p>
                          <IconTrash
                            size={15}
                            onClick={() => setDeatils(prev => ({ ...prev, floorplan: null }))}
                            color="red"
                            cursor="pointer"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="text-center mt-[100px] text-blue cursor-pointer"
                        onClick={() => setEditOpen(prev => ({ ...prev, floorplan: true }))}
                      >
                        Select Floor Plan
                      </div>
                    )}
                  </div>
                </ContentCard>
                <ContentCard title="Facade">
                  <div className="m-3 h-full" onClick={() => setEditOpen(prev => ({ ...prev, facade: true }))}>
                    {deatils?.facade ? (
                      <div className="h-full flex flex-col gap-4">
                        <div
                          className="flex justify-center"
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        >
                          <Image src={deatils?.facade.image} height={190} width="100%" />
                        </div>
                        <div
                          className="flex justify-between items-center"
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        >
                          <p className="font-medium text-font-color">{deatils?.facade?.name}</p>
                          <IconTrash
                            size={15}
                            onClick={() => setDeatils(prev => ({ ...prev, facade: null }))}
                            color="red"
                            cursor="pointer"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="text-center mt-[100px] text-blue cursor-pointer"
                        onClick={() => setEditOpen(prev => ({ ...prev, facade: true }))}
                      >
                        Select Facade
                      </div>
                    )}
                  </div>
                </ContentCard>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="bg-card-color p-4 m-2">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <p>This Package inclusions: </p>
                  <IconPencil size={20} />
                </div>
                <div className="rounded-2xl flex gap-2 p-1 border border-primary">
                  {filterButtons.map((btn, index) => (
                    <Button
                      key={index}
                      className={`rounded-xl text-xs ${activeTab === btn ? 'bg-primary' : 'bg-white text-primary'} `}
                      type="primary"
                      size="small"
                      onClick={() => setActiveTab(btn)}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>
                <div className="text-blue">
                  <Tooltip title="Inclusion List">
                    <IconTable size={20} />
                  </Tooltip>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4 mt-3">
                <Input
                  addonBefore={<IconSearch size={20} />}
                  placeholder="Search Inclusions"
                  size="small"
                  value={filters.inclusion}
                  onChange={e => setParams({ inclusion: e.target.value })}
                />
                <div>
                  {editOpen?.group ? (
                    <Form.Item name="group" className="pt-3">
                      <Select
                        className="w-full"
                        showSearch
                        options={[{ label: 'Turnkey Inclusion', value: 'Turnkey Inclusion' }]}
                        onChange={value => {
                          setEditOpen(prev => ({ ...prev, group: false }));
                        }}
                        placeholder="Please Select Option"
                      />
                    </Form.Item>
                  ) : form.getFieldValue('group') ? (
                    <div>
                      <p className="text-primary">{form.getFieldValue('group')}</p>
                      <p className="text-xs">Group</p>
                    </div>
                  ) : (
                    <p className="text-blue cursor-pointer" onClick={() => setEditOpen(prev => ({ ...prev, group: true }))}>
                      Choose Group
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <Checkbox /> Select All
                </div>
                {InclusinList.map((list, index) => (
                  <div key={index} className="flex items-start gap-2 mb-2">
                    <Checkbox checked />
                    <div>
                      <p>{list.title}</p>
                      <Tag color="blue">{list.group}</Tag>
                    </div>
                  </div>
                ))}
              </div>

              <TextArea
                rows={4}
                style={{ resize: 'none' }}
                showCount
                className="my-2"
                maxLength={500}
              />

            </div>
            <div className="flex-1">
              <div className="p-4 m-2 bg-card-color">
                <div className="flex justify-between my-2">
                  <p>House Features</p>
                  <div className="text-blue">
                    <IconTable size={20} />
                  </div>
                </div>
                <Input
                  addonBefore={<IconSearch size={20} />}
                  placeholder="Search Feature.."
                  size="small"
                  value={filters.houseFeature}
                  onChange={e => setParams({ houseFeature: e.target.value })}
                />
                <div className="mt-2">
                  <div className="flex gap-2">
                    <Checkbox />
                    <p>Select All</p>
                  </div>
                  <div className="flex gap-2">
                    <Checkbox />
                    <p>new</p>
                  </div>
                </div>
              </div>
              <div className="p-4 m-2 bg-card-color">
                <div className="flex justify-between my-1">
                  <p>Disclaimer</p>
                  <div className="text-blue">
                    <IconTable size={20} />
                  </div>
                </div>
                <Form.Item name='disclaimerType'>
                  <Select size="small" options={[{ label: 'Validity', value: 'validity' }, { label: 'Standard', value: 'standard' }]} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name='disclaimerDescription'>
                  <TextArea
                    rows={4}
                    style={{ resize: 'none' }}
                    showCount
                    className="my-2"
                    maxLength={500}
                  />
                </Form.Item>

              </div>
            </div>
          </div>
        </div>

      </Form>
      <HlPackageFooter setEditOpen={setEditOpen} hasChanges={hasChanges} isSaving={isSaving} onSave={handleSave} packageDetails={packageDetails} />

      {editOpen?.lot && (
        <LandLotFormModel
          title="Lot"
          open={editOpen?.lot}
          onClose={() => setEditOpen(prev => ({ ...prev, lot: false }))}
          onSubmit={() => {
            setEditOpen(prev => ({ ...prev, lot: false }))
            setDeatils(prev => ({ ...prev, lot: packageDetails?.lotDetails }))
          }}
          isCopy={false}
        />
      )}
      {editOpen?.commission && (
        <CommissionDrawer
          openDrawer={editOpen?.commission}
          setOpenDrawer={() => setEditOpen(prev => ({ ...prev, commission: false }))}
          partners={packageDetails?.commissions || []}
          setPartners={(id) => createPackageCommission(id)}
          disabledPartners={[]}
          setDisabledPartners={(id) => deletePackageCommission(id)}
        />
      )}
      {editOpen?.floorplan && (
        <FloorPlanModal
          visible={editOpen?.floorplan}
          onCancel={() => setEditOpen(prev => ({ ...prev, floorplan: false }))}
          onSave={data => {
            setEditOpen(prev => ({ ...prev, floorplan: false }))
            setDeatils(prev => ({ ...prev, floorplan: data }))
            setHasChanges(true)
          }}
          selectedPlan={deatils?.floorplan}
        />
      )}
      {editOpen?.facade && (
        <FacadeModal
          visible={editOpen?.facade}
          onCancel={() => {
            setEditOpen(prev => ({ ...prev, facade: false }));
            dispatch(clearStandardFilter());
            dispatch(clearUpgradeFilter());
          }}
          onSave={data => {
            setEditOpen(prev => ({ ...prev, facade: false }))
            setDeatils(prev => ({ ...prev, facade: data }))
            setHasChanges(true)
          }}
          selectedFacade={deatils?.facade}
        />
      )}

      {editOpen?.custom && (
        <ActionDialogmodel
          title="Custom Section"
          open={editOpen?.custom}
          onCancel={() => setEditOpen(prev => ({ ...prev, custom: false }))}
          onSubmit={(values) => {
            handleSaveCustomSection(values);
            setEditOpen(prev => ({ ...prev, custom: false }))
          }}
          fields={[
            {
              label: 'attachFiles',
              name: 'attachFiles',
              type: 'image',
              extra: 'Custom Section Attachment will be attached along with HLPackage Pdf',
            }
          ]}
        />
      )}
      {editOpen?.priceList && (
        <PriceListDrawer
          title="PriceList Items"
          open={editOpen?.priceList}
          onClose={() => setEditOpen(prev => ({ ...prev, priceList: false }))}
          addPricelist={createPackagePricelist}
          removePricelist={deletePackagePricelist}
          selectedPricelist={packageDetails?.pricelist}
        />
      )}
    </div>
  );
};

export default HLPackageDetail;
