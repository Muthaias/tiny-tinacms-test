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
    DataStream,
    GenericEntryStore,
    Utilities,
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


const DataProvider: React.SFC<{streams: Streams, children}> = ({streams, children}) => {
    const history = useHistory();
    const [content, setContent] = React.useState<ContentData>(mockPostsData[0]);
    const pageMatch = useRouteMatch<{id: string}>("/page/:id");
    const postMatch = useRouteMatch<{id: string}>("/post/:id");
    const pageId = pageMatch && pageMatch.params.id;
    const postId = postMatch && postMatch.params.id;

    const [menu] = Utilities.useMenuStore(streams.menus);
    const menuCallback = React.useCallback((id: string) => {
        const menuContent = menu(id);
        return menuContent ? {
            items: menuContent.entries.map((entry, index) => ({
                key: entry.name + ":" + index,
                label: entry.name,
                onClick: () => entry.link && history.push(entry.link),
            })),
        } : {items: []}
    }, [menu]);

    React.useEffect(() => {
        (async () => {
            try {
                if (pageId) {
                    const pageData = await streams.pages.get({id: pageId});
                    setContent({
                        type: ContentType.Page,
                        contentBlocks: pageData.contentBlocks,
                        title: pageData.title,
                    });
                } else if (postId) {
                    const postData = await streams.posts.get({id: postId});
                    setContent({
                        type: ContentType.Post,
                        contentBlocks: postData.contentBlocks,
                        title: postData.title,
                    });
                }
            } catch (e) {
                console.warn("Failed to load page: ", e, pageMatch, postMatch);
                setContent(mockPostsData[0]);
            }
        })();
    }, [pageId, postId, streams]);

    return (
        <MenuContext.Provider value={menuCallback}>
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
        <DataProvider streams={DataStreams} >
            <Application />
        </DataProvider>
    </Router>,
    document.getElementById("app")
);
