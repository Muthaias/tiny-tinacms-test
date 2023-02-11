import * as React from "react";
import {useHistory} from "react-router-dom";
import {
    FormOptions,
    useForm,
    usePlugin,
} from "@tinacms/toolkit";

import {
    Entry,
    Menu,
    MenuEntry,
} from "../../modules/datastore";

import {
    MenuContext,
    MenuData,
} from "../../contexts";

import {useMenus} from "../../modules/cms";

export function useMenuForm(
    menuId: string,
    loadInitialValues: () => Promise<Entry & Menu>,
    onSubmit: (menuProps: Partial<Entry & Menu>) => Promise<void>,
    label: string = "Menu content",
): Entry & Menu {
    const formOptions: FormOptions<Entry & Menu> = {
        id: "__menu:" + menuId,
        label: label,
        fields: [
            {
                label: "Name",
                name: "name",
                component: "text",
            },
            {
                label: "Link",
                name: "link",
                component: "text",
            },
            {
                label: "Menu items",
                name: "entries",
                component: "group-list",
                description: "A list of menu items",
                itemProps: (item) => ({
                    key: item.key,
                    label: item.name,
                }),
                defaultItem: () => ({
                    name: "New item",
                    key: "__item:" + Date.now(),
                }),
                fields: [
                    {
                        label: "Name",
                        name: "name",
                        component: "text",
                    },
                    {
                        label: "Link",
                        name: "link",
                        component: "text",
                    },
                ],
            },
            {
                label: "Tags",
                name: "tags",
                component: "group-list",
                description: "A list of menu tags",
                itemProps: item => ({
                    key: item._key,
                    label: item.name,
                }),
                defaultItem: () => ({
                    name: "New tag",
                    key: "__tag:" + Date.now(),
                }),
                fields: [
                    {
                        label: "Name",
                        name: "name",
                        component: "text",
                    },
                ],
            }
        ],
        loadInitialValues: loadInitialValues,
        onSubmit: onSubmit
    };
    const [menu, menuForm] = useForm<Entry & Menu>(formOptions);
    usePlugin(menuForm);
    return menu;
}

export type MenuProviderProps = {
    menuId?: string;
    children: any;
};

export const TinaMenuProvider: React.FunctionComponent<MenuProviderProps> = ({menuId, children}) => {
    const history = useHistory();
    const menusApi = useMenus();
    const menu = useMenuForm(
        menuId || "__no_menu",
        async () => {
            const selectedMenu = menuId !== undefined ? await menusApi.first({
                type: "property",
                propertyId: "name" as "name",
                criteria: menuId,
            }) : undefined;
            return selectedMenu || {
                id: "",
                name: menuId || "",
                entries: [],
                tags: [],
            };
        },
        async (updatedMenu) => {
            if (updatedMenu.id) {
                menusApi.update({
                    id: updatedMenu.id,
                    ...updatedMenu
                });
            } else {
                menusApi.add({
                    name: updatedMenu.name || "",
                    entries: updatedMenu.entries || [],
                    tags: updatedMenu.tags || [],
                });
            }
        }
    );
    const menuData: MenuData | null = menu && menu.entries ? {
        items: menu.entries.map((entry, index) => ({
            label: entry.name,
            key: entry.name + "-" + index,
            onClick: entry.link ? (
                () => entry.link && history.push(entry.link)
            ) : undefined,
        })),
    } : {
        items: []
    };
    return (
        <MenuContext.Provider value={menuData}>
            {React.Children.toArray(children)}
        </MenuContext.Provider>
    );
}