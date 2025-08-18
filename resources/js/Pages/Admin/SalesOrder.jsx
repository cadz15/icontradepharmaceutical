import AppTooltip from "@/Components/AppTooltip";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import React from "react";
import { FaRegEye } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

const items = {
    data: [
        {
            id: 1,
            sales_order_number: "G-0001",
            customer: { name: "Juan Dela Cruz", short_address: "Ormoc City" },
            medical_representative: { name: "Med Rep 1" },
            total: 10000,
            date_sold: "July 30, 2025",
            status: "pending",
        },
        {
            id: 2,
            sales_order_number: "G-0001",
            customer: { name: "Juan Dela Cruz", short_address: "Ormoc City" },
            medical_representative: { name: "Med Rep 1" },
            total: 10000,
            date_sold: "July 30, 2025",
            status: "pending",
        },
    ],
};

function SalesOrder() {
    const sales = usePage().props;

    return (
        <AuthenticatedLayout header={"Sales Order"}>
            <Head title="Sales Orders" />

            <Card className="mt-4 p-0">
                <CardHeader className="p-4">
                    <h1 className="font-medium text-xl">Sales Order</h1>
                </CardHeader>
                <CardContent>
                    <table className="w-full">
                        <thead className="bg-[#eef1f9]">
                            <tr className="border-b shadow-sm text-left">
                                <th className="p-3">Sales ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Med Rep</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales?.data?.map((saleOrder) => (
                                <tr
                                    className="border-b font-normal"
                                    key={saleOrder.id}
                                >
                                    <td className="p-3">
                                        {saleOrder.sales_order_number}
                                    </td>
                                    <td className="p-3">
                                        {saleOrder.customer?.name}
                                    </td>
                                    <td className="p-3">
                                        {saleOrder.customer?.short_address}
                                    </td>
                                    <td className="p-3">{saleOrder.total}</td>
                                    <td className="p-3">
                                        {saleOrder.medical_representative?.name}
                                    </td>
                                    <td className="p-3">{saleOrder.status}</td>
                                    <td className="p-3">
                                        {saleOrder.date_sold}
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <AppTooltip title={"View"}>
                                            <FaRegEye />
                                        </AppTooltip>
                                        <FiEdit />
                                        <RiDeleteBinLine />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="w-full mt-4">
                {items?.last_page > 1 && (
                    <AppPagination paginationData={items} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default SalesOrder;
