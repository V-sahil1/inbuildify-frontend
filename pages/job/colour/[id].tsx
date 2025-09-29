import StageProgress from "@/components/common/StageProgress";
import ColorFilter from "@/components/job/jobDetail/ColorFilter";
import { ColorItemCard } from "@/components/job/jobDetail/ColorItemCard";
import ColorSideMenu from "@/components/job/jobDetail/ColorSideMenu";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { fetchColourSubCategoryItems } from "@redux/feature/color/colorThunk";
import { toggleExpandColourCategoryItem } from "@redux/feature/color/ColourSlice";
import { Button, message, Select } from "antd";
import { ColorItemList } from "data/sampleData";
import React, { useState } from "react";
 
const Index = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    ""
  ); 
  const [isGridView, setIsGridView] = useState(true);
  const { ColorCategory } = useAppSelector((state) => state.colour);
  const [subCategoryItem, setSubCategoryItem] = useState([]);

  const dispatch = useAppDispatch();
  const handleSubCategoryExpand = async (selectedSubCategory: {
    categoryId: string;
    subCategoryId: string;
  }) => {
    setSelectedSubCategory(selectedSubCategory.subCategoryId);
    const category = ColorCategory.find(
      (item) => item.colorCategoryId === selectedSubCategory.categoryId
    );
    const subCategory = category?.subCategories.find(
      (item) => item.colorSubCategoryId === selectedSubCategory.subCategoryId
    );

    if (!subCategory) return;

    if (!subCategory?.isExpanded) {
      try {
        dispatch(
          toggleExpandColourCategoryItem({
            colorSubCategoryId: subCategory.colorSubCategoryId,
            colorCategoryId: subCategory.colorCategoryId,
          })
        );

        const response = await dispatch(
          fetchColourSubCategoryItems({
            colorSubCategoryId: subCategory.colorSubCategoryId,
            colorCategoryId: subCategory.colorCategoryId,
          })
        ).unwrap();
        setSubCategoryItem(response?.data?.colorItems || []);
      } catch (error) {
        message.error(error || "Failed to fetch colour sub category");
      }
    } else {
      setSubCategoryItem(subCategory?.items);
    }
  };

  const addedCount = ColorItemList.map(
    (item) => item.items.filter((item) => item.isAdded).length
  ).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="grid grid-cols-[250px_1fr]">
        <div className="p-3">
          <StageProgress
            id="MH-001"
            title="Colors"
            status="In Progress"
            steps={[]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3">
            <h6>Murthy</h6>
            <p>Lot 300 Tallis Road, VIC , 3030</p>
          </div>
          <div className="p-3">
            {/* Chose Range */}
            <Select
              placeholder="Select Range"
              allowClear
              options={[
                { value: "Range 1", label: "Range 1" },
                { value: "Range 2", label: "Range 2" },
                { value: "Range 3", label: "Range 3" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Colors Filter */}
      <div className="py-3">
        <ColorFilter
          selectedCount={Number(addedCount)}
          onSearch={(val) => console.log("Search:", val)}
          imageInPdf={true}
          onImageInPdfChange={(val) => console.log("Image in pdf:", val)}
          price={true}
          onPriceChange={(val) => console.log("Price:", val)}
          activeTab="all"
          onTabChange={(tab) => console.log("Tab changed:", tab)}
          suppliers={[
            { key: "1", label: "Supplier 1" },
            { key: "2", label: "Supplier 2" },
          ]}
          onSupplierSelect={(key) => console.log("Supplier selected:", key)}
          isGridView={isGridView}
          onToggleLayout={() => setIsGridView(!isGridView)}
        />
      </div>

      {/* side menu and items list */}
      <div className="grid grid-cols-[250px_1fr]">
        <div>
          <ColorSideMenu
            selectedKey={selectedSubCategory}
            onSelect={(key) => handleSubCategoryExpand(key)}
          />
        </div>
        <div className="p-3">
          <ColorItemCard data={subCategoryItem || []} isGridView={isGridView} />
        </div>
      </div>
      <div className="sticky bottom-0 left-0 w-full bg-[var(--card-color)] border-t p-3 z-50">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          {/* Left side buttons */}
          <div className="flex gap-3">
            <Button type="primary" onClick={() => console.log("Save clicked")}>
              Approve
            </Button>
            <Button onClick={() => console.log("Reset clicked")}>
              Preview
            </Button>
            <Button onClick={() => console.log("Export clicked")}>
              Create Template
            </Button>
            <Button onClick={() => console.log("Delete clicked")}>Email</Button>
            <Button onClick={() => console.log("Delete clicked")}>
              View Job
            </Button>
          </div>

          {/* Right side total amount */}
          <div className="text-lg font-semibold">Total Amount: $1234.56</div>
        </div>
      </div>
    </>
  );
};

export default Index;
