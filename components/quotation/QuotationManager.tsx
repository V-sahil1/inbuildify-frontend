import StageProgress from "@/components/common/StageProgress";
import CategorySidebar from "@/components/leadDetail/CategorySidebar";
import FooterActions from "@/components/leadDetail/FooterActions";
import InfoCards from "@/components/leadDetail/InfoCards";
import ItemsPanel from "@/components/leadDetail/ItemsPanel";
import { Plan } from "@/pages/leads/[id]";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import {
  toggleExpand,
} from "@redux/feature/masterPriceList/masterPriceListSlice";
import { IFacadeState } from "@redux/feature/facade/IFacadeState";
import {
  fetchCategories,
  fetchCategoryItems,
} from "@redux/feature/masterPriceList/masterPriceListThunk";
import { Package } from "@redux/feature/package/IPackageState";
import { RootState } from "@redux/feature/store";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  createQuotation,
  getQuotationById,
  getQuotationVersionById,
} from "@redux/feature/quotation/quotationThunk";
import { message, Spin } from "antd";
import QuotationFilter from "@/components/quotation/QuotationFilter";
import { updateLeadStatus } from "@redux/feature/lead/leadSlice";
import { clearQuotation } from "@redux/feature/quotation/quotationSlice";
import { usePdf } from "@hooks/usePdf";
import QuatationPdf from "@/components/common/QuatationPdf";
import calculateTotalQuotation from "@lib/utils/calculateTotalQuotation";
import SystemRoutes from "@lib/constants/Routes";
import { useRouter } from "next/router";
import { getDwellingTypes, getRanges } from "@redux/feature/types/typesThunk";
import { clearFilters } from "@redux/feature/facade/facadeSlice";

