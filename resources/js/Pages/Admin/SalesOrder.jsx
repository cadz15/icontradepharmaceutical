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
import { Eye, Edit, Trash2, FileText, Plus } from "lucide-react";
import AppPagination from "@/components/AppPagination";
import DeleteDialog from "@/components/Modal/Admin/DeleteDialog";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

function SalesOrder() {
    const { sales } = usePage().props;

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

                {/* Sales Orders Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Sales Order List
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
                                                            Create your first
                                                            sales order to get
                                                            started
                                                        </p>
                                                    </div>
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
