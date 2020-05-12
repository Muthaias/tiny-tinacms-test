import * as React from "react";
import {
    useCMS,
    FormOptions,
    useForm,
    usePlugin,
} from "tinacms";

import {
    DataStore,
    Entry,
    Post,
} from "../../modules/datastore";

import {
    ContentContext,
    ContentType,
    ContentData,
} from "../../contexts";

export function useCMSPost(postId: string) {
    const cms = useCMS();
    const postsApi: DataStore<Post> = cms.api.posts;
    const formOptions: FormOptions<Entry & Post> = {
        id: "__main:" + postId,
        label: "Main content",
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
        loadInitialValues: () => postsApi.get({id: postId}),
        onSubmit: ({title, content, imageUrl}: {title: string, content: string, imageUrl?: string}) => {
            if (postId !== null) {
                postsApi.update({
                    id: postId,
                    title,
                    content,
                    imageUrl
                });
            }
        }
    };
    const [post, postForm] = useForm<Entry & Post>(formOptions);
    usePlugin(postForm);
    return post;
}

export const TinaPostProvider: React.SFC<{postId: string, children: any}> = ({postId, children}) => {
    const post = useCMSPost(postId);

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