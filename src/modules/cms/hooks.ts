import {useCMS} from "@tinacms/toolkit";

import {
    EntryStore,
    DataSearch,
    Post,
    Author,
    Menu,
    Entry,
} from "../datastore";

function assertApi<T>(id: string): T {
    const cms = useCMS();
    const api: T = cms.api[id];
    if (!api) throw new Error("Api with id '" + id + "' is not available");
    return api;
}

export function usePosts(): EntryStore<Post> {
    return assertApi<EntryStore<Post>>("posts");
}

export function usePages(): EntryStore<Post> {
    return assertApi<EntryStore<Post>>("pages");
}

export function useAuthors(): EntryStore<Author> {
    return assertApi<EntryStore<Author>>("author");
}

export function useMenus(): EntryStore<Menu> & DataSearch<Entry & Menu> {
    return assertApi<EntryStore<Menu> & DataSearch<Entry & Menu>>("menu");
}