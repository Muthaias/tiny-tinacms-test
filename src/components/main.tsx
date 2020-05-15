import * as React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

import {useContent, ContentData, ContentType} from "../contexts/content";

const ContentWrapper = styled.div`
    padding: var(--theme-padding-big) var(--theme-padding-huge);
    font-family: var(--theme-font-family);
    font-size: var(--theme-font-size-medium);
    background: var(--theme-color-content-background);
    min-height: calc(100vh - var(--theme-height-header));
`

const Header = styled.div`
    position: relative;
    background-image: url('${props => props.data.headerImage || ""}');
    background-color: #333;
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto var(--theme-header-image-size);
    width: 100%;
    height: var(--theme-height-header);
    font-size: var(--theme-font-size-small);
`

const ContentTitle = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    padding: var(--theme-padding-small);
    background: var(--theme-header-text-background);
    color: var(--theme-header-text-color);
    max-width: calc(0.5 * var(--theme-width-max));
    font-size: var(--theme-font-size-big);
`

export const MainCore: React.FunctionComponent<ContentData> = (data) => {
    return (
        <>
            <Header data={data}>
                <ContentTitle>{data.title}</ContentTitle>
            </Header>
            <ContentWrapper>
                {(() => {
                    switch(data.type) {
                        case ContentType.Listing: return (
                            <>
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