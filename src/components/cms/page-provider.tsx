import * as React from "react";

import {usePages} from "../../modules/cms";

import {
    ContentContext,
    ContentType,
    ContentData,
} from "../../contexts";

import {useContentForm} from "./utilities";

export const TinaPageProvider: React.SFC<{pageId: string, children: any}> = ({pageId, children}) => {
    const pagesApi = usePages();
    const post = useContentForm(
        pageId,
        () => pagesApi.get({id: pageId}),
        ({title, content, imageUrl}: {title: string, content: string, imageUrl?: string}) => {
            if (pageId !== null) {
                return pagesApi.update({
                    id: pageId,
                    title,
                    content,
                    imageUrl
                });
            }
            return Promise.resolve();
        },
        "Page content"
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