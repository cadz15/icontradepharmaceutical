import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Eye,
    Edit,
    Trash2,
    FileText,
    Plus,
    Search,
    Filter,
    X,
    Calendar,
} from "lucide-react";
import AppPagination from "@/components/AppPagination";
import DeleteDialog from "@/components/Modal/Admin/DeleteDialog";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const statusVariant = {
    pending: "outline",
    "acknowledge-approved": "default",
    "acknowledge-hold": "destructive",
    processing: "secondary",
};

const statusColors = {
    pending: "bg-yellow-500 hover:bg-yellow-600",
    "acknowledge-approved": "bg-green-500 hover:bg-green-600",
    "acknowledge-hold": "bg-red-500 hover:bg-red-600",
    processing: "bg-blue-500 hover:bg-blue-600",
};

function SalesOrder() {
    const { sales, medRepData, filters: initialFilters = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || "");
    const [medRepFilter, setMedRepFilter] = useState(
        initialFilters.med_rep || "all"
    );
    const [statusFilter, setStatusFilter] = useState(
        initialFilters.status || "all"
    );
    const [priceSort, setPriceSort] = useState(
        initialFilters.price_sort || "all"
    );
    const [dateFilter, setDateFilter] = useState(
        initialFilters.date_sold || ""
    );

    // Get unique medical representatives for filter
    const medicalReps = [
        ...new Set(
            sales?.data
                ?.map((sale) => sale.medical_representative?.name)
                .filter(Boolean)
        ),
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, medRepFilter, statusFilter, priceSort, dateFilter]);

    const applyFilters = () => {
        const filters = {};

        if (searchTerm) filters.search = searchTerm;
        if (medRepFilter && medRepFilter !== "all")
            filters.med_rep = medRepFilter;
        if (statusFilter && statusFilter !== "all")
            filters.status = statusFilter;
        if (priceSort && priceSort !== "all") filters.price_sort = priceSort;
        if (dateFilter) filters.date_sold = dateFilter;

        router.get(route("sales.order.index"), filters, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setMedRepFilter("all");
        setStatusFilter("all");
        setPriceSort("all");
        setDateFilter("");
        router.get(
            route("sales.order.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const hasActiveFilters =
        searchTerm ||
        medRepFilter !== "all" ||
        statusFilter !== "all" ||
        priceSort !== "all" ||
        dateFilter;

    return (
        <AuthenticatedLayout>
            <Head title="Sales Orders" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Sales Orders
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and track all sales orders
                        </p>
                    </div>

                    {/* <Button className="gap-2" asChild>
                        <Link href={route("sales.order.create")}>
                            <Plus className="h-4 w-4" />
                            New Sales Order
                        </Link>
                    </Button> */}
                </div>

                {/* Search and Filters Section */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            {/* Search Input */}
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by customer, customer address..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Medical Representative Filter */}
                            <Select
                                value={medRepFilter}
                                onValueChange={setMedRepFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Med Reps" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Med Reps
                                    </SelectItem>
                                    {medRepData.map((rep) => (
                                        <SelectItem
                                            key={rep?.id}
                                            value={rep.id}
                                        >
                                            {rep.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    {/* <SelectItem value="processing">
                                        Processing
                                    </SelectItem> */}
                                    <SelectItem value="acknowledge-approved">
                                        Acknowledge Approved
                                    </SelectItem>
                                    <SelectItem value="acknowledge-hold">
                                        Acknowledge Hold
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Price Sort */}
                            <Select
                                value={priceSort}
                                onValueChange={setPriceSort}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Price Sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Default</SelectItem>
                                    <SelectItem value="high">
                                        Price: High to Low
                                    </SelectItem>
                                    <SelectItem value="low">
                                        Price: Low to High
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Date Filter */}
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) =>
                                        setDateFilter(e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Active Filters Indicator */}
                        {hasActiveFilters && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Filter className="h-4 w-4" />
                                    <span>Active filters applied</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sales Orders Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Sales Order List
                            {hasActiveFilters && (
                                <Badge variant="secondary" className="ml-2">
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
                                            Sales ID
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Customer
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Address
                                        </TableHead>
                                        <TableHead className="font-semibold text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Med Rep
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Status
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Date
                                        </TableHead>
                                        <TableHead className="font-semibold w-[100px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sales?.data?.map((saleOrder) => (
                                        <TableRow
                                            key={saleOrder.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    {
                                                        saleOrder.sales_order_number
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {saleOrder.customer?.name}
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <div
                                                    className="truncate"
                                                    title={
                                                        saleOrder.customer
                                                            ?.short_address
                                                    }
                                                >
                                                    {
                                                        saleOrder.customer
                                                            ?.short_address
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(
                                                    saleOrder.total
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="font-normal"
                                                >
                                                    {
                                                        saleOrder
                                                            .medical_representative
                                                            ?.name
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        statusVariant[
                                                            saleOrder.status
                                                        ] || "outline"
                                                    }
                                                    className={
                                                        statusColors[
                                                            saleOrder.status
                                                        ] || ""
                                                    }
                                                >
                                                    {saleOrder.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        saleOrder.status.slice(
                                                            1
                                                        )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(
                                                    saleOrder.date_sold
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    asChild
                                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "sales.order.show",
                                                                            saleOrder.id
                                                                        )}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    View details
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    asChild
                                                                    className="h-8 w-8 text-muted-foreground hover:text-orange-600"
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "sales.order.edit",
                                                                            saleOrder.id
                                                                        )}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Edit order
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <DeleteDialog
                                                                    address={route(
                                                                        "sales.order.delete",
                                                                        saleOrder.id
                                                                    )}
                                                                    toastMessage="Sales order deleted successfully"
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </DeleteDialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Delete order
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {sales?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-12 text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <FileText className="h-12 w-12" />
                                                    <div>
                                                        <p className="font-medium">
                                                            No sales orders
                                                            found
                                                        </p>
                                                        <p className="text-sm">
                                                            {hasActiveFilters
                                                                ? "Try adjusting your filters to see more results"
                                                                : "Create your first sales order to get started"}
                                                        </p>
                                                    </div>
                                                    {hasActiveFilters && (
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
                                                    {/* <Button
                                                        className="gap-2 mt-2"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                "sales.order.create"
                                                            )}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                            Create Sales Order
                                                        </Link>
                                                    </Button> */}
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
                {sales?.last_page > 1 && (
                    <div className="flex justify-center">
                        <AppPagination paginationData={sales} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default SalesOrder;
