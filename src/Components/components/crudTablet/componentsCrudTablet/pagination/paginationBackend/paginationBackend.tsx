import { useState, useEffect, useRef } from "react";
import { Col, Pagination } from "react-bootstrap";
import { ChunkCrudTabletProps } from "../../../interfaceCrudtablet";


export interface PaginationCrudTabletProps {
    items: number;
    itemPerPage: number;
    setChunk: (arg: ChunkCrudTabletProps) => void;
}

export function PaginationBackend({ items, itemPerPage, setChunk }: PaginationCrudTabletProps) {
    const [page, setPage] = useState<number>(1);
    const pageCount = Math.ceil(items / itemPerPage);
    const chunkRef = useRef(setChunk);

    useEffect(() => {
        chunkRef.current = setChunk;
    }, [setChunk]);

    useEffect(() => {
        const lastContent = page * itemPerPage;
        const firstContentIndex = lastContent - itemPerPage;
        const lastContentIndex = itemPerPage;

        chunkRef.current({
            firstContentIndex: firstContentIndex,
            lastContentIndex: lastContentIndex,
        });
    }, [items, itemPerPage, page]);

    const changePage = (direction: boolean) => {
        setPage(state => {
            if (direction) {
                if (state === pageCount) return state;
                return state + 1;
            } else {
                if (state === 1) return state;
                return state - 1;
            }
        });
    };

    const setPageSAFE = (num: number) => {
        if (num > pageCount) {
            setPage(pageCount);
        } else if (num < 1) {
            setPage(1);
        } else {
            setPage(num);
        }
    };

    const getItemProps = (index: number) => ({
        active: page === (index + 1),
        onClick: () => { setPageSAFE(index + 1); }
    });

    const next = (page: number) => {
        changePage(true);
        if (page === pageCount) return;
        setPageSAFE(page + 1);
    };

    const prev = (page: number) => {
        changePage(false);
        if (page === 1) return;
        setPageSAFE(page - 1);
    };

    const rangeStart = Math.max(page - 2, 1);
    const rangeEnd = Math.min(page + 2, pageCount);

    const pageButtons: JSX.Element[] = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
        pageButtons.push(
            <Pagination.Item key={i} active={page === i} onClick={() => setPageSAFE(i)}>
                {i}
            </Pagination.Item>
        );
    }

    return (
        <Col sm={6} lg={4} className="pb-5">
            <Pagination className="pagination-primary mg-sm-b-0">
                <Pagination.Prev onClick={() => prev(page)} disabled={page === 1} />
                {pageButtons}
                <Pagination.Next onClick={() => next(page)} disabled={page === pageCount} />
            </Pagination>
        </Col>
    );
}
