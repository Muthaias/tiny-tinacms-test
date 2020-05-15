import * as React from "react";
import styled from "styled-components";

import {MenuData} from "../contexts/menu";

const MenuWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    background: var(--theme-header-text-background);
    color: var(--theme-header-text-color);
    font-family: var(--theme-font-family);
`
const MenuItem = styled.div`
    padding: var(--theme-padding-small);
    margin: 0;
    white-space: nowrap;
    background: rgba(255, 255, 255, 0);
    transition: background 0.1s, color 0.1s;
    &:hover {
        background: rgba(255, 255, 255, 0.9);
        color: #000;
    }
`

export interface MenuProps extends MenuData {
};

export const Menu: React.SFC<MenuProps> = function ({items}: MenuProps) {

    return (
        <MenuWrapper>
            {items.map(item => (
                <MenuItem key={item.key} onClick={item.onClick}>
                    {item.label}
                </MenuItem>
            ))}
        </MenuWrapper>
    );
}
