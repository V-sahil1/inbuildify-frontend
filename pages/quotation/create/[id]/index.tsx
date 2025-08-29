import StageProgress from '@/components/common/StageProgress';
import CategorySidebar from '@/components/leadDetail/CategorySidebar';
import FooterActions from '@/components/leadDetail/FooterActions';
import InfoCards from '@/components/leadDetail/InfoCards';
import ItemsPanel from '@/components/leadDetail/ItemsPanel';
import { Facade, Plan } from '@/pages/leads/[id]';
import { availableFacades, availablePackages, availablePlans, leadDetails, propertyDetails, quotationData } from '@/pages/leads/data/sampleData'
import { PropertyDetails } from '@/pages/leads/data/types';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { toggleExpand } from '@redux/feature/masterPriceList/masterPriceListSlice';
import { IFacadeState } from '@redux/feature/facade/IFacadeState';
import { fetchCategories, fetchCategoryItems } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { Package } from '@redux/feature/package/IPackageState';
import { RootState } from '@redux/feature/store';
// import { Spin } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { removeQuotationItem, setQuotationItems } from '@redux/feature/quotation/quotationSlice';
import QuotationFilter from '@/components/quotation/QuotationFilter';

const Index = () => {
  const dispatch = useAppDispatch();
  const { contact, property, plan, facade, package: selectedPackageFromSlice } = useAppSelector((state: RootState) => state.quotation);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(plan);
  const [selectedFacade, setSelectedFacade] = useState<IFacadeState | undefined>(facade);
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(selectedPackageFromSlice);
  const [quotation, setQuotation] = useState(quotationData);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [extraItem, setExtraItem] = useState(false);
  const { categories: categoryData, status } = useAppSelector((state: RootState) => state.masterPriceList);
  const { selectedFilters: mplFilters } = useAppSelector((state: RootState) => state.masterPriceList);
  const {items} = useAppSelector((state: RootState) => state.quotation);
  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);


  const getCategoryById = useCallback(
    (categoryId: string) => categoryData.find((cat) => cat.categoryId === categoryId),
    [categoryData]
  );

  const handleFetchCategoryItems = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const currentCategory = getCategoryById(categoryId);
    if(currentCategory){
      setExtraItem(false);
    }

    if (!currentCategory?.isExpanded) {
      dispatch(toggleExpand(categoryId));
      dispatch(fetchCategoryItems({ categoryId, filters: { range: mplFilters.range || undefined, dwelling_type: mplFilters.dwelling_type || undefined } }))
        .unwrap()
       
    }
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => { };
  const handleItemAdd = (itemId: string) => { 
    if(items.some((item) => item === itemId)){
      dispatch(removeQuotationItem(itemId));
    }else{
      dispatch(setQuotationItems(itemId));
    }
  };
  const calculateTotal = () => 1000;

  const handleSaveAs = () => console.log("Save As clicked");
  const handleApprove = () => console.log("Approve clicked");
  const handleEmail = () => console.log("Email clicked");
  const handlePreview = () => console.log("Preview clicked");
  const handleViewOpportunity = () => console.log("View Opportunity clicked");
  const handleExtraClick = () => {
    setExtraItem(true);
    setSelectedCategory(null);
  };
  return (
    <>
      <div className='m-3 flex justify-between items-center'>
        <StageProgress
          id='MYH00492'
          title='Quotation'
          status='Open'
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
        onPropertyUpdate={() => { }}
      />

      <div className="flex flex-1 m-3">
        <div className="w-64">
          {status === Status.IDLE ? (
            <div className="flex items-center justify-center flex-1">
              {/* <Spin /> */}
              loading
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
          onItemAdd={handleItemAdd}
          extraItem={extraItem}
          onExtraClick={handleExtraClick}
        />
      </div>

      <div className='m-3'>
        <FooterActions
          expiryDate={quotation.expiryDate}
          total={calculateTotal()}
          onSaveAs={handleSaveAs}
          onApprove={handleApprove}
          onEmail={handleEmail}
          onPreview={handlePreview}
          onViewOpportunity={handleViewOpportunity}
        />
      </div>
    </>
  );
};

export default Index;
