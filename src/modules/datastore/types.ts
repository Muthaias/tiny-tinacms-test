export enum ContentBlockType {
    Title = "title",
    Text = "text",
    Gallery = "gallery",
};

export type ContentBlock = {
    name: string;
} & ({
    type: ContentBlockType.Title;
    imageUrl: string;
    title: string;
} | {
    type: ContentBlockType.Text;
    text: string;
} | {
    type: ContentBlockType.Gallery;
    images: {
        imageUrl: string;
        title: string;
    }[];
});

export type Post = {
    title: string;
    type: string;
    author?: string;
    index?: number,
    contentBlocks: ContentBlock[];
}

export type Author = {
    name: string;
    index?: number;
}

export type MenuEntry = {
    name: string;
    link?: string;
    entries: MenuEntry[];
}

export type Menu = MenuEntry & {
    tags: string[];
};