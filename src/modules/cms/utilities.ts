import {TinaCMS} from "tinacms";
import {postCreator, menuCreator} from "../plugins";
import {DataStore, Author, Post, Menu, DataSearch} from "../datastore";

export function cmsFromStores(
    postStore: DataStore<Post>,
    pageStore: DataStore<Post>,
    menuStore: DataStore<Menu> & DataSearch<Menu>,
    authorStore: DataStore<Author>,
): TinaCMS {
    const cms = new TinaCMS();
    cms.plugins.add(
        postCreator({
            name: "Add Post",
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
            name: "Add Page",
            onSubmit: (values) => {
                return pageStore.add({
                    title: values.title || "Untitled page",
                    type: "basic",
                    content: "",
                });
            }
        })
    );
    cms.plugins.add(
        menuCreator({
            name: "Add Menu",
            onSubmit: (values) => {
                return menuStore.add({
                    name: values.name || "Untitled menu",
                    entries: [],
                    tags: [],
                });
            }
        })
    );

    cms.registerApi("authors", authorStore);
    cms.registerApi("posts", postStore);
    cms.registerApi("pages", pageStore);
    cms.registerApi("menu", menuStore);
    return cms;
}
