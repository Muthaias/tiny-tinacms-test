import * as React from "react";
import {useMemo, useState, useEffect} from "react";
import * as ReactDOM from "react-dom";
import {TinaProvider, useForm, TinaCMS, useCMS, FormOptions, ActionButton, usePlugins, usePlugin} from "tinacms";
import {cmsFromStores} from "./modules/cms";

import {Main} from "./modules/main";
import {LocalStorageStore, DataStore, Entry, Post, Author} from "./modules/datastore";

const CMSProvider: React.FunctionComponent<{init: () => TinaCMS, children}> = (props) => {
    const cms = useMemo(props.init, []);

    return (
        <TinaProvider cms={cms}>
            {React.Children.toArray(props.children)}
        </TinaProvider>
    );
}

function createPostsFields(posts: {label: string, value: string}[] = []) {
    return [
        {
            label: "Posts",
            name: "posts",
            component: "group-list",
            description: "A list of posts",
            itemProps: item => ({
                id: item.id || item.key,
                key: item.id || item.key,
                label: item.title,
            }),
            defaultItem: () => ({
                title: "New post",
                content: "",
                key: "__post:" + Date.now(),
            }),
            fields: [{
                label: "Title",
                name: "title",
                component: "text",
            }],
        },
        {
            label: "Select post",
            name: "postId",
            component: "select",
            options: posts
        }
    ];
}

function createAuthorsFields() {
    return [
        {
            label: "Authors",
            name: "authors",
            component: "group-list",
            description: "A list of authors",
            itemProps: item => ({
                key: item.id || item.key,
                label: item.name,
            }),
            defaultItem: () => ({
                name: "Unknown author",
                content: "",
                key: "__post:" + Date.now(),
            }),
            fields: [
                {
                    label: "Name",
                    name: "name",
                    component: "text",
                },
            ],
        }
    ];
}

const Application: React.FunctionComponent = () => {
    const cms = useCMS();
    const postsApi: DataStore<Post> = cms.api.posts;
    const authorsApi: DataStore<Author> = cms.api.authors;
    const postFormOptions: FormOptions<{posts: (Entry & Post)[], postId: string}> = {
        id: "__posts",
        label: "Posts",
        fields: createPostsFields(),
        loadInitialValues: () => Promise.resolve({
            posts: postsApi.entries.sort((a, b) => a.index - b.index),
            postId: null,
        }),
        onSubmit: ({posts}) => {
            const removals = postsApi.entries.filter(
                entry => !posts.some(p => p.id === entry.id)
            ).map(
                (entry) => postsApi.remove(entry)
            );
            const updates = posts.map((post, index) => {
                if (post.id) {
                    return postsApi.update({
                        id: post.id,
                        title: post.title,
                        index: index,
                    });
                } else {
                    return postsApi.add({
                        title: post.title,
                        type: "basic",
                        content: "",
                        index: index,
                    });
                }
            });
            return Promise.all<any>([
                ...removals,
                ...updates,
            ]);
        } 
    }
    const authorFormOptions: FormOptions<{authors: (Entry & Author)[]}> = {
        id: "__authors",
        label: "Authors",
        fields: createAuthorsFields(),
        loadInitialValues: () => Promise.resolve({
            authors: authorsApi.entries.sort((a, b) => a.index - b.index),
        }),
        onSubmit: ({authors}) => {
            const removals = authorsApi.entries.filter(
                entry => !authors.some(p => p.id === entry.id)
            ).map(
                (entry) => authorsApi.remove(entry)
            );
            const updates = authors.map((author, index) => {
                if (author.id) {
                    return authorsApi.update({
                        id: author.id,
                        name: author.name,
                        index: index,
                    });
                } else {
                    return authorsApi.add({
                        name: author.name,
                        index: index,
                    });
                }
            });
            return Promise.all<any>([
                ...removals,
                ...updates,
            ]);
        } 
    }
    const [{posts, postId}, postForm] = useForm<{posts: (Entry & Post)[], postId: string}>(postFormOptions);
    const [{authors}, authorForm] = useForm<{authors: (Entry & Author)[], postId: string}>(authorFormOptions);
    usePlugins(postForm);
    usePlugin(authorForm);
    useEffect(() => {
        if (posts !== undefined) {
            postForm.updateFields(
                createPostsFields(posts.filter(post => !!post.id).map(post => ({value: post.id, label: post.title})))
            );
        }
    }, [posts]);
    return (
        <div className="application">
            {postId !== undefined && <Main postId={postId}/>}
        </div>
    );
}

ReactDOM.render(
    <CMSProvider
        init={() => cmsFromStores(
            new LocalStorageStore<Post>("__posts"),
            new LocalStorageStore<Author>("__authors")
        )}
    >
        <Application />
    </CMSProvider>,
    document.getElementById("app")
);
