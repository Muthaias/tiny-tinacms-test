import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    cmsFromStores,
} from "./modules/cms";
import {Application} from "./components/application";
import {
    GenericEntryStore,
    Post,
    Author,
    Menu,
} from "./modules/datastore";
import {
    HashRouter as Router,
} from "react-router-dom";
import {CMSProvider} from "./components/cms";

const dataPrefix = "contentBlocks:withGallery:";

function renderSite(
    targetId: string = "app"
) {
    ReactDOM.render(
        <Router>
            <CMSProvider
                init={() => cmsFromStores(
                    GenericEntryStore.fromTargetId<Post>(dataPrefix + "posts"),
                    GenericEntryStore.fromTargetId<Post>(dataPrefix + "pages"),
                    GenericEntryStore.fromTargetId<Menu>(dataPrefix + "menus"),
                    GenericEntryStore.fromTargetId<Author>(dataPrefix + "authors")
                )}
            >
                <Application />
            </CMSProvider>
        </Router>,
        document.getElementById(targetId)
    );
}

const shouldSeed: boolean = true;
const forceSeed: boolean = false;
(async () => {
    const seedIds = [
        "posts",
        "pages",
        "authors",
        "menus",
    ];
    const needSeed: boolean = !seedIds.reduce((acc, id) => acc || !!window.localStorage.getItem(dataPrefix + id), false);
    if (shouldSeed && needSeed || forceSeed) {
        try {
            const response = await fetch("./data/data.json");
            const data = await response.json();
            seedIds.forEach((id) => {
                window.localStorage.setItem(dataPrefix + id, JSON.stringify(data[id] || []))
            });
        } catch (e) {
            console.warn("Unable to seed local storage data.");
        }
    }
    
    renderSite("app");
})();

