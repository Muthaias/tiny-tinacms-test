import * as React from "react";

import {ContentBlock} from "../modules/datastore";

export enum ContentType {
    Post = "post",
    Page = "page",
    Listing = "listing",
};

interface CommonContentData {
    title: string;
}

export interface PostData extends CommonContentData {
    type: ContentType.Post;
    contentBlocks: ContentBlock[];
}

export interface PageData extends CommonContentData {
    type: ContentType.Page;
    contentBlocks: ContentBlock[];
}

export interface ListingData extends CommonContentData {
    type: ContentType.Listing;
    entries: {
        title: string;
        id: string;
        short: string;
    }[]
}

export type ContentData = (
    PostData |
    PageData |
    ListingData
);

export const ContentContext = React.createContext<ContentData>({
    type: ContentType.Listing,
    title: "Entries",
    entries: []
});

export function useContent() {
    return React.useContext(ContentContext);
}