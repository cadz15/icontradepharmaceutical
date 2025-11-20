import { useEffect, useState } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
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
    Building2,
    MapPin,
    Calendar,
    User,
    Edit,
    Save,
    X,
    Package,
    TrendingUp,
    ShoppingCart,
    BarChart3,
    Eye,
    Search,
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";
import AppPagination from "@/Components/AppPagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

const customerClasses = [
    { value: "a", label: "CLASS A: DISPENSING/ WITH PURCHASING POWER" },
    { value: "b", label: "CLASS B: PRESCRIBING ONLY" },
    { value: "c", label: "CLASS C: NO COMMITMENT" },
];

export default function CustomerShow() {
    const { customer, analytics, filters } = usePage().props;
    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        full_address: "",
        short_address: "",
        region: "",
        class: "",
        practice: "",
        s3_license: "",
        s3_validity: "",
        pharmacist_name: "",
        prc_id: "",
        prc_validity: "",
        remarks: "",
        fromView: "yes",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(customer);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchFilter, setSearchFilter] = useState("");

    // Chart colors
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

    const handleEditToggle = () => {
        if (isEditing) {
            setFormData(customer); // Reset form data
        }
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        put(route("customer.update", customer.id), {
            data,
            onSuccess: () => {
                setIsEditing(false);
                setIsSubmitting(false);
                toast.success("Customer successfully updated!");
            },
            onError: (errors) => {
                setIsSubmitting(false);
                console.error("Update errors:", errors);
                toast.error(
                    "Failed to update customer. Please check the form."
                );
            },
        });
    };

    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    useEffect(() => {
        if (customer) {
            setData({
                name: customer.name ?? "",
                full_address: customer.full_address ?? "",
                short_address: customer.short_address ?? "",
                region: customer.region ?? "",
                class: customer.class ?? "",
                practice: customer.practice ?? "",
                s3_license: customer.s3_license ?? "",
                s3_validity: customer.s3_validity ?? "",
                pharmacist_name: customer.pharmacist_name ?? "",
                prc_id: customer.prc_id ?? "",
                prc_validity: customer.prc_validity ?? "",
                remarks: customer.remarks ?? "",
                fromView: "yes",
            });
        }
    }, [customer]);

    return (
        <AuthenticatedLayout>
            <Head title={`${customer.name} - Customer Details`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Building2 className="h-8 w-8 text-primary" />
                            {customer.name}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Customer details and analytics
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleEditToggle}
                                    disabled={isSubmitting}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleEditToggle}
                                className="gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Customer
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Information - Left Side */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    {isEditing ? (
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className={
                                                errors.name
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">
                                            {customer.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="full_address">
                                        Full Address
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="full_address"
                                            value={data.full_address}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "full_address",
                                                    e.target.value
                                                )
                                            }
                                            className={
                                                errors.full_address
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            {customer.full_address}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Region</Label>
                                        {isEditing ? (
                                            <Input
                                                id="region"
                                                value={data.region}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "region",
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    errors.region
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            />
                                        ) : (
                                            <Badge variant="outline">
                                                {customer.region}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="class">Class</Label>
                                        {isEditing ? (
                                            <Select
                                                onValueChange={(value) =>
                                                    handleInputChange(
                                                        "class",
                                                        value
                                                    )
                                                }
                                                value={data.class}
                                            >
                                                <SelectTrigger
                                                    className={
                                                        errors.class
                                                            ? "border-destructive"
                                                            : ""
                                                    }
                                                >
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customerClasses.map(
                                                        (classItem) => (
                                                            <SelectItem
                                                                key={
                                                                    classItem.value
                                                                }
                                                                value={
                                                                    classItem.value
                                                                }
                                                            >
                                                                {
                                                                    classItem.label
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge variant="secondary">
                                                {customer.class}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="practice">Practice</Label>
                                    {isEditing ? (
                                        <Input
                                            id="practice"
                                            value={data.practice || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "practice",
                                                    e.target.value
                                                )
                                            }
                                            className={
                                                errors.practice
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">
                                            {customer.practice ||
                                                "Not specified"}
                                        </p>
                                    )}
                                </div>

                                {/* S3 License Information */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        S3 License
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="s3_license">
                                                License Number
                                            </Label>
                                            {isEditing ? (
                                                <Input
                                                    id="s3_license"
                                                    value={
                                                        data.s3_license || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "s3_license",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <p className="text-sm">
                                                    {customer.s3_license ||
                                                        "Not set"}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="s3_validity">
                                                Validity
                                            </Label>
                                            {isEditing ? (
                                                <Input
                                                    id="s3_validity"
                                                    type="date"
                                                    value={
                                                        data.s3_validity || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "s3_validity",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <p className="text-sm">
                                                    {formatDate(
                                                        customer.s3_validity
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pharmacist Information */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="font-medium">
                                        Pharmacist Details
                                    </h4>
                                    <div className="space-y-2">
                                        <Label htmlFor="pharmacist_name">
                                            Pharmacist Name
                                        </Label>
                                        {isEditing ? (
                                            <Input
                                                id="pharmacist_name"
                                                value={
                                                    data.pharmacist_name || ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "pharmacist_name",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <p className="text-sm">
                                                {customer.pharmacist_name ||
                                                    "Not specified"}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="prc_id">
                                                PRC ID
                                            </Label>
                                            {isEditing ? (
                                                <Input
                                                    id="prc_id"
                                                    value={data.prc_id || ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "prc_id",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <p className="text-sm">
                                                    {customer.prc_id ||
                                                        "Not set"}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="prc_validity">
                                                PRC Validity
                                            </Label>
                                            {isEditing ? (
                                                <Input
                                                    id="prc_validity"
                                                    type="date"
                                                    value={
                                                        data.prc_validity || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "prc_validity",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <p className="text-sm">
                                                    {formatDate(
                                                        customer.prc_validity
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Remarks */}
                                <div className="space-y-2">
                                    <Label htmlFor="remarks">Remarks</Label>
                                    {isEditing ? (
                                        <Input
                                            id="remarks"
                                            value={data.remarks || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "remarks",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">
                                            {customer.remarks || "No remarks"}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Analytics and Sales Data - Right Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Purchase
                                        </p>
                                        <p className="text-xl font-bold">
                                            {formatCurrency(
                                                analytics.statistics
                                                    .total_purchase
                                            )}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Package className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Top Product Type
                                        </p>
                                        <p
                                            className="text-lg font-bold truncate"
                                            title={
                                                analytics.statistics
                                                    .most_purchased_type
                                            }
                                        >
                                            {
                                                analytics.statistics
                                                    .most_purchased_type
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <BarChart3 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Orders
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {analytics.statistics.total_orders}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Current Orders
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {
                                                analytics.statistics
                                                    .current_orders
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Product Type Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Product Type Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={analytics.productTypeData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({
                                                    product_type,
                                                    quantity,
                                                }) =>
                                                    `${product_type}: ${quantity}`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="quantity"
                                            >
                                                {analytics.productTypeData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Sales Trend */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sales Order Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <LineChart
                                            data={analytics.salesTrendData}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="total_sales"
                                                stroke="#0088FE"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Current Sales Orders Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Sales Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analytics.currentSalesOrders.map(
                                            (order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">
                                                        {
                                                            order.sales_order_number
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(
                                                            order.date_sold
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatCurrency(
                                                            order.total
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="default">
                                                            {order.status}
                                                        </Badge>
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
                                                                                    order.id
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
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                        {analytics.currentSalesOrders.length ===
                                            0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="text-center py-8 text-muted-foreground"
                                                >
                                                    No pending sales orders
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* History Sales Orders Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales Order History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analytics.historySalesOrders?.data?.map(
                                            (order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">
                                                        {
                                                            order.sales_order_number
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(
                                                            order.date_sold
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatCurrency(
                                                            order.total
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                statusVariant[
                                                                    order.status
                                                                ] || "outline"
                                                            }
                                                            className={
                                                                statusColors[
                                                                    order.status
                                                                ] || ""
                                                            }
                                                        >
                                                            {order.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                order.status.slice(
                                                                    1
                                                                )}
                                                        </Badge>
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
                                                                                    order.id
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
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                        {analytics.historySalesOrders.length ===
                                            0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="text-center py-8 text-muted-foreground"
                                                >
                                                    No sales order history
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {analytics.historySalesOrders?.last_page > 1 && (
                            <div className="flex justify-center">
                                <AppPagination
                                    paginationData={
                                        analytics.historySalesOrders
                                    }
                                />
                            </div>
                        )}

                        {/* Product Purchase Trend by Year */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Product Purchase Trend -{" "}
                                        {analytics.productPurchaseTrend.year}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Label
                                            htmlFor="year-select"
                                            className="text-sm font-medium"
                                        >
                                            Year:
                                        </Label>
                                        <Select
                                            value={
                                                analytics.productPurchaseTrend
                                                    .year
                                            }
                                            onValueChange={(value) => {
                                                router.get(
                                                    route(
                                                        "customer.show",
                                                        customer.id
                                                    ),
                                                    {
                                                        ...filters,
                                                        year: value,
                                                    }
                                                );
                                            }}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    { length: 5 },
                                                    (_, i) => {
                                                        const year =
                                                            new Date().getFullYear() -
                                                            i;
                                                        return (
                                                            <SelectItem
                                                                key={year}
                                                                value={year.toString()}
                                                            >
                                                                {year}
                                                            </SelectItem>
                                                        );
                                                    }
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Search Bar - Local Filter Only */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search products by name..."
                                            value={searchFilter || ""}
                                            onChange={(e) => {
                                                // Update local state only, no server request
                                                setSearchFilter(e.target.value);
                                            }}
                                            className="pl-10"
                                        />
                                        {searchFilter && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                                                onClick={() => {
                                                    setSearchFilter("");
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-semibold w-[200px]">
                                                    Product Name
                                                </TableHead>
                                                {[
                                                    "Jan",
                                                    "Feb",
                                                    "Mar",
                                                    "Apr",
                                                    "May",
                                                    "Jun",
                                                    "Jul",
                                                    "Aug",
                                                    "Sep",
                                                    "Oct",
                                                    "Nov",
                                                    "Dec",
                                                ].map((month) => (
                                                    <TableHead
                                                        key={month}
                                                        className="text-center font-semibold"
                                                    >
                                                        {month}
                                                    </TableHead>
                                                ))}
                                                <TableHead className="text-center font-semibold">
                                                    Total
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {analytics.productPurchaseTrend.products
                                                .filter((product) => {
                                                    if (!searchFilter)
                                                        return true;
                                                    const searchTerm =
                                                        searchFilter.toLowerCase();
                                                    return (
                                                        product.brand_name
                                                            .toLowerCase()
                                                            .includes(
                                                                searchTerm
                                                            ) ||
                                                        (product.generic_name &&
                                                            product.generic_name
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchTerm
                                                                ))
                                                    );
                                                })
                                                .map((product) => (
                                                    <TableRow
                                                        key={product.id}
                                                        className="hover:bg-muted/50"
                                                    >
                                                        <TableCell className="font-medium">
                                                            <div>
                                                                <div>
                                                                    {
                                                                        product.brand_name
                                                                    }
                                                                </div>
                                                                {product.generic_name && (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {
                                                                            product.generic_name
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>

                                                        {/* Monthly quantities with trends */}
                                                        {product.monthly_data.map(
                                                            (
                                                                quantity,
                                                                monthIndex
                                                            ) => {
                                                                const trend =
                                                                    product
                                                                        .trends[
                                                                        monthIndex
                                                                    ];
                                                                const isPositive =
                                                                    trend.startsWith(
                                                                        "+"
                                                                    );
                                                                const isNegative =
                                                                    trend.startsWith(
                                                                        "-"
                                                                    ) &&
                                                                    !trend.startsWith(
                                                                        "-0"
                                                                    );
                                                                const hasData =
                                                                    quantity >
                                                                    0;

                                                                return (
                                                                    <TableCell
                                                                        key={
                                                                            monthIndex
                                                                        }
                                                                        className="text-center"
                                                                    >
                                                                        {hasData ? (
                                                                            <div className="flex flex-col items-center">
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        quantity
                                                                                    }
                                                                                </span>
                                                                                <span
                                                                                    className={cn(
                                                                                        "text-xs",
                                                                                        isPositive &&
                                                                                            "text-green-600",
                                                                                        isNegative &&
                                                                                            "text-red-600",
                                                                                        !isPositive &&
                                                                                            !isNegative &&
                                                                                            "text-gray-500"
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        trend
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </TableCell>
                                                                );
                                                            }
                                                        )}

                                                        {/* Total */}
                                                        <TableCell className="text-center font-bold">
                                                            {
                                                                product.total_quantity
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                            {analytics.productPurchaseTrend.products.filter(
                                                (product) => {
                                                    if (!searchFilter)
                                                        return true;
                                                    const searchTerm =
                                                        searchFilter.toLowerCase();
                                                    return (
                                                        product.brand_name
                                                            .toLowerCase()
                                                            .includes(
                                                                searchTerm
                                                            ) ||
                                                        (product.generic_name &&
                                                            product.generic_name
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchTerm
                                                                ))
                                                    );
                                                }
                                            ).length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={14}
                                                        className="text-center py-8 text-muted-foreground"
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Package className="h-8 w-8 opacity-50" />
                                                            <p className="font-medium">
                                                                {searchFilter
                                                                    ? `No products found matching "${searchFilter}"`
                                                                    : `No product purchase data for ${analytics.productPurchaseTrend.year}`}
                                                            </p>
                                                            <p className="text-sm">
                                                                {searchFilter
                                                                    ? "Try adjusting your search terms"
                                                                    : "This customer hasn't made any purchases this year."}
                                                            </p>
                                                            {searchFilter && (
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                productSearch:
                                                                                    "",
                                                                            })
                                                                        );
                                                                    }}
                                                                >
                                                                    Clear Search
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Results Count */}
                                <div className="mt-3 text-sm text-muted-foreground">
                                    Showing{" "}
                                    {
                                        analytics.productPurchaseTrend.products.filter(
                                            (product) => {
                                                if (!searchFilter) return true;
                                                const searchTerm =
                                                    searchFilter.toLowerCase();
                                                return (
                                                    product.brand_name
                                                        .toLowerCase()
                                                        .includes(searchTerm) ||
                                                    (product.generic_name &&
                                                        product.generic_name
                                                            .toLowerCase()
                                                            .includes(
                                                                searchTerm
                                                            ))
                                                );
                                            }
                                        ).length
                                    }{" "}
                                    of{" "}
                                    {
                                        analytics.productPurchaseTrend.products
                                            .length
                                    }{" "}
                                    products
                                    {searchFilter && (
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 ml-2 text-blue-600"
                                            onClick={() => {
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    productSearch: "",
                                                }));
                                            }}
                                        >
                                            Clear search
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
