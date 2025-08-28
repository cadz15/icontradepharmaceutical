import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formattedCurrency } from "@/util/currencyFormat";
import { formatDate } from "@/util/formattedDate";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function SalesOrderView() {
    const { salesOrder } = usePage().props;

    const { data, setData, put, processing } = useForm({
        status: "pending",
    });

    const handleSubmit = () => {
        put(route("sales.order.update", salesOrder.id), {
            onSuccess: () => {
                toast.success("Sales order updated!");
            },
        });
    };

    useEffect(() => {
        console.log(salesOrder);

        setData("status", salesOrder.status);
    }, [salesOrder]);
    return (
        <AuthenticatedLayout header={"Sales Order"}>
            <Head title="Sales Order" />

            <div className="flex flex-col md:flex-row gap-6 w-full mt-8 ">
                <div className="w-full md:w-1/3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Order Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-6 flex flex-col gap-2">
                                <div className="w-full">
                                    <h5 className="font-normal">Customer:</h5>
                                    <span> {salesOrder?.customer?.name}</span>
                                </div>
                                <div className="w-full">
                                    <h5 className="font-normal">Address:</h5>
                                    <span>
                                        {" "}
                                        {salesOrder?.customer?.short_address}
                                    </span>
                                </div>
                                <div className="w-full">
                                    <h5 className="font-normal">
                                        Medical Rep:
                                    </h5>
                                    <span>
                                        {" "}
                                        {
                                            salesOrder?.medical_representative
                                                ?.name
                                        }
                                    </span>
                                </div>
                                <div className="w-full">
                                    <h5 className="font-normal">Date Sold:</h5>
                                    <span>
                                        {" "}
                                        {formatDate(salesOrder?.date_sold)}
                                    </span>
                                </div>
                                <div className="w-full">
                                    <h5 className="font-normal">Total:</h5>
                                    <span>
                                        {" "}
                                        {formattedCurrency(salesOrder?.total)}
                                    </span>
                                </div>
                                <div className="w-full">
                                    <span className="font-normal">Status:</span>
                                    <Select
                                        value={data.status}
                                        onValueChange={(text) => {
                                            setData("status", text);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"pending"}>
                                                Pending
                                            </SelectItem>
                                            <SelectItem value={"packed"}>
                                                Packed
                                            </SelectItem>
                                            <SelectItem value={"delivered"}>
                                                Delivered
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    className="mt-8"
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                >
                                    {processing ? "Updating..." : "Update"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full md:w-2/3 ">
                    <Card className="flex-1 p-0">
                        <CardHeader className="p-4">
                            <h1 className="font-medium text-xl">Items</h1>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full">
                                <thead className="bg-[#eef1f9]">
                                    <tr className="border-b shadow-sm text-left">
                                        <th className="p-3">Brand Name</th>
                                        <th className="p-3">Generic Name</th>
                                        <th className="p-3">Quantity</th>
                                        <th className="p-3">Catalog Price</th>
                                        <th className="p-3">Promo</th>
                                        <th className="p-3">Total</th>
                                        <th className="p-3">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesOrder?.sale_items?.map((item) => (
                                        <tr
                                            className="border-b font-normal"
                                            key={item.id}
                                        >
                                            <td className="p-3">
                                                {item.item?.brand_name}
                                            </td>
                                            <td className="p-3">
                                                {item.item?.generic_name}
                                            </td>
                                            <td className="p-3">
                                                {item.quantity}
                                            </td>
                                            <td className="text-right p-3">
                                                {formattedCurrency(
                                                    item.item?.catalog_price
                                                )}
                                            </td>
                                            <td className="p-3">
                                                {item.promo === "regular"
                                                    ? "Regular"
                                                    : item.promo === "discount"
                                                    ? `Discount: ${item.discount}`
                                                    : `Free Item Quantity: ${item.free_item_quantity} - ${item.free_item_remarks}`}
                                            </td>
                                            <td className="text-right p-3">
                                                {formattedCurrency(item.total)}
                                            </td>
                                            <td>{item.remarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default SalesOrderView;
