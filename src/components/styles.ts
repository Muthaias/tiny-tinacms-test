import { createGlobalStyle, css } from "styled-components";

const theme = css`
    :root {
        --theme-padding-small: 10px;
        --theme-padding-medium: 20px;
        --theme-padding-big: 30px;
        --theme-padding-huge: 60px;

        --theme-width-max: 1200px;
        --theme-height-header: 300px;

        --theme-header-image-size: 100%;
    
        --theme-font-family: verdana, "DejaVu Sans", "Bitstream Vera Sans";
        --theme-font-size-small: 12px;
        --theme-font-size-medium: 18px;
        --theme-font-size-big: 24px;

        --theme-header-text-background: rgba(0, 0, 0, 0.6);
        --theme-header-text-color: #fff;

        --theme-color-background: #eee;
        --theme-color-deep-background: #333;
        --theme-color-content-background: #fff;
    }

    body {
        padding: 0;
        margin: 0;
        font-family: var(--theme-font-family);
        background: var(--theme-color-background);
    }

    * {
        box-sizing: border-box;
    }
`

export const ThemeStyles = createGlobalStyle`
    ${theme};
`
type DeviceIds = "mobile" | "tablet" | "desktop";

export const Devices: Record<DeviceIds, string> = ["mobile", "tablet", "desktop"].reduce((acc, key) => {
    acc[key] = `(min-width: ${acc[key]})`;
    return acc;
}, {
    mobile: "425px",
    tablet: "1024px",
    desktop: "1920px",
});