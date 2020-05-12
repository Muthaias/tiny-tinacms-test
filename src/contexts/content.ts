import * as React from "react";

export enum ContentType {
    Post,
    Page,
    Listing
};

interface CommonContentData {
    title: string;
    headerImage?: string;
}

export interface PostData {
    type: ContentType.Post;
    content: string;
}

export interface PageData {
    type: ContentType.Page;
    content: string;
}

export interface ListingData {
    type: ContentType.Listing;
    entries: {
        title: string;
        id: string;
        short: string;
    }[]
}

export type ContentData = CommonContentData & (
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