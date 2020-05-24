import * as React from "react";
import {Entry, DataStream} from "./datastore";
import {Menu} from "./types";

export function requireEntryId(entry: Partial<Entry>): string {
    if (entry.id === undefined) throw new Error("No id on enty: " + JSON.stringify(entry));
    return entry.id;
}

export function useMenuStore(stream: DataStream<Menu>): [(id: string) => Entry & Menu, string[]] {
    const [menuMap, dispatchMenuMap] = React.useReducer<React.Reducer<{[id: string]: Entry & Menu | undefined}, {id: string, entry: Entry & Menu}>>((state, action) => {
        const newState = {
            ...state,
            [action.id]: action.entry
        };
        return newState;
    }, {});
    const loadRef = React.useRef<{[x: string]: boolean}>({});
    const menu = React.useCallback((id: string): Entry & Menu => {
        const m = menuMap[id];

        if (!m && !loadRef.current[id]) {
            loadRef.current[id] = true;
            stream.first({
                type: "property",
                propertyId: "name" as "name",
                criteria: id,
            }).then((loadedMenu) => {
                dispatchMenuMap({id: id, entry: loadedMenu});
            })
        }

        return m || {
            id: "__no_menu",
            name: id,
            entries: [],
            tags: [],
        };
    }, [menuMap, stream]);
    const loadedMenuIds = React.useMemo(() => Object.keys(menuMap), [menuMap]);
    return [menu, loadedMenuIds];
}