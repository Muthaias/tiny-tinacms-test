import * as React from "react";
import * as ReactDOM from "react-dom";

import {Application} from "./components/application";
import {
    HashRouter as Router,
    useHistory,
    useRouteMatch,
} from "react-router-dom";
import {
    Post,
    Menu,
    EntryRead,
    DataSearch,
    GenericEntryStore,
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

interface Streams {
    posts: DataStream<Post>;
    pages: DataStream<Post>;
    menus: DataStream<Menu>;
}
type DataStream<T> = EntryRead<T> & DataSearch<T>;
const DataProvider: React.SFC<{streams: Streams, menuId: string, children}> = ({streams, menuId, children}) => {
    const history = useHistory();
    const [mainMenu, setMainMenu] = React.useState<MenuData>({items: []});
    const [content, setContent] = React.useState<ContentData>(mockPostsData[0]);

    React.useEffect(() => {
        streams.menus.first({
            type: "property",
            propertyId: "name" as "name",
            criteria: menuId,
        }).then(menuContent => {
            setMainMenu(menuContent ? {
                items: menuContent.entries.map((entry, index) => ({
                    key: entry.name + ":" + index,
                    label: entry.name,
                    onClick: () => entry.link && history.push(entry.link),
                })),
            } : {items: []});
        });
    }, [menuId, streams]);

    const pageMatch = useRouteMatch<{id: string}>("/page/:id");
    const postMatch = useRouteMatch<{id: string}>("/post/:id");
    const pageId = pageMatch && pageMatch.params.id;
    const postId = postMatch && postMatch.params.id;

    React.useEffect(() => {
        (async () => {
            try {
                if (pageId) {
                    const pageData = await streams.pages.get({id: pageId});
                    setContent({
                        type: ContentType.Page,
                        content: pageData.content,
                        title: pageData.title,
                        headerImage: pageData.imageUrl,
                    });
                } else if (postId) {
                    const postData = await streams.posts.get({id: postId});
                    setContent({
                        type: ContentType.Page,
                        content: postData.content,
                        title: postData.title,
                        headerImage: postData.imageUrl,
                    });
                }
            } catch (e) {
                console.warn("Failed to load page: ", e, pageMatch, postMatch);
                setContent(mockPostsData[0]);
            }
        })();
    }, [pageId, postId, streams]);

    return (
        <MenuContext.Provider value={mainMenu}>
            <ContentContext.Provider value={content}>
                {React.Children.toArray(children)}
            </ContentContext.Provider>
        </MenuContext.Provider>
    )
}

const DataStreams = {
    posts: GenericEntryStore.fromWebData<Post>("__posts", "data/data.json", (data) => data.posts || []),
    pages: GenericEntryStore.fromWebData<Post>("__pages", "data/data.json", (data) => data.pages || []),
    menus: GenericEntryStore.fromWebData<Menu>("__menu", "data/data.json", (data) => data.menus || []),
};
ReactDOM.render(
    <Router>
        <DataProvider streams={DataStreams} menuId={"Main"}>
            <Application />
        </DataProvider>
    </Router>,
    document.getElementById("app")
);
