import * as React from "react";
import {ScreenOptions} from "@tinacms/react-screens";
import styled from "styled-components";

const ContentWrapper = styled.div`
    padding: var(--tina-padding-big);
    background: var(--tina-color-grey-2);
`
const ListWrapper = styled.div`
    background: var(--tina-color-grey-0);
    border: solid 1px var(--tina-color-grey-3);
    border-radius: var(--tina-radius-small);
`
const IconButton = styled.div`
    color: var(--tina-color-grey-3);
    flex-grow: 0;
    line-height: 300%;
    padding: 0 var(--tina-padding-small);
`

const ElementWrapper = styled.div`
    display: flex;
    flex-wrap: no-wrap;
    padding: 0;
    margin: 0;
    font-size: var(--tina-font-size-1);
    color: var(--tina-color-grey-9);
    border-bottom: solid 1px var(--tina-color-grey-3);
    &:last-child {
        border-bottom: none;
    }
    &:hover ${IconButton} {
        color: var(--tina-color-grey-9);
    }
`
const TextWrapper = styled.div`
    display: inline-block;
    width: 100%;
    line-height: 300%;
    padding: 0 var(--tina-padding-small);
    font-weight: bold;
`

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
`

const PageEntry = styled.div`
    position: relative;
    flex-grow: 0;
    width: 40px;
    height: 40px;
    &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        content: "";
        display: block;
        background: var(--tina-color-grey-5);
        width: 20%;
        height: 20%;
        border-radius: 50%;
        transition: width 0.1s, height 0.1s;
    }
    ${({ active }) => !active && `
        &:hover {
            &::after {
                width: 40%;
                height: 40%;
                background: var(--tina-color-grey-9);
            }
        }
    `}
    ${({ active }) => active && `
        &::after {
            background: var(--tina-color-grey-9);
        }
    `}
`

export interface Entry<T> {
    label: string;
    entry: T;
};
export interface EntrySupplier<T> {
    getEntries(start: number, end: number): Promise<Entry<T>[]>;
    count(): Promise<number>;
    viewEntry(entry: Entry<T>);
    removeEntry(entry: Entry<T>): Promise<void>;
};

export function useEntrySelection<T>(name: string, supplier: EntrySupplier<T>, entriesPerPage: number = 10): ScreenOptions {
    const plugin = React.useMemo<ScreenOptions>(() => ({
        name: name,
        Icon: () => (
            <span></span>
        ),
        layout: 'popup',
        Component: (props) => {
            const [page, setPage] = React.useState(0);
            const [pageCount, setPageCount] = React.useState(0);
            const [entries, setEntries] = React.useState<Entry<T>[]>([]);
            React.useEffect(() => {
                supplier.getEntries(page * entriesPerPage, (page + 1) * entriesPerPage).then((entries) => {
                    setEntries(entries);
                });
            }, [page]);
            React.useEffect(() => {
                supplier.count().then((count) => setPageCount(Math.ceil(count / entriesPerPage)));
            }, [])
            return (
                <ContentWrapper>
                    <ListWrapper>
                        {entries.map((e, index) => {
                            return (
                                <ElementWrapper key={index}>
                                    <TextWrapper
                                        onClick={() => {
                                            supplier.viewEntry(e);
                                            props.close();
                                        }}
                                    >{e.label}</TextWrapper>
                                    {supplier.removeEntry && <IconButton>x</IconButton>}
                                </ElementWrapper>
                            );
                        })}
                    </ListWrapper>
                    <PaginationWrapper>
                        {Array.from({length: pageCount}).map((_, p) => (
                            <PageEntry active={p === page} key={p} onClick={() => setPage(p)}/>
                        ))}
                    </PaginationWrapper>
                </ContentWrapper>
            );
        }
    }), [name, supplier, entriesPerPage]);
    return plugin;
}