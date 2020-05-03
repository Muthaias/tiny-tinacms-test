import {Field} from "tinacms";

export function createAuthorsFields(): (Field & {[x: string]: any})[] {
    return [
        {
            label: "Authors",
            name: "authors",
            component: "group-list",
            description: "A list of authors",
            itemProps: item => ({
                key: item.id || item.key,
                label: item.name,
            }),
            defaultItem: () => ({
                name: "Unknown author",
                content: "",
                key: "__post:" + Date.now(),
            }),
            fields: [
                {
                    label: "Name",
                    name: "name",
                    component: "text",
                },
            ],
        }
    ];
}
