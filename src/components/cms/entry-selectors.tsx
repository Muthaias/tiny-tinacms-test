import * as React from "react";
import {
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
            const entries = await postsApi.getEntries(start, end - start);
            return entries.map(post => ({
                label: post.title,
                entry: post,
            }));
        },
        count: async () => (await postsApi.getEntries()).length,
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
            const entries = await pagesApi.getEntries(start, end - start);
            return entries.map(post => ({
                label: post.title,
                entry: post,
            }));
        },
        count: async () => (await pagesApi.getEntries()).length,
        viewEntry: (entry) => {
            history.push("/page/" + entry.entry.id);
        },
        removeEntry: async () => {},
    }, 5);
    useScreenPlugin(entrySelection);
    return <></>
}