const QuotationManager = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { quoteVersionId } = router.query as { quoteVersionId: string };
  // console.log("🚀 ~ QuotationManager ~ quoteVersionId:", quoteVersionId)
  const [isEditMode, setIsEditMode] = useState(false);
  const isReadOnly = useMemo(
    () => !!quoteVersionId && !isEditMode,
    [quoteVersionId, isEditMode]
  );
  const { user } = useAppSelector((state) => state.auth);
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
  } = useAppSelector((state: RootState) => state.quotation);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(plan);
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(
    undefined
  );
  // Sync local state with Redux store
  useEffect(() => {
    setSelectedPlan(plan);
    setSelectedPackage(selectedPackageFromSlice);
  }, [plan, selectedPackageFromSlice]);
  const [selectedFacade, setSelectedFacade] = useState<
    IFacadeState | undefined
  >(facade);

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchQuotation = async () => {
      await dispatch(getQuotationVersionById(quoteVersionId as string)).unwrap();
    };
    if (quoteVersionId) {
      fetchQuotation();
    }
  }, [dispatch, quoteVersionId]);

  // Reset edit mode when quoteId changes
  useEffect(() => {
    setIsEditMode(false);
  }, [quoteVersionId]);

  // Sync local state with Redux store
  useEffect(() => {
    setSelectedFacade(facade);
  }, [facade]);

  // Function to check if a field should be disabled
  const isFieldDisabled = (fieldName: string) => {
    return !!quoteVersionId && !isEditMode;
  };
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [extraItem, setExtraItem] = useState(false);
  const { status: typesStatus } = useAppSelector(
    (state: RootState) => state.types
  );
  const { categories: categoryData, status } = useAppSelector(
    (state: RootState) => state.masterPriceList
  );
  // const { categories: mplCategories } = useAppSelector(
  //   (state: RootState) => state.masterPriceList
  // );
  // const { selectedFilters: mplFilters } = useAppSelector(
  //   (state: RootState) => state.masterPriceList
  // );
  const { package: packageFromSlice, items: itemsFromSlice } = useAppSelector(
    (state) => state.quotation
  );

  // const BaseCategory = useMemo(() => mplCategories.find((cat) => cat.name === "base price"), [mplCategories]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();
      } catch (e) {
        message.error(e || "Failed to fetch categories");
      }
    };
    if (status === Status.IDLE) {
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
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [dispatch, router]);

  const { previewPdf } = usePdf(QuatationPdf);
  const getCategoryById = useCallback(
    (categoryId: string) =>
      categoryData.find((cat) => cat.categoryId === categoryId),
    [categoryData]
  );

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
            categoryId,
            filters: {
              range: quotationFilters?.range || undefined,
              dwelling_type: quotationFilters?.dwelling_type || undefined,
            },
          })
        ).unwrap();
        // if(response.categoryId === BaseCategory?.categoryId){
        //   const mappedItems = response.items.map((item) => ({
        //     itemId: item.categoryItemId,
        //     quantity: 1,
        //     price: Number(item.cost),
        //   }));
        //   dispatch(setQuotationBaseItems(mappedItems));
        // }
      } catch (error) {
        message.error(error || "Failed to fetch category items");
      }
    }
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => {};

  const getQuotationItems = () => {
    const normalize = (item: any, isExtra = false) => ({
      itemId: isExtra ? item.categoryItemId : item.itemId,
      quantity: Number(item.quantity),
      price: isExtra ? Number(item.cost) : Number(item.price),
      total:
        Number(item.quantity) *
        (isExtra ? Number(item.cost) : Number(item.price)),
    });

    return [
      ...items.map((item) => normalize(item)),
      ...extraItems.map((item) => normalize(item, true)),
    ];
  };

  const createQuotationPayload = () => {
    return {
      ...(quoteVersionId && {quoteId: quoteDetails?.quotationId}),
      quotationPayload: {
        ...(!quoteVersionId && {
          leadId: property?.leadId,
          propertyId: property?.propertyId,
        }),
        range: quotationFilters?.range,
        dwellingType: quotationFilters?.dwelling_type,
        floorPlanId: plan?.floorPlanId,
        facadeId: facade?.facadeId,
        packageId: selectedPackageFromSlice?.packageId,
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
            status: "COMPLETED",
            updatedAt: response.updatedAt,
          })
        );
      }
      message.success(
        quoteVersionId
          ? "Quotation updated successfully"
          : "Quotation created successfully"
      );
      router.push(`/${SystemRoutes.JOB}`);
    } catch (error) {
      message.error(error);
    }
  };
  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const responses = await Promise.all(
        categoryData.map((cat) => {
          if (!cat.isExpanded) {
            dispatch(toggleExpand(cat.categoryId));
            return dispatch(
              fetchCategoryItems({
                categoryId: cat.categoryId,
                filters: {
                  range: quotationFilters?.range || undefined,
                  dwelling_type: quotationFilters?.dwelling_type || undefined,
                },
              })
            ).unwrap();
          }
          return Promise.resolve({
            categoryId: cat.categoryId,
            items: cat.items || [],
          });
        })
      );

      // Use the updated categories (from Redux or responses)
      const allCategories = categoryData.map((cat) => {
        const fetched = responses.find(
          (res) => res.categoryId === cat.categoryId
        );
        return {
          ...cat,
          items: fetched?.items || cat.items || [],
        };
      });

      // Now build grouped items
      const groupedItems = allCategories.map((category) => {
        const matchedItems = (category.items || [])
          .filter((catItem) =>
            itemsFromSlice.some((sel) => sel.itemId === catItem.categoryItemId)
          )
          .map((catItem) => {
            const selected = itemsFromSlice.find(
              (sel) => sel.itemId === catItem.categoryItemId
            );
            return {
              ...catItem,
              ...selected,
              total: Number(selected?.quantity) * Number(selected?.price),
            };
          });

        return {
          categoryId: category.categoryId,
          categoryName: category.name,
          description: category.description,
          items: matchedItems,
          categoryTotal: matchedItems.reduce((sum, i) => sum + i.total, 0),
        };
      });
      const filteredGroupedItems = groupedItems.filter(
        (cat) => cat.items.length > 0
      );
      previewPdf({
        user: user,
        leadDetail: contact,
        propertyDetail: property,
        quotePackage: selectedPackageFromSlice,
        quotationAmount: calculateTotalQuotation(
          packageFromSlice,
          itemsFromSlice,
          Number(facade?.cost)
        ),
        floorPlan: plan,
        facade: facade,
        items: filteredGroupedItems,
      });
    } catch (error) {
      message.error(error || "Failed to preview quotation");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleExtraClick = () => {
    setExtraItem(true);
    setSelectedCategory(null);
  };

  const canContact = !!contact;
  const canProperty = property && Object.keys(property).length > 0 && property?.propertyId;
  const canPlan = plan && Object.keys(plan).length > 0;
  const canFacade = !!facade;
  const canSelectedPackageFromSlice = !!selectedPackageFromSlice;
  const canAction =
    canContact &&
    canProperty &&
    canPlan &&
    canFacade &&
    canSelectedPackageFromSlice;

  if (quoteVersionId && quotationStatus.getById === Status.PENDING) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Spin />
      </div>
    );
  }

  return (
    <>
      <div className="m-3 flex justify-between items-center">
        <StageProgress
          id={quoteDetails?.slugId || ""}
          title="Quotation"
          steps={[]}
        />
        <QuotationFilter 
          isReadOnly={isReadOnly}
          onFilterChange={() => setSelectedCategory(null)} 
          />
      </div>

      <InfoCards
        leadDetails={{ ...contact, leadId: id as string }}
        propertyDetails={property}
        selectedPlan={selectedPlan}
        selectedFacade={selectedFacade}
        selectedPackage={selectedPackage}
        onPlanSelect={setSelectedPlan}
        onFacadeSelect={setSelectedFacade}
        onPackageSelect={setSelectedPackage}
        onPropertyUpdate={() => {}}
        isReadOnly={isReadOnly}
      />

      <div className="flex flex-1 m-3 border rounded-lg ">
        {quotationFilters.range && quotationFilters.dwelling_type ? (
          <>
            <div className="w-64">
              {status === Status.IDLE ? (
                <div className="flex items-center justify-center flex-1">
                  <Spin />
                </div>
              ) : (
                <CategorySidebar
                  categories={categoryData}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleFetchCategoryItems}
                />
              )}
            </div>

            <ItemsPanel
              category={getCategoryById(selectedCategory)}
              onItemQuantityChange={handleItemQuantityChange}
              extraItem={extraItem}
              onExtraClick={handleExtraClick}
              isReadOnly={isReadOnly}
              itemsLoading={
                selectedCategory
                  ? getCategoryById(selectedCategory)?.loadingItems ?? false
                  : false
              }
            />
          </>
        ) : (
          <div className="flex flex-1 bg-card-color text-font-color-100 items-center justify-center border rounded-lg h-[356px]">
            <p>
              {quotationFilters.range
                ? "Please select Dwelling Type"
                : quotationFilters.dwelling_type
                ? "Please select Range"
                : "Please select Range and Dwelling Type"}
            </p>
          </div>
        )}
      </div>

      <div className="m-3">
        <FooterActions
          total={calculateTotalQuotation(
            packageFromSlice,
            itemsFromSlice,
            Number(facade?.cost)
          )}
          quoteVersionId={quoteVersionId}
          isEditMode={isEditMode}
          onEdit={() => setIsEditMode(true)}
          onCancel={() => setIsEditMode(false)}
          onSave={handleCreateQuotation}
          onPreview={handlePreview}
          disableAction={!canAction}
          previewLoading={previewLoading}
          loading={quotationStatus.create === Status.PENDING}
        />
      </div>
    </>
  );
};

export default QuotationManager;
