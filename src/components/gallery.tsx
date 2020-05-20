import * as React from "react";
import styled from "styled-components";

export interface GalleryProps {
    images: {
        imageUrl: string;
        title: string;
    }[];
    height: string;
};

export const Gallery: React.SFC<GalleryProps> = ({images}) => {
    return (
        <GalleryWrapper>
            {images.map((image, index) => (
                <GalleryItemWrapper key={index}>
                    <GalleryItem src={image.imageUrl}/>
                    {image.title && <GalleryItemTitle>{image.title}</GalleryItemTitle>}
                </GalleryItemWrapper>
            ))}
        </GalleryWrapper>
    );
};


const GalleryItemWrapper = styled.div`
    position: relative;
    font-size: var(--theme-font-size-small);
    height: 100%;
    display: inline-block;
`

const GalleryItemTitle = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    padding: var(--theme-padding-small);
    background: var(--theme-header-text-background);
    color: var(--theme-header-text-color);
`

const GalleryItem = styled.img`
    height: 100%;
    display: inline-block;
`

const GalleryWrapper = styled.div`
    background: var(--theme-color-deep-background);
    height: var(--theme-height-gallery);
    max-width: var(--theme-width-max);
    border: solid 1px var(--theme-color-deep-background);
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
`