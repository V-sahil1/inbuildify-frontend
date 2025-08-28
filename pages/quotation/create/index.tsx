import StageProgress from '@/components/common/StageProgress';
import CategorySidebar from '@/components/leadDetail/CategorySidebar';
import FooterActions from '@/components/leadDetail/FooterActions';
import InfoCards from '@/components/leadDetail/InfoCards'
import ItemsPanel from '@/components/leadDetail/ItemsPanel';
import { Facade, Package, Plan } from '@/pages/leads/[id]';
import { availableFacades, availablePackages, availablePlans, leadDetails, propertyDetails, quotationData } from '@/pages/leads/data/sampleData'
import { PropertyDetails } from '@/pages/leads/data/types';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { fetchCategories } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { RootState } from '@redux/feature/store';
import { Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'

const index = () => {
    const dispatch = useAppDispatch();
    const { contact, property } = useAppSelector((state: RootState) => state.quotation);
    const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(availablePlans[0]);
    const [selectedFacade, setSelectedFacade] = useState<Facade | undefined>(availableFacades[0]);
    const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(availablePackages[0]);
    const [quotation, setQuotation] = useState(quotationData);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const { categories: categoryData, status } = useAppSelector((state: RootState) => state.masterPriceList);

    const currentSelectedCategory = useMemo(() => {
        return categoryData.find((cat) => cat.categoryId === selectedCategory);
    }, [selectedCategory, categoryData]);

    useEffect(() => {
        if (status === Status.IDLE) {
            dispatch(fetchCategories());
        }
    }, [dispatch]);

    const handleItemQuantityChange = (itemId: string, quantity: number) => { };
    const handleItemAdd = (itemId: string) => { };
    const calculateTotal = () => { return 1000 };
    const handleSaveAs = () => console.log("Save As clicked");
    const handleApprove = () => console.log("Approve clicked");
    const handleEmail = () => console.log("Email clicked");
    const handlePreview = () => console.log("Preview clicked");
    const handleViewOpportunity = () => console.log("View Opportunity clicked");
    return (
        <>
            <div className='m-3'>
                <StageProgress
                    id='MYH00492'
                    title='Quotation'
                    status='Open'
                    steps={[]}
                />
            </div>
            <InfoCards
                leadDetails={contact}
                propertyDetails={property}
                selectedPlan={selectedPlan}
                selectedFacade={selectedFacade}
                selectedPackage={selectedPackage}
                availableFacades={availableFacades}
                availablePackages={availablePackages}
                onPlanSelect={setSelectedPlan}
                onFacadeSelect={setSelectedFacade}
                onPackageSelect={setSelectedPackage}
                onPropertyUpdate={() => { }}
            />

            <div className="flex flex-1 m-3">
                <div className="w-64">
                    {status === Status.IDLE ? (
                        <div className="flex items-center justify-center flex-1">
                            <Spin />
                        </div>
                    ) : (
                        <CategorySidebar
                            categories={categoryData}
                            selectedCategory={selectedCategory}
                            onCategorySelect={setSelectedCategory}
                        />
                    )}
                </div>

                <ItemsPanel
                    category={currentSelectedCategory}
                    onItemQuantityChange={handleItemQuantityChange}
                    onItemAdd={handleItemAdd}
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
    )
}

export default index