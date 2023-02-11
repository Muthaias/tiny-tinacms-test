import {AddContentPlugin} from "@tinacms/toolkit";
import {Post} from "../datastore";

export function postCreator({
    name,
    onSubmit,
}: {
    name: string,
    onSubmit: (c: Pick<Post, "title">) => Promise<any>;
}): AddContentPlugin<Pick<Post, "title">> {
    return {
        name: name,
        __type: "content-creator",
        fields: [
            {
                name: 'title',
                label: 'Title',
                component: 'text',
            }
        ],
        onSubmit,
    }
}