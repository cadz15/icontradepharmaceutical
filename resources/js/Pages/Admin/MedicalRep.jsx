import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { MdMedicalInformation } from "react-icons/md";

function MedicalRep() {
    return (
        <AuthenticatedLayout header={"Medical Representatives"}>
            <Head title="Medical Representatives" />
            <button className="flex flex-row items-center gap-2 bg-violet-600 px-5 py-3 mt-8 rounded-md text-white hover:bg-violet-500 ">
                <MdMedicalInformation size={18} /> Add Med Rep
            </button>

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
                            <tr className="border-b font-normal">
                                <td className="p-3">Sample</td>
                                <td className="p-3">Sample</td>
                                <td className="p-3">Sample</td>
                                <td className="p-3">Sample</td>
                            </tr>
                            <tr className="border-b font-normal">
                                <td className="p-3">Sample</td>
                                <td className="p-3">Sample</td>
                                <td className="p-3">Sample</td>
                                <td className="p-3">Sample</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}

export default MedicalRep;
