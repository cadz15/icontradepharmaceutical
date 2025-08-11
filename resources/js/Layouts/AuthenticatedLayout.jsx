import AppSidebar from "@/Components/AppSidebar";
import Navbar from "@/Components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-[#eef1f9] ">
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <Navbar />
                    <div className="py-10 px-6 font-semibold">
                        <h1 className="text-2xl">{header}</h1>
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </div>
    );
}
