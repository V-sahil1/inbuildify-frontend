import StageProgress from "@/components/common/StageProgress";
import CategorySidebar from "@/components/leadDetail/CategorySidebar";
import FooterActions from "@/components/leadDetail/FooterActions";
import InfoCards from "@/components/leadDetail/InfoCards";
import ItemsPanel from "@/components/leadDetail/ItemsPanel";
import { Plan } from "@/pages/leads/[id]";
import { quotationData } from "data/sampleData";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import { toggleExpand } from "@redux/feature/masterPriceList/masterPriceListSlice";
import { IFacadeState } from "@redux/feature/facade/IFacadeState";
import {
  fetchCategories,
  fetchCategoryItems,
} from "@redux/feature/masterPriceList/masterPriceListThunk";
import { Package } from "@redux/feature/package/IPackageState";
import { RootState } from "@redux/feature/store";
import React, { useEffect, useState, useCallback } from "react";
import { createQuotation } from "@redux/feature/quotation/quotationThunk";
import { message, Spin } from "antd";
import QuotationFilter from "@/components/quotation/QuotationFilter";
import { updateLeadStatus } from "@redux/feature/lead/leadSlice";
import { clearQuotation } from "@redux/feature/quotation/quotationSlice";
import { usePdf } from "@hooks/usePdf";
import QuatationPdf from "@/components/common/QuatationPdf";
import { useRouter } from "next/navigation";
import calculateTotalQuotation from "@lib/utils/calculateTotalQuotation";

const Index = () => {
  const dispatch = useAppDispatch();
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
  } = useAppSelector((state: RootState) => state.quotation);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(plan);

  // Sync local state with Redux store
  useEffect(() => {
    setSelectedPlan(plan);
  }, [plan]);
  const [selectedFacade, setSelectedFacade] = useState<
    IFacadeState | undefined
  >(facade);

  // Sync local state with Redux store
  useEffect(() => {
    setSelectedFacade(facade);
  }, [facade]);
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(
    selectedPackageFromSlice
  );
  const [quotation, setQuotation] = useState(quotationData);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [extraItem, setExtraItem] = useState(false);
  const { categories: categoryData, status } = useAppSelector(
    (state: RootState) => state.masterPriceList
  );
  // const { categories: mplCategories } = useAppSelector(
  //   (state: RootState) => state.masterPriceList
  // );
  const { selectedFilters: mplFilters } = useAppSelector(
    (state: RootState) => state.masterPriceList
  );
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
    return () => {
      dispatch(clearQuotation());
    };
  }, []);

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
      range: "PREMIUM",
      dwellingType: "DOUBLE_STOREY",
      leadId: property?.leadId,
      propertyId: property?.propertyId,
      floorPlanId: plan?.floorPlanId,
      facadeId: facade?.facadeId,
      packageId: selectedPackageFromSlice?.packageId,
      items: getQuotationItems(),
    };
  };

  const handleApprove = async () => {
    try {
      const payload = createQuotationPayload();
      const response = await dispatch(createQuotation(payload)).unwrap();
      dispatch(
        updateLeadStatus({
          leadId: response.leadId,
          status: "COMPLETED",
          updatedAt: response.updatedAt,
        })
      );
      message.success("Quotation created successfully");
      router.push(`/job`);
    } catch (error) {
      console.log(error);
      message.error("Failed to create quotation");
    }
  };
  const handlePreview = () => {
    previewPdf({
      user: user,
      leadDetail: contact,
      propertyDetail: property,
      quotePackage: selectedPackageFromSlice,
      quotationAmount: calculateTotalQuotation(
        selectedPackageFromSlice,
        itemsFromSlice
      ),
      floorPlan: plan,
      facade: facade,
    });
  };

  const handleViewOpportunity = () => console.log("View Opportunity clicked");
  const handleExtraClick = () => {
    setExtraItem(true);
    setSelectedCategory(null);
  };
  return (
    <>
      <div className="m-3 flex justify-between items-center">
        <StageProgress
          id="MYH00492"
          title="Quotation"
          status="Open"
          steps={[]}
        />
        <QuotationFilter />
      </div>

      <InfoCards
        leadDetails={contact}
        propertyDetails={property}
        selectedPlan={selectedPlan}
        selectedFacade={selectedFacade}
        selectedPackage={selectedPackage}
        onPlanSelect={setSelectedPlan}
        onFacadeSelect={setSelectedFacade}
        onPackageSelect={setSelectedPackage}
        onPropertyUpdate={() => {}}
      />

      <div className="flex flex-1 m-3">
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
            />
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
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
          expiryDate={quotation.expiryDate}
          total={calculateTotalQuotation(
            Number(packageFromSlice?.amount),
            itemsFromSlice
          )}
          onApprove={handleApprove}
          onPreview={handlePreview}
          loading={quotationStatus === Status.PENDING}
        />
      </div>
    </>
  );
};

export default Index;
