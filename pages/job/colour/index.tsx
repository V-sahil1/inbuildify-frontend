import StageProgress from "@/components/common/StageProgress";
import ColorFilter from "@/components/job/jobDetail/ColorFilter";
import { ColorItemCard } from "@/components/job/jobDetail/ColorItemCard";
import ColorSideMenu from "@/components/job/jobDetail/ColorSideMenu";
import { Button, Select } from "antd";
import { ColorItemList } from "data/sampleData";
import React, { useState } from "react";

const menuItems = [
    {
        key: "bricks",
        label: "BRICKS",
        children: [
            { key: "bricks-access", label: "Access Range" },
            { key: "bricks-domain", label: "Domain Range" },
            { key: "bricks-industrial", label: "Industrial" },
            { key: "bricks-melbourne", label: "Melbourne" },
            { key: "bricks-metallix", label: "Metallix" },
        ],
    },
    {
        key: "roof_tiles",
        label: "ROOF TILES",
        children: [
            { key: "roof-concrete", label: "Concrete Tiles" },
            { key: "roof-clay", label: "Clay Tiles" },
        ],
    },
    {
        key: "facade",
        label: "FACADE",
        children: [
            { key: "facade-modern", label: "Modern" },
            { key: "facade-traditional", label: "Traditional" },
            { key: "facade-hamptons", label: "Hamptons" },
        ],
    },
    {
        key: "fascia",
        label: "FASCIA, GUTTER & DOWNPIPES",
        children: [
            { key: "fascia-steel", label: "Steel" },
            { key: "fascia-aluminium", label: "Aluminium" },
        ],
    },
    {
        key: "windows",
        label: "WINDOWS AND FRAMES",
        children: [
            { key: "windows-white", label: "White" },
            { key: "windows-black", label: "Black" },
            { key: "windows-grey", label: "Grey" },
        ],
    },
    {
        key: "garage",
        label: "GARAGE DOOR",
        children: [
            { key: "garage-panel", label: "Panel Lift" },
            { key: "garage-roller", label: "Roller Door" },
        ],
    },
    {
        key: "driveway",
        label: "DRIVEWAY",
        children: [
            { key: "driveway-exposed", label: "Exposed Aggregate" },
            { key: "driveway-coloured", label: "Coloured Concrete" },
        ],
    },
    {
        key: "fence",
        label: "FENCE",
        children: [
            { key: "fence-timber", label: "Timber" },
            { key: "fence-colorbond", label: "Colorbond" },
        ],
    },
    {
        key: "letterbox",
        label: "LETTERBOX",
        children: [
            { key: "letterbox-standard", label: "Standard" },
            { key: "letterbox-modern", label: "Modern" },
        ],
    },
    {
        key: "doors",
        label: "DOORS",
        children: [
            { key: "doors-hinged", label: "Hinged" },
            { key: "doors-sliding", label: "Sliding" },
            { key: "doors-french", label: "French Doors" },
        ],
    },
    {
        key: "flooring",
        label: "FLOORING",
        children: [
            { key: "flooring-timber", label: "Timber" },
            { key: "flooring-laminate", label: "Laminate" },
            { key: "flooring-tile", label: "Tile" },
            { key: "flooring-carpet", label: "Carpet" },
        ],
    },
    {
        key: "tiling",
        label: "TILING",
        children: [
            { key: "tiling-wall", label: "Wall Tiles" },
            { key: "tiling-floor", label: "Floor Tiles" },
        ],
    },
    {
        key: "cabinet",
        label: "CABINET COLOURS",
        children: [
            { key: "cabinet-matte", label: "Matte" },
            { key: "cabinet-gloss", label: "Gloss" },
            { key: "cabinet-textured", label: "Textured" },
        ],
    },
];

const Index = () => {
    const [selectedCategory, setSelectedCategory] = useState(menuItems[0].children[0].key);
    // State to manage the view layout
    const [isGridView, setIsGridView] = useState(true);

    const filteredItems = ColorItemList.filter((item) => item.category === selectedCategory);
    const addedCount = ColorItemList.map((item) => item.items.filter((item) => item.isAdded).length).reduce((a, b) => a + b, 0);

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
                        items={menuItems}
                        selectedKey={selectedCategory}
                        onSelect={(key) => setSelectedCategory(key)}
                    />
                </div>
                <div className="p-3">
                    <ColorItemCard
                        data={filteredItems.length > 0 ? filteredItems[0].items : []}
                        isGridView={isGridView}
                    />
                </div>
            </div>
            <div className="sticky bottom-0 left-0 w-full bg-[var(--card-color)] border-t p-3 z-50">
                <div className="max-w-[1200px] mx-auto flex justify-between items-center">
                    {/* Left side buttons */}
                    <div className="flex gap-3">
                        <Button type="primary" onClick={() => console.log("Save clicked")}>Approve</Button>
                        <Button onClick={() => console.log("Reset clicked")}>Preview</Button>
                        <Button onClick={() => console.log("Export clicked")}>Create Template</Button>
                        <Button onClick={() => console.log("Delete clicked")}>Email</Button>
                        <Button onClick={() => console.log("Delete clicked")}>View Job</Button>
                    </div>

                    {/* Right side total amount */}
                    <div className="text-lg font-semibold">
                        Total Amount: $1234.56
                    </div>
                </div>
            </div>

        </>
    );
};

export default Index;