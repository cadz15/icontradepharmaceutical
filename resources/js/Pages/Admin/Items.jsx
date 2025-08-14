import AppPagination from "@/Components/AppPagination";
import AppTooltip from "@/Components/AppTooltip";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import { FaRegEye, FaUserDoctor } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

function Items() {
    const { items } = usePage().props;

    useEffect(() => {
        console.log(items);
    }, []);
    return (
        <AuthenticatedLayout header={"Items Inventory"}>
            <Head title="Items Inventory" />
            <Link href={route("item.create")}>
                <Button className="mt-6">
                    <FaUserDoctor size={18} /> Add New Item
                </Button>
            </Link>

            <Card className="mt-4 p-0">
                <CardHeader className="p-4">
                    <h1 className="font-medium text-xl">Items Inventory</h1>
                </CardHeader>
                <CardContent>
                    <table className="w-full">
                        <thead className="bg-[#eef1f9]">
                            <tr className="border-b shadow-sm text-left">
                                <th className="p-3">Brand Name</th>
                                <th className="p-3">Generic Name</th>
                                <th className="p-3">Milligrams</th>
                                <th className="p-3">Supply</th>
                                <th className="p-3">Catalog Price</th>
                                <th className="p-3">Product Type</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.data?.map((item) => (
                                <tr
                                    className="border-b font-normal"
                                    key={item.id}
                                >
                                    <td className="p-3">{item.brand_name}</td>
                                    <td className="p-3">{item.generic_name}</td>
                                    <td className="p-3">{item.milligrams}</td>
                                    <td className="p-3">{item.supply}</td>
                                    <td className="p-3">
                                        {item.catalog_price}
                                    </td>
                                    <td className="p-3">{item.product_type}</td>
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

export default Items;
