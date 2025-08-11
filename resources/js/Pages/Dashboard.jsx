import ReportSnapshot from "@/Components/Analytics/Admin/ReportSnapshot";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AuthenticatedLayout header={"Admin Dashboard"}>
            <Head title="Dashboard" />

            <div className="flex flex-row mt-10 gap-6">
                <ReportSnapshot className="w-2/3" />
                <ReportSnapshot className="w-1/3" />
            </div>
        </AuthenticatedLayout>
    );
}
