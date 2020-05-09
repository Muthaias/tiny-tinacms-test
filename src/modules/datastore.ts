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

export type Post = {
    title: string;
    type: string;
    content: string;
    author?: string;
    imageUrl?: string;
    index?: number,
}

export type Author = {
    name: string;
    index?: number;
}

export class LocalStorageStore<T> implements DataStore<T> {
    private _targetId: string;
    private _cache: Map<string, Entry & T> = new Map<string, Entry & T>();
    private _cacheTime: string = "__nocache";
    private _listeners: ((store: DataStore<T>) => void)[] = [];
    private _triggerPromise: Promise<any> | null = null;

    constructor(targetId: string) {
        this._targetId = targetId;
    }

    public get entries(): (Entry & T)[] {
        return Array.from(this._map.values());
    }

    async get(entry: Entry): Promise<Entry & T> {
        const e = this._map.get(entry.id);
        if (e === undefined) throw new Error("No entry with id: " + entry.id);
        return e;
    }

    async add(data: T): Promise<Entry & T> {
        const entry: Entry & T = {
            ...data,
            id: this._targetId + ":" + Date.now(),
            index: this._map.size,
        }
        this._map.set(entry.id, entry);
        this._entries = this.entries;
        return entry;
    }

    async update(entry: Entry & Partial<T>) {
        const oldEntry = await this.get(entry);
        const newEntry: Entry & T = {
            ...oldEntry,
            ...entry
        } as unknown as Entry & T;
        this._map.set(entry.id, newEntry);
        this._entries = this.entries;
    }

    async remove(entry: Entry) {
        this._map.delete(entry.id);
        this._entries = this.entries;
    }

    onChange(update: (store: DataStore<T>) => void) {
        this.offChange(update);
        this._listeners.push(update);
    }

    offChange(update: (store: DataStore<T>) => void) {
        this._listeners = this._listeners.filter(l => l !== update);
    }

    private get _map(): Map<string, Entry & T> {
        if (this._cache && this._cacheTime === window.localStorage.getItem(this._targetId + "cache_time")) {
            return this._cache;
        }
        this._cache = this._entries.reduce((acc, value) => {
            acc.set(value.id, value);
            return acc;
        }, new Map<string, Entry & T>());
        this._cacheTime = Date.now() + "";
        window.localStorage.setItem(this._targetId + "cache_time", this._cacheTime);
        return this._cache;
    }

    private set _entries(data: (Entry & T)[]) {
        window.localStorage.setItem(this._targetId, JSON.stringify(data));
        if (!this._triggerPromise) {
            this._triggerPromise = Promise.resolve().then(() => {
                this._listeners.forEach(l => l(this));
                this._triggerPromise = null;
            });
        }
    }

    private get _entries(): (Entry & T)[] {
        return JSON.parse(window.localStorage.getItem(this._targetId) || "[]");
    }
}