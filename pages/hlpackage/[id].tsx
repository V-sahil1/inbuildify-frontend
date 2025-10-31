import LandLotFormModel from '@/components/common/Models/LandLotFormModel';
import FloorPlanModal from '@/components/leadDetail/FloorPlanModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { mapToOptions } from '@lib/utils/rangeAndDwellingObjToOptions';
import { getDwellingTypes, getRanges } from '@redux/feature/types/typesThunk';
import {
  IconDots,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import FacadeModal from '@/components/leadDetail/FacadeModal';
import { clearStandardFilter, clearUpgradeFilter } from '@redux/feature/facade/facadeSlice';
import PriceListDrawer from '@/components/common/Models/PriceListDrawer';
import { CommissionDrawer, Partner } from '@/components/job/jobDetail/comission/commissionDrawer';
const { TextArea } = Input;
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import {
  CustomSectionField,
  InclusinList,
  initialPartners,
  initialValues,
  lotdata,
  templateOptions,
} from 'data/HLPackageDeatilData';
import { ContentCard } from '@/components/common/card/ContentCard';

const HLPackageDetail = () => {
  const [contactNameEditOpen, setContactNameEditOpen] = useState(false);
  const [RangeEditOpen, setRangeEditOpen] = useState(false);
  const [DwellingTypeEditOpen, setDwellingTypeEditOpen] = useState(false);
  const [templateEditOpen, settemplateEditOpen] = useState(false);
  const [groupEditOpen, setGroupEditOpen] = useState(false);
  const [lotDetail, setLotDetail] = useState(null);
  const [landLotOpen, setLandLotOpen] = useState(false);
  const [landCommissionModelOpen, setLandCommissionModelOpen] = useState(false);
  const [customSectionModalOpen, setCustomSectionModalOpen] = useState(false);
  const [PriceListDrawerOpen, setPriceListDrawerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFacade, setSelectedFacade] = useState(null);
  const [floorplanModalOpen, setfloorplanModalOpen] = useState(false);
  const [facadeModalOpen, setFacadeModalOpen] = useState(false);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [disabledPartners, setDisabledPartners] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const { range, dwellingType } = useAppSelector(state => state.types);
  const typesStatus = useAppSelector(state => state.types.status);
  const rangeOptions = mapToOptions(range);
  const dwellingOptions = mapToOptions(dwellingType);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<{
    inclusion: string;
    houseFeature: string;
  }>({
    inclusion: searchParams.get('inclusion') || '',
    houseFeature: searchParams.get('houseFeature') || '',
  });

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: typeof filters) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value.toString());
          } else {
            params.delete(key);
          }
        });

        router.replace(`${pathname}?${params.toString()}`);
      }, 500), // 500ms debounce delay
    [pathname, router, searchParams]
  );

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters(prev => {
        const newFilters = { ...prev, ...updates };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  useEffect(() => {
    const fetchTypesData = async () => {
      try {
        if (typesStatus?.range === Status.IDLE) {
          await dispatch(getRanges()).unwrap();
        }
        if (typesStatus?.dwellingType === Status.IDLE) {
          await dispatch(getDwellingTypes()).unwrap();
        }
      } catch (error) {
        message.error(error);
      }
    };
    fetchTypesData();
  }, [dispatch]);

  const SelectEditableField = ({ open, onChange, name, onClick, options }) => (
    <div>
      {open ? (
        <Form.Item name={name}>
          <Select
            className="w-full"
            options={options}
            onChange={onChange}
            placeholder="Please Select Option "
          ></Select>
        </Form.Item>
      ) : (
        <p onClick={onClick} className="cursor-pointer">
          {form.getFieldValue(name)}
        </p>
      )}
    </div>
  );
  const filterButtons = ['All', 'Selected', 'UnSelected'];
  function handleSubmit(values) {}
  return (
    <div className="p-4">
      <Form form={form} onFinish={handleSubmit} initialValues={initialValues}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            House & Land Package <Tag color="blue">Available</Tag>
          </h1>
          <div>
            <div className="grid grid-cols-3 gap-8 text-primary">
              <SelectEditableField
                open={RangeEditOpen}
                name="range"
                options={rangeOptions}
                onChange={() => {
                  setRangeEditOpen(false);
                }}
                onClick={() => setRangeEditOpen(true)}
              />
              <SelectEditableField
                open={DwellingTypeEditOpen}
                name="dwellingType"
                options={dwellingOptions}
                onChange={() => {
                  setDwellingTypeEditOpen(false);
                }}
                onClick={() => setDwellingTypeEditOpen(true)}
              />
              <SelectEditableField
                open={templateEditOpen}
                name="template"
                options={templateOptions}
                onChange={() => {
                  settemplateEditOpen(false);
                }}
                onClick={() => settemplateEditOpen(true)}
              />
            </div>
            <div className="grid grid-cols-3 gap-8 text-xs">
              <p>Range</p>
              <p>Dwelling Type</p>
              <p>Template</p>
            </div>
          </div>
          <div className="text-primary border border-primary p-1 rounded-lg">
            {' '}
            <Tooltip title="Go to Listing">
              <IconTable />
            </Tooltip>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2">
            <div className="flex">
              <div className="flex-1">
                <ContentCard title="Title">
                  <p className="p-4 text-sm">new HL Package</p>
                </ContentCard>
                <ContentCard title="Lot">
                  <div className=" p-4 text-sm ">
                    {lotDetail ? (
                      <div>
                        <div className="flex gap-2 items-center mb-2">
                          <IconMapPin size={20} />
                          <p>{lotdata.address}</p>
                        </div>
                        <div className="flex mb-2">
                          {' '}
                          <p>Estate : </p>
                          <p>{lotdata.estate}</p>
                        </div>
                        <div className="flex mb-2">
                          {' '}
                          <p>Stage : </p>
                          <p>{lotdata.stage}</p>
                        </div>
                        <div className="flex mb-2">
                          {' '}
                          <p>Type : </p>
                          <p>{lotdata.type}</p>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex">
                            {' '}
                            <p>W : </p>
                            <p>{lotdata.width}</p>
                          </div>
                          <div className="flex">
                            {' '}
                            <p>D : </p>
                            <p>{lotdata.depth}</p>
                          </div>
                          <div className="flex">
                            {' '}
                            <p>Total : </p>
                            <p>{lotdata.total}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-blue min-h-[135px] flex justify-center items-center cursor-pointer">
                        <div>
                          <p onClick={() => setLandLotOpen(true)}>Create Lot</p>
                          <p>Link Lot</p>
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
                      {contactNameEditOpen ? (
                        <Form.Item name="contactName">
                          <Select
                            className="w-full"
                            showSearch
                            options={[
                              { label: 'Meet', value: 'Meet' },
                              { label: 'Rahul', value: 'Rahul' },
                            ]}
                            onChange={value => {
                              setContactNameEditOpen(false);
                            }}
                            placeholder="Please Select Option"
                          ></Select>
                        </Form.Item>
                      ) : (
                        <p onClick={() => setContactNameEditOpen(true)}>
                          {form.getFieldValue('contactName')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center mb-2">
                      <IconMail size={20} />
                      <p>kishan@gmail.com</p>
                    </div>
                    <div className="flex gap-4 mb-2">
                      <div className="flex gap-2 items-center">
                        <IconPhone size={20} />
                        <p>123467898</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Switch size="small" />
                        <p>Show in pdf</p>
                      </div>
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
                      <p>$ 35,000.00</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex gap-2">
                        <p>Land</p>
                        <p>$ 50000.00</p>
                      </div>
                      <div className="flex gap-2" onClick={() => setLandCommissionModelOpen(true)}>
                        <p>Comm</p>
                        <p className="text-blue">$ 50000</p>
                      </div>
                    </div>
                  </div>
                </ContentCard>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 h-full">
                <ContentCard title="FloorPlan">
                  <div className="m-3 h-full" onClick={() => setfloorplanModalOpen(true)}>
                    {selectedPlan ? (
                      <>
                        <div className="h-full">
                          <Image src={selectedPlan.image} height={150} />
                          <div className="flex justify-between items-center mt-[50px]">
                            <p className="font-medium text-font-color">{selectedPlan.name}</p>
                            <IconTrash
                              size={15}
                              onClick={() => setSelectedPlan(null)}
                              color="red"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center mt-[100px] text-blue cursor-pointer">
                        Select Floor Plan
                      </div>
                    )}
                  </div>
                </ContentCard>
                <ContentCard title="Facade">
                  <div className="m-3 h-full" onClick={() => setFacadeModalOpen(true)}>
                    {selectedFacade ? (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-full flex flex-col justify-between">
                          <Image src={selectedFacade.image} height={150} />
                          <div className="flex justify-between items-center mt-[55px]">
                            <p className="font-medium text-font-color">{selectedFacade.name}</p>
                            <IconTrash
                              size={15}
                              onClick={() => setSelectedFacade(null)}
                              color="red"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center mt-[100px] text-blue cursor-pointer">
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
                  {filterButtons.map(btn => (
                    <Button
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
                  onChange={e => handleFilterChange({ ...filters, inclusion: e.target.value })}
                />
                <div>
                  {groupEditOpen ? (
                    <Form.Item name="group" className="pt-3">
                      <Select
                        className="w-full"
                        showSearch
                        options={[{ label: 'Turnkey Inclusion', value: 'Turnkey Inclusion' }]}
                        onChange={value => {
                          setGroupEditOpen(false);
                        }}
                        placeholder="Please Select Option"
                      ></Select>
                    </Form.Item>
                  ) : form.getFieldValue('group') ? (
                    <div>
                      <p className="text-primary">{form.getFieldValue('group')}</p>
                      <p className="text-xs">Group</p>
                    </div>
                  ) : (
                    <p className="text-blue cursor-pointer" onClick={() => setGroupEditOpen(true)}>
                      Choose Group
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <Checkbox /> Select All
                </div>
                {InclusinList.map(list => (
                  <div className="flex items-start gap-2 mb-2">
                    <Checkbox checked />
                    <div>
                      <p>{list.title}</p>
                      <Tag color="blue">{list.group}</Tag>
                    </div>
                  </div>
                ))}
              </div>
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
                  onChange={e => handleFilterChange({ ...filters, houseFeature: e.target.value })}
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
                <Select size="small" defaultValue="validity" style={{ width: '100%' }} />
                <TextArea
                  rows={4}
                  style={{ resize: 'none' }}
                  showCount
                  className="my-2"
                  maxLength={500}
                ></TextArea>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between m-2">
          <div className="flex gap-1">
            <Button icon={<IconDots size={20} />}> </Button>
            <Button type="primary" onClick={() => setCustomSectionModalOpen(true)}>
              Custom Section
            </Button>
            <Button type="primary" onClick={() => setPriceListDrawerOpen(true)}>
              Price List
            </Button>
          </div>
          <h1 className="text-lg font-bold">Total : $53,000.00</h1>
        </div>
      </Form>

      <LandLotFormModel
        title="Lot"
        open={landLotOpen}
        onClose={() => setLandLotOpen(false)}
        onSubmit={() => {
          setLandLotOpen(false);
          setLotDetail(lotdata);
        }}
        isCopy={false}
      />
      <CommissionDrawer
        openDrawer={landCommissionModelOpen}
        setOpenDrawer={setLandCommissionModelOpen}
        partners={partners}
        setPartners={setPartners}
        disabledPartners={disabledPartners}
        setDisabledPartners={setDisabledPartners}
      />
      <FloorPlanModal
        visible={floorplanModalOpen}
        onCancel={() => setfloorplanModalOpen(false)}
        onSave={setSelectedPlan}
        selectedPlan={selectedPlan}
      />
      <FacadeModal
        visible={facadeModalOpen}
        onCancel={() => {
          setFacadeModalOpen(false);
          dispatch(clearStandardFilter());
          dispatch(clearUpgradeFilter());
        }}
        onSave={data => {
          setSelectedFacade(data);
          dispatch(clearStandardFilter());
          dispatch(clearUpgradeFilter());
        }}
        selectedFacade={selectedFacade}
      />
      <ActionDialogmodel
        title="Custom Section"
        open={customSectionModalOpen}
        onCancel={() => setCustomSectionModalOpen(false)}
        onSubmit={() => {
          setCustomSectionModalOpen(false);
        }}
        fields={CustomSectionField}
      />
      <PriceListDrawer
        title="PriceList Items"
        open={PriceListDrawerOpen}
        onClose={() => setPriceListDrawerOpen(false)}
      />
    </div>
  );
};

export default HLPackageDetail;
