import { Head, router, usePage } from "@inertiajs/react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    TrendingUp,
    BarChart3,
    ShoppingCart,
    AlertTriangle,
    DollarSign,
    Users,
    Search,
    Calendar,
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
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import { useState } from "react";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
];

export default function ItemsReport() {
    const { analytics, filters } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat().format(number);
    };

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const getInventoryStatus = (inventory) => {
        if (inventory <= 0) {
            return {
                color: "bg-red-100 text-red-800 border-red-200",
                text: "Out of Stock",
            };
        } else if (inventory < 5) {
            return {
                color: "bg-orange-100 text-orange-800 border-orange-200",
                text: "Very Low",
            };
        } else if (inventory < 10) {
            return {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                text: "Low",
            };
        } else {
            return {
                color: "bg-green-100 text-green-800 border-green-200",
                text: "In Stock",
            };
        }
    };

    // Filter low inventory items by search
    const filteredLowInventoryItems = analytics.lowInventoryItems.filter(
        (item) =>
            item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.generic_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.product_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Items Analytics Report" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Package className="h-8 w-8 text-primary" />
                            Items Analytics Report
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Comprehensive analysis of product performance and
                            inventory
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Items
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatNumber(
                                        analytics.statistics.total_items
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Inventory Value
                                </p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(
                                        analytics.statistics
                                            .total_inventory_value
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Low Inventory
                                </p>
                                <p className="text-2xl font-bold">
                                    {analytics.statistics.low_inventory_count}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <ShoppingCart className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Out of Stock
                                </p>
                                <p className="text-2xl font-bold">
                                    {analytics.statistics.out_of_stock_count}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Top Seller - {filters.year}
                                </p>
                                <p
                                    className="text-lg font-bold truncate"
                                    title={analytics.statistics.most_sold_item}
                                >
                                    {analytics.statistics.most_sold_item}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatNumber(
                                        analytics.statistics.most_sold_quantity
                                    )}{" "}
                                    sold
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Item Trends by Year */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Item Sales Trends - {filters.year}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={filters.year}
                                        onValueChange={(value) => {
                                            router.get(route("items.report"), {
                                                ...filters,
                                                year: value,
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(
                                                { length: 10 },
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
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={analytics.itemTrendsByYear}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month_name"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis yAxisId="left" />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                    />
                                    <RechartsTooltip
                                        formatter={(value, name) => {
                                            if (name === "Total Quantity") {
                                                return [
                                                    formatNumber(value),
                                                    name,
                                                ];
                                            } else if (name === "Total Sales") {
                                                return [
                                                    formatCurrency(value),
                                                    name,
                                                ];
                                            }
                                            return [value, name];
                                        }}
                                    />
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="total_quantity"
                                        stroke="#0088FE"
                                        fill="#0088FE"
                                        fillOpacity={0.3}
                                        name="Total Quantity"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="total_sales"
                                        stroke="#00C49F"
                                        strokeWidth={2}
                                        name="Total Sales"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Popular Item Types */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Popular Product Types - {filters.year}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={analytics.popularItemTypes}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis
                                        type="category"
                                        dataKey="product_type"
                                        width={80}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <RechartsTooltip
                                        formatter={(value, name) => {
                                            if (name === "Total Quantity") {
                                                return [
                                                    formatNumber(value),
                                                    name,
                                                ];
                                            } else if (name === "Total Sales") {
                                                return [
                                                    formatCurrency(value),
                                                    name,
                                                ];
                                            }
                                            return [value, name];
                                        }}
                                    />
                                    <Bar
                                        dataKey="total_quantity"
                                        fill="#0088FE"
                                        name="Total Quantity"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Item Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Top Items -{" "}
                                {monthNames[analytics.currentMonth - 1]}{" "}
                                {analytics.currentYear}
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={filters.month}
                                    onValueChange={(value) => {
                                        router.get(route("items.report"), {
                                            ...filters,
                                            month: value,
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthNames.map((month, index) => (
                                            <SelectItem
                                                key={index + 1}
                                                value={(index + 1).toString()}
                                            >
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Product Type</TableHead>
                                        <TableHead className="text-right">
                                            Quantity Sold
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total Sales
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Unique Customers
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {analytics.itemTrendsByMonth.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div>{item.brand_name}</div>
                                                    {item.generic_name && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {item.generic_name}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {item.product_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatNumber(
                                                    item.total_quantity
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">
                                                {formatCurrency(
                                                    item.total_sales
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Users className="h-3 w-3 text-muted-foreground" />
                                                    {item.unique_customers}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {analytics.itemTrendsByMonth.length ===
                                        0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No sales data for{" "}
                                                {
                                                    monthNames[
                                                        analytics.currentMonth -
                                                            1
                                                    ]
                                                }{" "}
                                                {analytics.currentYear}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Low Inventory Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                Low Inventory Items (Less than 10)
                            </div>
                            <div className="w-64">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search items..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Product Type</TableHead>
                                        <TableHead>Milligrams/Supply</TableHead>
                                        <TableHead className="text-right">
                                            Catalog Price
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Inventory
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Inventory Value
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLowInventoryItems.map((item) => {
                                        const inventoryStatus =
                                            getInventoryStatus(item.inventory);
                                        return (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div>
                                                            {item.brand_name}
                                                        </div>
                                                        {item.generic_name && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    item.generic_name
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {item.product_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {item.milligrams && (
                                                            <div>
                                                                {
                                                                    item.milligrams
                                                                }
                                                            </div>
                                                        )}
                                                        {item.supply && (
                                                            <div className="text-muted-foreground">
                                                                {item.supply}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        item.catalog_price
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    <span
                                                        className={
                                                            item.inventory <= 0
                                                                ? "text-red-600"
                                                                : item.inventory <
                                                                  5
                                                                ? "text-orange-600"
                                                                : "text-yellow-600"
                                                        }
                                                    >
                                                        {item.inventory}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        item.inventory_value
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            inventoryStatus.color
                                                        }
                                                    >
                                                        {inventoryStatus.text}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredLowInventoryItems.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                {searchTerm
                                                    ? `No low inventory items found matching "${searchTerm}"`
                                                    : "No low inventory items found"}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Items (All Time) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Most Popular Items - {filters.year}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Product Type</TableHead>
                                        <TableHead className="text-right">
                                            Total Quantity
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total Sales
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Unique Customers
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Avg. Price
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {analytics.popularItems.map(
                                        (item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    <Badge
                                                        variant={
                                                            index < 3
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                    >
                                                        #{index + 1}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div>
                                                            {item.brand_name}
                                                        </div>
                                                        {item.generic_name && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    item.generic_name
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {item.product_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatNumber(
                                                        item.total_quantity
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-green-600">
                                                    {formatCurrency(
                                                        item.total_sales
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Users className="h-3 w-3 text-muted-foreground" />
                                                        {item.unique_customers}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        item.catalog_price
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
