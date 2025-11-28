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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    User,
    Edit,
    Save,
    X,
    Package,
    TrendingUp,
    ShoppingCart,
    BarChart3,
    Eye,
    QrCode,
    Smartphone,
    Users,
    Gift,
    Search,
    FileText,
    ImageIcon,
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
} from "recharts";
import AppPagination from "@/Components/AppPagination";

// Use react-qr-code instead of qrcode.react
import QRCode from "react-qr-code";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import { Calendar, Plus, Clock, MapPin } from "lucide-react";
import CreateEvent from "@/Components/Modal/MedicalRepresentative/CreateEvent";
import EventDetails from "@/Components/Modal/MedicalRepresentative/EventDetails";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function MedicalRepresentativeShow() {
    const { medicalRepresentative, analytics, filters } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: medicalRepresentative.name,
        clear_product_app: false,
        clear_sales_order_app: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productSearch, setProductSearch] = useState("");

    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(analytics.currentMonth);
    const [currentYear, setCurrentYear] = useState(analytics.currentYear);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const handleEditToggle = () => {
        if (isEditing) {
            setFormData({
                name: medicalRepresentative.name,
                clear_product_app: false,
                clear_sales_order_app: false,
            });
        }
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        await router.put(
            route("medical-representatives.update", medicalRepresentative.id),
            formData,
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
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

    const hasRegisteredApps =
        medicalRepresentative.product_app_id ||
        medicalRepresentative.sales_order_app_id;

    // Function to render signature image from blob data
    const renderSignature = (signatureBlob) => {
        if (!signatureBlob) return null;

        try {
            // If it's a base64 string, create data URL
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
                // Assume it's base64 data without prefix
                return (
                    <img
                        src={`data:image/png;base64,${signatureBlob}`}
                        alt="Signature"
                        className="h-8 w-16 object-contain border rounded"
                    />
                );
            }
        } catch (error) {
            console.error("Error rendering signature:", error);
            return (
                <span className="text-xs text-muted-foreground">
                    Error loading signature
                </span>
            );
        }
    };

    // Add these functions
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowEventDetails(true);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setShowEventModal(true);
        setShowEventDetails(false);
    };

    const handleCloseEventDetails = () => {
        setShowEventDetails(false);
        setSelectedEvent(null);
    };

    // Add these functions
    const handleMonthChange = (increment) => {
        if (increment === 0) {
            router.get(
                route("medical-representatives.show", medicalRepresentative.id)
            );

            return;
        }

        let newMonth = parseInt(currentMonth) + parseInt(increment);
        let newYear = currentYear;

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);

        // Fetch events for the new month
        router.get(
            route("medical-representatives.show", medicalRepresentative.id),
            {
                year: newYear,
                month: newMonth,
            }
        );
    };

    const handleCreateEvent = (date = null) => {
        setSelectedDate(date);
        setShowEventModal(true);
    };

    const getEventTypeColor = (
        eventType,
        isMultiDay = false,
        isFirstDay = false,
        isLastDay = false
    ) => {
        const baseColors = {
            meeting: "bg-blue-100 text-blue-800 border-blue-200",
            call: "bg-green-100 text-green-800 border-green-200",
            visit: "bg-purple-100 text-purple-800 border-purple-200",
            task: "bg-orange-100 text-orange-800 border-orange-200",
            other: "bg-gray-100 text-gray-800 border-gray-200",
        };

        let color = baseColors[eventType] || baseColors.other;

        if (isMultiDay) {
            if (isFirstDay) {
                color += " border-l-4 border-l-blue-400";
            } else if (isLastDay) {
                color += " border-l-4 border-l-green-400";
            } else {
                color += " border-l-4 border-l-yellow-400";
            }
        }

        return color;
    };

    const getStatusColor = (status) => {
        const colors = {
            scheduled: "bg-blue-500",
            completed: "bg-green-500",
            cancelled: "bg-red-500",
        };
        return colors[status] || colors.scheduled;
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

    return (
        <AuthenticatedLayout>
            <Head
                title={`${medicalRepresentative.name} - Medical Representative`}
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <User className="h-8 w-8 text-primary" />
                            {medicalRepresentative.name}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Medical Representative details and analytics
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
                                Edit Medical Representative
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Medical Representative Information - Left Side */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Representative Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    {isEditing ? (
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">
                                            {medicalRepresentative.name}
                                        </p>
                                    )}
                                </div>

                                {/* API Key QR Code */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <QrCode className="h-4 w-4" />
                                        API Key QR Code
                                    </h4>
                                    <div className="flex justify-center p-4 bg-white border rounded-lg">
                                        <QRCode
                                            value={
                                                medicalRepresentative.api_key
                                            }
                                            size={200}
                                            level="M"
                                            style={{
                                                height: "auto",
                                                maxWidth: "100%",
                                                width: "100%",
                                            }}
                                            viewBox="0 0 256 256"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">
                                        Scan this QR code to register apps
                                    </p>
                                </div>

                                {/* Registered Apps */}
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        Registered Apps
                                    </h4>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-green-600" />
                                                <span>Product App</span>
                                            </div>
                                            {medicalRepresentative.product_app_id ? (
                                                <Badge
                                                    variant="default"
                                                    className="bg-green-500"
                                                >
                                                    Registered
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    Not Registered
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <ShoppingCart className="h-4 w-4 text-blue-600" />
                                                <span>Sales Order App</span>
                                            </div>
                                            {medicalRepresentative.sales_order_app_id ? (
                                                <Badge
                                                    variant="default"
                                                    className="bg-green-500"
                                                >
                                                    Registered
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    Not Registered
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing && hasRegisteredApps && (
                                        <div className="space-y-3 pt-3 border-t">
                                            <Label className="text-sm font-medium">
                                                Clear Registered Apps
                                            </Label>
                                            {medicalRepresentative.product_app_id && (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="clear_product_app"
                                                        checked={
                                                            formData.clear_product_app
                                                        }
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            handleInputChange(
                                                                "clear_product_app",
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor="clear_product_app"
                                                        className="text-sm"
                                                    >
                                                        Clear Product App
                                                        Registration
                                                    </Label>
                                                </div>
                                            )}
                                            {medicalRepresentative.sales_order_app_id && (
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="clear_sales_order_app"
                                                        checked={
                                                            formData.clear_sales_order_app
                                                        }
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            handleInputChange(
                                                                "clear_sales_order_app",
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor="clear_sales_order_app"
                                                        className="text-sm"
                                                    >
                                                        Clear Sales Order App
                                                        Registration
                                                    </Label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Events Calendar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Events Calendar -{" "}
                                        {monthNames[currentMonth - 1]}{" "}
                                        {currentYear}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleMonthChange(-1)
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setCurrentMonth(
                                                    new Date().getMonth() + 1
                                                );
                                                setCurrentYear(
                                                    new Date().getFullYear()
                                                );

                                                handleMonthChange(0);
                                            }}
                                        >
                                            Today
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleMonthChange(1)}
                                        >
                                            Next
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

                                        // Adjust for first day of month starting on correct day
                                        if (
                                            dayData.day === 1 &&
                                            dayOfWeek > 0
                                        ) {
                                            return [
                                                ...Array(dayOfWeek)
                                                    .fill(null)
                                                    .map((_, index) => (
                                                        <div
                                                            key={`empty-${index}`}
                                                            className="min-h-[100px] border rounded-lg bg-muted/20"
                                                        />
                                                    )),
                                                <div
                                                    key={dayData.date}
                                                    className={`min-h-[100px] border rounded-lg p-2 ${
                                                        dayData.is_today
                                                            ? "bg-blue-50 border-blue-200"
                                                            : "bg-white"
                                                    }`}
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
                                                            onClick={() =>
                                                                handleCreateEvent(
                                                                    dayData.date
                                                                )
                                                            }
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-1 max-h-20 overflow-y-auto">
                                                        {dayData.events &&
                                                            Object.values(
                                                                dayData.events
                                                            ).map((event) => (
                                                                <div
                                                                    key={
                                                                        event.id
                                                                    }
                                                                    className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getEventTypeColor(
                                                                        event.event_type
                                                                    )} ${
                                                                        event.is_multi_day
                                                                            ? "border-l-4"
                                                                            : ""
                                                                    } ${
                                                                        event.is_first_day &&
                                                                        event.is_multi_day
                                                                            ? "border-l-blue-400"
                                                                            : event.is_last_day &&
                                                                              event.is_multi_day
                                                                            ? "border-l-green-400"
                                                                            : event.is_multi_day
                                                                            ? "border-l-yellow-400"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        handleEventClick(
                                                                            event
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="font-medium truncate">
                                                                        {
                                                                            event.title
                                                                        }
                                                                    </div>
                                                                    {event.start_time && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Clock className="h-2 w-2" />
                                                                            <span>
                                                                                {
                                                                                    event.start_time
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {event.customer && (
                                                                        <div className="flex items-center gap-1">
                                                                            <User className="h-2 w-2" />
                                                                            <span className="truncate">
                                                                                {
                                                                                    event.customer
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center justify-between mt-1">
                                                                        <span className="capitalize">
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
                                                                    {event.is_multi_day && (
                                                                        <div className="text-[10px] text-gray-500 mt-1">
                                                                            {event.is_first_day
                                                                                ? "Starts"
                                                                                : event.is_last_day
                                                                                ? "Ends"
                                                                                : "Continues"}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>,
                                            ];
                                        }

                                        return (
                                            <div
                                                key={dayData.date}
                                                className={`min-h-[100px] border rounded-lg p-2 group ${
                                                    dayData.is_today
                                                        ? "bg-blue-50 border-blue-200"
                                                        : "bg-white"
                                                }`}
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
                                                        onClick={() =>
                                                            handleCreateEvent(
                                                                dayData.date
                                                            )
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="space-y-1 max-h-20 overflow-y-auto">
                                                    {dayData.events &&
                                                        Object.values(
                                                            dayData.events
                                                        ).map((event) => (
                                                            <div
                                                                key={event.id}
                                                                className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getEventTypeColor(
                                                                    event.event_type
                                                                )} ${
                                                                    event.is_multi_day
                                                                        ? "border-l-4"
                                                                        : ""
                                                                } ${
                                                                    event.is_first_day &&
                                                                    event.is_multi_day
                                                                        ? "border-l-blue-400"
                                                                        : event.is_last_day &&
                                                                          event.is_multi_day
                                                                        ? "border-l-green-400"
                                                                        : event.is_multi_day
                                                                        ? "border-l-yellow-400"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    handleEventClick(
                                                                        event
                                                                    )
                                                                }
                                                            >
                                                                <div className="font-medium truncate">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </div>
                                                                {event.start_time && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-2 w-2" />
                                                                        <span>
                                                                            {
                                                                                event.start_time
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {event.customer && (
                                                                    <div className="flex items-center gap-1">
                                                                        <User className="h-2 w-2" />
                                                                        <span className="truncate">
                                                                            {
                                                                                event.customer
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center justify-between mt-1">
                                                                    <span className="capitalize">
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
                                                                {event.is_multi_day && (
                                                                    <div className="text-[10px] text-gray-500 mt-1">
                                                                        {event.is_first_day
                                                                            ? "Starts"
                                                                            : event.is_last_day
                                                                            ? "Ends"
                                                                            : "Continues"}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Create Event Modal */}
                        <CreateEvent
                            medicalRepresentative={medicalRepresentative}
                            showModal={showEventModal}
                            onClose={() => {
                                setShowEventModal(false);
                                setSelectedDate(null);
                            }}
                            selectedDate={selectedDate}
                        />

                        <EventDetails
                            event={selectedEvent}
                            showModal={showEventDetails}
                            onClose={handleCloseEventDetails}
                            onEdit={handleEditEvent}
                        />
                    </div>

                    {/* Analytics and Sales Data - Right Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <Card>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Sales
                                        </p>
                                        <p className="text-xl font-bold">
                                            {formatCurrency(
                                                analytics.statistics.total_sales
                                            )}
                                        </p>
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
                                            Monthly Sales
                                        </p>
                                        <p className="text-xl font-bold">
                                            {formatCurrency(
                                                analytics.statistics
                                                    .monthly_sales
                                            )}
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
                                            {
                                                analytics.statistics
                                                    .total_customers_sold
                                            }
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
                                            Monthly Customers
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {
                                                analytics.statistics
                                                    .monthly_customers_sold
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Package className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Top Product Type
                                        </p>
                                        <p
                                            className="text-lg font-bold truncate"
                                            title={
                                                analytics.statistics
                                                    .top_product_type
                                            }
                                        >
                                            {
                                                analytics.statistics
                                                    .top_product_type
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Sales Per Year */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        Sales Trend - {filters.year}
                                        <Select
                                            value={filters.year}
                                            onValueChange={(value) => {
                                                router.get(
                                                    route(
                                                        "medical-representatives.show",
                                                        medicalRepresentative.id
                                                    ),
                                                    {
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
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <LineChart
                                            data={analytics.salesPerYearData}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month_name"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis />
                                            <RechartsTooltip
                                                formatter={(value) => [
                                                    formatCurrency(value),
                                                    "Sales",
                                                ]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="total_sales"
                                                stroke="#0088FE"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Product Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={
                                                    analytics.productDistributionData
                                                }
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
                                                {analytics.productDistributionData.map(
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
                        </div>

                        {/* Product Sold Trend Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Product Sold Trend -{" "}
                                        {analytics.productSoldTrend.year}
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
                                            value={productSearch}
                                            onChange={(e) =>
                                                setProductSearch(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                        {productSearch && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                                                onClick={() =>
                                                    setProductSearch("")
                                                }
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
                                            {analytics.productSoldTrend.products
                                                .filter((product) => {
                                                    if (!productSearch)
                                                        return true;
                                                    const searchTerm =
                                                        productSearch.toLowerCase();
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
                                                                    trend?.startsWith(
                                                                        "+"
                                                                    );
                                                                const isNegative =
                                                                    trend?.startsWith(
                                                                        "-"
                                                                    ) &&
                                                                    !trend?.startsWith(
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
                                                                                    className={`text-xs ${
                                                                                        isPositive
                                                                                            ? "text-green-600"
                                                                                            : isNegative
                                                                                            ? "text-red-600"
                                                                                            : "text-gray-500"
                                                                                    }`}
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

                                                        <TableCell className="text-center font-bold">
                                                            {
                                                                product.total_quantity
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                            {analytics.productSoldTrend.products.filter(
                                                (product) => {
                                                    if (!productSearch)
                                                        return true;
                                                    const searchTerm =
                                                        productSearch.toLowerCase();
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
                                                                {productSearch
                                                                    ? `No products found matching "${productSearch}"`
                                                                    : `No product sold data for ${analytics.productSoldTrend.year}`}
                                                            </p>
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
                                        analytics.productSoldTrend.products.filter(
                                            (product) => {
                                                if (!productSearch) return true;
                                                const searchTerm =
                                                    productSearch.toLowerCase();
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
                                    {analytics.productSoldTrend.products.length}{" "}
                                    products
                                    {productSearch && (
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 ml-2 text-blue-600"
                                            onClick={() => setProductSearch("")}
                                        >
                                            Clear search
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* DCR Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Daily Call Reports (DCR) -{" "}
                                    {monthNames[currentMonth - 1]}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>DCR Name</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Signature</TableHead>
                                            <TableHead>Remarks</TableHead>
                                            <TableHead>Sync Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analytics.dcrs.data.map((dcr) => (
                                            <TableRow key={dcr.id}>
                                                <TableCell className="font-medium">
                                                    {dcr.name}
                                                </TableCell>
                                                <TableCell>
                                                    {dcr.customer?.name ||
                                                        "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(dcr.dcr_date)}
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
                                                                    <span className="line-clamp-2 max-w-[200px]">
                                                                        {
                                                                            dcr.remarks
                                                                        }
                                                                    </span>
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
                                                        <span className="text-muted-foreground">
                                                            No remarks
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {dcr.sync_date
                                                        ? formatDate(
                                                              dcr.sync_date
                                                          )
                                                        : "Not synced"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {analytics.dcrs.data.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="text-center py-8 text-muted-foreground"
                                                >
                                                    No daily call reports found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                {analytics.dcrs.last_page > 1 && (
                                    <div className="mt-4">
                                        <AppPagination
                                            paginationData={analytics.dcrs}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sales Orders Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Sales Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analytics.salesOrders.data.map(
                                            (order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">
                                                        {
                                                            order.sales_order_number
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.customer?.name}
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
                                                                order.status ===
                                                                "pending"
                                                                    ? "outline"
                                                                    : order.status ===
                                                                      "acknowledge-approved"
                                                                    ? "default"
                                                                    : order.status ===
                                                                      "acknowledge-hold"
                                                                    ? "destructive"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
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
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                        {analytics.salesOrders.data.length ===
                                            0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="text-center py-8 text-muted-foreground"
                                                >
                                                    No sales orders found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                {analytics.salesOrders.last_page > 1 && (
                                    <div className="mt-4">
                                        <AppPagination
                                            paginationData={
                                                analytics.salesOrders
                                            }
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sales with Free Items/Discounts */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gift className="h-5 w-5" />
                                    Sales with Free Items & Discounts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Free Items</TableHead>
                                            <TableHead>Discounts</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analytics.salesWithFreeItemsDiscounts.data.map(
                                            (order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">
                                                        {
                                                            order.sales_order_number
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.customer?.name}
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
                                                        {order.sales_order_items.some(
                                                            (item) =>
                                                                item.promo ===
                                                                "free"
                                                        ) ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-orange-50"
                                                            >
                                                                Yes
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                No
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.sales_order_items.some(
                                                            (item) =>
                                                                item.promo ===
                                                                "discount"
                                                        ) ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-blue-50"
                                                            >
                                                                Yes
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                No
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                        {analytics.salesWithFreeItemsDiscounts
                                            .data.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="text-center py-8 text-muted-foreground"
                                                >
                                                    No sales with free items or
                                                    discounts found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                {analytics.salesWithFreeItemsDiscounts
                                    .last_page > 1 && (
                                    <div className="mt-4">
                                        <AppPagination
                                            paginationData={
                                                analytics.salesWithFreeItemsDiscounts
                                            }
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
