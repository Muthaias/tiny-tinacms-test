import * as React from "react";
import {useMemo} from "react";
import * as ReactDOM from "react-dom";
import {TinaCMS} from "tinacms";
import {ThemeProvider} from "styled-components"

import {TinaProvider} from "./hacks/tinaprovider";
import {cmsFromStores} from "./modules/cms";
import {Application} from "./modules/application";
import {LocalStorageStore, Post, Author} from "./modules/datastore";

const CMSProvider: React.FunctionComponent<{init: () => TinaCMS, children}> = (props) => {
    const cms = useMemo(props.init, []);

    return (
        <ThemeProvider theme={{useExternalFont: false}}>
            <TinaProvider cms={cms}>
                {React.Children.toArray(props.children)}
            </TinaProvider>
        </ThemeProvider>
    );
}

ReactDOM.render(
    <CMSProvider
        init={() => cmsFromStores(
            new LocalStorageStore<Post>("__posts"),
            new LocalStorageStore<Author>("__authors")
        )}
    >
        <Application />
    </CMSProvider>,
    document.getElementById("app")
);
