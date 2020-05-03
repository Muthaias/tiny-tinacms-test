import {useEffect} from "react";
import {DataStore, Entry} from "./datastore";

export function submitEntries<T, IT = {entries: (Partial<Entry & T>)[]}>(
    store: DataStore<T>,
    onAdd: (entry: Partial<T>, index: number) => T,
    onUpdate: (entry: Partial<Entry & T>, index: number) => Entry & Partial<T>,
    select: (input: IT) => (Partial<Entry & T>)[],
) {
    return (result: IT) => {
        const entries = select(result);
        const removals = store.entries.filter(
            entry => !entries.some(p => p.id === entry.id)
        ).map(
            (entry) => store.remove(entry)
        );
        const updates = entries.map((entry, index) => {
            if (entry.id) {
                return store.update(onUpdate(entry, index));
            } else {
                return store.add(onAdd(entry, index));
            }
        });
        return Promise.all<any>([
            ...removals,
            ...updates,
        ]);
    } 
}

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