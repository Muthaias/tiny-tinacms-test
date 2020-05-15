export interface BaseQuery<T> {
    type: T;
}

export interface OrQuery<Q extends BaseQuery<any>> extends BaseQuery<"or"> {
    queries: Q[];
}

export interface AndQuery<Q extends BaseQuery<any>> extends BaseQuery<"and"> {
    queries: Q[];
}

export interface PropertyQuery<T = string> extends BaseQuery<"property"> {
    propertyId: T;
    criteria: string;
}

export type SearchQuery<P = string> = (
    OrQuery<SearchQuery<P>> |
    AndQuery<SearchQuery<P>> |
    PropertyQuery<P>
);

export interface QueryDescriptor<T extends {type: any}> {
    type: T["type"],
}

export interface DataSearch<T, Q extends {type: any} = SearchQuery> {
    search(query: Q): Promise<T[]>;
    first(query: Q): Promise<T>;
    availableQueries(): Promise<QueryDescriptor<Q>[]>;
}

export type Entry = {
    id: string;
}