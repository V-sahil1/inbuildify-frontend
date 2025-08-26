import React, { useState } from "react";
import { ConfigProvider } from "antd";

import TopBar from "@/components/leadDetail/TopBar";
import ItemsPanel from "@/components/leadDetail/ItemsPanel";
import InfoCards from "@/components/leadDetail/InfoCards";
import FooterActions from "@/components/leadDetail/FooterActions";
import CategorySidebar from "@/components/leadDetail/CategorySidebar";
import { quotationData, leadDetails, propertyDetails, availablePlans, availableFacades, availablePackages, categories } from "./data/sampleData";
import { PropertyDetails } from "./data/types";


export interface Plan {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  area: string;
}

export interface Facade {
  id: string;
  name: string;
  type: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
}

function App() {
  const [quotation, setQuotation] = useState(quotationData);
  const [property, setProperty] = useState(propertyDetails);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(
    availablePlans[0]
  );
  const [selectedFacade, setSelectedFacade] = useState<Facade | undefined>(
    availableFacades[0]
  );
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(
    availablePackages[0]
  );
  const [selectedCategory, setSelectedCategory] = useState("base-price");
  const [categoryData, setCategoryData] = useState(categories);

  const handleRangeChange = (value: string) => {
    setQuotation((prev) => ({ ...prev, range: value }));
  };

  const handleDwellingTypeChange = (value: string) => {
    setQuotation((prev) => ({ ...prev, dwellingType: value }));
  };
  const handlePropertyUpdate = (updatedProperty: PropertyDetails) => {
    setProperty(updatedProperty);
  };
  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    setCategoryData((prev) =>
      prev.map((category) => ({
        ...category,
        items: category.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, total: item.price * quantity }
            : item
        ),
      }))
    );
  };

  const handleItemAdd = (itemId: string) => {
    console.log("Adding item:", itemId);
    // Implement add item logic here
  };

  const getCurrentCategory = () => {
    return categoryData.find((cat) => cat.id === selectedCategory);
  };

  const calculateTotal = () => {
    return categoryData.reduce(
      (total, category) =>
        total +
        category.items.reduce(
          (categoryTotal, item) => categoryTotal + item.total,
          0
        ),
      0
    );
  };

  const handleSaveAs = () => console.log("Save As clicked");
  const handleApprove = () => console.log("Approve clicked");
  const handleEmail = () => console.log("Email clicked");
  const handlePreview = () => console.log("Preview clicked");
  const handleViewOpportunity = () => console.log("View Opportunity clicked");

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
      }}
    >
      <div className=" bg-gray-100 flex flex-col">
        <TopBar
          quotationId={quotation.id}
          version={quotation.version}
          status={quotation.status}
          range={quotation.range}
          dwellingType={quotation.dwellingType}
          onRangeChange={handleRangeChange}
          onDwellingTypeChange={handleDwellingTypeChange}
        />

        <InfoCards
          leadDetails={leadDetails}
          propertyDetails={property}
          selectedPlan={selectedPlan}
          selectedFacade={selectedFacade}
          selectedPackage={selectedPackage}
          availableFacades={availableFacades}
          availablePackages={availablePackages}
          onPlanSelect={setSelectedPlan}
          onFacadeSelect={setSelectedFacade}
          onPackageSelect={setSelectedPackage}
          onPropertyUpdate={handlePropertyUpdate}
        />

        <div className="flex flex-1">
          <div className="w-64">
            <CategorySidebar
              categories={categoryData}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          <ItemsPanel
            category={getCurrentCategory()}
            onItemQuantityChange={handleItemQuantityChange}
            onItemAdd={handleItemAdd}
          />
        </div>

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
    </ConfigProvider>
  );
}

export default App;
