import * as React from "react";
import {useMemo} from "react";
import * as ReactDOM from "react-dom";
import {TinaCMS, TinaProvider} from "tinacms";

import {cmsFromStores} from "./modules/cms";
import {Application} from "./components/application";
import {
    LocalStorageStore,
    Post,
    Author
} from "./modules/datastore";
import {
    MenuContext,
    ContentContext,
} from "./contexts";
import {
    TinaPostProvider
} from "./components/cms";
import {
    mockMenuData,
    mockPagesData,
    mockListingsData,
} from "./modules/mock-data";
import {
    HashRouter as Router,
    Route,
    Switch,
} from "react-router-dom";


const CMSProvider: React.FunctionComponent<{init: () => TinaCMS, children}> = (props) => {
    const cms = useMemo(props.init, []);
    return (
        <MenuContext.Provider value={mockMenuData}>
            <TinaProvider cms={cms}>
                <Switch>
                    <Route path="/post/:postId" render={({match}) => (
                        <TinaPostProvider postId={match.params.postId}>{React.Children.toArray(props.children)}</TinaPostProvider>
                    )} />
                    <Route path="/page/:pageId" render={({match}) => (
                        <ContentContext.Provider value={mockPagesData[match.params.pageId] || mockPagesData[0]}>
                            {React.Children.toArray(props.children)}
                        </ContentContext.Provider>
                    )} />
                    <Route path="/listing/:listingId" render={({match}) => (
                        <ContentContext.Provider value={mockListingsData[match.params.listingId] || mockListingsData[0]}>
                            {React.Children.toArray(props.children)}
                        </ContentContext.Provider>
                    )} />
                    <Route path="*" render={({match}) => (
                        <ContentContext.Provider value={mockPagesData[match.params.pageId] || mockPagesData[0]}>
                            {React.Children.toArray(props.children)}
                        </ContentContext.Provider>
                    )} />
                </Switch>
            </TinaProvider>
        </MenuContext.Provider>
    );
}

ReactDOM.render(
    <Router>
        <CMSProvider
            init={() => cmsFromStores(
                new LocalStorageStore<Post>("__posts"),
                new LocalStorageStore<Author>("__authors")
            )}
        >
            <Application />
        </CMSProvider>
    </Router>,
    document.getElementById("app")
);
