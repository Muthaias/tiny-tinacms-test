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

export const mockImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&h=300&q=80";

export const mockPostsData: PostData[] = [
    {
        type: ContentType.Post,
        title: "Hello world!",
        content: "There's currently no post available here!",
        headerImage: mockImageUrl,
    },
    {
        type: ContentType.Post,
        title: "Brave new world!",
        content: "",
        headerImage: mockImageUrl,
    },
];

export const mockPagesData: PageData[] = [
    {
        type: ContentType.Page,
        title: "Hello world!",
        content: "There's currently no page available here!",
        headerImage: mockImageUrl,
    },
];

export const mockListingsData: ListingData[] = [
    {
        type: ContentType.Listing,
        title: "Hello world!",
        entries: [],
        headerImage: mockImageUrl,
    },
];