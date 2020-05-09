import * as React from "react";
import {useMemo} from "react";
import * as ReactDOM from "react-dom";
import {TinaCMS} from "tinacms";
import {TinaProvider} from "./hacks/tinaprovider";
import {GlobalStyles} from "./hacks/globalstyles";

import {cmsFromStores} from "./modules/cms";
import {Application} from "./modules/application";
import {LocalStorageStore, Post, Author} from "./modules/datastore";

const CMSProvider: React.FunctionComponent<{init: () => TinaCMS, children}> = (props) => {
    const cms = useMemo(props.init, []);

    return (
        <TinaProvider cms={cms}>
            {React.Children.toArray(props.children)}
        </TinaProvider>
    );
}

ReactDOM.render(
    <CMSProvider
        init={() => cmsFromStores(
            new LocalStorageStore<Post>("__posts"),
            new LocalStorageStore<Author>("__authors")
        )}
    >
        <GlobalStyles />
        <Application />
    </CMSProvider>,
    document.getElementById("app")
);
