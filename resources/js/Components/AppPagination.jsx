import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

function AppPagination({ paginationData }) {
    const { prev_page_url, next_page_url, current_page, last_page, links } =
        paginationData;

    // Generate pagination links, only showing 4 page numbers
    const generateLinks = () => {
        const numberLinks = [];
        const startPage = Math.max(current_page - 2, 1);
        const endPage = Math.min(current_page + 2, last_page);

        for (let i = startPage; i <= endPage; i++) {
            numberLinks.push(i);
        }

        return numberLinks;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={prev_page_url} />
                </PaginationItem>
                {generateLinks().map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={links[page].url}
                            isActive={links[page].active}
                        >
                            {links[page].label}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext href={next_page_url} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default AppPagination;
