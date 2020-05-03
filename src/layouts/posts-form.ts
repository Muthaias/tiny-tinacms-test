import {Field} from "tinacms";

export function createPostsFields(
    posts: {label: string, value: string}[] = [],
    authors: {label: string, value: string}[] = [],
): (Field & {[x: string]: any})[] {
    return [
        {
            label: "Posts",
            name: "posts",
            component: "group-list",
            description: "A list of posts",
            itemProps: item => ({
                id: item.id || item.key,
                key: item.id || item.key,
                label: item.title,
            }),
            defaultItem: () => ({
                title: "New post",
                content: "",
                key: "__post:" + Date.now(),
            }),
            fields: [
                {
                    label: "Title",
                    name: "title",
                    component: "text",
                },
                {
                    label: "Author",
                    name: "author",
                    component: "select",
                    options: [{label: "None", value: null}, ...authors]
                }
            ],
        },
        {
            label: "Select post",
            name: "postId",
            component: "select",
            options: [{label: "None", value: null}, ...posts]
        }
    ];
}
