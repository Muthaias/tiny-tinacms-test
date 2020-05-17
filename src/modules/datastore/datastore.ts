export interface EntryRead<T> {
    get(entry: Entry): Promise<Entry & T>;
    getEntries(offset?: number, count?: number): Promise<(Entry & T)[]>;
}

export interface EntryStore<T> extends EntryRead<T> {
    add(entry: T): Promise<Entry & T>;
    update(entry: Entry & Partial<T>): Promise<void>;
    remove(entry: Entry): Promise<void>;

    onChange(update: (store: EntryStore<T>) => void);
    offChange(update: (store: EntryStore<T>) => void);
}

export interface DataStore<T> {
    load(): Promise<T>;
    store(data: T): Promise<void>;
}

export type Entry = {
    id: string;
}