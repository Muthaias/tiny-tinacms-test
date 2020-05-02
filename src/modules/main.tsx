import * as React from "react";
import ReactMarkdown from "react-markdown";
import {useLocalForm} from "tinacms";


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

export const Main: React.FunctionComponent = () => {
  const [{title, content}] = useLocalForm({
    id: "__main",
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
    loadInitialValues: async () => {
      return JSON.parse(window.localStorage.getItem("__main") || "null") || {
        title: "title",
        content: "content"
      }
    },
    onSubmit: (values: {title: string, content: string}) => {
      window.localStorage.setItem("__main", JSON.stringify(values));
    }
  });
  return <MainCore title={title} content={content}/>
}