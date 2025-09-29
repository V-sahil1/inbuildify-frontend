import React, { useEffect, useState } from "react";
import { Menu, MenuProps, message } from "antd";
import {SubCategory } from "@redux/feature/color/iColourState";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import {
  fetchColourCategory,
  fetchColourSubCategory,
} from "@redux/feature/color/colorThunk";
import { toggleExpandColourCategory } from "@redux/feature/color/ColourSlice";
import { Status } from "@lib/constants/enum";
import Loading from "@/components/common/Loading";

export interface SidebarMenuItem {
    key: string;
    label: string;
    children?: SubCategory[]; 
}

interface ColorSideMenuProps {
    onSelect?: (data: { categoryId: string, subCategoryId: string }) => void;
    selectedKey?: string;
}

const ColorSideMenu: React.FC<ColorSideMenuProps> = ({onSelect, selectedKey}) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [loadingKeys, setLoadingKeys] = useState<string[]>([]); 
  const dispatch = useAppDispatch();
  const { ColorCategory, status } = useAppSelector((state) => state.colour);
  const fetchColourCategoryData = async () => {
    try {
      await dispatch(fetchColourCategory()).unwrap();
    } catch (error) {
      message.error(error || "Failed to fetch colour category");
    }
  };
  useEffect(() => {
    if (status === Status.IDLE) {
      fetchColourCategoryData();
    }
  }, [status]);
  const handleColorCategoryExpand = async (
    colorCategoryId: string,
    isExpanded: boolean
  ) => {
    if (!isExpanded) {
      try {
        setLoadingKeys((prev) => [...prev, colorCategoryId]); 
        dispatch(toggleExpandColourCategory(colorCategoryId));
        await dispatch(fetchColourSubCategory(colorCategoryId)).unwrap();
      } catch (error: any) {
        message.error(error || "Failed to fetch colour sub category");
      } finally {
        setLoadingKeys((prev) => prev.filter((k) => k !== colorCategoryId));  
      }
    }
  };
  const onOpenChange: MenuProps["onOpenChange"] = async (keys) => {
    const latestKey = keys.length > 0 ? keys[keys.length - 1] : null;
    setOpenKeys(keys);
    if (latestKey) {
      const item = ColorCategory.find((item) => item.colorCategoryId === latestKey);
      if (item) {
        handleColorCategoryExpand(latestKey, item.isExpanded);
      }
    }
  };

  const menuItems = ColorCategory.map((cat) => {
    if (loadingKeys.includes(cat.colorCategoryId)) {
      return {
        key: cat?.colorCategoryId,
        label: cat?.name,
        children: [
          {
            key: `${cat?.colorCategoryId}-loading`,
            label: (
              <div className="flex justify-center">
                <Loading type="primary" />
              </div>
            ),
            disabled: true,
          },
        ],
      };
    }

    return {
      key: cat?.colorCategoryId,
      label: cat?.name,
    children: cat?.subCategories?.map((sub) => ({
      key: sub?.colorSubCategoryId,
      label: sub?.name,
    })),
    };
  });

    return (
        <Menu
            mode="inline"
            onClick={({ key, keyPath }) => {

        if (keyPath.length === 2) {
          const subCategoryId = keyPath[0];
          const categoryId = keyPath[1];   
          onSelect?.({ categoryId, subCategoryId });
        }
      }}
            items={menuItems}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            selectedKeys={[selectedKey]}
        />
    );
};

export default ColorSideMenu;
