import {ContentCreatorPlugin} from "tinacms";
import {Post, Menu} from "./datastore";

export function postCreator({
    name,
    onSubmit,
}: {
    name: string,
    onSubmit: (c: Pick<Post, "title">) => Promise<any>;
}): ContentCreatorPlugin<Pick<Post, "title">> {
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

export function menuCreator({
    name,
    onSubmit,
}: {
    name: string,
    onSubmit: (c: Pick<Menu, "name">) => Promise<any>;
}): ContentCreatorPlugin<Pick<Menu, "name">> {
    return {
        name: name,
        __type: "content-creator",
        fields: [
            {
                name: 'name',
                label: 'Name',
                component: 'text',
            }
        ],
        onSubmit,
    }
}
