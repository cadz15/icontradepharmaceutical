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
import { Package, FlaskConical, Tag, Pill, Building } from "lucide-react";

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

    return (
        <AuthenticatedLayout>
            <Head title={item.brand_name} />

            <div className="container max-w-6xl mx-auto py-6 space-y-6">
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
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        {item.brand_name}
                                    </h1>
                                    <h2 className="text-xl text-muted-foreground">
                                        {item.generic_name}
                                    </h2>
                                </div>
                                <Badge
                                    variant={getProductTypeVariant(
                                        item.product_type
                                    )}
                                    className="text-sm capitalize"
                                >
                                    {item.product_type.replace("-", " ")}
                                </Badge>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
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

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
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

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Product Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Product Type
                                    </Label>
                                    <p className="text-sm font-medium capitalize mt-1">
                                        {item.product_type.replace("-", " ")}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Brand Name
                                    </Label>
                                    <p className="text-sm font-medium mt-1">
                                        {item.brand_name}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Generic Name
                                    </Label>
                                    <p className="text-sm font-medium mt-1">
                                        {item.generic_name}
                                    </p>
                                </div>

                                {item.milligrams && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Milligrams
                                        </Label>
                                        <p className="text-sm font-medium mt-1">
                                            {item.milligrams}
                                        </p>
                                    </div>
                                )}

                                {item.supply && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Supply
                                        </Label>
                                        <p className="text-sm font-medium mt-1">
                                            {item.supply}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Simple Label component since we're not importing the shadcn Label
const Label = ({ children, className = "" }) => (
    <span className={`text-sm font-medium ${className}`}>{children}</span>
);

export default ItemView;
