import {
    FormOptions,
    useForm,
    usePlugin,
} from "tinacms";

import {
    Entry,
    Post,
    ContentBlock,
} from "../../modules/datastore";


const contentBlockField = {
    name: "type",
    label: "Content Block",
    component: "content-block",
    description: "Select content block type",
    options: ["title", "text", "gallery"],
    blockFields: {
        title: [
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
        text: [
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
        gallery: [
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
    onSubmit: (item: {title: string, contentBlocks: ContentBlock[]}) => Promise<void>,
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
                label: "Content blocks",
                name: "contentBlocks",
                component: "group-list",
                description: "Content blocks",
                itemProps: item => ({
                    key: item.id,
                    label: item.name + ": " + item.type,
                }),
                defaultItem: () => ({
                    id: "__block:" + Date.now(),
                    type: "title",
                    imageUrl: "",
                    title: "",
                    name: "Block",
                }),
                fields: [contentBlockField],
            },
        ],
        loadInitialValues: async () => {
            const values = await loadInitialValues();
            return {
                ...values,
                contentBlocks: values.contentBlocks.map((block, index) => ({
                    ...block,
                    id: "block:" + index
                }))
            }
        },
        onSubmit: onSubmit
    };
    const [post, postForm] = useForm<Entry & Post>(formOptions);
    usePlugin(postForm);
    return post;
}
