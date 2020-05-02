import * as React from "react";
import ReactMarkdown from "react-markdown";
import {useLocalForm, useCMS} from "tinacms";


export const MainCore: React.FunctionComponent<{
    title: string;
    content: string;
}> = ({title, content}) => {
    return (
        <div>
            <h1>{title}</h1>
            <ReactMarkdown source={content || ""}></ReactMarkdown>
        </div>
    );
}

export const Main: React.FunctionComponent<{postId: string | null}> = ({postId}) => {
    const cms = useCMS();
    const [{title, content}] = useLocalForm({
        id: "__main:" + postId,
        label: "Main content",
        fields: [
            {
                name: 'title',
                label: 'Title',
                component: 'text',
            },
            {
                name: 'content',
                label: 'content',
                component: 'markdown',
            }
        ],
        loadInitialValues: () => postId === null ? Promise.resolve({
            title: "Empty post",
            content: "",
        }) : cms.api.posts.get({id: postId}),
        onSubmit: ({title, content}: {title: string, content: string}) => {
            if (postId !== null) {
                cms.api.posts.update({
                    id: postId,
                    title,
                    content,
                });
            }
        }
    });
    return <MainCore title={title} content={content}/>
}