import { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    FileText,
    Search,
    Filter,
    User,
    MapPin,
    Calendar,
    Signature,
    MessageSquare,
    Eye,
    X,
    Download,
} from "lucide-react";
import AppPagination from "@/components/AppPagination";

export default function DCRsIndex() {
    const {
        dcrs,
        customers,
        medicalRepresentatives,
        filters: initialFilters = {},
    } = usePage().props;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [firstStart, setFirstStart] = useState(true);

    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        customer_id: initialFilters.customer_id || "",
        medical_representative_id:
            initialFilters.medical_representative_id || "",
        start_date: initialFilters.start_date || "",
        end_date: initialFilters.end_date || "",
        has_signature: initialFilters.has_signature || "all",
        sort_by: initialFilters.sort_by || "dcr_date",
        sort_order: initialFilters.sort_order || "desc",
    });

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "Not synced";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const renderSignature = (signatureBlob) => {
        if (!signatureBlob) return null;

        try {
            if (
                signatureBlob.startsWith("data:") ||
                signatureBlob.startsWith("blob:")
            ) {
                return (
                    <img
                        src={signatureBlob}
                        alt="Signature"
                        className="h-8 w-16 object-contain border rounded"
                    />
                );
            } else {
                return (
                    <img
                        src={`data:image/png;base64,${signatureBlob}`}
                        alt="Signature"
                        className="h-8 w-16 object-contain border rounded"
                    />
                );
            }
        } catch (error) {
            return (
                <span className="text-xs text-muted-foreground">
                    Error loading signature
                </span>
            );
        }
    };

    const fetchDCRs = async (params = {}) => {
        setIsRefreshing(true);
        try {
            await router.get(route("dcrs.index"), params, {
                preserveState: true,
                onSuccess: () => {
                    setIsRefreshing(false);
                },
                onError: (error) => {
                    console.error("Error fetching DCRs:", error);
                    setIsRefreshing(false);
                },
            });
        } catch (error) {
            console.error("Error fetching DCRs:", error);
            setIsRefreshing(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            customer_id: "",
            medical_representative_id: "",
            start_date: "",
            end_date: "",
            has_signature: "all",
            sort_by: "dcr_date",
            sort_order: "desc",
        });
    };

    const hasActiveFilters = () => {
        return (
            filters.search ||
            filters.customer_id ||
            filters.medical_representative_id ||
            filters.start_date ||
            filters.end_date ||
            filters.has_signature !== "all" ||
            filters.sort_by !== "dcr_date"
        );
    };

    // Trigger search/filter on change with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!firstStart) {
                fetchDCRs(filters);
            } else {
                setFirstStart(false);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [filters]);

    return (
        <AuthenticatedLayout>
            <Head title="Daily Call Reports (DCR)" />

            <div className="container max-w-7xl mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <FileText className="h-8 w-8 text-primary" />
                            Daily Call Reports (DCR)
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            View and manage daily call reports from medical
                            representatives
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => fetchDCRs(filters)}
                            disabled={isRefreshing}
                            className="gap-2"
                        >
                            {isRefreshing ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                <div className="h-4 w-4" />
                            )}
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Search and Filters Section */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Search & Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search Input */}
                            <div className="lg:col-span-2">
                                <Label
                                    htmlFor="search"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    Search DCRs
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search by customer, address, remarks, or medical representative..."
                                        value={filters.search}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "search",
                                                e.target.value
                                            )
                                        }
                                        className="pl-10"
                                    />
                                    {filters.search && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                                            onClick={() =>
                                                handleFilterChange("search", "")
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Customer Filter */}
                            <div>
                                <Label
                                    htmlFor="customer_id"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    Customer
                                </Label>
                                <Select
                                    value={filters.customer_id}
                                    onValueChange={(value) =>
                                        handleFilterChange("customer_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Customers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Customers
                                        </SelectItem>
                                        {customers.map((customer) => (
                                            <SelectItem
                                                key={customer.id}
                                                value={customer.id}
                                            >
                                                {customer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Medical Representative Filter */}
                            <div>
                                <Label
                                    htmlFor="medical_representative_id"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    Medical Representative
                                </Label>
                                <Select
                                    value={filters.medical_representative_id}
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            "medical_representative_id",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Representatives" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Representatives
                                        </SelectItem>
                                        {medicalRepresentatives.map((mr) => (
                                            <SelectItem
                                                key={mr.id}
                                                value={mr.id}
                                            >
                                                {mr.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            {/* Date Range - Start Date */}
                            <div>
                                <Label
                                    htmlFor="start_date"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    From Date
                                </Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={filters.start_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "start_date",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            {/* Date Range - End Date */}
                            <div>
                                <Label
                                    htmlFor="end_date"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    To Date
                                </Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={filters.end_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "end_date",
                                            e.target.value
                                        )
                                    }
                                    min={filters.start_date}
                                />
                            </div>

                            {/* Signature Filter */}
                            <div>
                                <Label
                                    htmlFor="has_signature"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    Signature
                                </Label>
                                <Select
                                    value={filters.has_signature}
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            "has_signature",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All DCRs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All DCRs
                                        </SelectItem>
                                        <SelectItem value="yes">
                                            With Signature
                                        </SelectItem>
                                        <SelectItem value="no">
                                            Without Signature
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort Options */}
                            <div>
                                <Label
                                    htmlFor="sort_by"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    Sort By
                                </Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={filters.sort_by}
                                        onValueChange={(value) =>
                                            handleFilterChange("sort_by", value)
                                        }
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dcr_date">
                                                Date
                                            </SelectItem>
                                            <SelectItem value="name">
                                                DCR Name
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            handleFilterChange(
                                                "sort_order",
                                                filters.sort_order === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            )
                                        }
                                        className="flex-shrink-0"
                                    >
                                        {filters.sort_order === "asc"
                                            ? "↑"
                                            : "↓"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters & Clear Button */}
                        {hasActiveFilters() && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-muted-foreground">
                                        Active filters:
                                    </span>
                                    {filters.search && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            Search: "{filters.search}"
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "search",
                                                        ""
                                                    )
                                                }
                                            />
                                        </Badge>
                                    )}
                                    {filters.customer_id && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            Customer:{" "}
                                            {
                                                customers.find(
                                                    (c) =>
                                                        c.id ==
                                                        filters.customer_id
                                                )?.name
                                            }
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "customer_id",
                                                        ""
                                                    )
                                                }
                                            />
                                        </Badge>
                                    )}
                                    {filters.medical_representative_id && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            MR:{" "}
                                            {
                                                medicalRepresentatives.find(
                                                    (mr) =>
                                                        mr.id ==
                                                        filters.medical_representative_id
                                                )?.name
                                            }
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "medical_representative_id",
                                                        ""
                                                    )
                                                }
                                            />
                                        </Badge>
                                    )}
                                    {filters.start_date && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            From:{" "}
                                            {formatDate(filters.start_date)}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "start_date",
                                                        ""
                                                    )
                                                }
                                            />
                                        </Badge>
                                    )}
                                    {filters.end_date && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            To: {formatDate(filters.end_date)}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "end_date",
                                                        ""
                                                    )
                                                }
                                            />
                                        </Badge>
                                    )}
                                    {filters.has_signature !== "all" && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            Signature:{" "}
                                            {filters.has_signature === "yes"
                                                ? "With"
                                                : "Without"}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "has_signature",
                                                        "all"
                                                    )
                                                }
                                            />
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="gap-2"
                                >
                                    <X className="h-3 w-3" />
                                    Clear All
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results Summary */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {dcrs?.from || 0} to {dcrs?.to || 0} of{" "}
                        {dcrs?.total || 0} DCRs
                    </div>
                    {hasActiveFilters() && (
                        <div className="text-sm text-blue-600">
                            Filtered results
                        </div>
                    )}
                </div>

                {/* DCRs Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Daily Call Reports
                            {hasActiveFilters() && (
                                <Badge variant="outline" className="ml-2">
                                    Filtered
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">
                                            DCR Name
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Customer
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Address
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Medical Representative
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Date
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Signature
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Remarks
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dcrs?.data?.map((dcr) => (
                                        <TableRow
                                            key={dcr.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    {dcr.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    {dcr.customer?.name ||
                                                        "N/A"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-2 max-w-[200px]">
                                                                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                                <span className="truncate">
                                                                    {dcr
                                                                        .customer
                                                                        ?.full_address ||
                                                                        "N/A"}
                                                                </span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {dcr.customer
                                                                    ?.full_address ||
                                                                    "N/A"}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>
                                                {dcr.medical_representative ? (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3 w-3 text-muted-foreground" />
                                                        {
                                                            dcr
                                                                .medical_representative
                                                                .name
                                                        }
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">
                                                        N/A
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {formatDate(dcr.dcr_date)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {dcr.signature ? (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <div className="cursor-pointer">
                                                                    {renderSignature(
                                                                        dcr.signature
                                                                    )}
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="p-2">
                                                                    <img
                                                                        src={
                                                                            dcr.signature.startsWith(
                                                                                "data:"
                                                                            ) ||
                                                                            dcr.signature.startsWith(
                                                                                "blob:"
                                                                            )
                                                                                ? dcr.signature
                                                                                : `data:image/png;base64,${dcr.signature}`
                                                                        }
                                                                        alt="Signature"
                                                                        className="h-32 w-64 object-contain border rounded"
                                                                    />
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-muted-foreground"
                                                    >
                                                        No Signature
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {dcr.remarks ? (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <div className="flex items-center gap-2 max-w-[200px]">
                                                                    <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                                    <span className="truncate">
                                                                        {
                                                                            dcr.remarks
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="max-w-xs">
                                                                    {
                                                                        dcr.remarks
                                                                    }
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">
                                                        No remarks
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {dcrs?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-12 text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <FileText className="h-12 w-12 opacity-50" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {hasActiveFilters()
                                                                ? "No DCRs match your filters"
                                                                : "No DCRs found"}
                                                        </p>
                                                        <p className="text-sm">
                                                            {hasActiveFilters()
                                                                ? "Try adjusting your search criteria"
                                                                : "Daily call reports will appear here once created"}
                                                        </p>
                                                    </div>
                                                    {hasActiveFilters() && (
                                                        <Button
                                                            variant="outline"
                                                            onClick={
                                                                clearFilters
                                                            }
                                                            className="gap-2 mt-2"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            Clear Filters
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {dcrs?.last_page > 1 && (
                    <div className="flex justify-center">
                        <AppPagination paginationData={dcrs} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
