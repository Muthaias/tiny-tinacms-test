import * as React from "react";
import {useCallback, useEffect} from "react";
import {useForm, useCMS, FormOptions, usePlugins, useScreenPlugin} from "tinacms";

import {Main} from "./main";
import {useStoreUpdate, submitEntries, requireEntryId} from "./store-utilitites";
import {createAuthorsFields, createPostsFields} from "../layouts";

import {DataStore, Entry, Post, Author} from "./datastore";
import {useEntrySelection} from "./entry-selection";

function sortEntries<T>(entries: T & {index?: number}[]) {
    return entries.sort((a, b) => (a.index || 0) - (b.index || 0));
}

export const Application: React.FunctionComponent = () => {
    const cms = useCMS();
    const [postId, setPostId] = React.useState<string | null>(null);
    const postsApi: DataStore<Post> = cms.api.posts;
    const authorsApi: DataStore<Author> = cms.api.authors;
    const entrySelection = useEntrySelection<Entry & Post>("Post selection", {
        getEntries: async (start: number, end: number) => {
            return postsApi.entries.slice(start, end).map(post => ({
                label: post.title,
                entry: post,
            }));
        },
        count: async () => postsApi.entries.length,
        viewEntry: (entry) => {
            setPostId(entry.entry.id);
        },
        removeEntry: async () => {},
    }, 5);
    useScreenPlugin(entrySelection);
    const postFormOptions: FormOptions<{posts: (Entry & Post)[]}> = {
        id: "__posts",
        label: "Posts",
        fields: createPostsFields(),
        loadInitialValues: () => Promise.resolve({
            posts: sortEntries(postsApi.entries),
        }),
        onSubmit: submitEntries<Post, {posts: (Entry & Post)[]}>(
            postsApi,
            (post, index) => ({
                title: post.title || "",
                type: "basic",
                content: "",
                author: post.author,
                index: index,
            }),
            (post, index) => ({
                id: requireEntryId(post),
                title: post.title,
                author: post.author,
                index: index,
            }),
            ({posts}) => posts
        )
    };
    const authorFormOptions: FormOptions<{authors: (Entry & Author)[]}> = {
        id: "__authors",
        label: "Authors",
        fields: createAuthorsFields(),
        loadInitialValues: () => Promise.resolve({
            authors: sortEntries(authorsApi.entries),
        }),
        onSubmit: submitEntries<Author, {authors: (Entry & Author)[]}>(
            authorsApi,
            (author, index) => ({
                name: author.name || "",
                index: index,
            }),
            (author, index) => ({
                id: requireEntryId(author),
                name: author.name,
                index: index,
            }),
            ({authors}) => authors
        )
    };
    const [{posts}, postForm] = useForm<{posts: (Entry & Post)[]}>(postFormOptions);
    const [{authors}, authorForm] = useForm<{authors: (Entry & Author)[]}>(authorFormOptions);
    usePlugins([postForm, authorForm]);

    return (
        <div className="application">
            {postId !== undefined && <Main postId={postId}/>}
        </div>
    );
}