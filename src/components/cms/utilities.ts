import {
    FormOptions,
    useForm,
    usePlugin,
} from "tinacms";

import {
    Entry,
    Post,
} from "../../modules/datastore";


const contentBlockField = {
    name: "blockType",
    label: "Content Block",
    component: "content-block",
    description: "Select content block type",
    options: ["titleBlock", "textBlock", "galleryBlock"],
    blockFields: {
        titleBlock: [
            {
                label: "Name",
                name: "name",
                component: "text",
            },
            {
                label: "Title block",
                name: "title",
                component: "text",
            },
            {
                name: "imageUrl",
                label: "Header Image URL",
                component: "text",
            }
        ],
        textBlock: [
            {
                label: "Name",
                name: "name",
                component: "text",
            },
            {
                label: "Text",
                name: "text",
                component: "markdown",
            },
        ],
        galleryBlock: [
            {
                label: "Name",
                name: "name",
                component: "text",
            },
            ...Array.from({length: 5}).map((_, index) => ({
                label: "Image " + index,
                name: "image" + index,
                component: "text",
            }))
        ] 
    }
}

export function useContentForm(
    postId: string,
    loadInitialValues: () => Promise<Entry & Post>,
    onSubmit: ({title, content, imageUrl}: {title: string, content: string, imageUrl?: string}) => Promise<void>,
    label: string = "Post content",
) {
    const formOptions: FormOptions<Entry & Post> = {
        id: "__main:" + postId,
        label: label,
        fields: [
            {
                name: "title",
                label: "Title",
                component: "text",
            },
            {
                name: "content",
                label: "Content",
                component: "markdown",
            },
            {
                name: "imageUrl",
                label: "Header Image URL",
                component: "text",
            },
            {
                label: "Content blocks",
                name: "contentBlocks",
                component: "group-list",
                description: "Content blocks",
                itemProps: item => ({
                    key: item.id,
                    label: item.name + ": " + item.blockType,
                }),
                defaultItem: () => ({
                    id: "__block:" + Date.now(),
                    blockType: "titleBlock",
                    imageUrl: "",
                    title: "",
                    name: "Block",
                }),
                fields: [contentBlockField],
            },
        ],
        loadInitialValues: loadInitialValues,
        onSubmit: onSubmit
    };
    const [post, postForm] = useForm<Entry & Post>(formOptions);
    usePlugin(postForm);
    return post;
}
