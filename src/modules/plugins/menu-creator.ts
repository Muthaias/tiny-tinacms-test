import {ContentCreatorPlugin} from "tinacms";
import {Menu} from "../datastore";

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