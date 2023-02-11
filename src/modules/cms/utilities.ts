import {TinaCMS} from "@tinacms/toolkit";
import {postCreator, menuCreator} from "../plugins";
import {EntryStore, Author, Post, Menu, DataSearch, ContentBlockType} from "../datastore";

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
    const cms = new TinaCMS({sidebar: true});
    cms.plugins.add(
        postCreator({
            name: "Add Post",
            onSubmit: (values) => {
                return postStore.add({
                    title: values.title || "Untitled post",
                    type: "basic",
                    contentBlocks: [{
                        name: "Content",
                        type: ContentBlockType.Text,
                        text: "",
                    }],
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
                    contentBlocks: [{
                        name: "Content",
                        type: ContentBlockType.Text,
                        text: "",
                    }],
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
                const authors = await authorStore.getEntries();
                const posts = await postStore.getEntries();
                const pages = await pageStore.getEntries();
                const menus = await menuStore.getEntries();
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
    
    window.localStorage.setItem("tina.isEditing", "true");
    cms.registerApi("authors", authorStore);
    cms.registerApi("posts", postStore);
    cms.registerApi("pages", pageStore);
    cms.registerApi("menu", menuStore);
    cms.registerApi("admin", {
        fetchCollections: (...args) => {
            return []
        }
    });
    cms.enable();
    return cms;
}
