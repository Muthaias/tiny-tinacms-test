import {useEffect} from "react";
import {DataStore, Entry} from "./datastore";

export function useStoreUpdate<T>(
    store: DataStore<T>,
    callback: (store: DataStore<T>) => void,
    deps: any[],
) {
    useEffect(() => {
        store.onChange(callback);
        return () => store.offChange(callback);
    }, [store, ...deps]);
}

export function requireEntryId(entry: Partial<Entry>): string {
    if (entry.id === undefined) throw new Error("No id on enty: " + JSON.stringify(entry));
    return entry.id;
}