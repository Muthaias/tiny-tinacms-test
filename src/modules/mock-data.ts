import {
    MenuData,
    PostData,
    PageData,
    ListingData,
    ContentType,
} from "../contexts";
import {
    ContentBlockType
} from "./datastore";

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
        contentBlocks: [
            {
                name: "Title",
                type: ContentBlockType.Title,
                title: "Hello world!",
                imageUrl: mockImageUrl,
            },
            {
                name: "Content",
                type: ContentBlockType.Text,
                text: "There's currently no page available here!",
            }
        ],
    },
];

export const mockPagesData: PageData[] = [
    {
        type: ContentType.Page,
        title: "Hello world!",
        contentBlocks: [
            {
                name: "Title",
                type: ContentBlockType.Title,
                title: "Hello world!",
                imageUrl: mockImageUrl,
            },
            {
                name: "Content",
                type: ContentBlockType.Text,
                text: "There's currently no page available here!",
            }
        ],
    },
];

export const mockListingsData: ListingData[] = [
    {
        type: ContentType.Listing,
        title: "Hello world!",
        entries: [],
    },
];
