import { useState } from 'react';

interface UsePaginationProps {
    contentPerPage: number;
    count: number;
}

//prettier-ignore
const usePaginationHOOK = ({ contentPerPage, count }: UsePaginationProps) => {
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(count / contentPerPage);
    // index of last item of current page
    const lastContentIndex = page * contentPerPage;
    // index of first item of current page
    const firstContentIndex = lastContentIndex - contentPerPage;

    // change page based on direction either front or back
    const changePage = (direction: boolean) => {
        setPage(state => {
            // move forward
            if (direction) {
                // if page is the last page, do nothing
                if (state === pageCount) {
                    return state;
                }
                return state + 1;
                // go back
            } else {
                // if page is the first page, do nothing
                if (state === 1) {
                    return state;
                }
                return state - 1;
            }
        });
    };

    const setPageSAFE = (num: number) => {
        if (num > pageCount) {
   //         console.log(num, pageCount)
            setPage(pageCount);

        } else if (num < 1) {
            setPage(1);
        } else {
            setPage(num);
        }
    };

    return {
        totalPages: pageCount,
        nextPage: () => changePage(true),
        prevPage: () => changePage(false),
        setPage: setPageSAFE,
        // chunk,
        // handleChunk,
        lastContentIndex,
        firstContentIndex,
        page,
    };
};



export default usePaginationHOOK 