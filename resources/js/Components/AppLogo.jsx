import React from "react";
import Logo from "@/images/Logo.png";
import { Link } from "@inertiajs/react";

function AppLogo() {
    return (
        <Link href={route("dashboard")}>
            <img src={Logo} className="h-[52px] w-4/5" />
        </Link>
    );
}

export default AppLogo;
