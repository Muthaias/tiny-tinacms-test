import {Entry, EntryStore, DataStore} from "./datastore";
import {DataSearch, SearchQuery, QueryDescriptor} from "./datasearch";
import {StaticDataStore, LocalStorageDataStore, StaticWebDataStore} from "./datastores";

export class GenericEntryStore<T> implements EntryStore<T>, DataSearch<T, SearchQuery<keyof T>> {
    private _idPrefix: string;
    private _map: Map<string, Entry & T> | null = null;
    private _listeners: ((store: EntryStore<T>) => void)[] = [];
    private _triggerPromise: Promise<any> | null = null;
    private _store: DataStore<(Entry & T)[]>;

    constructor(idPrefix: string, store: DataStore<(Entry & T)[]>) {
        this._store = store;
        this._idPrefix = idPrefix;
    }

    public static fromTargetId<E>(targetId: string) {
        return new GenericEntryStore<E>(
            targetId,
            new LocalStorageDataStore<(Entry & E)[]>(targetId, []),
        );
    }

    public static fromData<E>(targetId: string, data: (Entry & E)[] = []) {
        return new GenericEntryStore<E>(
            targetId,
            new StaticDataStore<(Entry & E)[]>(data),
        );
    }

    public static fromWebData<E>(targetId: string, path: string, transform?: (data: any) => (Entry & E)[]) {
        return new GenericEntryStore<E>(
            targetId,
            new StaticWebDataStore<(Entry & E)[]>(path, [], transform),
        );
    }

    public async search(query: SearchQuery<keyof T>) {
        const map = await this._loadMap();
        const entries = Array.from(map.values());
        return Promise.resolve(
            this._search(entries, query)
        );
    }

    public async first(query: SearchQuery<keyof T>) {
        const result = await this.search(query);
        return Promise.resolve(result[0]);
    }

    public availableQueries() {
        const queries: QueryDescriptor<SearchQuery<keyof T>>[] = [
            {type: "or"},
            {type: "and"},
            {type: "property"},
        ];
        return Promise.resolve(queries);
    }

    private _search(entries: (Entry & T)[], query: SearchQuery<keyof T>) {
        switch (query.type) {
            case "or":
                return entries.filter(entry => query.queries.some(q => this._search([entry], q).length > 0));
            case "and":
                return query.queries.reduce((acc, q) => this._search(acc, q), entries);
            case "property":
                return entries.filter(entry => query.partial ? (
                        String(entry[query.propertyId]).match(query.criteria)
                    ) : (
                        String(entry[query.propertyId]) === query.criteria
                    )
                );
        }
    }

    async get(entry: Entry): Promise<Entry & T> {
        const map = await this._loadMap();
        const e = map.get(entry.id);
        if (e === undefined) throw new Error("No entry with id: " + entry.id);
        return e;
    }

    async getEntries(offset: number = 0, count?: number): Promise<(Entry & T)[]> {
        const map = await this._loadMap();
        const entries = Array.from(map.values());
        const start = Math.min(offset, entries.length);
        const finalCount = count === undefined ? entries.length : count;
        const end = Math.min(offset + finalCount, entries.length);
        return entries.slice(start, end);
    }

    async add(data: T): Promise<Entry & T> {
        const map = await this._loadMap();
        const entry: Entry & T = {
            ...data,
            id: this._idPrefix + ":" + Date.now(),
            index: map.size,
        }
        map.set(entry.id, entry);
        this._save(map);
        return entry;
    }

    async update(entry: Entry & Partial<T>) {
        const oldEntry = await this.get(entry);
        const newEntry: Entry & T = {
            ...oldEntry,
            ...entry
        } as unknown as Entry & T;
        const map = await this._loadMap();
        map.set(entry.id, newEntry);
        this._save(map);
    }

    async remove(entry: Entry) {
        const map = await this._loadMap();
        map.delete(entry.id);
        this._save(map);
    }

    onChange(update: (store: EntryStore<T>) => void) {
        this.offChange(update);
        this._listeners.push(update);
    }

    offChange(update: (store: EntryStore<T>) => void) {
        this._listeners = this._listeners.filter(l => l !== update);
    }

    private _save(map: Map<string, Entry & T>) {
        this._store.store(Array.from(map.values()));
        if (!this._triggerPromise) {
            this._triggerPromise = Promise.resolve().then(() => {
                this._listeners.forEach(l => l(this));
                this._triggerPromise = null;
            });
        }
    }

    private async _loadMap(): Promise<Map<string, Entry & T>> {
        if (!this._map) {
            const data = await this._store.load();
            this._map = data.reduce((acc, value) => {
                acc.set(value.id, value);
                return acc;
            }, new Map<string, Entry & T>());
        }
        return this._map;
    }
}