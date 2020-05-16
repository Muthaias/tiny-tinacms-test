import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    cmsFromStores,
} from "./modules/cms";
import {Application} from "./components/application";
import {
    LocalStorageStore,
    Post,
    Author,
    Menu,
} from "./modules/datastore";
import {
    HashRouter as Router,
} from "react-router-dom";
import {CMSProvider} from "./components/cms";

ReactDOM.render(
    <Router>
        <CMSProvider
            init={() => cmsFromStores(
                new LocalStorageStore<Post>("__posts"),
                new LocalStorageStore<Post>("__pages"),
                new LocalStorageStore<Menu>("__menu"),
                new LocalStorageStore<Author>("__authors")
            )}
        >
            <Application />
        </CMSProvider>
    </Router>,
    document.getElementById("app")
);
