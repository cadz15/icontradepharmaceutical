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
import { Eye, Edit, Trash2, Package, Plus, Pill, Tag } from "lucide-react";
import AppPagination from "@/components/AppPagination";
import DeleteDialog from "@/components/Modal/Admin/DeleteDialog";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

function Items() {
    const { items } = usePage().props;

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

    const productTypeVariants = {
        exclusive: "default",
        "non-exclusive": "secondary",
        regulated: "destructive",
    };
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

                    <Button className="gap-2" asChild>
                        <Link href={route("item.create")}>
                            <Plus className="h-4 w-4" />
                            Add New Item
                        </Link>
                    </Button>
                </div>

                {/* Items Inventory Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Inventory List
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
                                    {items?.data?.map((item) => (
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
                                                <span
                                                    className={`${
                                                        parseInt(
                                                            item.inventory
                                                        ) < 10
                                                            ? "text-red-700"
                                                            : ""
                                                    }`}
                                                >
                                                    {item.inventory}
                                                </span>
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
                                                                            "item.edit",
                                                                            item.id
                                                                        )}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Edit item</p>
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
                                                                    Delete item
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {items?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-12 text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <Package className="h-12 w-12" />
                                                    <div>
                                                        <p className="font-medium">
                                                            No items found
                                                        </p>
                                                        <p className="text-sm">
                                                            Add your first item
                                                            to start managing
                                                            inventory
                                                        </p>
                                                    </div>
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
