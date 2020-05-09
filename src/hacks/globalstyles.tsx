
import { createGlobalStyle, css } from 'styled-components'

const theme = css`
  :root {
    --tina-color-primary-light: #2296fe;
    --tina-color-primary: #2296fe;
    --tina-color-primary-dark: #0574e4;
    --tina-color-error-light: #eb6337;
    --tina-color-error: #ec4815;
    --tina-color-error-dark: #dc4419;
    --tina-color-warning-light: #f5e06e;
    --tina-color-warning: #e9d050;
    --tina-color-warning-dark: #d3ba38;
    --tina-color-success-light: #57c355;
    --tina-color-success: #3cad3a;
    --tina-color-success-dark: #249a21;
    --tina-color-grey-0: #ffffff;
    --tina-color-grey-1: #f6f6f9;
    --tina-color-grey-2: #edecf3;
    --tina-color-grey-3: #e1ddec;
    --tina-color-grey-4: #b2adbe;
    --tina-color-grey-5: #918c9e;
    --tina-color-grey-6: #716c7f;
    --tina-color-grey-7: #565165;
    --tina-color-grey-8: #433e52;
    --tina-color-grey-9: #363145;
    --tina-color-grey-10: #282828;

    --tina-radius-small: 5px;
    --tina-radius-big: 24px;

    --tina-padding-small: 12px;
    --tina-padding-big: 20px;

    --tina-font-size-0: 11px;
    --tina-font-size-1: 13px;
    --tina-font-size-2: 15px;
    --tina-font-size-3: 16px;
    --tina-font-size-4: 18px;
    --tina-font-size-5: 20px;
    --tina-font-size-6: 22px;
    --tina-font-size-7: 26px;
    --tina-font-size-8: 32px;

    --tina-font-family: sans-serif;

    --tina-font-weight-regular: 500;
    --tina-font-weight-bold: 600;

    --tina-shadow-big: 0px 2px 3px rgba(0, 0, 0, 0.12),
      0px 4px 8px rgba(48, 48, 48, 0.1);
    --tina-shadow-small: 0px 2px 3px rgba(0, 0, 0, 0.12);

    --tina-timing-short: 85ms;
    --tina-timing-medium: 150ms;
    --tina-timing-long: 250ms;

    --tina-z-index-0: 500;
    --tina-z-index-1: 1000;
    --tina-z-index-2: 1500;
    --tina-z-index-3: 2000;
    --tina-z-index-4: 2500;

    --tina-sidebar-width: 340px;
    --tina-sidebar-header-height: 60px;
    --tina-toolbar-height: 62px;
  }
`

export const GlobalStyles = createGlobalStyle`
  ${theme};
`