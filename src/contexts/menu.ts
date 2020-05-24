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

export const MenuContext = React.createContext<(id: string) => MenuData>((id: string) => ({
    items: [],
}));

export function useMenu(id: string = "Main") {
    const menu = React.useContext(MenuContext);
    return menu(id);
}