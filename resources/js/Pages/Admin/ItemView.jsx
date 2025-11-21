import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Package,
    FlaskConical,
    Tag,
    Pill,
    Building,
    AlertTriangle,
    ShoppingCart,
    Box,
    TrendingUp,
    Edit,
    ArrowLeft,
} from "lucide-react";
import { Link } from "@inertiajs/react";

const formattedCurrency = (amount) => {
    const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(numericAmount);
};

const productTypeVariants = {
    "non-exclusive": "secondary",
    exclusive: "default",
    regulated: "destructive",
};

function ItemView() {
    const { item } = usePage().props;

    const getProductTypeVariant = (type) => {
        return productTypeVariants[type] || "secondary";
    };

    const getInventoryStatus = (inventory) => {
        const quantity = parseInt(inventory);
        if (quantity <= 0) {
            return {
                status: "out_of_stock",
                label: "Out of Stock",
                color: "text-red-700 bg-red-50 border-red-200",
                icon: AlertTriangle,
                badgeColor: "destructive",
                alert: true,
            };
        }
        if (quantity < 5) {
            return {
                status: "very_low",
                label: "Very Low Stock",
                color: "text-red-600 bg-red-50 border-red-200",
                icon: AlertTriangle,
                badgeColor: "destructive",
                alert: true,
            };
        }
        if (quantity < 10) {
            return {
                status: "low",
                label: "Low Stock",
                color: "text-orange-600 bg-orange-50 border-orange-200",
                icon: AlertTriangle,
                badgeColor: "outline",
                alert: true,
            };
        }
        if (quantity < 20) {
            return {
                status: "medium",
                label: "Medium Stock",
                color: "text-yellow-600 bg-yellow-50 border-yellow-200",
                icon: Box,
                badgeColor: "secondary",
                alert: false,
            };
        }
        return {
            status: "good",
            label: "In Stock",
            color: "text-green-600 bg-green-50 border-green-200",
            icon: Box,
            badgeColor: "default",
            alert: false,
        };
    };

    const inventoryStatus = getInventoryStatus(item.inventory);
    const StatusIcon = inventoryStatus.icon;

    return (
        <AuthenticatedLayout>
            <Head title={item.brand_name} />

            <div className="container max-w-6xl mx-auto py-6 space-y-6">
                {/* Header with Back Button and Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="h-10 w-10"
                        >
                            <Link href={route("item.index")}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Item Details
                            </h1>
                            <p className="text-muted-foreground">
                                Complete information about {item.brand_name}
                            </p>
                        </div>
                    </div>

                    <Button asChild className="gap-2">
                        <Link href={route("item.edit", item.id)}>
                            <Edit className="h-4 w-4" />
                            Edit Item
                        </Link>
                    </Button>
                </div>

                {/* Inventory Alert Banner */}
                {inventoryStatus.alert && (
                    <Card
                        className={`border-l-4 border-l-red-500 ${inventoryStatus.color}`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <StatusIcon className="h-5 w-5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold">
                                        {inventoryStatus.label}
                                    </h3>
                                    <p className="text-sm opacity-90">
                                        Current inventory: {item.inventory}{" "}
                                        units
                                        {inventoryStatus.status ===
                                            "out_of_stock" &&
                                            " - Consider restocking immediately"}
                                        {inventoryStatus.status ===
                                            "very_low" &&
                                            " - Urgent restock recommended"}
                                        {inventoryStatus.status === "low" &&
                                            " - Consider restocking soon"}
                                    </p>
                                </div>
                                <Badge variant={inventoryStatus.badgeColor}>
                                    {inventoryStatus.label}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Image Carousel */}
                {item.images.length > 0 ? (
                    <Card className="overflow-hidden">
                        <CardContent className="p-6">
                            <Carousel className="w-full max-w-4xl mx-auto">
                                <CarouselContent>
                                    {item.images.map((itemImage, index) => (
                                        <CarouselItem key={itemImage.id}>
                                            <div className="flex aspect-video items-center justify-center p-2">
                                                <img
                                                    src={route(
                                                        "image.link",
                                                        itemImage.id
                                                    )}
                                                    alt={`${
                                                        item.brand_name
                                                    } - Image ${index + 1}`}
                                                    className="rounded-lg object-contain w-full h-full max-h-96"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {item.images.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </>
                                )}
                            </Carousel>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <Package className="h-16 w-16 opacity-50" />
                                <p className="text-lg font-medium">
                                    No images available
                                </p>
                                <p className="text-sm">
                                    This item doesn't have any images yet
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Item Details */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <Card className="lg:col-span-2">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                                        <Pill className="h-8 w-8 text-blue-600" />
                                        {item.brand_name}
                                    </h1>
                                    <h2 className="text-xl text-muted-foreground">
                                        {item.generic_name}
                                    </h2>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge
                                        variant={getProductTypeVariant(
                                            item.product_type
                                        )}
                                        className="text-sm capitalize"
                                    >
                                        {item.product_type.replace("-", " ")}
                                    </Badge>
                                    <Badge
                                        variant={inventoryStatus.badgeColor}
                                        className="flex items-center gap-1"
                                    >
                                        <StatusIcon className="h-3 w-3" />
                                        {inventoryStatus.label}
                                    </Badge>
                                </div>
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4 border-t">
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FlaskConical className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Milligrams
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {item.milligrams || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Package className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Supply
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {item.supply || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Tag className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Price
                                        </p>
                                        <p className="text-lg font-semibold text-green-700">
                                            {formattedCurrency(
                                                item.catalog_price
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`flex items-center gap-3 p-4 rounded-lg border-2 ${inventoryStatus.color} hover:opacity-90 transition-opacity`}
                                >
                                    <div className="p-2 bg-white rounded-lg">
                                        <ShoppingCart className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Inventory
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {item.inventory} units
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">
                                        Inventory Level
                                    </span>
                                    <span>{item.inventory} units</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${
                                            inventoryStatus.status ===
                                            "out_of_stock"
                                                ? "bg-red-500"
                                                : inventoryStatus.status ===
                                                  "very_low"
                                                ? "bg-red-400"
                                                : inventoryStatus.status ===
                                                  "low"
                                                ? "bg-orange-400"
                                                : inventoryStatus.status ===
                                                  "medium"
                                                ? "bg-yellow-400"
                                                : "bg-green-500"
                                        }`}
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                (item.inventory / 50) * 100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Low</span>
                                    <span>Optimal</span>
                                </div>
                            </div>

                            {/* Remarks Section */}
                            {item.remarks && (
                                <div className="pt-4 border-t">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Remarks
                                    </h3>
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-800 whitespace-pre-wrap">
                                            {item.remarks}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Information Sidebar */}
                    <div className="space-y-6">
                        {/* Product Information Card */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Product Information
                                </h3>

                                <div className="space-y-4">
                                    <InfoRow
                                        label="Product Type"
                                        value={item.product_type.replace(
                                            "-",
                                            " "
                                        )}
                                    />
                                    <InfoRow
                                        label="Brand Name"
                                        value={item.brand_name}
                                    />
                                    <InfoRow
                                        label="Generic Name"
                                        value={item.generic_name}
                                    />
                                    {item.milligrams && (
                                        <InfoRow
                                            label="Milligrams"
                                            value={item.milligrams}
                                        />
                                    )}
                                    {item.supply && (
                                        <InfoRow
                                            label="Supply"
                                            value={item.supply}
                                        />
                                    )}
                                    <InfoRow
                                        label="Catalog Price"
                                        value={formattedCurrency(
                                            item.catalog_price
                                        )}
                                        valueClass="text-green-700 font-semibold"
                                    />
                                    <InfoRow
                                        label="Inventory Status"
                                        value={
                                            <Badge
                                                variant={
                                                    inventoryStatus.badgeColor
                                                }
                                            >
                                                {inventoryStatus.label}
                                            </Badge>
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <Button asChild className="w-full gap-2">
                                        <Link
                                            href={route("item.edit", item.id)}
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit Item
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="w-full gap-2"
                                    >
                                        <Link href={route("item.index")}>
                                            <ArrowLeft className="h-4 w-4" />
                                            Back to Items
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Reusable InfoRow component
const InfoRow = ({ label, value, valueClass = "" }) => (
    <div className="flex justify-between items-start py-2 border-b last:border-b-0">
        <span className="text-sm font-medium text-muted-foreground">
            {label}
        </span>
        <span className={`text-sm text-right ${valueClass}`}>{value}</span>
    </div>
);

// Simple Label component
const Label = ({ children, className = "" }) => (
    <span className={`text-sm font-medium ${className}`}>{children}</span>
);

export default ItemView;
