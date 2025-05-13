import { useMemo, useState } from "react";

interface usePaginationParams<T> {
    itemsPerPage: number,
    allItems: T[];
}

export function usePagination<T>({ itemsPerPage, allItems }: usePaginationParams<T>) {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(allItems.length / 3);

    const displayedItems = useMemo(() => {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        return allItems.slice(start, end);
    }, [currentPage, itemsPerPage, allItems]);

    const handlePrevPage = () => {
        setCurrentPage(Math.max(currentPage - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage(Math.min(currentPage + 1, totalPages - 1));
    };

    const canPrevPage = allItems.length > 0 && currentPage > 0;
    const canNextPage = allItems.length > 0 && currentPage < totalPages - 1;

    return {
        displayedItems,
        handlePrevPage,
        handleNextPage,
        canPrevPage,
        canNextPage,
    };
}