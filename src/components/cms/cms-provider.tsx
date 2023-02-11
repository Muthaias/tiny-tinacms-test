import * as React from "react";
import {useMemo} from "react";
import {TinaCMS, TinaProvider} from "@tinacms/toolkit";
import {EditProvider} from "@tinacms/sharedctx";

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
        <EditProvider>
            <TinaProvider cms={cms}>
                <TinaMenuProvider menuId={routeMatch?.params.menuId || "Main"}>
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
                            <ContentContext.Provider value={mockPagesData[0]}>
                                {React.Children.toArray(props.children)}
                            </ContentContext.Provider>
                        )} />
                    </Switch>
                </TinaMenuProvider>
            </TinaProvider>
        </EditProvider>
    );
}