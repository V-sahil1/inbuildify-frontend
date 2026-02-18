import React, { useEffect, useState } from 'react';
import { Menu, MenuProps, message } from 'antd';
import { Category } from '@redux/feature/color/iColourState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllColour, fetchColourCategory } from '@redux/feature/color/colorThunk';
import { toggleExpandColourCategory } from '@redux/feature/color/ColourSlice';
import { Status } from '@lib/constants/enum';
import Loading from '@/components/common/Loading';
import NoDataMessage from '@/components/common/NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';

export interface SidebarMenuItem {
  key: string;
  label: string;
  children?: Category[];
}

interface ColorSideMenuProps {
  onSelect?: (data: { categoryId: string; subCategoryId: string }) => void;
  selectedKey?: string;
}

const ColorSideMenu: React.FC<ColorSideMenuProps> = ({ onSelect, selectedKey }) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [loadingKeys, setLoadingKeys] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { color, status } = useAppSelector(state => state.colour);
  const fetchColourCategoryData = async () => {
    try {
      await dispatch(fetchAllColour()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch colour category');
    }
  };
  useEffect(() => {
    if (status.color.fetch === Status.IDLE) {
      fetchColourCategoryData();
    }
  }, [status]);
  const handleColorCategoryExpand = async (colorId: string, isExpanded: boolean) => {
    if (!isExpanded) {
      try {
        setLoadingKeys(prev => [...prev, colorId]);
        dispatch(toggleExpandColourCategory(colorId));
        await dispatch(fetchColourCategory(colorId)).unwrap();
      } catch (error: any) {
        message.error(error || 'Failed to fetch colour sub category');
      } finally {
        setLoadingKeys(prev => prev.filter(k => k !== colorId));
      }
    }
  };
  const onOpenChange: MenuProps['onOpenChange'] = async keys => {
    const latestKey = keys.length > 0 ? keys[keys.length - 1] : null;
    setOpenKeys(keys);
    if (latestKey) {
      const item = color.find(item => item.colorId === latestKey);
      if (item) {
        handleColorCategoryExpand(latestKey, item.isExpanded);
      }
    }
  };

  const menuItems = color.map(cat => {
    if (loadingKeys.includes(cat.colorId)) {
      return {
        key: cat?.colorId,
        label: cat?.colorName,
        children: [
          {
            key: `${cat?.colorId}-loading`,
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
      key: cat?.colorId,
      label: cat?.colorName,
      children:
        cat?.colorCategories && cat.colorCategories.length > 0
          ? cat?.colorCategories?.map(sub => ({
              key: sub?.colorCategoryId,
              label: sub?.categoryName,
            }))
          : [
              {
                key: `${cat?.colorId}-empty`,
                label: (
                  <div className="w-full ml-[-80px]flex justify-center items-center">
                    <NoDataMessage label="Sub Category" link={SystemRoutes.SETTINGS_COLOUR} />
                  </div>
                ),
              },
            ],
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
