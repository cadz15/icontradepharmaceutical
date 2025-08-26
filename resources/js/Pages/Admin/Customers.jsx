import AppPagination from "@/Components/AppPagination";
import AppTooltip from "@/Components/AppTooltip";
import CreateCustomer from "@/Components/Modal/Admin/CreateCustomer";
import DeleteDialog from "@/Components/Modal/Admin/DeleteDialog";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { FaRegEye, FaUserDoctor } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

function Customers() {
    const { customers } = usePage().props;
    const [updateData, setUpdateData] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchCustomers = () => {
        router.get(
            route("customer.index"),
            {},
            {
                onSuccess: ({ props }) => {},
                onError: (error) => {
                    console.error(
                        "Error fetching medical representatives:",
                        error
                    );
                },
            }
        );
    };

    const handleSetUpdateData = (id) => {
        const data = customers?.data?.filter((customer) => customer.id === id);
        if (data) {
            setUpdateData(data[0]);
            setShowModal(true);
        } else {
            setUpdateData(null);
            setShowModal(false);
        }
    };

    const handleS3Validity = (s3Date) => {
        const s3Validity = new Date(s3Date);
        const nowDate = new Date();

        if (!s3Date) return false;

        return nowDate <= s3Validity;
    };

    const handleNewCustomer = () => {
        fetchCustomers();
    };

    useEffect(() => {
        if (showModal) {
            console.log(updateData);
        }
    }, [showModal, updateData]);

    return (
        <AuthenticatedLayout header={"Doctors / Hospitals"}>
            <Head title="Doctors / Hospitals" />
            <CreateCustomer
                onCreate={handleNewCustomer}
                className="mt-8"
                updateData={updateData}
                showModal={setShowModal}
                visible={showModal}
            >
                <FaUserDoctor size={18} /> Add New Doctor/Hospital
            </CreateCustomer>

            <Card className="mt-4 p-0">
                <CardHeader className="p-4">
                    <h1 className="font-medium text-xl">
                        Doctor / Hospital List
                    </h1>
                </CardHeader>
                <CardContent>
                    <table className="w-full">
                        <thead className="bg-[#eef1f9]">
                            <tr className="border-b shadow-sm text-left">
                                <th className="p-3">Name</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Region</th>
                                <th className="p-3">Class</th>
                                <th className="p-3">Practice</th>
                                <th className="p-3">S3 Accredited</th>
                                <th className="p-3">Pharmacist</th>
                                <th className="p-3">Remarks</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers?.data?.map((customer) => (
                                <tr
                                    className="border-b font-normal"
                                    key={customer.id}
                                >
                                    <td className="p-3">{customer.name}</td>
                                    <td className="p-3">
                                        {customer.full_address}
                                    </td>
                                    <td className="p-3">{customer.region}</td>
                                    <td className="p-3">{customer.class}</td>
                                    <td className="p-3">{customer.practice}</td>
                                    <td className="p-3">
                                        {handleS3Validity(
                                            customer.s3_validity
                                        ) ? (
                                            <span>{customer.s3_validity}</span>
                                        ) : (
                                            <span className="text-red-500">
                                                Not Available
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {customer.pharmacist_name}
                                    </td>
                                    <td className="p-3">{customer.remarks}</td>
                                    <td className="p-3 flex gap-2">
                                        <AppTooltip
                                            title={"View"}
                                            className={`bg-indigo-500`}
                                        >
                                            <FaRegEye className="text-indigo-500" />
                                        </AppTooltip>

                                        <AppTooltip
                                            title={"Edit"}
                                            className={`bg-orange-500`}
                                        >
                                            <FiEdit
                                                className="text-orange-500"
                                                onClick={() =>
                                                    handleSetUpdateData(
                                                        customer.id
                                                    )
                                                }
                                            />
                                        </AppTooltip>

                                        <AppTooltip
                                            title={"Delete"}
                                            className={`bg-red-500`}
                                        >
                                            <DeleteDialog id={customer.id}>
                                                <RiDeleteBinLine className="text-red-500" />
                                            </DeleteDialog>
                                        </AppTooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="w-full mt-4">
                {customers?.last_page > 1 && (
                    <AppPagination paginationData={customers} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default Customers;
