import AppPagination from "@/Components/AppPagination";
import CreateMedRep from "@/Components/Modal/Admin/CreateMedRep";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { IoQrCodeOutline } from "react-icons/io5";
import { MdMedicalInformation } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import AppTooltip from "@/Components/AppTooltip";
import QRModal from "@/Components/Modal/Admin/QRModal";

function MedicalRep() {
    const { medicalReps } = usePage().props;

    const fetchMedicalReps = () => {
        router.get(
            route("medical-rep.index"),
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

    const handleNewMedRep = () => {
        fetchMedicalReps();
    };

    useEffect(() => {
        console.log(medicalReps);
    }, [medicalReps]);

    return (
        <AuthenticatedLayout header={"Medical Representatives"}>
            <Head title="Medical Representatives" />
            <CreateMedRep onCreate={handleNewMedRep} className="mt-8">
                <MdMedicalInformation size={18} /> Add Med Rep
            </CreateMedRep>

            <Card className="mt-4 p-0">
                <CardHeader className="p-4">
                    <h1 className="font-medium text-xl">
                        Medical Representative List
                    </h1>
                </CardHeader>
                <CardContent>
                    <table className="w-full">
                        <thead className="bg-[#eef1f9]">
                            <tr className="border-b shadow-sm text-left">
                                <th className="p-3">Name</th>
                                <th className="p-3">Medical App</th>
                                <th className="p-3">Product App</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalReps?.data?.map((medicalRep) => (
                                <tr
                                    className="border-b font-normal"
                                    key={medicalRep.id}
                                >
                                    <td className="p-3">{medicalRep.name}</td>
                                    <td className="p-3">
                                        {medicalRep.sales_order_app_id ? (
                                            <span className="text-green-800">
                                                Registered
                                            </span>
                                        ) : (
                                            <span>Not Available</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {medicalRep.product_app_id ? (
                                            <span className="text-green-800">
                                                Registered
                                            </span>
                                        ) : (
                                            <span>Not Available</span>
                                        )}
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <AppTooltip title={"View"}>
                                            <FaRegEye />
                                        </AppTooltip>
                                        <FiEdit />
                                        <QRModal qrValue={medicalRep.api_key}>
                                            <IoQrCodeOutline />
                                        </QRModal>
                                        <RiDeleteBinLine />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="w-full mt-4">
                {medicalReps?.last_page > 1 && (
                    <AppPagination paginationData={medicalReps} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}

export default MedicalRep;
