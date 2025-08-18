import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import AppLogo from "./AppLogo";
import { Link, usePage } from "@inertiajs/react";
import { ChevronRight, Home, Settings2 } from "lucide-react";

import { MdOutlineLocalPharmacy } from "react-icons/md";
import {
    FaUserDoctor,
    FaHandHoldingMedical,
    FaMoneyCheckDollar,
} from "react-icons/fa6";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";

const items = [
    {
        title: "Dashboard",
        route: "dashboard",
        icon: Home,
        isSingle: true,
    },
    {
        title: "Doctors/Hospitals",
        route: "customer.index",
        icon: FaUserDoctor,
        isSingle: true,
    },
    {
        title: "Medical Representative",
        route: "medical-rep.index",
        icon: FaHandHoldingMedical,
        isSingle: true,
    },
    {
        title: "Sales Order",
        route: "sales.order.index",
        icon: FaMoneyCheckDollar,
        isSingle: true,
    },
    {
        title: "Inventory",
        route: "item",
        icon: MdOutlineLocalPharmacy,
        isSingle: false,
        items: [
            {
                title: "List",
                url: route("item.index"),
                route: "item.index",
            },
            {
                title: "Report",
                url: "#",
                route: "dashboard",
            },
        ],
    },
    {
        title: "Settings",
        route: "dashboard",
        icon: Settings2,
        isSingle: false,
        items: [
            {
                title: "General",
                url: "#",
                route: "dashboard",
            },
            {
                title: "Team",
                url: "#",
                route: "dashboard",
            },
            {
                title: "Billing",
                url: "#",
                route: "dashboard",
            },
            {
                title: "Limits",
                url: "#",
                route: "dashboard",
            },
        ],
    },
];

function AppSidebar() {
    const { url } = usePage();

    const isActive = (routeName) => {
        return route().current() === routeName;
    };

    const isActiveThruChild = (routeName) => {
        return route().current().includes(routeName);
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b ">
                <AppLogo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <span className="font-semibold text-black ">MENU</span>
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {items.map((item) => {
                            return item.isSingle ? (
                                <SidebarMenuButton
                                    size="lg"
                                    isActive={isActive(item.route)}
                                    asChild
                                    key={item.title}
                                >
                                    <Link href={route(item.route)}>
                                        <item.icon className="text-lg" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            ) : (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                size="lg"
                                                tooltip={item.title}
                                                isActive={isActiveThruChild(
                                                    item.route
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="text-lg" />
                                                )}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    subItem.route
                                                                )}
                                                            >
                                                                <span>
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}

export default AppSidebar;
