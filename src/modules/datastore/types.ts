export type Post = {
    title: string;
    type: string;
    content: string;
    author?: string;
    imageUrl?: string;
    index?: number,
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