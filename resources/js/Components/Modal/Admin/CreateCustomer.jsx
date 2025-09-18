import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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

function CreateCustomer({
    className,
    onCreate,
    children,
    updateData = null,
    showModal,
    visible,
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

    const handleRegionChange = (text) => {
        setData("region", text);
    };

    const handleClassChange = (text) => {
        setData("class", text);
    };

    const handleModalVisibleToggle = (visible) => {
        setIsOpen(visible);
        showModal(visible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (updateData) {
            put(route("customer.update", updateData.id), {
                data: data,
                onSuccess: () => {
                    console.log("Customer updated Successfully");
                    reset();
                    setIsOpen(false); // Close the modal after success
                    toast.success("Customer successfully updated!");

                    // Call the onCreate callback to notify the parent to refresh the list
                    if (onCreate) {
                        onCreate();
                    }
                },
                onError: (errors) => {
                    console.log("Errors:", errors);
                },
            });
        } else {
            post(route("customer.store"), {
                data: data,
                onSuccess: () => {
                    console.log("Customer Created Successfully");
                    reset();
                    setIsOpen(false); // Close the modal after success
                    toast.success("Customer successfully created!");

                    // Call the onCreate callback to notify the parent to refresh the list
                    if (onCreate) {
                        onCreate();
                    }
                },
                onError: (errors) => {
                    console.log("Errors:", errors);
                },
            });
        }
    };

    useEffect(() => {
        if (updateData) {
            setData("name", updateData.name ?? "");
            setData("full_address", updateData.full_address ?? "");
            setData("short_address", updateData.short_address ?? "");
            setData("region", updateData.region ?? "");
            setData("class", updateData.class ?? "");
            setData("practice", updateData.practice ?? "");
            setData("s3_license", updateData.s3_license ?? "");
            setData("s3_validity", updateData.s3_validity ?? "");
            setData("pharmacist_name", updateData.pharmacist_name ?? "");
            setData("prc_id", updateData.prc_id ?? "");
            setData("prc_validity", updateData.prc_validity ?? "");
            setData("remarks", updateData.remarks ?? "");
        }
        console.log(updateData);

        handleModalVisibleToggle(visible);
    }, [visible]);

    return (
        <Dialog open={isOpen} onOpenChange={handleModalVisibleToggle}>
            <DialogTrigger asChild>
                <Button
                    className={className}
                    onClick={() => handleModalVisibleToggle(true)}
                >
                    {children}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto">
                <DialogHeader>
                    {updateData ? (
                        <>
                            <DialogTitle>Update Doctor / Hospital</DialogTitle>
                            <DialogDescription>
                                Update doctor or hospital to the system.
                            </DialogDescription>
                        </>
                    ) : (
                        <>
                            <DialogTitle>Create Doctor / Hospital</DialogTitle>
                            <DialogDescription>
                                Add a new doctor or hospital to the system.
                            </DialogDescription>
                        </>
                    )}
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Dra. Juana Dela Cruz"
                            value={data.name}
                            onChange={handleChange}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="full_address">
                            Full Address<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="full_address"
                            name="full_address"
                            placeholder="JLR Bldg, Camagong St., Purok Sampaguita, Brgy. Punta, Ormoc City"
                            value={data.full_address}
                            onChange={handleChange}
                        />
                        {errors.full_address && (
                            <p className="text-sm text-red-500">
                                {errors.full_address}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full md:w-1/2">
                            <Label htmlFor="short_address">
                                Short Address
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="short_address"
                                name="short_address"
                                placeholder="Ormoc City"
                                value={data.short_address}
                                onChange={handleChange}
                            />
                            {errors.short_address && (
                                <p className="text-sm text-red-500">
                                    {errors.short_address}
                                </p>
                            )}
                        </div>
                        <div className="w-full md:w-1/2">
                            <Label htmlFor="region">
                                Region<span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={handleRegionChange}
                                value={data.region}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Region" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map((region) => (
                                        <SelectItem key={region} value={region}>
                                            {region}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {errors.region && (
                                <p className="text-sm text-red-500">
                                    {errors.region}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full md:w-1/3">
                            <Label htmlFor="class">
                                Class<span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={handleClassChange}
                                value={data.class}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"A"}>
                                        CLASS A: DESPENCING/ WITH PURCHASING
                                        POWER
                                    </SelectItem>
                                    <SelectItem value={"B"}>
                                        CLASS B: PRESCRIBING ONLY
                                    </SelectItem>
                                    <SelectItem value={"C"}>
                                        CLASS C: NO COMMITMENT
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.class && (
                                <p className="text-sm text-red-500">
                                    {errors.class}
                                </p>
                            )}
                        </div>
                        <div className="w-full md:w-2/3">
                            <Label htmlFor="practice">
                                Practice<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="practice"
                                name="practice"
                                placeholder="Pediatric"
                                value={data.practice}
                                onChange={handleChange}
                            />
                            {errors.practice && (
                                <p className="text-sm text-red-500">
                                    {errors.practice}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full md:w-1/3">
                            <Label htmlFor="s3_license">S3 License</Label>
                            <Input
                                id="s3_license"
                                name="s3_license"
                                placeholder="A"
                                value={data.s3_license}
                                onChange={handleChange}
                            />
                            {errors.s3_license && (
                                <p className="text-sm text-red-500">
                                    {errors.s3_license}
                                </p>
                            )}
                        </div>
                        <div className="w-full md:w-2/3">
                            <Label htmlFor="s3_validity">S3 Validity</Label>
                            <Input
                                id="s3_validity"
                                name="s3_validity"
                                placeholder="Pediatric"
                                value={data.s3_validity}
                                onChange={handleChange}
                            />
                            {errors.s3_validity && (
                                <p className="text-sm text-red-500">
                                    {errors.s3_validity}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="pharmacist_name">Pharmacist</Label>
                        <Input
                            id="pharmacist_name"
                            name="pharmacist_name"
                            placeholder="Juan Dela Cruz"
                            value={data.pharmacist_name}
                            onChange={handleChange}
                        />
                        {errors.pharmacist_name && (
                            <p className="text-sm text-red-500">
                                {errors.pharmacist_name}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <div className="w-full md:w-1/3">
                            <Label htmlFor="prc_id">PRC ID</Label>
                            <Input
                                id="prc_id"
                                name="prc_id"
                                placeholder="1234567"
                                value={data.prc_id}
                                onChange={handleChange}
                            />
                            {errors.prc_id && (
                                <p className="text-sm text-red-500">
                                    {errors.prc_id}
                                </p>
                            )}
                        </div>
                        <div className="w-full md:w-2/3">
                            <Label htmlFor="prc_validity">PRC Validity</Label>
                            <Input
                                id="prc_validity"
                                name="prc_validity"
                                placeholder="June 30, 2030"
                                value={data.prc_validity}
                                onChange={handleChange}
                            />
                            {errors.prc_validity && (
                                <p className="text-sm text-red-500">
                                    {errors.prc_validity}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="remarks">Remarks</Label>
                        <Input
                            id="remarks"
                            name="remarks"
                            placeholder="Remarks"
                            value={data.remarks}
                            onChange={handleChange}
                        />
                        {errors.remarks && (
                            <p className="text-sm text-red-500">
                                {errors.remarks}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        {updateData ? (
                            <Button
                                type="submit"
                                disabled={processing}
                                variant="secondary"
                            >
                                {processing ? "Updating..." : "Update"}
                            </Button>
                        ) : (
                            <Button type="submit" disabled={processing}>
                                {processing ? "Creating..." : "Create"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCustomer;
