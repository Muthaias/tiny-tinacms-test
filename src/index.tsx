import * as React from "react";
import {useMemo} from "react";
import * as ReactDOM from "react-dom";
import {TinaCMS, TinaProvider} from "tinacms";

import {ThemeStyles} from "./styles";
import {cmsFromStores} from "./modules/cms";
import {Application} from "./components/application";
import {LocalStorageStore, Post, Author} from "./modules/datastore";
import {
    MenuContext,
    ContentContext,
} from "./contexts";
import {mockMenuData, mockPostsData} from "./modules/mock-data";

const CMSProvider: React.FunctionComponent<{init: () => TinaCMS, children}> = (props) => {
    const cms = useMemo(props.init, []);
    return (
        <MenuContext.Provider value={mockMenuData}>
            <ContentContext.Provider value={mockPostsData[0]}>
                <ThemeStyles />
                <TinaProvider cms={cms}>
                    {React.Children.toArray(props.children)}
                </TinaProvider>
            </ContentContext.Provider>
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
