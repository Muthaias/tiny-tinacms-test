import * as React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

import {useContent, ContentData, ContentType} from "../contexts/content";

const ContentWrapper = styled.div`
    padding: var(--theme-padding-big);
    font-family: var(--theme-font-family);
    font-size: var(--theme-font-size-normal);
`

const HeaderImage = styled.div`
    background-image: url('${props => props.headerImage || ""}');
    background-color: #333;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
    width: 100%;
    height: 300px;
`

export const MainCore: React.FunctionComponent<ContentData> = (data) => {
    return (
        <>
            <HeaderImage data={data}/>
            <ContentWrapper>
                {(() => {
                    switch(data.type) {
                        case ContentType.Listing: return (
                            <>
                                <h1>{data.title}</h1>
                                <ul>
                                    {data.entries.map(entry => (
                                        <li key={entry.id}>{entry.title}</li>
                                    ))}
                                </ul>
                            </>
                        );
                        case ContentType.Page:
                        case ContentType.Post: return (
                            <>
                                <h1>{data.title}</h1>
                                <ReactMarkdown source={data.content || ""}></ReactMarkdown>
                            </>
                        );
                    }
                })()}
            </ContentWrapper>
        </>
    );
}

export const Main: React.SFC = () => {
    const content = useContent();
    return <MainCore {...content}/>
}