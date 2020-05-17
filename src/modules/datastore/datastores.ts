export class StaticDataStore<T> {
    private _data: T;
    constructor(data: T) {
        this._data = data;
    }

    async load(): Promise<T> {
        return this._data;
    }

    async store(_: T): Promise<void> {}
}

export class StaticWebDataStore<T> {
    private _path: string;
    private _defaultData: T;
    private _transform: ((data: any) => T) | null = null;

    constructor(path: string, defaultData: T, transform?: (data: any) => T) {
        this._path = path;
        this._defaultData = defaultData;
        this._transform = transform || null;
    }

    async load(): Promise<T> {
        try {
            const response = await fetch(this._path);
            const data = await response.json();
            return this._transform ? this._transform(data) : data;
        } catch (e) {
            console.warn(e);
            return this._defaultData;
        }
    }

    async store(_: T): Promise<void> {}
}

export class LocalStorageDataStore<T> {
    private _targetId: string;
    private _defaultData: T;

    constructor (targetId: string, defaultData: T) {
        this._targetId = targetId;
        this._defaultData = defaultData;
    }

    async load(): Promise<T> {
        const serializedData = window.localStorage.getItem(this._targetId);
        return serializedData ? JSON.parse(serializedData) : this._defaultData;
    }

    async store(data: T): Promise<void> {
        window.localStorage.setItem(this._targetId, JSON.stringify(data));
    }
}