import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
    Package,
    User,
    MapPin,
    Calendar,
    DollarSign,
    Truck,
    Package2,
    Clock,
    CheckCircle2,
    Loader2,
    CircleX,
} from "lucide-react";

const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
    "acknowledge-approved": {
        label: "Acknowledge-Approved",
        color: "bg-blue-500",
        icon: Package2,
    },
    "acknowledge-hold": {
        label: "Acknowledge-Hold",
        color: "bg-red-500",
        icon: CircleX,
    },
};

function SalesOrderView() {
    const { salesOrder } = usePage().props;

    const { data, setData, put, processing } = useForm({
        status: "pending",
    });

    const handleSubmit = () => {
        put(route("sales.order.update", salesOrder.id), {
            onSuccess: () => {
                toast.success("Sales order updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update sales order. Please try again.");
            },
        });
    };

    const formatCurrency = (amount) => {
        const numericAmount =
            typeof amount === "string" ? parseFloat(amount) : amount;
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(numericAmount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadge = (status) => {
        const config = statusConfig[status] || statusConfig.pending;
        const IconComponent = config.icon;

        return (
            <Badge
                className={`${config.color} text-white hover:${config.color}`}
            >
                <IconComponent className="h-3 w-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    const getPromoDisplay = (item) => {
        switch (item.promo) {
            case "regular":
                return <Badge variant="outline">Regular</Badge>;
            case "discount":
                return (
                    <div className="space-y-1">
                        <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800"
                        >
                            Discount: {item.discount}%
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                            Save{" "}
                            {formatCurrency(
                                (parseFloat(item.item.catalog_price) *
                                    item.quantity *
                                    (item.discount || 0)) /
                                    100
                            )}
                        </div>
                    </div>
                );
            case "free_item":
                return (
                    <div className="space-y-1">
                        <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                        >
                            Free Item
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                            {item.free_item_quantity} items -{" "}
                            {item.free_item_remarks}
                        </div>
                    </div>
                );
            default:
                return <Badge variant="outline">Regular</Badge>;
        }
    };

    useEffect(() => {
        setData("status", salesOrder.status);
    }, [salesOrder, setData]);

    const currentStatusConfig =
        statusConfig[data.status] || statusConfig.pending;
    const StatusIcon = currentStatusConfig.icon;

    return (
        <AuthenticatedLayout>
            <Head title={`Sales Order #${salesOrder.sales_order_number}`} />

            <div className="container max-w-7xl mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Sales Order #{salesOrder.sales_order_number}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Order placed on {formatDate(salesOrder.date_sold)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(salesOrder.status)}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order Information */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Customer Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Customer
                                        </p>
                                        <p className="font-medium">
                                            {salesOrder.customer?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <MapPin className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Address
                                        </p>
                                        <p className="font-medium">
                                            {salesOrder.customer?.short_address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Truck className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Medical Representative
                                        </p>
                                        <p className="font-medium">
                                            {
                                                salesOrder
                                                    .medical_representative
                                                    ?.name
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Calendar className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Date Sold
                                        </p>
                                        <p className="font-medium">
                                            {formatDate(salesOrder.date_sold)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <DollarSign className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Amount
                                        </p>
                                        <p className="text-lg font-bold text-emerald-700">
                                            {formatCurrency(salesOrder.total)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Update Status
                                    </label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData("status", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <div className="flex items-center gap-2">
                                                <StatusIcon className="h-4 w-4" />
                                                <SelectValue placeholder="Select status" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Pending
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="acknowledge-approved">
                                                <div className="flex items-center gap-2">
                                                    <Package2 className="h-4 w-4" />
                                                    Acknowledge-Approved
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="acknowledge-hold">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Acknowledge-Hold
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={
                                        processing ||
                                        data.status === salesOrder.status
                                    }
                                    className="w-full gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Update Status
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package2 className="h-5 w-5" />
                                Order Items (
                                {salesOrder.sale_items?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-semibold">
                                                Product
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Quantity
                                            </TableHead>
                                            <TableHead className="font-semibold text-right">
                                                Unit Price
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Promotion
                                            </TableHead>
                                            <TableHead className="font-semibold text-right">
                                                Total
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Remarks
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {salesOrder.sale_items?.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">
                                                            {
                                                                item.item
                                                                    ?.brand_name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {
                                                                item.item
                                                                    ?.generic_name
                                                            }
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="font-mono"
                                                    >
                                                        {item.quantity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(
                                                        item.item?.catalog_price
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getPromoDisplay(item)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(item.total)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[150px]">
                                                        {item.remarks ? (
                                                            <span className="text-sm text-muted-foreground truncate">
                                                                {item.remarks}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">
                                                                -
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Order Summary */}
                            <div className="flex justify-end p-6 border-t">
                                <div className="space-y-2 min-w-[200px]">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal:
                                        </span>
                                        <span>
                                            {formatCurrency(salesOrder.total)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-emerald-700">
                                            {formatCurrency(salesOrder.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default SalesOrderView;
