export interface DataStore<T> {
    entries: (Entry & T)[];

    get(entry: Entry): Promise<Entry & T>;
    add(entry: T): Promise<Entry & T>;
    update(entry: Entry & Partial<T>): Promise<void>;
    remove(entry: Entry): Promise<void>;

    onChange(update: (store: DataStore<T>) => void);
    offChange(update: (store: DataStore<T>) => void);
}

export type Entry = {
    id: string;
}