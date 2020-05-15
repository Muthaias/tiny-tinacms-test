import {useCMS} from "tinacms";

import {DataStore, Post, Author} from "./datastore";

function assertApi<T>(id: string): T {
    const cms = useCMS();
    const api: T = cms.api[id];
    if (!api) throw new Error("Api with id '" + id + "' is not available");
    return api;
}

export function usePosts(): DataStore<Post> {
    return assertApi<DataStore<Post>>("posts");
}

export function usePages(): DataStore<Post> {
    return assertApi<DataStore<Post>>("pages");
}

export function useAuthors(): DataStore<Author> {
    return assertApi<DataStore<Author>>("author");
}