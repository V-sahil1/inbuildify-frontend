import StageProgress from '@/components/common/StageProgress';
import CategorySidebar from '@/components/leadDetail/CategorySidebar';
import FooterActions from '@/components/leadDetail/FooterActions';
import InfoCards from '@/components/leadDetail/InfoCards';
import ItemsPanel from '@/components/leadDetail/ItemsPanel';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { toggleExpand } from '@redux/feature/masterPriceList/masterPriceListSlice';
import { IFacadeState } from '@redux/feature/facade/IFacadeState';
import {
  fetchCategoryItems,
  fetchPricelistMaster,
} from '@redux/feature/masterPriceList/masterPriceListThunk';
import { Package } from '@redux/feature/package/IPackageState';
import { RootState } from '@redux/feature/store';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  createQuotationPackageThunk,
  createQuotationVersionThunk,
  getQuotationCustomSection,
  getQuotationPricelistThunk,
  getQuotationVersionById,
  updateQuotationVersion,
  updateQuotationItemThunk,
  getQuotationPdf,
} from '@redux/feature/quotation/quotationThunk';
import {
  setQuotationPlan,
  setQuotationFacade,
  setQuotationPackage,
  setSelectedFilters,
  setQuotationStructuralEngineer,
} from '@redux/feature/quotation/quotationSlice';
import { message, Button, Tooltip, Tag } from 'antd';
import QuotationFilter from '@/components/quotation/QuotationFilter';
import { updateLeadStatus } from '@redux/feature/lead/leadSlice';
import { clearQuotation, setQuotationItems } from '@redux/feature/quotation/quotationSlice';
import { usePdf } from '@hooks/usePdf';
import calculateTotalQuotation from '@lib/utils/calculateTotalQuotation';
import SystemRoutes from '@lib/constants/Routes';
import { useRouter } from 'next/router';
import { clearFilters } from '@redux/feature/facade/facadeSlice';
import Loading from '../common/Loading';
import JobDocumentPdf from '../common/pdf/JobDocumentPdf';
import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';
import { QuotationVersionDetails } from '@redux/feature/quotation/IQuotationState';
import { IconNewSection } from '@tabler/icons-react';

