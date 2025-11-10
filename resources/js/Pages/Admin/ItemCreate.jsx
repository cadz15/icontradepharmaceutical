import { useCallback, useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { useDropzone } from "react-dropzone";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Upload, Package, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { TagsInput } from "@/Components/TagsInput";

export default function ItemCreate() {
    const { data, setData, post, progress, processing, errors, reset } =
        useForm({
            brand_name: "",
            generic_name: "",
            milligrams: "",
            supply: "",
            catalog_price: "",
            product_type: "",
            images: [],
            remarks: "",
        });

    const [previews, setPreviews] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const onDrop = useCallback(
        (acceptedFiles) => {
            const newPreviews = acceptedFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setPreviews(newPreviews);
            setData("images", acceptedFiles);
        },
        [setData]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"],
        },
        maxFiles: 10,
        maxSize: 5 * 1024 * 1024, // 5MB
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectChange = (value) => {
        setData("product_type", value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("item.store"), {
            onSuccess: () => {
                reset();
                setPreviews([]);
            },
            onError: (errors) => {
                console.error("Error creating item:", errors);
            },
        });
    };

    const formatCurrency = (value) => {
        // Remove non-numeric characters except decimal point
        const numericValue = value.replace(/[^\d.]/g, "");
        if (!numericValue) return "";

        // Format as currency
        return new Intl.NumberFormat("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(numericValue));
    };

    const handlePriceChange = (e) => {
        const formattedValue = e.target.value;
        setData("catalog_price", formattedValue);
    };

    useEffect(() => {
        setData("remarks", selectedTags.join(","));
    }, [selectedTags]);

    return (
        <AuthenticatedLayout>
            <Head title="Create Item" />

            <div className="container max-w-4xl mx-auto py-6">
                <Card className="shadow-sm border-0">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">
                                    Create New Item
                                </CardTitle>
                                <CardDescription>
                                    Add a new product to your inventory
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Basic Information
                                </h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="brand_name"
                                            className="text-sm font-medium"
                                        >
                                            Brand Name{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="brand_name"
                                            name="brand_name"
                                            placeholder="e.g., Unilab, Pfizer"
                                            value={data.brand_name}
                                            onChange={handleChange}
                                            className={
                                                errors.brand_name
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        />
                                        {errors.brand_name && (
                                            <p className="text-sm text-destructive flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.brand_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="generic_name"
                                            className="text-sm font-medium"
                                        >
                                            Generic Name{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="generic_name"
                                            name="generic_name"
                                            placeholder="e.g., Paracetamol, Ibuprofen"
                                            value={data.generic_name}
                                            onChange={handleChange}
                                            className={
                                                errors.generic_name
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        />
                                        {errors.generic_name && (
                                            <p className="text-sm text-destructive flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.generic_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="milligrams"
                                            className="text-sm font-medium"
                                        >
                                            Milligrams
                                        </Label>
                                        <Input
                                            id="milligrams"
                                            name="milligrams"
                                            placeholder="e.g., 500mg"
                                            value={data.milligrams}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="supply"
                                            className="text-sm font-medium"
                                        >
                                            Supply
                                        </Label>
                                        <Input
                                            id="supply"
                                            name="supply"
                                            placeholder="e.g., 1s, 100ml"
                                            value={data.supply}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="catalog_price"
                                            className="text-sm font-medium"
                                        >
                                            Catalog Price{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="catalog_price"
                                            name="catalog_price"
                                            placeholder="0.00"
                                            type="number"
                                            value={data.catalog_price}
                                            onChange={handlePriceChange}
                                            className={
                                                errors.catalog_price
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        />
                                        {errors.catalog_price && (
                                            <p className="text-sm text-destructive flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.catalog_price}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="product_type"
                                        className="text-sm font-medium"
                                    >
                                        Product Type{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        onValueChange={handleSelectChange}
                                        value={data.product_type}
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.product_type
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select product type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="non-exclusive">
                                                Non-Exclusive/Generic
                                            </SelectItem>
                                            <SelectItem value="exclusive">
                                                Exclusive
                                            </SelectItem>
                                            <SelectItem value="regulated">
                                                Regulated/Dangerous
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.product_type && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.product_type}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="product_type"
                                        className="text-sm font-medium"
                                    >
                                        Product Ingredients
                                    </Label>
                                    <TagsInput
                                        availableTags={["Vitamins C", "Zinc"]}
                                        value={selectedTags}
                                        onChange={setSelectedTags}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Image Upload */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Product Images
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Upload up to 10 images. Supported
                                        formats: JPG, PNG, GIF. Max file size:
                                        5MB each.
                                    </p>
                                </div>

                                <div
                                    {...getRootProps()}
                                    className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                    ${
                        isDragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }
                  `}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center gap-3">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        {isDragActive ? (
                                            <p className="text-sm font-medium">
                                                Drop the images here...
                                            </p>
                                        ) : (
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    Drag & drop images here, or
                                                    click to browse
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF up to 5MB each
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {errors.images && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {errors.images}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Image Previews */}
                                {previews.length > 0 && (
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">
                                            Preview ({previews.length} image
                                            {previews.length !== 1 ? "s" : ""})
                                        </Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {previews.map((src, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative group"
                                                >
                                                    <img
                                                        src={src}
                                                        alt={`Preview ${
                                                            idx + 1
                                                        }`}
                                                        className="rounded-lg object-cover w-full h-24 border"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                        <ImageIcon className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Progress */}
                                {processing && progress && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">
                                                Uploading images...
                                            </span>
                                            <span>{progress.percentage}%</span>
                                        </div>
                                        <Progress
                                            value={progress.percentage}
                                            className="h-2"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-3 border-t px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={processing}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-w-24"
                            >
                                {processing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Item"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
