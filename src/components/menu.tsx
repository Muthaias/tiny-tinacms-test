import * as React from "react";
import styled from "styled-components";

import {MenuData} from "../contexts/menu";
import {Devices} from "./styles";

const MenuWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    padding-top: 50px;
    overflow: hidden;
    background: var(--theme-header-text-background);
    color: var(--theme-header-text-color);
    font-family: var(--theme-font-family);
    transition: height 0.1s;

    &.open {
        height: 100vh;
        overflow: auto;
        background: rgba(0, 0, 0, 0.9);
    }

    @media ${Devices.tablet} {
        position: relative;
        top: auto;
        left: auto;
        width: auto;
        height: auto;
        padding: 0;
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
    }
`

const MenuToggleBar = styled.div`
    position: absolute;
    display: block;
    background: rgba(255, 255, 255, 1.0);
    width: 60%;
    height: 4%;
    transform: rotate(0deg);
    transition: background 0.1s, transform 0.1s, top 0.1s;
`

const MenuToggle = styled.div`
    @media ${Devices.tablet} {
        display: none;
    }

    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    color: var(--theme-header-text-color);
    background: rgba(255, 255, 255, 0.0);
    transition: background 0.1s, color 0.1s;
    &:hover {
        background: rgba(255, 255, 255, 0.9);
        color: #000;

        ${MenuToggleBar} {
            background: #000;
        }
    }
    ${MenuToggleBar}:nth-child(1) {
        top: 30%;
        left: 20%;
    }
    ${MenuToggleBar}:nth-child(2) {
        top: 48%;
        left: 20%;
    }
    ${MenuToggleBar}:nth-child(3) {
        top: 66%;
        left: 20%;
    }
    &.open {
        ${MenuToggleBar}:nth-child(1) {
            top: 48%;
            left: 20%;
            transform: rotate(45deg);
        }
        ${MenuToggleBar}:nth-child(2) {
            background: rgba(255, 255, 255, 0.0);
            transform: rotate(360deg);
        }
        ${MenuToggleBar}:nth-child(3) {
            top: 48%;
            left: 20%;
            transform: rotate(-45deg);
        }
    }
`

const MenuItem = styled.div`
    padding: var(--theme-padding-small);
    margin: 0;
    white-space: nowrap;
    background: rgba(255, 255, 255, 0);
    transition: background 0.1s, color 0.1s;
    overflow: hidden;
    text-align: center;
    &:hover {
        background: rgba(255, 255, 255, 0.9);
        color: #000;
    }
    @media ${Devices.tablet} {
        max-width: calc(0.2 * var(--theme-width-max));
    }
`

export interface MenuProps extends MenuData {
};

export const Menu: React.FunctionComponent<MenuProps> = function ({items}: MenuProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <MenuWrapper className={"menu-wrapper" + (open ? " open" : "")}>
                {items.map(item => (
                    <MenuItem key={item.key} onClick={() => {
                        item.onClick && item.onClick();
                        setOpen(false);
                    }}>
                        {item.label}
                    </MenuItem>
                ))}
            </MenuWrapper>
            <MenuToggle className={"menu-toggle" + (open ? " open" : "")} onClick={() => setOpen(!open)}>
                <MenuToggleBar />
                <MenuToggleBar />
                <MenuToggleBar />
            </MenuToggle>
        </>
    );
}
