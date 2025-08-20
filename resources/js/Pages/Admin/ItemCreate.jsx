import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function ItemCreate() {
    const { data, setData, post, progress, processing, errors, reset } =
        useForm({
            brand_name: "",
            generic_name: "",
            milligrams: "",
            supply: "",
            catalog_price: "",
            product_type: "",
            images: [],
        });

    const [previews, setPreviews] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setPreviews(acceptedFiles.map((file) => URL.createObjectURL(file)));
        setData("images", acceptedFiles);
    });
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 10,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectChange = (text) => {
        setData("product_type", text);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("item.store"), {
            onSuccess: () => {
                console.log("Hello world");
                reset();
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    return (
        <AuthenticatedLayout header={"Create Item"}>
            <Head title="Create Item" />
            <div className="mt-8 ">
                <Card className="flex flex-col gap-4 max-w-screen-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create Item</CardTitle>
                    </CardHeader>

                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        <CardContent>
                            <div className="grid gap-2 mb-4">
                                <Label htmlFor="brand_name">
                                    Brand Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="brand_name"
                                    name="brand_name"
                                    placeholder="Unilab"
                                    value={data.brand_name}
                                    onChange={handleChange}
                                />
                                {errors.brand_name && (
                                    <p className="text-sm text-red-500">
                                        {errors.brand_name}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2 mb-4">
                                <Label htmlFor="generic_name">
                                    Generic Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="generic_name"
                                    name="generic_name"
                                    placeholder="Tambal Sa Sip-on"
                                    value={data.generic_name}
                                    onChange={handleChange}
                                />
                                {errors.generic_name && (
                                    <p className="text-sm text-red-500">
                                        {errors.generic_name}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-row gap-4 mb-4">
                                <div className="grid gap-2 w-full">
                                    <Label htmlFor="milligrams">
                                        Milligrams
                                    </Label>
                                    <Input
                                        id="milligrams"
                                        name="milligrams"
                                        placeholder="100/mg"
                                        value={data.milligrams}
                                        onChange={handleChange}
                                    />
                                    {errors.milligrams && (
                                        <p className="text-sm text-red-500">
                                            {errors.milligrams}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2 w-full">
                                    <Label htmlFor="supply">Supply</Label>
                                    <Input
                                        id="supply"
                                        name="supply"
                                        placeholder="1s"
                                        value={data.supply}
                                        onChange={handleChange}
                                    />
                                    {errors.supply && (
                                        <p className="text-sm text-red-500">
                                            {errors.supply}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2 w-full">
                                    <Label htmlFor="catalog_price">
                                        Catalog Price
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="catalog_price"
                                        name="catalog_price"
                                        placeholder="1,000.00"
                                        value={data.catalog_price}
                                        onChange={handleChange}
                                    />
                                    {errors.catalog_price && (
                                        <p className="text-sm text-red-500">
                                            {errors.catalog_price}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-2 mb-4">
                                <Label htmlFor="product_type">
                                    Product Type
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    onValueChange={handleSelectChange}
                                    value={data.product_type}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Product Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"non-exclusive"}>
                                            Non-Exclusive/Generic
                                        </SelectItem>
                                        <SelectItem value={"exclusive"}>
                                            Exclusive
                                        </SelectItem>
                                        <SelectItem value={"regulated"}>
                                            Regulated/Dangerous
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {errors.product_type && (
                                    <p className="text-sm text-red-500">
                                        {errors.product_type}
                                    </p>
                                )}
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-2 mt-4">
                                <Label>Images</Label>
                                <span className="text-sm text-gray-500 font-normal">
                                    Select up to 10 images to upload. Supported
                                    formats: JPG, PNG, or GIF. Each image must
                                    be under 5MB. Drag and drop or click to
                                    browse files.
                                </span>
                            </div>
                            <div
                                {...getRootProps()}
                                className={`border-dashed border-2 rounded p-6 text-center cursor-pointer transition-all
                                ${
                                    isDragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                }
                                `}
                            >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Drop the image here...</p>
                                ) : (
                                    <p>
                                        Drag & drop an image here, or click to
                                        select
                                    </p>
                                )}
                            </div>
                            {errors.images && (
                                <p className="text-sm text-red-500">
                                    {errors.images}
                                </p>
                            )}

                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {previews.map((src, idx) => (
                                        <img
                                            key={idx}
                                            src={src}
                                            alt={`Preview ${idx}`}
                                            className="rounded max-h-40 object-cover w-full"
                                        />
                                    ))}
                                </div>
                            )}

                            {processing && (
                                <div className="mt-4">
                                    <Progress
                                        value={progress?.percentage || 0}
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Uploading... {progress?.percentage}%
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter
                            className="flex justify-end"
                            disabled={processing}
                        >
                            <Button type="submit">
                                {processing ? "Creating..." : "Create Item"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

export default ItemCreate;
