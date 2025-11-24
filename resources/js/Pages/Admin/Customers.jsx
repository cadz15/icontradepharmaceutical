import { useEffect, useState } from "react";
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
import {
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Building2,
    MapPin,
    Calendar,
    User,
    MessageSquare,
} from "lucide-react";
import AppPagination from "@/components/AppPagination";
import CreateCustomer from "@/components/Modal/Admin/CreateCustomer";
import DeleteDialog from "@/components/Modal/Admin/DeleteDialog";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Customers() {
    const {
        customers,
        analytics,
        filters: initialFilters = {},
    } = usePage().props;
    const [updateData, setUpdateData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [firstStart, setFirstStart] = useState(true);

    const [filters, setFilters] = useState({
        search: initialFilters.search,
        address: initialFilters.address,
        practice: initialFilters.practice,
        s3: initialFilters.s3,
        hasPharmacist: initialFilters.hasPharmacist,
    });

    const fetchCustomers = async (params = {}) => {
        setIsRefreshing(true);
        try {
            await router.get(route("customer.index"), params, {
                onSuccess: () => {
                    setIsRefreshing(false);
                },
                onError: (error) => {
                    console.error("Error fetching customers:", error);
                    setIsRefreshing(false);
                },
            });
        } catch (error) {
            console.error("Error fetching customers:", error);
            setIsRefreshing(false);
        }
    };

    const handleSetUpdateData = (id) => {
        const data = customers?.data?.find((customer) => customer.id === id);
        if (data) {
            setUpdateData(data);
            setShowModal(true);
        } else {
            setUpdateData(null);
            setShowModal(false);
        }
    };

    const handleS3Validity = (s3Date) => {
        if (!s3Date) return false;

        try {
            const s3Validity = new Date(s3Date);
            const nowDate = new Date();
            return nowDate <= s3Validity;
        } catch (error) {
            console.error("Error parsing date:", error);
            return false;
        }
    };

    const formatS3Date = (s3Date) => {
        if (!s3Date) return "Not Available";

        try {
            return new Date(s3Date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    const handleNewCustomer = () => {
        fetchCustomers();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUpdateData(null);
    };

    const getStatusBadge = (customer) => {
        const isValid = handleS3Validity(customer.s3_validity);
        return isValid ? (
            <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600"
            >
                <Calendar className="h-3 w-3 mr-1" />
                Valid until {formatS3Date(customer.s3_validity)}
            </Badge>
        ) : (
            <Badge variant="outline" className="text-red-500 border-red-200">
                {customer.s3_validity
                    ? `Expired: ${formatS3Date(customer.s3_validity)}`
                    : "Not Accredited "}
            </Badge>
        );
    };

    // 🔍 Trigger search/filter on change
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!firstStart) {
                fetchCustomers(filters);
            } else {
                setFirstStart(false);
            }
        }, 800);
        return () => clearTimeout(timeout);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Doctors / Hospitals" />

            <div className="space-y-6">
                {/* Header with Add Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Building2 className="h-8 w-8 text-primary" />
                            Doctors / Hospitals
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your medical professionals and healthcare
                            facilities
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={fetchCustomers}
                            disabled={isRefreshing}
                            className="gap-2"
                        >
                            {isRefreshing ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                <div className="h-4 w-4" />
                            )}
                            Refresh
                        </Button>

                        <CreateCustomer
                            onCreate={handleNewCustomer}
                            updateData={updateData}
                            showModal={setShowModal}
                            visible={showModal}
                            onClose={handleCloseModal}
                        >
                            <Button className="gap-2">
                                <UserPlus className="h-4 w-4" />
                                Add New Doctor/Hospital
                            </Button>
                        </CreateCustomer>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total
                                </p>
                                <p className="text-2xl font-bold">
                                    {customers?.total || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    S3 Accredited
                                </p>
                                <p className="text-2xl font-bold">
                                    {analytics?.total_s3_license || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    With Pharmacist
                                </p>
                                <p className="text-2xl font-bold">
                                    {analytics?.total_pharmacists || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <MapPin className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Regions
                                </p>
                                <p className="text-2xl font-bold">
                                    {analytics?.unique_regions_count || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 🔍 Filters Section */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                            Search & Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {/* Search */}
                        <div>
                            <Input
                                placeholder="Search by name..."
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <Input
                                placeholder="Filter by address..."
                                value={filters.address}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "address",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* Practice */}
                        <div>
                            <Input
                                placeholder="Filter by practice..."
                                value={filters.practice}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "practice",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* S3 Accredited */}
                        <Select
                            value={filters.s3}
                            onValueChange={(v) => handleFilterChange("s3", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="S3 Accredited" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All S3</SelectItem>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Has Pharmacist */}
                        <Select
                            value={filters.hasPharmacist}
                            onValueChange={(v) =>
                                handleFilterChange("hasPharmacist", v)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Has Pharmacist" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Pharmacist
                                </SelectItem>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Customers Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Doctor / Hospital List
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                Showing {customers?.from} to {customers?.to} of{" "}
                                {customers?.total} entries
                            </div>
                        </div>
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
                                            Address
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Region
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Class
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Practice
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            S3 Accredited
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Pharmacist
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Remarks
                                        </TableHead>
                                        <TableHead className="font-semibold w-[130px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers?.data?.map((customer) => (
                                        <TableRow
                                            key={customer.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                    {customer.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 max-w-[200px]">
                                                    <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                    <span
                                                        className="truncate"
                                                        title={
                                                            customer.full_address
                                                        }
                                                    >
                                                        {customer.full_address}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="font-normal"
                                                >
                                                    {customer.region}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="font-normal"
                                                >
                                                    {customer.class}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {customer.practice}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(customer)}
                                            </TableCell>
                                            <TableCell>
                                                {customer.pharmacist_name ? (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3 w-3 text-muted-foreground" />
                                                        {
                                                            customer.pharmacist_name
                                                        }
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {customer.remarks ? (
                                                    <div className="flex items-center gap-2 max-w-[150px]">
                                                        <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                        <span
                                                            className="truncate"
                                                            title={
                                                                customer.remarks
                                                            }
                                                        >
                                                            {customer.remarks}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "customer.show",
                                                                            customer.id
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
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-orange-600 hover:bg-orange-50"
                                                                    onClick={() =>
                                                                        handleSetUpdateData(
                                                                            customer.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Edit
                                                                    customer
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <DeleteDialog
                                                                    address={route(
                                                                        "customer.delete",
                                                                        customer.id
                                                                    )}
                                                                    toastMessage="Customer deleted successfully"
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </DeleteDialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Delete
                                                                    customer
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {customers?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={9}
                                                className="text-center py-12 text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <Building2 className="h-12 w-12" />
                                                    <div>
                                                        <p className="font-medium">
                                                            No customers found
                                                        </p>
                                                        <p className="text-sm">
                                                            Add your first
                                                            doctor or hospital
                                                            to get started
                                                        </p>
                                                    </div>
                                                    <CreateCustomer
                                                        onCreate={
                                                            handleNewCustomer
                                                        }
                                                        updateData={updateData}
                                                        showModal={setShowModal}
                                                        visible={showModal}
                                                        onClose={
                                                            handleCloseModal
                                                        }
                                                    >
                                                        <Button className="gap-2 mt-2">
                                                            <UserPlus className="h-4 w-4" />
                                                            Add New Customer
                                                        </Button>
                                                    </CreateCustomer>
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
                {customers?.last_page > 1 && (
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            Page {customers.current_page} of{" "}
                            {customers.last_page}
                        </div>
                        <AppPagination paginationData={customers} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
