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
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  createQuotation,
  createQuotationVersionThunk,
  getQuotationPricelistThunk,
  getQuotationVersionById,
  updateQuotationVersion,
} from '@redux/feature/quotation/quotationThunk';
import {
  setQuotationPlan,
  setQuotationFacade,
  setQuotationPackage,
} from '@redux/feature/quotation/quotationSlice';
import { message } from 'antd';
import QuotationFilter from '@/components/quotation/QuotationFilter';
import { updateLeadStatus } from '@redux/feature/lead/leadSlice';
import { clearQuotation, setQuotationItems } from '@redux/feature/quotation/quotationSlice';
import { usePdf } from '@hooks/usePdf';
import calculateTotalQuotation from '@lib/utils/calculateTotalQuotation';
import SystemRoutes from '@lib/constants/Routes';
import { useRouter } from 'next/router';
import { getDwellingTypes, getRanges } from '@redux/feature/types/typesThunk';
import { clearFilters } from '@redux/feature/facade/facadeSlice';
import Loading from '../common/Loading';
import JobDocumentPdf from '../common/pdf/JobDocumentPdf';
import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';
import { debouncedURL } from '@lib/utils/debounceURL';
import { QuotationPackage } from '@redux/feature/quotation/IQuotationState';

const QuotationManager = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { quoteVersionId } = router.query as { quoteVersionId: string };
  const [onSelect, setSelect] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const isReadOnly = useMemo(() => !!quoteVersionId && !isEditMode, [quoteVersionId, isEditMode]);
  const { user } = useAppSelector(state => state.auth);
  const {
    contact,
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
  const lastFetchedFiltersRef = useRef<{ range?: string; dwelling_type?: string } | null>(null);
  const [selectedFacade, setSelectedFacade] = useState<IFacadeState | undefined>(facade);
  const [selectedPlan, setSelectedPlan] = useState<IFloorPlanState | undefined>(plan);
  const [selectedPackage, setSelectedPackage] = useState<Package[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const canContact = !!contact;
  const canProperty = property && Object.keys(property).length > 0 && property?.propertyId;
  const canPlan = plan && Object.keys(plan).length > 0;
  const canFacade = !!facade;
  const canSelectedPackageFromSlice = !!selectedPackageFromSlice;
  const canAction =
    canContact && canProperty && canPlan && canFacade && canSelectedPackageFromSlice;
  // const isJob = useMemo(() => quoteDetails?.leadStatus === 'JOB', [quoteDetails]);
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['range', 'dwellingType', 'location'],
    initialValue: {
      range: quoteDetails?.rangeId || null,
      dwellingType: quoteDetails?.dwellingTypeId || null,
      location: quoteDetails?.locationId || null,
    },
  });
  const quotationData = quoteVersionId
    ? quotation?.find(i => i.versions.find(j => j.quotationVersionId === quoteVersionId))
    : quotation[quotation?.length - 1];
  useEffect(() => {
    return debouncedUpdateURL.cancel();
  }, [debouncedUpdateURL]);
  // Sync local state with Redux store
  useEffect(() => {
    setSelectedPlan(plan);
    setSelectedPackage(selectedPackageFromSlice);
  }, [plan, selectedPackageFromSlice]);

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchQuotation = async () => {
      await dispatch(
        getQuotationVersionById({
          quoteId: quotationData?.quotationId,
          quoteVersionId: quoteVersionId
            ? quoteVersionId
            : quotationData?.versions?.[0]?.quotationVersionId,
        })
      ).unwrap();
    };
    if (quotationData?.quotationId) {
      fetchQuotation();
    }
  }, [dispatch, quotationData?.quotationId]);

  // Reset edit mode when quoteId changes
  useEffect(() => {
    if (!!quoteVersionId || !!quotationData) {
      setIsEditMode(false);
      fetchQuotationPricelistItem();
    }
  }, [quoteVersionId, quotationData]);

  // Sync local state with Redux store
  useEffect(() => {
    setSelectedFacade(facade);
  }, [facade]);

  // Single unified handler for all changes (floorplan, facade, package)
  const handleSelectionChange = useCallback(
    (type: 'plan' | 'facade' | 'package', value: IFloorPlanState | IFacadeState | Package[]) => {
      switch (type) {
        case 'plan':
          setSelectedPlan(value as IFloorPlanState);
          dispatch(setQuotationPlan(value as IFloorPlanState));
          break;
        case 'facade':
          setSelectedFacade(value as IFacadeState);
          dispatch(setQuotationFacade(value as IFacadeState));
          break;
        case 'package':
          setSelectedPackage(value as Package[]);
          dispatch(setQuotationPackage(value as Package[]));
          break;
      }
      setHasChanges(true);
    },
    [dispatch]
  );

  const handleSaveChanges = useCallback(async () => {
    try {
      const payload = {
        rangeId: filters?.range || null,
        dwellingTypeId: filters?.dwellingType || null,
        floorPlanId: selectedPlan?.floorPlanId || null,
        facadeId: selectedFacade?.facadeId || null,
        locationId: filters?.location || null,
        packageId: selectedPackageFromSlice?.map(i => i.packageId) || null,
      };
      await dispatch(
        updateQuotationVersion({ id: quoteDetails?.quotationVersionId, data: payload })
      ).unwrap();
      setHasChanges(false);
      message.success('Changes saved successfully');
    } catch (error) {
      message.error(error || 'Failed to save changes');
    }
  }, [
    dispatch,
    filters,
    selectedPlan,
    selectedFacade,
    quoteDetails?.quotationVersionId,
    selectedPackageFromSlice,
  ]);

  // Function to check if a field should be disabled
  // const isFieldDisabled = (fieldName: string) => {
  //   return !!quoteVersionId && !isEditMode;
  // };
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [extraItem, setExtraItem] = useState(false);
  const { status: typesStatus } = useAppSelector((state: RootState) => state.types);
  const { priceMaster: categoryData, status } = useAppSelector(
    (state: RootState) => state.masterPriceList
  );
  // const { categories: mplCategories } = useAppSelector(
  //   (state: RootState) => state.masterPriceList
  // );
  // const { selectedFilters: mplFilters } = useAppSelector(
  //   (state: RootState) => state.masterPriceList
  // );
  const { package: packageFromSlice, items: itemsFromSlice } = useAppSelector(
    state => state.quotation
  );

  // const BaseCategory = useMemo(() => mplCategories.find((cat) => cat.name === "base price"), [mplCategories]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        await dispatch(fetchPricelistMaster({})).unwrap();
      } catch (e) {
        message.error(e || 'Failed to fetch categories');
      }
    };
    if (status.priceMaster === Status.IDLE) {
      fetchCategoriesData();
    }
  }, [dispatch, status]);

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

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!url.startsWith(`/${SystemRoutes.QUOTATION}`)) {
        dispatch(clearQuotation());
      }
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [dispatch, router]);

  useEffect(() => {
    if (categoryData.length > 0) {
      fetchAllCategoryItems();
    }
  }, [
    quotationFilters?.range,
    quotationFilters?.dwelling_type,
    dispatch,
    categoryData.length,
    items, // dependency so INCLUDED sync works correctly
  ]);
  const { previewPdf } = usePdf(JobDocumentPdf);
  const getCategoryById = useCallback(
    (categoryId: string) => categoryData.find(cat => cat.priceListId === categoryId),
    [categoryData]
  );

  const fetchAllCategoryItems = async () => {
    if (!quotationFilters?.range || !quotationFilters?.dwelling_type) return;

    // Prevent fetching again if filters didn't change
    if (
      lastFetchedFiltersRef.current?.range === quotationFilters.range &&
      lastFetchedFiltersRef.current?.dwelling_type === quotationFilters.dwelling_type
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
              dwelling_type_id: quotationFilters.dwelling_type,
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
        dwelling_type: quotationFilters.dwelling_type,
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

  const handleFetchCategoryItems = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    const currentCategory = getCategoryById(categoryId);
    if (currentCategory) {
      setExtraItem(false);
    }

    if (!currentCategory?.isExpanded) {
      dispatch(toggleExpand(categoryId));
      try {
        const response = await dispatch(
          fetchCategoryItems({
            price_list_id: categoryId,
            range_id: filters.range,
            dwelling_type_id: filters.dwellingType,
          })
        ).unwrap();
        // console.log("🚀 ~ handleFetchCategoryItems ~ response:", response);
        // if(response.categoryId === BaseCategory?.categoryId){
        //   const mappedItems = response.items.map((item) => ({
        //     itemId: item.categoryItemId,
        //     quantity: 1,
        //     price: Number(item.cost),
        //   }));
        //   dispatch(setQuotationBaseItems(mappedItems));
        // }
      } catch (error) {
        message.error(error || 'Failed to fetch category items');
      }
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
        dwellingType: quotationFilters?.dwelling_type,
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
  //           itemsFromSlice.some(sel => sel.priceListItemId === catItem.priceListItemId)
  //         )
  //         .map(catItem => {
  //           const selected = itemsFromSlice.find(
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
    setExtraItem(true);
    setSelectedCategory(null);
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

  const handleCustomSection = async values => {
    try {
    } catch (error) {
      message.error('Failed to save custom section');
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
          onFilterChange={() => {
            setHasChanges(true);
            setSelectedCategory(null);
          }}
          setParams={setParams}
          filters={filters}
          instantFilters={instantFilters}
        />
      </div>

      <InfoCards
        propertyDetails={property}
        selectedPlan={selectedPlan}
        selectedFacade={selectedFacade}
        selectedPackage={selectedPackage}
        onPlanSelect={plan => handleSelectionChange('plan', plan)}
        onFacadeSelect={facade => handleSelectionChange('facade', facade)}
        onPackageSelect={pkg => handleSelectionChange('package', pkg)}
        onPropertyUpdate={() => {}}
        isReadOnly={quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0)}
        filters={filters}
      />

      <div className="flex flex-1 m-3 border rounded-lg h-[365px]">
        {filters?.range && filters?.dwellingType ? (
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
                  onCategorySelect={handleFetchCategoryItems}
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
                : quotationFilters?.dwelling_type
                  ? 'Please select Range'
                  : 'Please select Range and Dwelling Type'}
            </p>
          </div>
        )}
      </div>

      <div className="m-3">
        <FooterActions
          id={quotationData?.referenceNumber || ''}
          total={calculateTotalQuotation(packageFromSlice, itemsFromSlice, Number(facade?.cost))}
          quoteVersionId={quoteVersionId || quotationData?.versions?.[0]?.quotationVersionId}
          isEditMode={isEditMode}
          onEdit={() => setIsEditMode(true)}
          onCancel={() => setIsEditMode(false)}
          onSave={handleCreateQuotation}
          onPreview={() => {}} // todo handle preview
          disableAction={quoteDetails?.quotationVersionNo < (quotationData?.versions?.length || 0)}
          previewLoading={previewLoading}
          loading={quotationStatus.create === Status.PENDING}
          hasUnsavedChanges={hasChanges}
          onSaveChanges={handleSaveChanges}
          onCreateNewVersion={handleCreateNewVersion}
          handleCustomSection={handleCustomSection}
        />
      </div>
    </>
  );
};

export default QuotationManager;
