import React from "react";
import { Button } from "@/components/ui/button";
import { Globe, Bell, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import { Link } from "@inertiajs/react";

const Navbar = () => {
    return (
        <header className="fixed w-full md:w-[calc(100%-255px)] z-50">
            <div className="flex items-center justify-between p-4 border-b bg-white">
                <SidebarTrigger className="text-lg md:hidden" iconSize={26} />
                <div></div>

                <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                        {["Globe", "Bell", "Settings"].map((icon, idx) => {
                            const Icon = {
                                Globe,
                                Bell,
                                Settings,
                            }[icon];
                            return (
                                <Button key={idx} variant="ghost" size="icon">
                                    <Icon className="h-5 w-5" />
                                </Button>
                            );
                        })}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="rounded-full">
                                <img
                                    src="https://dash-tail.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Favatar-3.d19d606f.jpg&w=48&q=75"
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link method="post" href={route("logout")}>
                                    Logout
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
