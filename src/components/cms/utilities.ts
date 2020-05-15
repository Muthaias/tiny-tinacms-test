import {
    FormOptions,
    useForm,
    usePlugin,
} from "tinacms";

import {
    Entry,
    Post,
} from "../../modules/datastore";

export function useContentForm(
    postId: string,
    loadInitialValues: () => Promise<Entry & Post>,
    onSubmit: ({title, content, imageUrl}: {title: string, content: string, imageUrl?: string}) => Promise<void>,
    label: string = "Post content",
) {
    const formOptions: FormOptions<Entry & Post> = {
        id: "__main:" + postId,
        label: label,
        fields: [
            {
                name: "title",
                label: "Title",
                component: "text",
            },
            {
                name: "content",
                label: "Content",
                component: "markdown",
            },
            {
                name: "imageUrl",
                label: "Header Image URL",
                component: "text",
            }
        ],
        loadInitialValues: loadInitialValues,
        onSubmit: onSubmit
    };
    const [post, postForm] = useForm<Entry & Post>(formOptions);
    usePlugin(postForm);
    return post;
}