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

ReactDOM.render(
    <Router>
        <CMSProvider
            init={() => cmsFromStores(
                GenericEntryStore.fromTargetId<Post>("__posts"),
                GenericEntryStore.fromTargetId<Post>("__pages"),
                GenericEntryStore.fromTargetId<Menu>("__menu"),
                GenericEntryStore.fromTargetId<Author>("__authors")
            )}
        >
            <Application />
        </CMSProvider>
    </Router>,
    document.getElementById("app")
);
