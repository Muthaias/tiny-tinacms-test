import * as React from "react";
import {
    FormOptions,
    useForm,
    usePlugin,
} from "tinacms";

import {
    Entry,
    Post,
} from "../../modules/datastore";

import {usePosts} from "../../modules/cms-hooks";

import {
    ContentContext,
    ContentType,
    ContentData,
} from "../../contexts";

export function usePostForm(
    postId: string,
    loadInitialValues: () => Promise<Entry & Post>,
    onSubmit: ({title, content, imageUrl}: {title: string, content: string, imageUrl?: string}) => Promise<void>
) {
    const formOptions: FormOptions<Entry & Post> = {
        id: "__main:" + postId,
        label: "Post content",
        fields: [
            {
                name: "title",
                label: "Title",
                component: "text",
            },
            {
                name: "content",
                label: "Content",
                component: "markdown",
            },
            {
                name: "imageUrl",
                label: "Header Image URL",
                component: "text",
            }
        ],
        loadInitialValues: loadInitialValues,
        onSubmit: onSubmit
    };
    const [post, postForm] = useForm<Entry & Post>(formOptions);
    usePlugin(postForm);
    return post;
}

export const TinaPostProvider: React.SFC<{postId: string, children: any}> = ({postId, children}) => {
    const postsApi = usePosts();
    const post = usePostForm(
        postId,
        () => postsApi.get({id: postId}),
        ({title, content, imageUrl}: {title: string, content: string, imageUrl?: string}) => {
            if (postId !== null) {
                return postsApi.update({
                    id: postId,
                    title,
                    content,
                    imageUrl
                });
            }
            return Promise.resolve();
        }
    );

    if (post === undefined) return null;

    const postData: ContentData = {
        type: ContentType.Post,
        title: post.title,
        content: post.content,
        headerImage: post.imageUrl,
    }
    return (
        <ContentContext.Provider value={postData}>
            {React.Children.toArray(children)}
        </ContentContext.Provider>
    )
};
