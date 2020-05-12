import { createGlobalStyle, css } from "styled-components";

const theme = css`
    :root {
        --theme-padding-big: 30px;
        --theme-padding-medium: 20px;
        --theme-padding-small: 10px;
    
        --theme-font-family: verdana, "DejaVu Sans", "Bitstream Vera Sans";
        --theme-font-size-normal: 12px;
    }

    body {
        padding: 0;
        margin: 0;
    }
`

export const ThemeStyles = createGlobalStyle`
  ${theme};
`