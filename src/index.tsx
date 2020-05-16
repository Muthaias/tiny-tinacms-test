import * as React from "react";
import * as ReactDOM from "react-dom";

import {Application} from "./components/application";
import {
    HashRouter as Router,
    useHistory,
    useRouteMatch,
} from "react-router-dom";
import {
    Entry,
    Post,
    Menu,
} from "./modules/datastore";
import {
    MenuContext,
    MenuData,
    ContentContext,
    ContentData,
    ContentType,
} from "./contexts";
import {
    mockPostsData,
} from "./modules/mock-data";
import Data from "../data/data.json";

type DataHack = any;
interface Data {
    posts: (Entry & Post)[];
    pages: (Entry & Post)[];
    menus: (Entry & Menu)[];
}
const DataProvider: React.SFC<{data: Data, children}> = ({data, children}) => {
    const history = useHistory();
    const postMap = React.useMemo(() => (
        data.posts.reduce<{[id: string]: Post}>((acc, post) => {
            acc[post.id] = post;
            return acc;
        }, {})
    ), [data]);
    const pageMap = React.useMemo(() => (
        data.pages.reduce<{[id: string]: Post}>((acc, post) => {
            acc[post.id] = post;
            return acc;
        }, {})
    ), [data]);
    const menuMap = React.useMemo(() => (
        data.menus.reduce<{[name: string]: Menu}>((acc, menu) => {
            acc[menu.name] = menu;
            return acc;
        },{})
    ), [data]);
    const menuContent = menuMap["Main"];
    const mainMenu: MenuData = menuContent ? {
        items: menuContent.entries.map((entry, index) => ({
            key: entry.name + ":" + index,
            label: entry.name,
            onClick: () => entry.link && history.push(entry.link),
        })),
    } : {items: []};

    const pageMatch = useRouteMatch<{id: string}>("/page/:id");
    const postMatch = useRouteMatch<{id: string}>("/post/:id");
    const selectedContent = (pageMatch ? (
        pageMap[pageMatch.params.id]
    ) : (
        postMatch ? (
            postMap[postMatch.params.id]
        ) : undefined
    ));
    const content: ContentData = selectedContent ? {
        type: ContentType.Post,
        content: selectedContent.content,
        title: selectedContent.title,
    } : mockPostsData[0];

    return (
        <MenuContext.Provider value={mainMenu}>
            <ContentContext.Provider value={content}>
                {React.Children.toArray(children)}
            </ContentContext.Provider>
        </MenuContext.Provider>
    )
}

ReactDOM.render(
    <Router>
        <DataProvider data={Data as DataHack} >
            <Application />
        </DataProvider>
    </Router>,
    document.getElementById("app")
);
