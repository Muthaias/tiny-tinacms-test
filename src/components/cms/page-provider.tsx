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
        ({title, contentBlocks}) => {
            if (pageId !== null) {
                return pagesApi.update({
                    id: pageId,
                    title,
                    contentBlocks,
                });
            }
            return Promise.resolve();
        },
        "Page content"
    );

    if (post === undefined || !post.contentBlocks) return null;

    const pageData: ContentData = {
        type: ContentType.Page,
        title: post.title,
        contentBlocks: post.contentBlocks,
    };
    return (
        <ContentContext.Provider value={pageData}>
            {React.Children.toArray(children)}
        </ContentContext.Provider>
    )
};