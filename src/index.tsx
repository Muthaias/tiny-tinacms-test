import * as React from "react";
import {useMemo} from "react";
import * as ReactDOM from "react-dom";
import {TinaCMS, TinaProvider} from "tinacms";

import {cmsFromStores} from "./modules/cms";
import {Application} from "./components/application";
import {LocalStorageStore, Post, Author} from "./modules/datastore";
import {MenuContext} from "./contexts/menu";
import {ThemeStyles} from "./styles";

const CMSProvider: React.FunctionComponent<{init: () => TinaCMS, children}> = (props) => {
    const cms = useMemo(props.init, []);
    const menuItems = ["Hello world!", "What you doing?", "More magic"].map(label => ({
        label: label,
        key: label,
    }));

    return (
        <MenuContext.Provider value={{items: menuItems}}>
            <ThemeStyles />
            <TinaProvider cms={cms}>
                {React.Children.toArray(props.children)}
            </TinaProvider>
        </MenuContext.Provider>
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