const QuotationManager = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { quoteVersionId } = router.query as { quoteVersionId: string };
  const {
    property,
    plan,
    facade,
    package: selectedPackageFromSlice,
    extraItems,
    items,
    selectedFilters: quotationFilters,
    status: quotationStatus,
    quoteDetails,
    quotation,
    structureEngineer: selectedStructuralEngineer,
  } = useAppSelector((state: RootState) => state.quotation);
  const { leadDetail } = useAppSelector(state => state.lead);
  const { priceMaster: categoryData, status } = useAppSelector(
    (state: RootState) => state.masterPriceList
  );
  const [onSelect, setSelect] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [extraItem, setExtraItem] = useState<'item' | 'complimentry' | 'discount' | 'note' | null>(
    null
  );
  const lastFetchedFiltersRef = useRef<{ range?: string; dwellingType?: string } | null>(null);
  const compactionReportShow =
    leadDetail?.property?.compactionReportProvider === 'builder' &&
    leadDetail?.property?.compactionReport === 'not_available';

  // const isJob = useMemo(() => quoteDetails?.leadStatus === 'JOB', [quoteDetails]);
  const quotationData = quoteVersionId
    ? quotation?.find(i => i.versions?.find(j => j.quotationVersionId === quoteVersionId))
    : quotation?.[quotation?.length - 1];

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!!quoteVersionId || !!quotationData?.versions?.[0]?.quotationVersionId) {
      fetchQuotation();
    }
  }, [dispatch, quotationData?.quotationId, router, quoteVersionId]);

  useEffect(() => {
    if (!!quoteVersionId || !!quotationData?.versions?.[0]?.quotationVersionId) {
      setIsEditMode(false);
      fetchQuotationPricelistItem();
      fetchQuotationCustomSection();
    }
  }, [quoteVersionId, quotationData]);
  useEffect(() => {
    if (!!quoteVersionId || !!quotationData) {
      fetchQuotationPricelistItem();
    }
  }, [quoteVersionId, quotationData, quotationFilters?.range, quotationFilters?.dwellingType]);

  useEffect(() => {
    if (status.priceMaster === Status.IDLE) {
      fetchCategoriesData();
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (categoryData.length > 0) {
      fetchAllCategoryItems();
    }
  }, [quotationFilters?.range, quotationFilters?.dwellingType, dispatch, categoryData.length]);

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [dispatch, router]);

  const fetchQuotation = async () => {
    try {
      await dispatch(
        getQuotationVersionById({
          quoteId: quotationData?.quotationId,
          quoteVersionId: quoteVersionId
            ? quoteVersionId
            : quotationData?.versions?.[0]?.quotationVersionId,
        })
      ).unwrap();
    } catch (error) {
      message.error((error as string) || error?.message || 'Failed to fetch quotation version detail');
    }
  };
  const handleSelectionChange = useCallback(
    async (
      type:
        | 'plan'
        | 'facade'
        | 'package'
        | 'range'
        | 'dwellingType'
        | 'location'
        | 'structuralEngineer',
      value: IFloorPlanState | IFacadeState | Package | string
    ) => {
      if (!value) {
        return;
      }

      try {
        const payload: Partial<QuotationVersionDetails> = {};
        switch (type) {
          case 'plan':
            dispatch(setQuotationPlan(value as IFloorPlanState));
            payload.floorPlanId = (value as IFloorPlanState)?.floorPlanId || null;
            // Clear facade when floor plan is changed
            dispatch(setQuotationFacade(null));
            payload.facadeId = null;
            break;
          case 'facade':
            dispatch(setQuotationFacade(value as IFacadeState));
            payload.facadeId = (value as IFacadeState)?.facadeId || null;
            break;
          case 'package':
            payload.packageId = (value as Package)?.packageId || null;
            if (
              quoteVersionId
                ? quoteVersionId
                : quotationData?.versions?.[0]?.quotationVersionId && (value as Package)?.packageId
            ) {
              await dispatch(
                createQuotationPackageThunk({
                  quotationVersionId: quoteVersionId
                    ? quoteVersionId
                    : quotationData?.versions?.[0]?.quotationVersionId,
                  packageId: (value as Package).packageId,
                })
              ).unwrap();

              // Refresh quotation data after package update
              await dispatch(
                getQuotationVersionById({
                  quoteId: quotationData?.quotationId,
                  quoteVersionId: quoteVersionId
                    ? quoteVersionId
                    : quotationData?.versions?.[0]?.quotationVersionId,
                })
              ).unwrap();

              setHasChanges(false);
              dispatch(setQuotationPackage(value as Package));
              return;
            }
            break;
          case 'range':
            dispatch(setSelectedFilters({ ...quotationFilters, range: value }));
            payload.rangeId = (value as string) || null;
            break;
          case 'dwellingType':
            dispatch(setSelectedFilters({ ...quotationFilters, dwellingType: value }));
            payload.dwellingTypeId = (value as string) || null;
            break;
          case 'location':
            dispatch(setSelectedFilters({ ...quotationFilters, location: value }));
            payload.locationId = (value as string) || null;
            break;
          case 'structuralEngineer':
            dispatch(setQuotationStructuralEngineer(value as any));
            payload.structureEngineerId = (value as any)?.structureEngineerId || null;
            break;
        }
        if (type !== 'package') {
          await dispatch(
            updateQuotationVersion({ id: quoteDetails?.quotationVersionId, data: payload })
          ).unwrap();
        }

        setHasChanges(false);
      } catch (error) {
        message.error((error as string) || error?.message || 'Failed to save changes');
      }
    },
    [dispatch, quotationFilters, quoteVersionId, quoteDetails]
  );

  const handleRouteChange = (url: string) => {
    if (!url.startsWith(`/${SystemRoutes.QUOTATION}`)) {
      // dispatch(clearQuotation());
    }
  };

  const handleItemQuantityUpdate = async (itemId: string, quantity: number) => {
    try {
      const priceItem = items.find(i => i.priceListItemId === itemId);
      if (!priceItem?.quotationVersionItemId) return;


      // Only update if quantity has changed
      if (Number(priceItem.quantity) !== quantity) {
        await dispatch(
          updateQuotationItemThunk({
            quotationVersionItemId: priceItem.quotationVersionItemId,
            quantity,
            note: priceItem.note || undefined,
            priceListItemDescription: priceItem.itemDescription || undefined,
          })
        ).unwrap();
        message.success('Quantity updated successfully');
      }
    } catch (error) {
      message.error((error as string) || 'Failed to update quantity');
      throw error; // Re-throw to let child component handle revert
    }
  };

  const fetchCategoriesData = async () => {
    try {
      await dispatch(fetchPricelistMaster({ is_active: true })).unwrap();
    } catch (e) {
      message.error((e as string) || (e as any)?.message || 'Failed to fetch categories');
    }
  };

  const { previewPdf } = usePdf(JobDocumentPdf);
  const getCategoryById = useCallback(
    (categoryId: string) => categoryData.find(cat => cat.priceListId === categoryId),
    [categoryData]
  );

  const fetchQuotationCustomSection = async () => {
    try {
      await dispatch(
        getQuotationCustomSection(
          quoteVersionId ?? quotationData?.versions?.[0]?.quotationVersionId
        )
      ).unwrap();
    } catch (error) {
      message.error((error as string) || error?.message || 'Failed to fetch custom section');
    }
  };

  const fetchAllCategoryItems = async () => {
    if (!compactionReportShow && (!quotationFilters?.range || !quotationFilters?.dwellingType))
      return;

    try {
      const responses = await Promise.all(
        categoryData.map(async cat => {
          if (!cat.isExpanded) {
            dispatch(toggleExpand(cat.priceListId));
          }
          return dispatch(
            fetchCategoryItems({
              price_list_id: cat.priceListId,
              range_id: quotationFilters.range || undefined,
              dwelling_type_id: quotationFilters.dwellingType || undefined,
              is_system_data: compactionReportShow,
              package_id: quoteDetails?.package?.packageId,
            })
          ).unwrap();
        })
      );

      // ✅ Step 2: After fetching, auto-add INCLUDED items
      responses.forEach(res => {
        res.priceListItem?.forEach((item: any) => {
          if (item?.costType === 'INCLUDED') {
            // only add if not already in quotation
            const alreadyAdded = items.some(i => i.priceListItemId === item.priceListItemId);
            if (!alreadyAdded) {
              dispatch(setQuotationItems({ ...item, quantity: 1 }));
            }
          }
        });
      });

      lastFetchedFiltersRef.current = {
        range: quotationFilters.range,
        dwellingType: quotationFilters.dwellingType,
      };
    } catch (error) {
      message.error((error as string) || error?.message || 'Failed to fetch category items');
    }
  };

  const fetchQuotationPricelistItem = async () => {
    try {
      await dispatch(
        getQuotationPricelistThunk({
          quotationVersionId: quoteVersionId ?? quotationData?.versions?.[0]?.quotationVersionId,
          package_id: selectedPackageFromSlice?.packageId || undefined,
          // range_id: quotationFilters?.range || undefined,
          // dwelling_type_id: quotationFilters?.dwellingType || undefined,
        })
      ).unwrap();
    } catch (error) {
      message.error((error as string) || error?.message || 'Failed to fetch quotation items');
    }
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => { };

  // const handlePreview = async () => {
  //   setPreviewLoading(true);
  //   try {
  //     const responses = await Promise.all(
  //       categoryData.map(cat => {
  //         if (!cat.isExpanded) {
  //           dispatch(toggleExpand(cat.priceListId));
  //           return dispatch(
  //             fetchCategoryItems({
  //               price_list_id: cat.priceListId,
  //               range_id: quotationFilters?.range || undefined,
  //               dwelling_type_id: quotationFilters?.dwelling_type || undefined,
  //             })
  //           ).unwrap();
  //         }
  //         return Promise.resolve({
  //           priceListId: cat.priceListId,
  //           items: cat.items || [],
  //         });
  //       })
  //     );

  //     // Use the updated categories (from Redux or responses)
  //     const allCategories = categoryData.map(cat => {
  //       const fetched = responses.find(res => res.priceListId === cat.priceListId);
  //       return {
  //         ...cat,
  //         items: fetched?.priceListItem || cat.items || [],
  //       };
  //     });

  //     lastFetchedFiltersRef.current = {
  //       range: quotationFilters.range,
  //       dwelling_type: quotationFilters.dwelling_type,
  //     };

  //     // Now build grouped items
  //     const groupedItems = allCategories.map(category => {
  //       const categoryItems = Array.isArray(category.items)
  //         ? category.items
  //         : category.items.priceListItem || [];
  //       const matchedItems = categoryItems
  //         .filter(catItem =>
  //           items.some(sel => sel.priceListItemId === catItem.priceListItemId)
  //         )
  //         .map(catItem => {
  //           const selected = items.find(
  //             sel => sel.priceListItemId === catItem.priceListItemId
  //           );

  //           return {
  //             ...catItem,
  //             ...selected,
  //             total: selected.itemCost,
  //           };
  //         });

  //       return {
  //         categoryId: category.priceListId,
  //         categoryName: category.name,
  //         // description: category.description,
  //         items: matchedItems,
  //         categoryTotal: matchedItems.reduce((sum, i) => sum + Number(i.total), 0),
  //       };
  //     });
  //     const filteredGroupedItems = groupedItems.filter(cat => cat.items.length > 0);
  //     previewPdf({ showedSection: { quotation: true } });
  //   } catch (error) {
  //     message.error(error || 'Failed to preview quotation');
  //   } finally {
  //     setPreviewLoading(false);
  //   }
  // };

  const handleExtraClick = (type: 'item' | 'complimentry' | 'discount' | 'note') => {
    setSelectedCategory(null);
    setExtraItem(type);
    setSelect(false);
  };

  // if (quoteVersionId && quotationStatus?.getById === Status.ERROR) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Result
  //         status="error"
  //         title="Error"
  //         subTitle="Failed to load quotation. Please try again later."
  //       />
  //     </div>
  //   );
  // }

  if (
    quoteVersionId &&
    (quotationStatus?.getById === Status.PENDING ||
      quotationStatus?.getById === Status.IDLE ||
      (quotationStatus?.getById === Status.SUCCESS && !quoteDetails))
  ) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loading type="primary" />
      </div>
    );
  }

  const handleCreateNewVersion = async () => {
    try {
      const response = await dispatch(
        createQuotationVersionThunk(quoteVersionId ?? quoteDetails?.quotationVersionId)
      ).unwrap();
      message.success('New version created successfully');

      // Update relevant states with the duplicated quotation data
      if (response) {
        // Update filters
        dispatch(
          setSelectedFilters({
            range: response.rangeId,
            dwellingType: response.dwellingTypeId,
            // location: response.locationId,
          })
        );

        // Update floor plan if available
        if (response.floorPlan) {
          dispatch(setQuotationPlan(response.floorPlan));
        }

        // Update facade if available
        if (response.facade) {
          dispatch(setQuotationFacade(response.facade));
        }

        // Update package if available
        if (response.package) {
          dispatch(setQuotationPackage(response.package));
        }

        // Redirect to the new version
        router.push(`${SystemRoutes.QUOTATION}/${response.quotationVersionId}`);
      }
    } catch (error) {
      message.error((error as string) || error?.message || 'Failed to create new version');
    }
  };

  const handlePreView = async () => {
    try {
      setPreviewLoading(true);
      const response = await dispatch(
        getQuotationPdf({ id: quoteVersionId ?? quotationData?.versions?.[0]?.quotationVersionId })
      ).unwrap();
      if (response) {
        window.open(response?.pdfUrl, '_blank');
        setPreviewLoading(false);
      }
    } catch (error) {
      message.error((error as string) || error?.message || 'Failed to get url');
      setPreviewLoading(false);
    }
  };

  return (
    <>
      <div className="m-3 flex justify-between items-center">
        <div className="flex items-center justify-center gap-4">
          <StageProgress
            id={quoteDetails?.referenceNumber + ' V' + quoteDetails?.quotationVersionNo || ''}
            title="Quotation"
            steps={[]}
          />
          {quoteDetails?.isApprove && <Tag color="green-inverse">Approved</Tag>}
          <Tooltip title="Create new quotation version" placement="top">
            <Button
              type="primary"
              onClick={handleCreateNewVersion}
              disabled={quoteDetails?.isApprove}
              loading={quotationStatus?.create === Status.PENDING}
            >
              <IconNewSection />
              New Version
            </Button>
          </Tooltip>
        </div>
        <QuotationFilter
          isReadOnly={
            quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0) ||
            quoteDetails?.isApprove
          }
          onFilterChange={({ type, value }) => {
            handleSelectionChange(type, value);
            setHasChanges(true);
            setSelectedCategory(null);
            // Use null (not []) so !!selectedPackage stays falsy and "Select Package"
            // button renders instead of an empty package box.
            dispatch(setQuotationPackage(null));
            dispatch(setQuotationFacade(null));
            dispatch(setQuotationPlan(null));
          }}
        />
      </div>

      <InfoCards
        // propertyDetails={property}
        selectedPlan={plan}
        selectedFacade={facade}
        selectedPackage={selectedPackageFromSlice}
        selectedStructuralEngineer={selectedStructuralEngineer}
        onPlanSelect={plan => handleSelectionChange('plan', plan)}
        onFacadeSelect={facade => handleSelectionChange('facade', facade)}
        onPackageSelect={pkg => handleSelectionChange('package', pkg)}
        onStructuralEngineerSelect={engineer =>
          handleSelectionChange('structuralEngineer', engineer)
        }
        // onPropertyUpdate={() => { }}
        isReadOnly={
          quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0) ||
          quoteDetails?.isApprove ||
          quoteDetails?.sendToEngineer === true
        }
        filters={quotationFilters}
      />

      <div className="flex flex-1 m-3 border border-border-color rounded-lg h-[360px]">
        {(quotationFilters?.range && quotationFilters?.dwellingType) ||
          (leadDetail?.property?.compactionReportProvider === 'builder' &&
            leadDetail?.property?.compactionReport === 'not_available') ? (
          <>
            <div className="w-64">
              {status.priceMaster === Status.PENDING ? (
                <div className="flex items-center justify-center flex-1">
                  <Loading type="primary" />
                </div>
              ) : (
                <CategorySidebar
                  categories={categoryData}
                  selectedCategory={selectedCategory}
                  onCategorySelect={categoryId => {
                    setSelectedCategory(categoryId);
                    setExtraItem(null);
                  }}
                  setSelect={setSelect}
                />
              )}
            </div>

            <ItemsPanel
              category={getCategoryById(selectedCategory)}
              onItemQuantityChange={handleItemQuantityChange}
              onItemQuantityUpdate={handleItemQuantityUpdate}
              extraItem={extraItem}
              onExtraClick={handleExtraClick}
              isReadOnly={
                quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0) ||
                quoteDetails?.isApprove ||
                !quoteDetails?.structuralEngineer
              }
              // itemsLoading={
              //   selectedCategory
              //     ? (getCategoryById(selectedCategory)?.loadingItems ?? false)
              //     : false
              // }
              itemsLoading={false}
              setSelect={val => {
                setSelectedCategory(val ? null : categoryData?.[0]?.priceListId);
                setSelect(val);
              }}
              select={onSelect}
            />
          </>
        ) : (
          <div className="flex flex-1 bg-card-color text-font-color-100 items-center justify-center border rounded-lg">
            <p>
              {quotationFilters?.range
                ? 'Please select Dwelling Type'
                : quotationFilters?.dwellingType
                  ? 'Please select Range'
                  : 'Please select Range and Dwelling Type'}
            </p>
          </div>
        )}
      </div>

      <div className="m-3">
        <FooterActions
          id={quotationData?.referenceNumber || ''}
          versionNo={quoteDetails?.quotationVersionNo}
          total={calculateTotalQuotation(
            selectedPackageFromSlice,
            items,
            Number(facade?.cost),
            Number(quoteDetails?.structuralEngineer?.price)
          )}
          quoteVersionId={quoteVersionId || quotationData?.versions?.[0]?.quotationVersionId}
          isEditMode={isEditMode}
          onEdit={() => setIsEditMode(true)}
          onCancel={() => setHasChanges(false)}
          onSave={() => { }}
          onPreview={() => handlePreView()} // todo handle preview
          disableAction={
            quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0) ||
            quoteDetails?.isApprove ||
            !quoteDetails?.structuralEngineer
          }
          previewLoading={previewLoading}
          loading={quotationStatus.create === Status.PENDING}
          hasUnsavedChanges={hasChanges}
          onCreateNewVersion={handleCreateNewVersion}
        />
      </div>
    </>
  );
};

export default QuotationManager;
