export type ContentBlock = {
    name: string;
} & ({
    type: "title";
    imageUrl: string;
    title: string;
} | {
    type: "text";
    text: string;
} | {
    type: "gallery";
    images: string[];
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