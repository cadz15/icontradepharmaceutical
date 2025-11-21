import { useState, useEffect } from "react";
import { usePage, router, Head, Link } from "@inertiajs/react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Eye,
    Edit,
    Trash2,
    Package,
    Plus,
    Pill,
    Tag,
    Search,
    Filter,
    X,
} from "lucide-react";
import AppPagination from "@/components/AppPagination";
import DeleteDialog from "@/components/Modal/Admin/DeleteDialog";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";

function Items() {
    const { items, filters: initialFilters = {} } = usePage().props;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [firstStart, setFirstStart] = useState(true);

    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        product_type: initialFilters.product_type || "",
        inventory_status: initialFilters.inventory_status || "",
        sort_by: initialFilters.sort_by || "brand_name",
        sort_order: initialFilters.sort_order || "asc",
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const getProductTypeVariant = (type) => {
        const key = type.toLowerCase().replace(/\s+/g, "_");
        return productTypeVariants[key] || "outline";
    };

    const getInventoryStatus = (inventory) => {
        const quantity = parseInt(inventory);
        if (quantity <= 0)
            return {
                status: "out_of_stock",
                label: "Out of Stock",
                color: "text-red-700 bg-red-50",
            };
        if (quantity < 5)
            return {
                status: "very_low",
                label: "Very Low",
                color: "text-red-600 bg-red-50",
            };
        if (quantity < 10)
            return {
                status: "low",
                label: "Low",
                color: "text-orange-600 bg-orange-50",
            };
        if (quantity < 20)
            return {
                status: "medium",
                label: "Medium",
                color: "text-yellow-600 bg-yellow-50",
            };
        return {
            status: "good",
            label: "Good",
            color: "text-green-600 bg-green-50",
        };
    };

    const productTypeVariants = {
        exclusive: "default",
        "non-exclusive": "secondary",
        regulated: "destructive",
        generic: "outline",
        branded: "default",
        otc: "secondary",
        prescription: "destructive",
    };

    const productTypes = [
        "Exclusive",
        "Non-Exclusive",
        "Regulated",
        "Generic",
        "Branded",
        "OTC",
        "Prescription",
    ];

    const inventoryStatusOptions = [
        { value: "all", label: "All Inventory" },
        { value: "out_of_stock", label: "Out of Stock" },
        { value: "very_low", label: "Very Low (< 5)" },
        { value: "low", label: "Low (< 10)" },
        { value: "medium", label: "Medium (< 20)" },
        { value: "good", label: "Good (20+)" },
    ];

    const sortOptions = [
        { value: "brand_name", label: "Brand Name" },
        { value: "generic_name", label: "Generic Name" },
        { value: "catalog_price", label: "Price" },
        { value: "inventory", label: "Inventory" },
        { value: "product_type", label: "Product Type" },
    ];

    const fetchItems = async (params = {}) => {
        setIsRefreshing(true);
        try {
            await router.get(route("item.index"), params, {
                preserveState: true,
                onSuccess: () => {
                    setIsRefreshing(false);
                },
                onError: (error) => {
                    console.error("Error fetching items:", error);
                    setIsRefreshing(false);
                },
            });
        } catch (error) {
            console.error("Error fetching items:", error);
            setIsRefreshing(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            product_type: "",
            inventory_status: "",
            sort_by: "brand_name",
            sort_order: "asc",
        });
    };

    const hasActiveFilters = () => {
        return (
            filters.search ||
            filters.product_type ||
            filters.inventory_status !== "" ||
            filters.sort_by !== "brand_name"
        );
    };

    // Trigger search/filter on change with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!firstStart) {
                fetchItems(filters);
            } else {
                setFirstStart(false);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [filters]);

    return (
        <AuthenticatedLayout>
            <Head title="Items Inventory" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Items Inventory
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your pharmaceutical products and medical
                            supplies
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => fetchItems(filters)}
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
                        <Button className="gap-2" asChild>
                            <Link href={route("item.create")}>
                                <Plus className="h-4 w-4" />
                                Add New Item
                            </Link>
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
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* Search Input */}
                            <div className="md:col-span-2">
                                <Label
                                    htmlFor="search"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    Search Items
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search by brand or generic name..."
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

                            {/* Product Type Filter */}
                            <div>
                                <Label
                                    htmlFor="product_type"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    Product Type
                                </Label>
                                <Select
                                    value={filters.product_type}
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            "product_type",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        {productTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Inventory Status Filter */}
                            <div>
                                <Label
                                    htmlFor="inventory_status"
                                    className="text-sm font-medium mb-2 block"
                                >
                                    Inventory Status
                                </Label>
                                <Select
                                    value={filters.inventory_status}
                                    onValueChange={(value) =>
                                        handleFilterChange(
                                            "inventory_status",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Inventory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {inventoryStatusOptions.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            )
                                        )}
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
                                            {sortOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
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
                                <div className="flex items-center gap-2">
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
                                    {filters.product_type && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            Type: {filters.product_type}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    handleFilterChange(
                                                        "product_type",
                                                        ""
                                                    )
                                                }
                                            />
                                        </Badge>
                                    )}
                                    {filters.inventory_status &&
                                        filters.inventory_status !== "all" && (
                                            <Badge
                                                variant="secondary"
                                                className="flex items-center gap-1"
                                            >
                                                {
                                                    inventoryStatusOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            filters.inventory_status
                                                    )?.label
                                                }
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() =>
                                                        handleFilterChange(
                                                            "inventory_status",
                                                            ""
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
                        Showing {items?.from || 0} to {items?.to || 0} of{" "}
                        {items?.total || 0} items
                    </div>
                    {hasActiveFilters() && (
                        <div className="text-sm text-blue-600">
                            Filtered results
                        </div>
                    )}
                </div>

                {/* Items Inventory Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Inventory List
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
                                            Brand Name
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Generic Name
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Milligrams
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Supply
                                        </TableHead>
                                        <TableHead className="font-semibold text-right">
                                            Catalog Price
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Product Type
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Inventory
                                        </TableHead>
                                        <TableHead className="font-semibold w-[100px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items?.data?.map((item) => {
                                        const inventoryStatus =
                                            getInventoryStatus(item.inventory);
                                        return (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Pill className="h-4 w-4 text-muted-foreground" />
                                                        {item.brand_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {item.generic_name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="font-mono text-xs"
                                                    >
                                                        {item.milligrams}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-normal"
                                                    >
                                                        {item.supply}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(
                                                        item.catalog_price
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getProductTypeVariant(
                                                            item.product_type
                                                        )}
                                                        className="capitalize"
                                                    >
                                                        {item.product_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            inventoryStatus.color
                                                        }
                                                    >
                                                        {item.inventory}
                                                    </Badge>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {inventoryStatus.label}
                                                    </div>
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
                                                                                "item.show",
                                                                                item.id
                                                                            )}
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Link>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        View
                                                                        details
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
                                                                                "item.edit",
                                                                                item.id
                                                                            )}
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Link>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        Edit
                                                                        item
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
                                                                            "item.delete",
                                                                            item.id
                                                                        )}
                                                                        toastMessage="Item deleted successfully"
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
                                                                        Delete
                                                                        item
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    {items?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-12 text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <Package className="h-12 w-12" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {hasActiveFilters()
                                                                ? "No items match your filters"
                                                                : "No items found"}
                                                        </p>
                                                        <p className="text-sm">
                                                            {hasActiveFilters()
                                                                ? "Try adjusting your search criteria"
                                                                : "Add your first item to start managing inventory"}
                                                        </p>
                                                    </div>
                                                    {hasActiveFilters() ? (
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
                                                    ) : (
                                                        <Button
                                                            className="gap-2 mt-2"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "item.create"
                                                                )}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                                Add New Item
                                                            </Link>
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
                {items?.last_page > 1 && (
                    <div className="flex justify-center">
                        <AppPagination paginationData={items} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default Items;
