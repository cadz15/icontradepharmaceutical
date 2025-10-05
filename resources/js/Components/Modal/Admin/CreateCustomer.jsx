import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Building2,
    MapPin,
    User,
    Calendar,
    FileText,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const regions = [
    "Region 1",
    "Region 2",
    "Region 3",
    "Region 4A",
    "Region 4B",
    "Region 5",
    "Region 6",
    "Region 7",
    "Region 8",
    "Region 9",
    "Region 10",
    "Region 11",
    "Region 12",
    "CAR",
    "NCR",
    "ARMM",
    "CARAGA",
    "BARMM",
];

const customerClasses = [
    { value: "A", label: "CLASS A: DISPENSING/ WITH PURCHASING POWER" },
    { value: "B", label: "CLASS B: PRESCRIBING ONLY" },
    { value: "C", label: "CLASS C: NO COMMITMENT" },
];

function CreateCustomer({
    className,
    onCreate,
    children,
    updateData = null,
    showModal,
    visible,
    onClose,
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
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
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleRegionChange = (value) => {
        setData("region", value);
    };

    const handleClassChange = (value) => {
        setData("class", value);
    };

    const handleModalVisibleToggle = (visible) => {
        setIsOpen(visible);
        showModal(visible);
        if (!visible && onClose) {
            onClose();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (updateData) {
            put(route("customer.update", updateData.id), {
                data,
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    toast.success("Customer successfully updated!");
                    onCreate();
                },
                onError: (errors) => {
                    console.error("Update errors:", errors);
                    toast.error(
                        "Failed to update customer. Please check the form."
                    );
                },
            });
        } else {
            post(route("customer.store"), {
                data,
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    toast.success("Customer successfully created!");
                    onCreate();
                },
                onError: (errors) => {
                    console.error("Creation errors:", errors);
                    toast.error(
                        "Failed to create customer. Please check the form."
                    );
                },
            });
        }
    };

    const handleReset = () => {
        reset();
        if (updateData) {
            // Reset form with updateData if editing
            Object.keys(updateData).forEach((key) => {
                const value = updateData[key] || "";
                setData(key, value);
            });
        }
    };

    useEffect(() => {
        if (updateData) {
            setData({
                name: updateData.name ?? "",
                full_address: updateData.full_address ?? "",
                short_address: updateData.short_address ?? "",
                region: updateData.region ?? "",
                class: updateData.class ?? "",
                practice: updateData.practice ?? "",
                s3_license: updateData.s3_license ?? "",
                s3_validity: updateData.s3_validity ?? "",
                pharmacist_name: updateData.pharmacist_name ?? "",
                prc_id: updateData.prc_id ?? "",
                prc_validity: updateData.prc_validity ?? "",
                remarks: updateData.remarks ?? "",
            });
        }
    }, [updateData, setData]);

    useEffect(() => {
        setIsOpen(visible);
    }, [visible]);

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <Dialog open={isOpen} onOpenChange={handleModalVisibleToggle}>
            <DialogTrigger asChild>
                <Button className={className}>{children}</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                {updateData
                                    ? "Update Doctor / Hospital"
                                    : "Create Doctor / Hospital"}
                            </DialogTitle>
                            <DialogDescription>
                                {updateData
                                    ? "Update existing doctor or hospital information."
                                    : "Add a new doctor or hospital to the system."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {hasErrors && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please check the form for errors and try again.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="grid gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Basic Information
                        </h3>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Name{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Dra. Juana Dela Cruz"
                                    value={data.name}
                                    onChange={handleChange}
                                    className={
                                        errors.name ? "border-destructive" : ""
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="full_address"
                                    className="text-sm font-medium"
                                >
                                    Full Address{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="full_address"
                                    name="full_address"
                                    placeholder="JLR Bldg, Camagong St., Purok Sampaguita, Brgy. Punta, Ormoc City"
                                    value={data.full_address}
                                    onChange={handleChange}
                                    className={
                                        errors.full_address
                                            ? "border-destructive"
                                            : ""
                                    }
                                />
                                {errors.full_address && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.full_address}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="short_address"
                                        className="text-sm font-medium"
                                    >
                                        Short Address{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="short_address"
                                        name="short_address"
                                        placeholder="Ormoc City"
                                        value={data.short_address}
                                        onChange={handleChange}
                                        className={
                                            errors.short_address
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                    {errors.short_address && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.short_address}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="region"
                                        className="text-sm font-medium"
                                    >
                                        Region{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        onValueChange={handleRegionChange}
                                        value={data.region}
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.region
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {regions.map((region) => (
                                                <SelectItem
                                                    key={region}
                                                    value={region}
                                                >
                                                    {region}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.region && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.region}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="class"
                                        className="text-sm font-medium"
                                    >
                                        Class{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        onValueChange={handleClassChange}
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
                                                        key={classItem.value}
                                                        value={classItem.value}
                                                    >
                                                        {classItem.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.class && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.class}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="practice"
                                        className="text-sm font-medium"
                                    >
                                        Practice{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="practice"
                                        name="practice"
                                        placeholder="Pediatrics"
                                        value={data.practice}
                                        onChange={handleChange}
                                        className={
                                            errors.practice
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                    {errors.practice && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.practice}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* License Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            License Information
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="s3_license"
                                    className="text-sm font-medium"
                                >
                                    S3 License
                                </Label>
                                <Input
                                    id="s3_license"
                                    name="s3_license"
                                    placeholder="A"
                                    value={data.s3_license}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="s3_validity"
                                    className="text-sm font-medium"
                                >
                                    S3 Validity
                                </Label>
                                <Input
                                    id="s3_validity"
                                    name="s3_validity"
                                    type="date"
                                    value={data.s3_validity}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pharmacist Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Pharmacist Information
                        </h3>

                        <div className="space-y-2">
                            <Label
                                htmlFor="pharmacist_name"
                                className="text-sm font-medium"
                            >
                                Pharmacist Name
                            </Label>
                            <Input
                                id="pharmacist_name"
                                name="pharmacist_name"
                                placeholder="Juan Dela Cruz"
                                value={data.pharmacist_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="prc_id"
                                    className="text-sm font-medium"
                                >
                                    PRC ID
                                </Label>
                                <Input
                                    id="prc_id"
                                    name="prc_id"
                                    placeholder="1234567"
                                    value={data.prc_id}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="prc_validity"
                                    className="text-sm font-medium"
                                >
                                    PRC Validity
                                </Label>
                                <Input
                                    id="prc_validity"
                                    name="prc_validity"
                                    type="date"
                                    value={data.prc_validity}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Additional Information
                        </h3>

                        <div className="space-y-2">
                            <Label
                                htmlFor="remarks"
                                className="text-sm font-medium"
                            >
                                Remarks
                            </Label>
                            <Input
                                id="remarks"
                                name="remarks"
                                placeholder="Additional notes or remarks"
                                value={data.remarks}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-24"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    {updateData ? "Updating..." : "Creating..."}
                                </>
                            ) : updateData ? (
                                "Update Customer"
                            ) : (
                                "Create Customer"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCustomer;
