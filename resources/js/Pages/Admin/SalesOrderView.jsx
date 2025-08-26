import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

function SalesOrderView() {
    return (
        <AuthenticatedLayout header={"Sales Order"}>
            <Head title="Sales Order" />

            <div className="flex flex-row gap-12 w-full mt-8">
                <div>LEFT</div>
                <div>RIGHT</div>
            </div>
        </AuthenticatedLayout>
    );
}

export default SalesOrderView;
