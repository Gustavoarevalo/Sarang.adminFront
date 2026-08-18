import { useEffect } from "react";
import usePaginationHOOK from "../hookpagination";
import { ChunkCrudTabletProps } from "../../../interfaceCrudtablet";
import { Col, Pagination } from "react-bootstrap";

export interface PaginationCrudTabletProps {
    items: number;
    itemPerPage: number;
    setChunk: (arg: ChunkCrudTabletProps) => void;
}

export function PaginationCrudTablet({ items, itemPerPage, setChunk }: PaginationCrudTabletProps) {
    const { firstContentIndex, lastContentIndex, nextPage, prevPage, page, setPage, totalPages } = usePaginationHOOK({
        contentPerPage: itemPerPage,
        count: items,
    });

    useEffect(() => {
        setChunk({
            firstContentIndex,
            lastContentIndex,
        });
    }, [page, itemPerPage, firstContentIndex, lastContentIndex, setChunk]);

    const getItemProps = (index: number) => ({
        variant: page === index ? "outlined" : "text",
        className: page === index ? "border-primary-500 text-primary-500" : "text-primary-300",
        onClick: () => setPage(index),
    });

    const rangeStart = Math.max(page - 2, 1);
    const rangeEnd = Math.min(page + 2, totalPages);

    const pageButtons: JSX.Element[] = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
        pageButtons.push(
            <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                {i}
            </Pagination.Item>
        );
    }

    return (
        <Col sm={6} lg={4} className="pb-5">
            <Pagination className="pagination-primary mg-sm-b-0">
                <Pagination.Prev onClick={() => prevPage()} disabled={page === 1} />
                {pageButtons}
                <Pagination.Next onClick={() => nextPage()} disabled={page === totalPages} />
            </Pagination>
        </Col>
    );
}
