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
  createQuotation,
  createQuotationVersionThunk,
  getQuotationCustomSection,
  getQuotationPricelistThunk,
  getQuotationVersionById,
  updateQuotationVersion,
} from '@redux/feature/quotation/quotationThunk';
import {
  setQuotationPlan,
  setQuotationFacade,
  setQuotationPackage,
  setSelectedFilters,
} from '@redux/feature/quotation/quotationSlice';
import { message } from 'antd';
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
  } = useAppSelector((state: RootState) => state.quotation);
  const { priceMaster: categoryData, status } = useAppSelector(
    (state: RootState) => state.masterPriceList
  );
  const [onSelect, setSelect] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [extraItem, setExtraItem] = useState(false);
  const lastFetchedFiltersRef = useRef<{ range?: string; dwellingType?: string } | null>(null);

  // const isJob = useMemo(() => quoteDetails?.leadStatus === 'JOB', [quoteDetails]);

  const quotationData = quoteVersionId
    ? quotation?.find(i => i.versions.find(j => j.quotationVersionId === quoteVersionId))
    : quotation[quotation?.length - 1];

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    if (quotationData?.quotationId) {
      fetchQuotation();
    }
  }, [dispatch, quotationData?.quotationId]);

  useEffect(() => {
    if (!!quoteVersionId || !!quotationData) {
      setIsEditMode(false);
      fetchQuotationPricelistItem();
      fetchQuotationCustomSection();
    }
  }, [quoteVersionId, quotationData]);

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
      message.error(error || 'Faailed to fetch quotation version detail');
    }
  };
  const handleSelectionChange = useCallback(
    async (
      type: 'plan' | 'facade' | 'package' | 'range' | 'dwellingType' | 'location',
      value: IFloorPlanState | IFacadeState | Package[] | string
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
            break;
          case 'facade':
            dispatch(setQuotationFacade(value as IFacadeState));
            payload.facadeId = (value as IFacadeState)?.facadeId || null;
            break;
          case 'package':
            dispatch(setQuotationPackage(value as Package[]));
            payload.packageId = (value as Package[])?.map(i => i.packageId) || null;
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
        }
        await dispatch(
          updateQuotationVersion({ id: quoteDetails?.quotationVersionId, data: payload })
        ).unwrap();
        setHasChanges(false);
        message.success('Changes saved successfully');
      } catch (error) {
        message.error(error || 'Failed to save changes');
      }
    },
    [dispatch, quotationFilters]
  );

  const handleRouteChange = (url: string) => {
    if (!url.startsWith(`/${SystemRoutes.QUOTATION}`)) {
      dispatch(clearQuotation());
    }
  };

  const fetchCategoriesData = async () => {
    try {
      await dispatch(fetchPricelistMaster({})).unwrap();
    } catch (e) {
      message.error(e || 'Failed to fetch categories');
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
      message.error(error || 'Failed to fetch custom section');
    }
  };

  const fetchAllCategoryItems = async () => {
    if (!quotationFilters?.range || !quotationFilters?.dwellingType) return;

    // Prevent fetching again if filters didn't change
    if (
      lastFetchedFiltersRef.current?.range === quotationFilters.range &&
      lastFetchedFiltersRef.current?.dwellingType === quotationFilters.dwellingType
    ) {
      return;
    }

    try {
      const responses = await Promise.all(
        categoryData.map(async cat => {
          if (!cat.isExpanded) {
            dispatch(toggleExpand(cat.priceListId));
          }
          return dispatch(
            fetchCategoryItems({
              price_list_id: cat.priceListId,
              range_id: quotationFilters.range,
              dwelling_type_id: quotationFilters.dwellingType,
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
      message.error(error || 'Failed to fetch category items');
    }
  };

  const fetchQuotationPricelistItem = async () => {
    try {
      await dispatch(
        getQuotationPricelistThunk(
          quoteVersionId ?? quotationData?.versions?.[0]?.quotationVersionId
        )
      ).unwrap();
    } catch (error) {
      message.error(error || 'Faied to fetch quotation items');
    }
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => {};

  const getQuotationItems = () => {
    const normalize = (item: any, isExtra = false) => ({
      itemId: isExtra ? item.categoryItemId : item.itemId,
      quantity: Number(item.quantity),
      price: isExtra ? Number(item.cost) : Number(item.price),
      total: Number(item.quantity) * (isExtra ? Number(item.cost) : Number(item.price)),
    });

    return [
      ...items.map(item => normalize(item)),
      ...extraItems.map(item => normalize(item, true)),
    ];
  };

  const createQuotationPayload = () => {
    return {
      ...(quoteVersionId && { quoteId: quoteDetails?.quotationId }),
      quotationPayload: {
        ...(!quoteVersionId && {
          leadId: property?.leadId,
          propertyId: property?.propertyId,
        }),
        range: quotationFilters?.range,
        dwellingType: quotationFilters?.dwellingType,
        floorPlanId: plan?.floorPlanId,
        facadeId: facade?.facadeId,
        // packageId: selectedPackageFromSlice?.packageId,
        items: getQuotationItems(),
      },
    };
  };

  const handleCreateQuotation = async () => {
    try {
      const payload = createQuotationPayload();
      const response = await dispatch(createQuotation(payload)).unwrap();
      if (!quoteVersionId) {
        dispatch(
          updateLeadStatus({
            leadId: response?.leadId,
            status: 'COMPLETED',
            updatedAt: response.updatedAt,
          })
        );
      }
      message.success(
        quoteVersionId ? 'Quotation updated successfully' : 'Quotation created successfully'
      );
      // router.push(`${SystemRoutes.JOB}/${property?.leadId}`);
      router.back();
    } catch (error) {
      message.error(error);
    }
  };
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

  const handleExtraClick = () => {
    setSelectedCategory(null);
    setTimeout(() => {
      setExtraItem(true);
    }, 0);
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

  // if (isJob) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Result
  //         status="403"
  //         // title="Access Restricted"
  //         subTitle="This lead has already been converted to a job and is no longer accessible from this page."
  //         extra={<Link href="/job">Go to Jobs</Link>}
  //       />
  //     </div>
  //   );
  // }

  const handleCreateNewVersion = async () => {
    try {
      await dispatch(
        createQuotationVersionThunk(
          quoteVersionId ?? quotationData?.versions?.[0]?.quotationVersionId
        )
      ).unwrap();
      message.success('New version created successfully');
    } catch (error) {
      message.error(error || 'Failed to craete new version');
    }
  };

  return (
    <>
      <div className="m-3 flex justify-between items-center">
        <StageProgress
          id={quotationData?.referenceNumber + ' V' + quoteDetails?.quotationVersionNo || ''}
          title="Quotation"
          steps={[]}
        />
        <QuotationFilter
          isReadOnly={quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0)}
          onFilterChange={({ type, value }) => {
            handleSelectionChange(type, value);
            setHasChanges(true);
            setSelectedCategory(null);
            dispatch(setQuotationPackage([]));
            dispatch(setQuotationFacade(null));
            dispatch(setQuotationPlan(null));
          }}
        />
      </div>

      <InfoCards
        propertyDetails={property}
        selectedPlan={plan}
        selectedFacade={facade}
        selectedPackage={selectedPackageFromSlice}
        onPlanSelect={plan => handleSelectionChange('plan', plan)}
        onFacadeSelect={facade => handleSelectionChange('facade', facade)}
        onPackageSelect={pkg => handleSelectionChange('package', pkg)}
        onPropertyUpdate={() => {}}
        isReadOnly={quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0)}
        filters={quotationFilters}
      />

      <div className="flex flex-1 m-3 border rounded-lg h-[365px]">
        {quotationFilters?.range && quotationFilters?.dwellingType ? (
          <>
            <div className="w-64">
              {status.priceMaster === Status.IDLE ? (
                <div className="flex items-center justify-center flex-1">
                  <Loading type="primary" />
                </div>
              ) : (
                <CategorySidebar
                  categories={categoryData}
                  selectedCategory={selectedCategory}
                  onCategorySelect={categoryId => {
                    setSelectedCategory(categoryId);
                    setExtraItem(false);
                  }}
                  setSelect={setSelect}
                />
              )}
            </div>

            <ItemsPanel
              category={getCategoryById(selectedCategory)}
              onItemQuantityChange={handleItemQuantityChange}
              extraItem={extraItem}
              onExtraClick={handleExtraClick}
              isReadOnly={quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0)}
              // itemsLoading={
              //   selectedCategory
              //     ? (getCategoryById(selectedCategory)?.loadingItems ?? false)
              //     : false
              // }
              itemsLoading={false}
              setSelect={setSelect}
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
          total={calculateTotalQuotation(selectedPackageFromSlice, items, Number(facade?.cost))}
          quoteVersionId={quoteVersionId || quotationData?.versions?.[0]?.quotationVersionId}
          isEditMode={isEditMode}
          onEdit={() => setIsEditMode(true)}
          onCancel={() => setHasChanges(false)}
          onSave={handleCreateQuotation}
          onPreview={() => {}} // todo handle preview
          disableAction={quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0)}
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
