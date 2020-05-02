import {TinaCMS} from "tinacms";
import {postCreator} from "./plugins";
import {DataStore, Author, Post} from "./datastore";

export function cmsFromStores(postStore: DataStore<Post>, authorStore: DataStore<Author>): TinaCMS {
    const cms = new TinaCMS();
    cms.plugins.add(
        postCreator({
            name: "Add Basic Post",
            onSubmit: (values) => {
                return postStore.add({
                    title: values.title || "Untitled post",
                    type: "basic",
                    content: "",
                });
            }
        })
    );
    cms.plugins.add(
        postCreator({
            name: "Add Special Post",
            onSubmit: (values) => {
                return postStore.add({
                    title: values.title || "Untitled post",
                    type: "basic",
                    content: "",
                });
            }
        })
    );

    cms.registerApi("authors", authorStore);
    cms.registerApi("posts", postStore);
    return cms;
}
