import * as React from "react";
import {useHistory} from "react-router-dom";
import {
    FormOptions,
} from "tinacms";
import {useForms} from "../../hacks/use-forms";
import {usePlugins} from "../../hacks/use-plugins";

import {
    Entry,
    Menu,
    MenuEntry,
    Utilities,
} from "../../modules/datastore";

import {
    MenuContext,
    MenuData,
} from "../../contexts";

import {useMenus} from "../../modules/cms";

export function useMenuForms(
    menuSpecs: {
        id: string,
        initialValues: Entry & Menu,
        onSubmit: (menuProps: Partial<(Entry & Menu)>) => Promise<void>,
    }[],
    label: string = "Menu content",
): {[id: string]: (Entry & Menu)} {
    const formGroup = React.useMemo(() => menuSpecs.map(({id, initialValues, onSubmit}) => {
        const formOptions: FormOptions<Entry & Menu> = {
            id: "__menu:" + id,
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
            initialValues: initialValues,
            onSubmit: onSubmit
        };
        return formOptions;
    }), [menuSpecs]);

    const [menus, menuForms] = useForms<Entry & Menu>(formGroup.map(fg => ({options: fg, watch: {}})));
    usePlugins(menuForms);
    return menuSpecs.reduce((acc, spec, index) => ({
        ...acc,
        [spec.id]: menus[index]
    }), {});
}

export type MenuProviderProps = {
    children: any;
};

export const TinaMenuProvider: React.SFC<MenuProviderProps> = ({children}) => {
    const history = useHistory();
    const menusApi = useMenus();
    const [menuSelect, menuIds] = Utilities.useMenuStore(menusApi);
    const menuSpecs = React.useMemo(() => menuIds.map(id => ({
        id,
        initialValues: menuSelect(id),
        onSubmit: async (updatedMenu) => {
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
    })), [menuIds, menuSelect]);
    console.log(menuIds);
    const menus = useMenuForms(menuSpecs);
    const menuCallback = React.useCallback((id: string) => {
        const menuContent = menus[id] || menuSelect(id);
        return menuContent ? {
            items: menuContent.entries.map((entry, index) => ({
                key: entry.name + ":" + index,
                label: entry.name,
                onClick: () => entry.link && history.push(entry.link),
            })),
        } : {items: []}
    }, [menus, menuSelect]);
    return (
        <MenuContext.Provider value={menuCallback}>
            {React.Children.toArray(children)}
        </MenuContext.Provider>
    );
}