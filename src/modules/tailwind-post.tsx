import * as React from "react";
import ReactMarkdown from "react-markdown";
import {Post, Author} from "./datastore";

import "./tailwind-post.css";

export const TailwindPost: React.FunctionComponent<{post: Post, author: Author}> = ({post, author}) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="ml-6 pt-1">
                <h1 className="text-xl text-gray-900 leading-tight mb-4">{post.title}</h1>
                <div className="text-base text-gray-600 leading-normal">
                    <ReactMarkdown source={post.content || ""}></ReactMarkdown>
                </div>
            </div>
        </div>
    );
}