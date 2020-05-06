import * as React from "react";
import ReactMarkdown from "react-markdown";
import {useLocalForm, useCMS} from "tinacms";
import {TailwindPost} from "./tailwind-post";

export const MainCore: React.FunctionComponent<{
    title: string;
    content: string;
}> = ({title, content}) => {
    return (
        <div>
            <TailwindPost post={{title: title, content: content, type: "basic"}} author={{name: "Mattias Nyberg"}}></TailwindPost>
        </div>
    );
}

export const Main: React.FunctionComponent<{postId: string | null}> = ({postId}) => {
    const cms = useCMS();
    const [{title, content, image}] = useLocalForm({
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
            },
            {
                name: "image",
                label: "Image",
                component: "image",
                previewSrc: (formValues, data) => {
                    console.log(formValues, data);
                },
                uploadDir: blogPost => {
                    console.log(blogPost);
                    return blogPost;
                },
                parse: filename => {
                    console.log(filename);
                    return filename;
                },
            }
        ],
        loadInitialValues: () => postId === null ? Promise.resolve({
            title: "Empty post: Hello world!",
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
    console.log(image);
    return <MainCore title={title} content={content}/>
}