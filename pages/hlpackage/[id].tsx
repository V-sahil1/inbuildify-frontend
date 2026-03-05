import LandLotFormModel from '@/components/common/Models/LandLotFormModel';
import FloorPlanModal from '@/components/leadDetail/FloorPlanModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import FacadeModal from '@/components/leadDetail/FacadeModal';
import { clearStandardFilter, clearUpgradeFilter } from '@redux/feature/facade/facadeSlice';
import PriceListDrawer from '@/components/common/Models/PriceListDrawer';
import { CommissionDrawer } from '@/components/job/jobDetail/comission/commissionDrawer';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { ContentCard } from '@/components/common/card/ContentCard';
import { debouncedURL } from '@lib/utils/debounceURL';
import { HlPackageFooter } from '@/components/hlpackage/hlPackageFooter';
import { HLPackageHeader } from '@/components/hlpackage/HLPackageHeader';
import { useRouter } from 'next/router';
import { useContactHook } from '@hooks/useContactHook';
import {
  createHLPackageCommission,
  createHLPackagePricelist,
  createLandLot,
  deleteHLPackageCommission,
  deleteHLPackagPricelist,
  fetchAllHLPackageCommissionById,
  fetchAllHLPackagePricelistById,
  fetchAllLandPackageById,
  updateLandPackage,
} from '@redux/feature/land/landThunk';
import { useLotHook } from '@hooks/useLotHook';
import { Status } from '@lib/constants/enum';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import dayjs from 'dayjs';
import { HLPackageLot } from '@/components/hlpackage/HLPackageLot';
import { HLPackageContact } from '@/components/hlpackage/HLPackageContact';
import { HLPackageFloorPlan } from '@/components/hlpackage/HLPackageFloorPlan';
import { HLPackageFacade } from '@/components/hlpackage/HLPackageFacade';
import { HLPackagePrice } from '@/components/hlpackage/HLPackagePrice';
import { HLPackageInclusion } from '@/components/hlpackage/HLPackageInclusion';
import { HLPackageFeatures } from '@/components/hlpackage/HLPackageFeatures';

