import * as React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

import {useContent, ContentData, ContentType} from "../contexts/content";
import {Devices} from "./styles";

const TextWrapper = styled.div`
    font-family: var(--theme-font-family);
    font-size: var(--theme-font-size-small);
    background: var(--theme-color-content-background);

    padding: var(--theme-padding-small) var(--theme-padding-medium);

    @media ${Devices.tablet} {
        padding: var(--theme-padding-big) var(--theme-padding-huge);
        font-size: var(--theme-font-size-medium);
    }
`

const ContentWrapper = styled.div`
    background: var(--theme-color-content-background);
    min-height: calc(100vh);
`

const Header = styled.div`
    position: relative;
    background-image: url('${props => props.data.imageUrl || ""}');
    background-color: #333;
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto var(--theme-header-image-size);
    width: 100%;
    height: var(--theme-height-header);
    font-size: var(--theme-font-size-small);
    text-align: center;
`

const ContentTitle = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    padding: var(--theme-padding-small);
    background: var(--theme-header-text-background);
    color: var(--theme-header-text-color);
    font-size: var(--theme-font-size-big);
    width: 100%;

    @media ${Devices.tablet} {
        width: auto;
        max-width: calc(0.5 * var(--theme-width-max));
    }
`

export const MainCore: React.FunctionComponent<ContentData> = (data) => {
    return (
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
                    case ContentType.Post: return data.contentBlocks.map((block, index) => {
                        switch (block.type) {
                            case "title": return (
                                <Header key={index} data={block}>
                                    <ContentTitle>{block.title}</ContentTitle>
                                </Header>
                            );
                            case "text": return (
                                <TextWrapper key={index}>
                                    <ReactMarkdown key={index} source={block.text || ""} />
                                </TextWrapper>
                            );
                            default: return null;
                        }
                    });
                }
            })()}
        </ContentWrapper>
    );
}

export const Main: React.SFC = () => {
    const content = useContent();
    return <MainCore {...content}/>
}