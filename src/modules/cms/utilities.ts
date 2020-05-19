import {TinaCMS} from "tinacms";
import {postCreator, menuCreator, ContentBlockPlugin} from "../plugins";
import {EntryStore, Author, Post, Menu, DataSearch} from "../datastore";

export function downloadObject(object: Object, name: string) {
    const dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object, undefined, '    '));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataString);
    anchor.setAttribute('download', name + '.json');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}

export function cmsFromStores(
    postStore: EntryStore<Post>,
    pageStore: EntryStore<Post>,
    menuStore: EntryStore<Menu> & DataSearch<Menu>,
    authorStore: EntryStore<Author>,
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
    cms.plugins.add(
        menuCreator({
            name: "Dump data",
            onSubmit: async (values) => {
                const authors = authorStore.getEntries();
                const posts = postStore.getEntries();
                const pages = pageStore.getEntries();
                const menus = menuStore.getEntries();
                const data = {
                    authors,
                    posts,
                    pages,
                    menus,
                }
                downloadObject(data, values.name);
            }
        })
    );
    cms.fields.add(ContentBlockPlugin);

    cms.registerApi("authors", authorStore);
    cms.registerApi("posts", postStore);
    cms.registerApi("pages", pageStore);
    cms.registerApi("menu", menuStore);
    return cms;
}
