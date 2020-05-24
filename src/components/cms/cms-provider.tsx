import * as React from "react";
import {useMemo} from "react";
import {TinaCMS, TinaProvider} from "tinacms";

import {
    PostSelector,
    PageSelector,
    TinaPostProvider,
    TinaPageProvider,
    TinaMenuProvider,
} from "./";
import {
    ContentContext,
} from "../../contexts";
import {
    mockPagesData,
    mockListingsData,
} from "../../modules/mock-data";
import {
    Route,
    Switch,
    useRouteMatch,
} from "react-router-dom";

export const CMSProvider: React.FunctionComponent<{init: () => TinaCMS, children}> = (props) => {
    const cms = useMemo(props.init, []);
    const routeMatch = useRouteMatch<{menuId: string}>("/menu/:menuId");

    return (
        <TinaProvider cms={cms}>
            <TinaMenuProvider>
                <PostSelector />
                <PageSelector />
                <Switch>
                    <Route path="/post/:postId" render={({match}) => (
                        <TinaPostProvider postId={match.params.postId}>{React.Children.toArray(props.children)}</TinaPostProvider>
                    )} />
                    <Route path="/page/:pageId" render={({match}) => (
                        <TinaPageProvider pageId={match.params.pageId}>{React.Children.toArray(props.children)}</TinaPageProvider>
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
            </TinaMenuProvider>
        </TinaProvider>
    );
}