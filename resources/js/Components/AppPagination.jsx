import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "@inertiajs/react";

function AppPagination({ paginationData }) {
    const { prev_page_url, next_page_url, current_page, last_page, links } =
        paginationData;

    // Generate pagination links, only showing 4 page numbers
    const generateLinks = () => {
        const numberLinks = [];
        const startPage = Math.max(current_page - 1, 1);
        const endPage = Math.min(current_page + 1, last_page);

        for (let i = startPage; i <= endPage; i++) {
            numberLinks.push(i);
        }

        return numberLinks;
    };

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous Page */}
                <PaginationItem>
                    {prev_page_url ? (
                        <Link href={prev_page_url} preserveState>
                            <PaginationPrevious />
                        </Link>
                    ) : (
                        <PaginationPrevious className="opacity-50 cursor-not-allowed" />
                    )}
                </PaginationItem>

                {/* First Page */}
                {current_page > 2 && (
                    <PaginationItem>
                        <Link href={links[1]?.url} preserveState>
                            <PaginationLink>1</PaginationLink>
                        </Link>
                    </PaginationItem>
                )}

                {/* Ellipsis if needed */}
                {current_page > 3 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Page Numbers */}
                {generateLinks().map((page) => (
                    <PaginationItem key={page}>
                        <Link href={links[page]?.url} preserveState>
                            <PaginationLink isActive={current_page === page}>
                                {page}
                            </PaginationLink>
                        </Link>
                    </PaginationItem>
                ))}

                {/* Ellipsis if needed */}
                {current_page < last_page - 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Last Page */}
                {current_page < last_page - 1 && (
                    <PaginationItem>
                        <Link href={links[last_page]?.url} preserveState>
                            <PaginationLink>{last_page}</PaginationLink>
                        </Link>
                    </PaginationItem>
                )}

                {/* Next Page */}
                <PaginationItem>
                    {next_page_url ? (
                        <Link href={next_page_url} preserveState>
                            <PaginationNext />
                        </Link>
                    ) : (
                        <PaginationNext className="opacity-50 cursor-not-allowed" />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default AppPagination;
