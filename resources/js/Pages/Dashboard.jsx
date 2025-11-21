import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
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
    Package,
    TrendingUp,
    BarChart3,
    ShoppingCart,
    AlertTriangle,
    DollarSign,
    Users,
    User,
    Calendar,
    Eye,
    ArrowUp,
    ArrowDown,
    Plus,
    Clock,
    MapPin,
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
import EventDetails from "@/Components/Modal/MedicalRepresentative/EventDetails";
import CreateEvent from "@/Components/Modal/Admin/CreateEvent";

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

export default function AdminDashboard() {
    const { analytics, filters } = usePage().props;
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

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

    const getEventTypeColor = (eventType) => {
        const colors = {
            meeting: "bg-blue-100 text-blue-800 border-blue-200",
            call: "bg-green-100 text-green-800 border-green-200",
            visit: "bg-purple-100 text-purple-800 border-purple-200",
            task: "bg-orange-100 text-orange-800 border-orange-200",
            training: "bg-indigo-100 text-indigo-800 border-indigo-200",
            other: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return colors[eventType] || colors.other;
    };

    const getStatusColor = (status) => {
        const colors = {
            scheduled: "bg-blue-500",
            completed: "bg-green-500",
            cancelled: "bg-red-500",
        };
        return colors[status] || colors.scheduled;
    };

    const handleMonthChange = (increment) => {
        let newMonth = parseInt(filters.month) + increment;
        let newYear = parseInt(filters.year);

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        router.get(route("dashboard"), {
            year: newYear,
            month: newMonth,
        });
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowEventDetails(true);
    };

    const handleCloseEventDetails = () => {
        setShowEventDetails(false);
        setSelectedEvent(null);
    };

    const handleCreateEvent = (date = null) => {
        setSelectedDate(date);
        setShowCreateEvent(true);
    };

    const handleEditEvent = (event) => {
        // For admin, we might want to redirect to the medical representative's event page
        // or implement a global event editor
        console.log("Edit event:", event);
        // You can implement edit functionality here
    };

    const handleDayClick = (dayData) => {
        handleCreateEvent(dayData.date);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Overview of your business performance and analytics
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMonthChange(-1)}
                        >
                            Previous Month
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                router.get(route("dashboard"), {
                                    year: new Date().getFullYear(),
                                    month: new Date().getMonth() + 1,
                                });
                            }}
                        >
                            Current Month
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMonthChange(1)}
                        >
                            Next Month
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleCreateEvent()}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Event
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Monthly Sales
                                </p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(
                                        analytics.statistics.monthly_sales
                                    )}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    {analytics.statistics.monthly_growth >=
                                    0 ? (
                                        <ArrowUp className="h-3 w-3 text-green-600" />
                                    ) : (
                                        <ArrowDown className="h-3 w-3 text-red-600" />
                                    )}
                                    <span
                                        className={`text-xs ${
                                            analytics.statistics
                                                .monthly_growth >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {Math.abs(
                                            analytics.statistics.monthly_growth
                                        ).toFixed(1)}
                                        %
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        vs last month
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Yearly Sales
                                </p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(
                                        analytics.statistics.yearly_sales
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {filters.year} YTD
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Customers
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatNumber(
                                        analytics.statistics.total_customers
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <User className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Medical Representatives
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatNumber(
                                        analytics.statistics.total_medical_reps
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <ShoppingCart className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Pending Orders
                                </p>
                                <p className="text-2xl font-bold">
                                    {analytics.statistics.pending_orders_count}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Out of Stock Items
                                </p>
                                <p className="text-2xl font-bold">
                                    {analytics.statistics.out_of_stock_count}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Type Distribution */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Type Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analytics.productTypeDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({
                                            product_type,
                                            total_sales,
                                        }) =>
                                            `${product_type}: ${formatCurrency(
                                                total_sales
                                            )}`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="total_sales"
                                    >
                                        {analytics.productTypeDistribution.map(
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
                                    <RechartsTooltip
                                        formatter={(value) =>
                                            formatCurrency(value)
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Region Performance */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Region Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={analytics.regionPerformance}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis
                                        type="category"
                                        dataKey="region"
                                        width={80}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <RechartsTooltip
                                        formatter={(value, name) => {
                                            if (name === "Total Sales") {
                                                return [
                                                    formatCurrency(value),
                                                    name,
                                                ];
                                            }
                                            return [formatNumber(value), name];
                                        }}
                                    />
                                    <Bar
                                        dataKey="total_sales"
                                        fill="#0088FE"
                                        name="Total Sales"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top Medical Representatives */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Top Medical Representatives
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analytics.topMedicalRepresentatives.map(
                                    (rep, index) => (
                                        <div
                                            key={rep.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant={
                                                        index < 3
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                >
                                                    #{index + 1}
                                                </Badge>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {rep.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {rep.total_orders}{" "}
                                                        orders •{" "}
                                                        {rep.total_customers}{" "}
                                                        customers
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm text-green-600">
                                                    {formatCurrency(
                                                        rep.total_sales
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Full Width Events Calendar */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Events Calendar -{" "}
                                {monthNames[parseInt(filters.month) - 1]}{" "}
                                {filters.year}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="text-center font-medium text-sm py-2 bg-muted/50"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {analytics.eventsCalendar.map((dayData) => {
                                const date = new Date(dayData.date);
                                const dayOfWeek = date.getDay();

                                if (dayData.day === 1 && dayOfWeek > 0) {
                                    return [
                                        ...Array(dayOfWeek)
                                            .fill(null)
                                            .map((_, index) => (
                                                <div
                                                    key={`empty-${index}`}
                                                    className="min-h-[120px] border rounded-lg bg-muted/20"
                                                />
                                            )),
                                        <div
                                            key={dayData.date}
                                            className={`min-h-[120px] border rounded-lg p-2 group cursor-pointer hover:bg-gray-50 transition-colors ${
                                                dayData.is_today
                                                    ? "bg-blue-50 border-blue-200"
                                                    : "bg-white"
                                            }`}
                                            onClick={() =>
                                                handleDayClick(dayData)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span
                                                    className={`text-sm font-medium ${
                                                        dayData.is_today
                                                            ? "text-blue-600"
                                                            : ""
                                                    }`}
                                                >
                                                    {dayData.day}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 hover:opacity-100 group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCreateEvent(
                                                            dayData.date
                                                        );
                                                    }}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                                {Object.values(
                                                    dayData.events
                                                ).map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getEventTypeColor(
                                                            event.event_type
                                                        )}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEventClick(
                                                                event
                                                            );
                                                        }}
                                                    >
                                                        <div className="font-medium truncate">
                                                            {event.title}
                                                        </div>
                                                        <div className="text-[10px] text-gray-600 truncate">
                                                            {
                                                                event.medical_representative
                                                            }
                                                        </div>
                                                        {event.start_time && (
                                                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                <Clock className="h-2 w-2" />
                                                                <span>
                                                                    {
                                                                        event.start_time
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {event.customer && (
                                                            <div className="text-[10px] text-gray-500 truncate">
                                                                {event.customer}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="capitalize text-[10px]">
                                                                {
                                                                    event.event_type
                                                                }
                                                            </span>
                                                            <div
                                                                className={`h-2 w-2 rounded-full ${getStatusColor(
                                                                    event.status
                                                                )}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>,
                                    ];
                                }

                                return (
                                    <div
                                        key={dayData.date}
                                        className={`min-h-[120px] border rounded-lg p-2 group cursor-pointer hover:bg-gray-50 transition-colors ${
                                            dayData.is_today
                                                ? "bg-blue-50 border-blue-200"
                                                : "bg-white"
                                        }`}
                                        onClick={() => handleDayClick(dayData)}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span
                                                className={`text-sm font-medium ${
                                                    dayData.is_today
                                                        ? "text-blue-600"
                                                        : ""
                                                }`}
                                            >
                                                {dayData.day}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 hover:opacity-100 group-hover:opacity-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCreateEvent(
                                                        dayData.date
                                                    );
                                                }}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="space-y-1 max-h-24 overflow-y-auto">
                                            {Object.values(dayData.events).map(
                                                (event) => (
                                                    <div
                                                        key={event.id}
                                                        className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getEventTypeColor(
                                                            event.event_type
                                                        )}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEventClick(
                                                                event
                                                            );
                                                        }}
                                                    >
                                                        <div className="font-medium truncate">
                                                            {event.title}
                                                        </div>
                                                        <div className="text-[10px] text-gray-600 truncate">
                                                            {
                                                                event.medical_representative
                                                            }
                                                        </div>
                                                        {event.start_time && (
                                                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                <Clock className="h-2 w-2" />
                                                                <span>
                                                                    {
                                                                        event.start_time
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {event.customer && (
                                                            <div className="text-[10px] text-gray-500 truncate">
                                                                {event.customer}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="capitalize text-[10px]">
                                                                {
                                                                    event.event_type
                                                                }
                                                            </span>
                                                            <div
                                                                className={`h-2 w-2 rounded-full ${getStatusColor(
                                                                    event.status
                                                                )}`}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* ... (rest of the tables section remains the same) ... */}

                {/* Event Details Modal */}
                {selectedEvent && (
                    <EventDetails
                        event={selectedEvent}
                        showModal={showEventDetails}
                        onClose={handleCloseEventDetails}
                        onEdit={handleEditEvent}
                    />
                )}

                {/* Create Event Modal */}
                <CreateEvent
                    showModal={showCreateEvent}
                    onClose={() => {
                        setShowCreateEvent(false);
                        setSelectedDate(null);
                    }}
                    selectedDate={selectedDate}
                />

                {/* Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Sales Orders */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Pending Sales Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analytics.pendingSalesOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                {order.sales_order_number}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.customer_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                By:{" "}
                                                {
                                                    order.medical_representative_name
                                                }
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">
                                                {formatCurrency(order.total)}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="bg-yellow-50 text-yellow-700"
                                            >
                                                Pending
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {analytics.pendingSalesOrders.length === 0 && (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No pending orders
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Out of Stock Items */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                Out of Stock Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analytics.outOfStockItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                {item.brand_name}
                                            </p>
                                            {item.generic_name && (
                                                <p className="text-xs text-muted-foreground">
                                                    {item.generic_name}
                                                </p>
                                            )}
                                            <Badge
                                                variant="outline"
                                                className="mt-1"
                                            >
                                                {item.product_type}
                                            </Badge>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-red-600">
                                                Out of Stock
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(
                                                    item.catalog_price
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {analytics.outOfStockItems.length === 0 && (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No out of stock items
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Popular Items */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Top Popular Items ({filters.year})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analytics.topPopularItems.map(
                                    (item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant={
                                                        index < 3
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                >
                                                    #{index + 1}
                                                </Badge>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {item.brand_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatNumber(
                                                            item.total_quantity
                                                        )}{" "}
                                                        sold
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm text-green-600">
                                                    {formatCurrency(
                                                        item.total_sales
                                                    )}
                                                </p>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {item.product_type}
                                                </Badge>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Event Details Modal */}
                {selectedEvent && (
                    <EventDetails
                        event={selectedEvent}
                        showModal={showEventDetails}
                        onClose={handleCloseEventDetails}
                        onEdit={handleEditEvent}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
