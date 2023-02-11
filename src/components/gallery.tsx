import * as React from "react";
import styled, {css} from "styled-components";

export interface GalleryProps {
    images: {
        imageUrl: string;
        title: string;
    }[];
    height: string;
};

export const Gallery: React.FunctionComponent<GalleryProps> = ({images}) => {
    const [positionIndex, setPositionIndex] = React.useState(0);
    const [positions, setPositions] = React.useState([-50]);
    const [imageCount, setImageCount] = React.useState(0);
    const galleryElement = React.useRef<typeof GalleryWrapper>(null);
    const sliderElement = React.useRef<typeof GallerySlider>(null);
    React.useEffect(() => {
        if (positions.length <= positionIndex) {
            setPositionIndex(Math.min(positionIndex, positions.length - 1))
        }
    }, [positions, positionIndex]);
    React.useEffect(() => {
        const setSize = () => {
            const galleryWidth = galleryElement && galleryElement.current.clientWidth;
            const sliderWidth = sliderElement && sliderElement.current.clientWidth;
            if (sliderWidth && galleryWidth) {
                const positionCount = Math.ceil(sliderWidth / galleryWidth);
                if (positionCount !== positions.length && positionCount > 1) {
                    const realPositionCount = Math.max(images.length, positionCount);
                    setPositions(Array.from({length: realPositionCount}).map((_, index) => (
                        -((0.5 / realPositionCount) + (1 / realPositionCount) * index) * 100
                    )));
                } else if (positionCount === 1) {
                    setPositions([-50]);
                }
            }
        };
        window.addEventListener("resize", setSize);
        setSize();
        return () => {
            window.removeEventListener("resize", setSize);
        };
    }, [galleryElement, sliderElement, imageCount, positions.join(",")]);
    return (
        <GalleryWrapper ref={galleryElement}>
            <GallerySlider ref={sliderElement} translateX={positions[positionIndex]}>
                {images.map((image, index) => (
                    <GalleryItemWrapper key={index}>
                        <GalleryItem src={image.imageUrl} onLoad={() => setImageCount(imageCount + 1)}/>
                        {image.title && <GalleryItemTitle>{image.title}</GalleryItemTitle>}
                    </GalleryItemWrapper>
                ))}
            </GallerySlider>
            {positions.length > 1 && <GalleryNav orientation={"left"} onClick={() => setPositionIndex((positions.length + positionIndex - 1) % positions.length)}>{"<"}</GalleryNav>}
            {positions.length > 1 && <GalleryNav orientation={"right"} onClick={() => setPositionIndex((positionIndex + 1) % positions.length)}>{">"}</GalleryNav>}
        </GalleryWrapper>
    );
};

const GalleryNav = styled.div`
    position: absolute;
    top: 50%;
    padding: var(--theme-padding-small);
    transform: translateY(-50%);
    background: var(--theme-header-text-background);
    color: var(--theme-header-text-color);
    ${props => (props.orientation === "left" ? (
        css`
            left: var(--theme-padding-small);
        `
    ) : (
        css`
            right: var(--theme-padding-small);
        `
    ))}
`

const GallerySlider = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(${props => props.translateX}%);
    transition: transform 0.1s;
`

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
    display: block;
`

const GalleryWrapper = styled.div`
    position: relative;
    background: var(--theme-color-deep-background);
    height: var(--theme-height-gallery);
    max-width: var(--theme-width-max);
    border-top: solid 1px var(--theme-color-deep-background);
    border-bottom: solid 1px var(--theme-color-deep-background);
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
`