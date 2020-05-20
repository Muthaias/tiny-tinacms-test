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
        ({title, contentBlocks}) => {
            if (postId !== null) {
                return postsApi.update({
                    id: postId,
                    title,
                    contentBlocks,
                });
            }
            return Promise.resolve();
        }
    );

    if (post === undefined || !post.contentBlocks) return null;

    const postData: ContentData = {
        type: ContentType.Post,
        title: post.title,
        contentBlocks: post.contentBlocks,
    }
    return (
        <ContentContext.Provider value={postData}>
            {React.Children.toArray(children)}
        </ContentContext.Provider>
    )
};
