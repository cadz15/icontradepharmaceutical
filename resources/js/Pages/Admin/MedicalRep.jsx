import { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit, Trash2, QrCode, UserPlus, Stethoscope } from "lucide-react";
import AppPagination from "@/components/AppPagination";
import CreateMedRep from "@/components/Modal/Admin/CreateMedRep";
import QRModal from "@/components/Modal/Admin/QRModal";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";

export default function MedicalRep() {
    const { medicalReps } = usePage().props;
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMedicalReps = async () => {
        setIsRefreshing(true);
        try {
            await router.get(
                route("medical-rep.index"),
                {},
                {
                    onSuccess: () => {
                        setIsRefreshing(false);
                    },
                    onError: (error) => {
                        console.error(
                            "Error fetching medical representatives:",
                            error
                        );
                        setIsRefreshing(false);
                    },
                }
            );
        } catch (error) {
            console.error("Error fetching medical representatives:", error);
            setIsRefreshing(false);
        }
    };

    const handleNewMedRep = () => {
        fetchMedicalReps();
    };

    const getStatusBadge = (value) => {
        return value ? (
            <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600"
            >
                Registered
            </Badge>
        ) : (
            <Badge variant="outline" className="text-muted-foreground">
                Not Available
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Medical Representatives" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Medical Representatives
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your medical representatives and their app
                            registrations
                        </p>
                    </div>

                    <CreateMedRep onCreate={handleNewMedRep}>
                        <Button className="gap-2" disabled={isRefreshing}>
                            <UserPlus className="h-4 w-4" />
                            Add Med Rep
                            {isRefreshing && (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            )}
                        </Button>
                    </CreateMedRep>
                </div>

                {/* Medical Representatives Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" />
                            Medical Representative List
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">
                                            Name
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Medical App
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Product App
                                        </TableHead>
                                        <TableHead className="font-semibold w-[140px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medicalReps?.data?.map((medicalRep) => (
                                        <TableRow
                                            key={medicalRep.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                {medicalRep.name}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(
                                                    medicalRep.sales_order_app_id
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(
                                                    medicalRep.product_app_id
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "medical-representatives.show",
                                                                            medicalRep.id
                                                                        )}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    View details
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <QRModal
                                                                    qrValue={
                                                                        medicalRep.api_key
                                                                    }
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-muted-foreground hover:text-purple-600"
                                                                    >
                                                                        <QrCode className="h-4 w-4" />
                                                                    </Button>
                                                                </QRModal>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Show QR Code
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Delete
                                                                    representative
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {medicalReps?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Stethoscope className="h-8 w-8" />
                                                    <p>
                                                        No medical
                                                        representatives found
                                                    </p>
                                                    <p className="text-sm">
                                                        Add your first medical
                                                        representative to get
                                                        started
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {medicalReps?.last_page > 1 && (
                    <div className="flex justify-center">
                        <AppPagination paginationData={medicalReps} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
