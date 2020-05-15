import * as React from "react";
import {usePosts} from "../../modules/cms";

import {
    ContentContext,
    ContentType,
    ContentData,
} from "../../contexts";
import {useContentForm} from "./utilities";

export const TinaPostProvider: React.SFC<{postId: string, children: any}> = ({postId, children}) => {
    const postsApi = usePosts();
    const post = useContentForm(
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
