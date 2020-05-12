import {
    MenuData,
    PostData,
    PageData,
    ListingData,
    ContentType,
} from "../contexts";

export const mockMenuData: MenuData = {
    items: [
        "Hello world!",
        "What you doing?",
        "More magic"
    ].map(title => ({
        key: title,
        label: title
    }))
};

export const mockPostsData: PostData[] = [
    {
        type: ContentType.Post,
        title: "Hello world!",
        content: "",
    },
];

export const mockPagesData: PageData[] = [
    {
        type: ContentType.Page,
        title: "Hello world!",
        content: "",
    },
];

export const mockListingsData: ListingData[] = [
    {
        type: ContentType.Listing,
        title: "Hello world!",
        entries: [],
    },
];