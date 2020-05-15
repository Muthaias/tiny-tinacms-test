import * as React from "react";
import {
    useCMS,
    useScreenPlugin,
} from "tinacms";
import {useHistory} from "react-router-dom";

import {
    usePosts,
    usePages,
} from "../../modules/cms";
import {Entry, Post} from "../../modules/datastore";
import {useEntrySelection} from "./entry-selection";

export const PostSelector: React.SFC = () => {
    const postsApi = usePosts();
    const history = useHistory();
    const entrySelection = useEntrySelection<Entry & Post>("Post selection", {
        getEntries: async (start: number, end: number) => {
            return postsApi.entries.slice(start, end).map(post => ({
                label: post.title,
                entry: post,
            }));
        },
        count: async () => postsApi.entries.length,
        viewEntry: (entry) => {
            history.push("/post/" + entry.entry.id);
        },
        removeEntry: async () => {},
    }, 5);
    useScreenPlugin(entrySelection);
    return <></>
}

export const PageSelector: React.SFC = () => {
    const pagesApi = usePages();
    const history = useHistory();
    const entrySelection = useEntrySelection<Entry & Post>("Page selection", {
        getEntries: async (start: number, end: number) => {
            return pagesApi.entries.slice(start, end).map(page => ({
                label: page.title,
                entry: page,
            }));
        },
        count: async () => pagesApi.entries.length,
        viewEntry: (entry) => {
            history.push("/page/" + entry.entry.id);
        },
        removeEntry: async () => {},
    }, 5);
    useScreenPlugin(entrySelection);
    return <></>
}