import {
    FormOptions,
    useForm,
    usePlugin,
} from "@tinacms/toolkit";

import {
    Entry,
    Post,
    ContentBlock,
} from "../../modules/datastore";

const TitleBlock = {
    label: "Title",
    key: "title-block",
    fields: [
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
    itemProps: item => ({
        key: item.id,
        label: "Title: " + item.name,
    }),
    defaultItem: {
        id: "__title:" + Date.now(),
        type: "title",
        name: "Title",
        title: "",
        imageUrl: "",
    }
};

const TextBlock = {
    label: "Text",
    key: "text-block",
    fields: [
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
    itemProps: item => ({
        key: item.id,
        label: "Text: " + item.name,
    }),
    defaultItem: {
        id: "__text:" + Date.now(),
        type: "text",
        name: "Text",
        text: "",
    }
}

const GalleryBlock = {
    label: "Gallery",
    key: "gallery-block",
    fields: [
        {
            label: "Name",
            name: "name",
            component: "text",
        },
        {
            label: "Height",
            name: "height",
            component: "text",
        },
        {
            label: "Images",
            name: "images",
            component: "group-list",
            description: "Image list",
            itemProps: item => ({
                key: item.id,
                label: item.title,
            }),
            defaultItem: () => ({
                title: "",
                imageUrl: "",
                id: "__image:" + Date.now(),
            }),
            fields: [
                {
                    label: "Title",
                    name: "title",
                    component: "text",
                },
                {
                    label: "Image",
                    name: "imageUrl",
                    component: "text",
                },
            ]
        }
    ],
    itemProps: item => ({
        key: item.id,
        label: "Gallery: " + item.name,
    }),
    defaultItem: {
        id: "__gallery:" + Date.now(),
        type: "gallery",
        name: "Gallery",
        images: [],
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
                component: "blocks",
                description: "Content blocks",
                templates: {
                    title: TitleBlock,
                    text: TextBlock,
                    gallery: GalleryBlock,
                }
            },
        ],
        loadInitialValues: async () => {
            const values = await loadInitialValues();
            return {
                ...values,
                contentBlocks: values.contentBlocks.map((block, index) => (block.type === "gallery" ? {
                    ...block,
                    id: "block:" + index,
                    images: block.images.map((image, imageIndex) => ({
                        ...image,
                        id: "image" + imageIndex,
                    })),
                    _template: block.type,
                } : {
                    ...block,
                    id: "block:" + index,
                    _template: block.type,
                }))
            }
        },
        onSubmit: onSubmit
    };
    const [post, postForm] = useForm<Entry & Post>(formOptions);
    usePlugin(postForm);
    return post;
}