const HLPackageDetail = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { packageDetails, status } = useAppSelector(state => state.land);
  const [editOpen, setEditOpen] = useState<{
    range: boolean;
    dwellingType: boolean;
    template: boolean;
    group: boolean;
    contact: boolean;
    lot: boolean;
    floorplan: boolean;
    facade: boolean;
    commission: boolean;
    custom: boolean;
    priceList: boolean;
    linkLot: boolean;
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
  const [deatils, setDeatils] = useState({
    lot: null,
    contact: null,
    floorplan: null,
    facade: null,
  });
  const [activeTab, setActiveTab] = useState('All');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { contactOptions, contact } = useContactHook();
  const { lotOptions, lot } = useLotHook();
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['inclusion', 'houseFeature'],
  });

  useEffect(() => {
    if (status.packageDetails === Status.IDLE) {
      fetchPackageData();
    }
    if (packageDetails) {
      form.setFieldsValue(packageDetails);
      form.setFieldsValue({
        rangeId: packageDetails?.range?.id,
        dwellingTypeId: packageDetails?.dwellingType?.id,
        templateId: packageDetails?.template?.id,
        contactId: packageDetails?.contact?.id,
      });
    }
    setDeatils(prev => ({
      ...prev,
      lot: packageDetails?.lotDetails,
      floorplan: packageDetails?.floorPlan,
      facade: packageDetails?.facade,
    }));
  }, [status.packageDetails]);

  useEffect(() => {
    if (packageDetails) {
      fetchPackageCommissionData();
      fetchPackagePricelistData();
    }
  }, [status.packageDetails]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const fetchPackageData = async () => {
    try {
      await dispatch(fetchAllLandPackageById(id as string)).unwrap();
    } catch (error) {
      message.error(error?.message || 'Failed to fetch package');
    }
  };

  const fetchPackageCommissionData = async () => {
    try {
      await dispatch(fetchAllHLPackageCommissionById(id as string)).unwrap();
    } catch (error) {
      message.error(error?.message || 'Failed to fetch package');
    }
  };

  const fetchPackagePricelistData = async () => {
    try {
      await dispatch(fetchAllHLPackagePricelistById(id as string)).unwrap();
    } catch (error) {
      message.error(error?.message || 'Failed to fetch package');
    }
  };

  const handleFormChange = () => {
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formValues = form.getFieldsValue();
      // Prepare update data
      const updateData = {
        rangeId: form.getFieldValue('rangeId'),
        dwellingTypeId: form.getFieldValue('dwellingTypeId'),
        contactId: form.getFieldValue('contactId'),
        lotId:
          deatils?.lot?.lotId != packageDetails?.lotDetails?.lotId ? deatils?.lot?.lotId : null,
        floorPlanId:
          deatils?.floorplan?.floorPlanId != packageDetails?.floorPlanId
            ? deatils?.floorplan?.floorPlanId
            : null,
        facadeId:
          deatils?.facade?.facadeId != packageDetails?.facadeId ? deatils?.facade?.facadeId : null,
        disclaimerType: formValues.disclaimerType,
        disclaimerDescription: formValues.disclaimerDescription,
      };
      const formData = formDataGenerator(updateData);
      await dispatch(
        updateLandPackage({
          data: formData,
          id: id as string,
        })
      ).unwrap();
      message.success('Package updated successfully');
      setHasChanges(false);
    } catch (error) {
      message.error(error?.message || 'Failed to update package');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCustomSection = async values => {
    try {
      const formData = formDataGenerator({ attachFiles: values.attachFiles });
      await dispatch(updateLandPackage({ data: formData, id: id as string }));
    } catch (error) {
      message.error(error?.message || 'Failed to save custom section');
    }
  };

  const createPackageCommission = async (commissionId: string) => {
    try {
      await dispatch(
        createHLPackageCommission({
          houseLandPackageId: id as string,
          jobCommissionId: commissionId,
        })
      ).unwrap();
      message.success('HL package commission created successfully');
    } catch (error) {
      message.error(error?.message || 'Failed to create commission');
    }
  };

  const deletePackageCommission = async (commissionId: string) => {
    try {
      await dispatch(
        deleteHLPackageCommission({ packageId: id as string, id: commissionId })
      ).unwrap();
      message.success('HL package commission deleted successfully');
    } catch (error) {
      message.error(error?.message || 'Failed to delete commission');
    }
  };

  const createPackagePricelist = async item => {
    try {
      await dispatch(
        createHLPackagePricelist({
          houseLandPackageId: id as string,
          priceListItemId: item?.priceListItemId,
          quantity: parseInt(item?.quantity),
          note: item?.note || undefined,
        })
      ).unwrap();
      message.success('HL package commission created successfully');
    } catch (error) {
      message.error(error?.message || 'Failed to create commission');
    }
  };

  const deletePackagePricelist = async (pricelistId: string) => {
    try {
      await dispatch(
        deleteHLPackagPricelist({ packageId: id as string, id: pricelistId })
      ).unwrap();
      message.success('HL package commission deleted successfully');
    } catch (error) {
      message.error(error?.message || 'Failed to delete commission');
    }
  };

  const handleLotSubmit = async values => {
    const payload = {
      ...values,
      titleDate: dayjs(values.titleDate).format('YYYY-MM-DD'),
    };
    try {
      const res = await dispatch(createLandLot(payload)).unwrap();
      message.success('Land lot created successfully');
      setEditOpen(prev => ({ ...prev, lot: false }));
      setDeatils(prev => ({ ...prev, lot: res }));
    } catch (error) {
      message.error(error || 'Failed to save land lot');
    }
  };

  return (
    <div className="p-4 pb-0">
      <Form form={form} onValuesChange={handleFormChange}>
        <HLPackageHeader form={form} headerEditOpen={editOpen} setHeaderEditOpen={setEditOpen} />
        <div className="max-h-[550px] overflow-y-auto custom-scrollbar ">
          <div className="grid grid-cols-2">
            <div className="flex">
              <div className="flex-1">
                <ContentCard title="Title">
                  <p className="p-4 text-sm">{packageDetails?.title}</p>
                </ContentCard>
                <ContentCard title="Lot">
                  <HLPackageLot
                    deatils={deatils}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    setHasChanges={setHasChanges}
                    lotOptions={lotOptions}
                    lot={lot}
                    setDeatils={setDeatils}
                  />
                </ContentCard>
              </div>
              <div className="flex-1">
                <ContentCard title="Contact">
                  <HLPackageContact
                    editOpen={editOpen}
                    form={form}
                    contactOptions={contactOptions}
                    contact={contact}
                    setEditOpen={setEditOpen}
                    setHasChanges={setHasChanges}
                  />
                </ContentCard>
                <ContentCard title="Price">
                  <HLPackagePrice
                    setEditOpen={setEditOpen}
                    packageDetails={packageDetails}
                    form={form}
                    setHasChanges={setHasChanges}
                  />
                </ContentCard>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 h-full">
                <ContentCard title="FloorPlan">
                  <HLPackageFloorPlan
                    setEditOpen={setEditOpen}
                    deatils={deatils}
                    setDeatils={setDeatils}
                  />
                </ContentCard>
                <ContentCard title="Facade">
                  <HLPackageFacade
                    setEditOpen={setEditOpen}
                    deatils={deatils}
                    setDeatils={setDeatils}
                  />
                </ContentCard>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <HLPackageInclusion
              editOpen={editOpen}
              setEditOpen={setEditOpen}
              form={form}
              filters={filters}
              setParams={setParams}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <HLPackageFeatures filters={filters} setParams={setParams} form={form} />
          </div>
        </div>
      </Form>
      <HlPackageFooter
        setEditOpen={setEditOpen}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
        packageDetails={packageDetails}
      />

      {editOpen?.lot && (
        <LandLotFormModel
          title="Lot"
          open={editOpen?.lot}
          onClose={() => setEditOpen(prev => ({ ...prev, lot: false }))}
          onSubmit={handleLotSubmit}
          isCopy={false}
        />
      )}
      {editOpen?.commission && (
        <CommissionDrawer
          openDrawer={editOpen?.commission}
          setOpenDrawer={() => setEditOpen(prev => ({ ...prev, commission: false }))}
          partners={packageDetails?.commissions || []}
          setPartners={id => createPackageCommission(id)}
          disabledPartners={[]}
          setDisabledPartners={id => deletePackageCommission(id)}
        />
      )}
      {editOpen?.floorplan && (
        <FloorPlanModal
          visible={editOpen?.floorplan}
          onCancel={() => setEditOpen(prev => ({ ...prev, floorplan: false }))}
          onSave={data => {
            setEditOpen(prev => ({ ...prev, floorplan: false }));
            setDeatils(prev => ({ ...prev, floorplan: data }));
            setHasChanges(true);
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
            setEditOpen(prev => ({ ...prev, facade: false }));
            setDeatils(prev => ({ ...prev, facade: data }));
            setHasChanges(true);
          }}
          selectedFacade={deatils?.facade}
        />
      )}

      {editOpen?.custom && (
        <ActionDialogmodel
          title="Custom Section"
          open={editOpen?.custom}
          onCancel={() => setEditOpen(prev => ({ ...prev, custom: false }))}
          onSubmit={values => {
            handleSaveCustomSection(values);
            setEditOpen(prev => ({ ...prev, custom: false }));
          }}
          fields={[
            {
              label: 'attachFiles',
              name: 'attachFiles',
              type: 'image',
              extra: 'Custom Section Attachment will be attached along with HLPackage Pdf',
            },
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
