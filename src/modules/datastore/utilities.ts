import * as React from "react";
import {Entry, DataStream} from "./datastore";
import {Menu} from "./types";

export function requireEntryId(entry: Partial<Entry>): string {
    if (entry.id === undefined) throw new Error("No id on enty: " + JSON.stringify(entry));
    return entry.id;
}

export function useMenuStore(stream: DataStream<Menu>, initialMenuIds: string[] = []): [(id: string) => Entry & Menu, string[]] {
    const [menuIds, setMenuIds] = React.useState<string[]>(initialMenuIds);
    const [menuMap, dispatchMenuMap] = React.useReducer<React.Reducer<{[id: string]: Entry & Menu | undefined}, {id: string, entry: Entry & Menu}>>((state, action) => {
        const newState = {
            ...state,
            [action.id]: action.entry
        };
        return newState;
    }, {});
    const justMounted = React.useRef(true);
    const newMenuIds = React.useMemo(() => [...menuIds], [menuIds]);
    const menu = React.useCallback((id: string): Entry & Menu => {
        const m = menuMap[id];

        if (!m && newMenuIds.indexOf(id) === -1) {
            if (justMounted.current === false) {
                setMenuIds([...newMenuIds, id]);
            } else {
                newMenuIds.push(id);
            }
        }

        return m || {
            id: "__no_menu",
            name: id,
            entries: [],
            tags: [],
        };
    }, [menuMap, newMenuIds]);
    React.useEffect(() => {
        (async () => {
            for (let menuId of menuIds) {
                console.log(menuId);
                if (!menuMap[menuId]) {
                    const m = await stream.first({
                        type: "property",
                        propertyId: "name" as "name",
                        criteria: menuId,
                    });
                    dispatchMenuMap({id: menuId, entry: m});
                }
            }
        })();
    }, [menuIds, menuMap, stream]);
    React.useEffect(() => {
        if (justMounted.current === true && JSON.stringify(newMenuIds) !== JSON.stringify(menuIds)) {
            setMenuIds(newMenuIds);
        }
        justMounted.current = false;
    }, [newMenuIds, menuIds, justMounted]);
    console.log(justMounted);
    const loadedMenuIds = React.useMemo(() => Object.keys(menuMap), [menuMap]);
    return [menu, loadedMenuIds];
}