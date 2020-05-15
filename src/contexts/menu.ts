import * as React from "react";

export interface MenuData {
    items: MenuItem[];
}

export interface MenuItem {
    label: string;
    key: string;
    icon?: string;
    onClick?: () => void;
}

export const MenuContext = React.createContext<MenuData>({
    items: [],
});

export function useMenu() {
    return React.useContext(MenuContext);
}