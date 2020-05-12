import * as React from "react";
import styled from "styled-components";

import {Main} from "./main";
import {Menu} from "../components/menu";
import {useMenu} from "../contexts/menu";

const MenuContainer = styled.div`
    position: absolute;
    top: var(--theme-padding-big);
    left: 0;
    width: 100%;
`;

const ApplicationContainer = styled.div`
    position: relative;
`

export const Application: React.FunctionComponent = () => {
    const menu = useMenu();
    return (
        <ApplicationContainer className="application">
            <MenuContainer>
                <Menu items={menu.items}></Menu>
            </MenuContainer>
            <Main/>
        </ApplicationContainer>
    );
}