import * as React from "react";
import {useMemo, useCallback, useEffect} from "react";
import * as ReactDOM from "react-dom";
import {TinaProvider, useForm, TinaCMS, useCMS, FormOptions, usePlugins, usePlugin} from "tinacms";
import {cmsFromStores} from "./modules/cms";

import {Main} from "./modules/main";
import {LocalStorageStore, DataStore, Entry, Post, Author} from "./modules/datastore";
import {useStoreUpdate, submitEntries, requireEntryId} from "./modules/store-utilitites";
import {createAuthorsFields, createPostsFields} from "./layouts";

const CMSProvider: React.FunctionComponent<{init: () => TinaCMS, children}> = (props) => {
    const cms = useMemo(props.init, []);

    return (
        <TinaProvider cms={cms}>
            {React.Children.toArray(props.children)}
        </TinaProvider>
    );
}

const Application: React.FunctionComponent = () => {
    const cms = useCMS();
    const postsApi: DataStore<Post> = cms.api.posts;
    const authorsApi: DataStore<Author> = cms.api.authors;
    const postFormOptions: FormOptions<{posts: (Entry & Post)[], postId: string | null}> = {
        id: "__posts",
        label: "Posts",
        fields: createPostsFields(),
        loadInitialValues: () => Promise.resolve({
            posts: [],
            postId: null,
        }),
        onSubmit: submitEntries<Post, {posts: (Entry & Post)[], postId: string | null}>(
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
    }
    const authorFormOptions: FormOptions<{authors: (Entry & Author)[]}> = {
        id: "__authors",
        label: "Authors",
        fields: createAuthorsFields(),
        loadInitialValues: () => Promise.resolve({
            authors: [],
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
    }
    const [{posts, postId}, postForm] = useForm<{posts: (Entry & Post)[], postId: string}>(postFormOptions);
    const [{authors}, authorForm] = useForm<{authors: (Entry & Author)[], postId: string}>(authorFormOptions);
    usePlugins(postForm);
    usePlugin(authorForm);
    const updatePosts = useCallback((newPosts: (Entry & Post)[], newAuthors: (Entry & Author)[]) => {
        postForm.updateFields(
            createPostsFields(
                newPosts.sort((a, b) => (a.index || 0) - (b.index || 0)).map(post => ({value: post.id, label: post.title})),
                newAuthors.sort((a, b) => (a.index || 0) - (b.index || 0)).map(author => ({value: author.id, label: author.name}))
            )
        );
        postForm.updateValues({posts: newPosts});
        authorForm.updateValues({authors: newAuthors});
    }, [postForm, authorForm]);

    useEffect(() => {
        if (
            postsApi !== undefined &&
            authorsApi !== undefined
        ) updatePosts(postsApi.entries, authorsApi.entries);
    }, [postsApi, authorsApi]);
    useStoreUpdate(postsApi, () => {
        if (postsApi !== undefined && authorsApi !== undefined) updatePosts(postsApi.entries, authorsApi.entries);
    }, [updatePosts, authorsApi]);
    useStoreUpdate(authorsApi, () => {
        if (authorsApi !== undefined && postsApi !== undefined) updatePosts(postsApi.entries, authorsApi.entries);
    }, [updatePosts, postsApi]);
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
