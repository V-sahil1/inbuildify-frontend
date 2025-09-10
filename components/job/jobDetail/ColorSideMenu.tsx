import React, { useState } from "react";
import { Menu, MenuProps } from "antd";

export interface SidebarMenuItem {
    key: string;
    label: string;
    children?: SidebarMenuItem[]; // for nested menus
}

interface ColorSideMenuProps {
    items: MenuProps['items'];
    onSelect?: (key: string) => void;
    selectedKey?: string;
}

const ColorSideMenu: React.FC<ColorSideMenuProps> = ({ items, onSelect, selectedKey }) => {
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
        const latestKey = keys.find((key) => !openKeys.includes(key));
        setOpenKeys(latestKey ? [latestKey] : []);
    };
    return (
        <Menu
            mode="inline"
            onClick={({ key }) => onSelect && onSelect(key)}
            items={items}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            selectedKeys={[selectedKey]}
        />
    );
};

export default ColorSideMenu;
