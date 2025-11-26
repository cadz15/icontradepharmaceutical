import { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Users,
    UserPlus,
    Edit,
    Trash2,
    Shield,
    ShieldOff,
    AlertTriangle,
    CheckCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import AppPagination from "@/components/AppPagination";
import DeleteDialog from "@/components/Modal/Admin/DeleteDialog";

export default function UsersIndex() {
    const { users, auth, flash } = usePage().props;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        is_admin: false,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (flash?.success || flash?.error) {
            // Clear form on success
            if (flash?.success && !editingUser) {
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                    is_admin: false,
                });
                setShowCreateModal(false);
                setEditingUser(null);
            }
        }
    }, [flash]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await router.post(route("users.store"), formData, {
                onSuccess: () => {
                    setErrors({});
                },
                onError: (errors) => {
                    setErrors(errors);
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await router.put(route("users.update", editingUser.id), formData, {
                onSuccess: () => {
                    setErrors({});
                    setEditingUser(null);
                },
                onError: (errors) => {
                    setErrors(errors);
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            is_admin: user.is_admin,
        });
        setErrors({});
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            is_admin: false,
        });
        setErrors({});
    };

    const canDeleteUser = (user) => {
        return user.id !== 1 && user.id !== auth.user.id;
    };

    const canEditUser = (user) => {
        return user.id !== 1; // Cannot edit super admin
    };

    const getRoleBadge = (user) => {
        if (user.id === 1) {
            return (
                <Badge
                    variant="default"
                    className="bg-purple-100 text-purple-800 border-purple-200"
                >
                    <Shield className="h-3 w-3 mr-1" />
                    Super Admin
                </Badge>
            );
        }
        return user.is_admin ? (
            <Badge
                variant="default"
                className="bg-blue-100 text-blue-800 border-blue-200"
            >
                <Shield className="h-3 w-3 mr-1" />
                Admin
            </Badge>
        ) : (
            <Badge variant="outline">
                <ShieldOff className="h-3 w-3 mr-1" />
                User
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Users" />

            <div className="container max-w-7xl mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Users className="h-8 w-8 text-primary" />
                            User Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage system users and their permissions
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="gap-2"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add New User
                    </Button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {flash?.success}
                        </AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert className="bg-red-50 border-red-200">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {flash?.error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Users</CardTitle>
                        <CardDescription>
                            {users.total} user(s) in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[120px]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {user.name}
                                                        </div>
                                                        {user.id ===
                                                            auth.user.id && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                You
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {getRoleBadge(user)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 border-green-200"
                                                >
                                                    Active
                                                </Badge>
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
                                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            user
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !canEditUser(
                                                                            user
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Edit user</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <div>
                                                                    <DeleteDialog
                                                                        address={route(
                                                                            "users.destroy",
                                                                            user.id
                                                                        )}
                                                                        toastMessage="User deleted successfully"
                                                                        disabled={
                                                                            !canDeleteUser(
                                                                                user
                                                                            )
                                                                        }
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                                                            disabled={
                                                                                !canDeleteUser(
                                                                                    user
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </DeleteDialog>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    {!canDeleteUser(
                                                                        user
                                                                    )
                                                                        ? "Cannot delete this user"
                                                                        : "Delete user"}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {users.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <Users className="h-12 w-12 opacity-50" />
                                                    <div>
                                                        <p className="font-medium">
                                                            No users found
                                                        </p>
                                                        <p className="text-sm">
                                                            Create your first
                                                            user to get started
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            setShowCreateModal(
                                                                true
                                                            )
                                                        }
                                                        className="gap-2"
                                                    >
                                                        <UserPlus className="h-4 w-4" />
                                                        Add New User
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="mt-4">
                                <AppPagination paginationData={users} />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Create User Modal */}
                <Dialog
                    open={showCreateModal}
                    onOpenChange={setShowCreateModal}
                >
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Create New User
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter full name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email Address *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.password}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm Password *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                formData.password_confirmation
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Confirm password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_admin"
                                        checked={formData.is_admin}
                                        onCheckedChange={(checked) =>
                                            handleInputChange(
                                                "is_admin",
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="is_admin"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Grant administrator privileges
                                    </Label>
                                </div>
                                {errors.is_admin && (
                                    <p className="text-sm text-red-600">
                                        {errors.is_admin}
                                    </p>
                                )}
                            </div>

                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        "Create User"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit User Modal */}
                <Dialog
                    open={!!editingUser}
                    onOpenChange={() => setEditingUser(null)}
                >
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Edit User
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_name">
                                        Full Name *
                                    </Label>
                                    <Input
                                        id="edit_name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter full name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit_email">
                                        Email Address *
                                    </Label>
                                    <Input
                                        id="edit_email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit_password">
                                        New Password (Leave blank to keep
                                        current)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="edit_password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.password}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {formData.password && (
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_password_confirmation">
                                            Confirm New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="edit_password_confirmation"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    formData.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Confirm new password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-red-600">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit_is_admin"
                                        checked={formData.is_admin}
                                        onCheckedChange={(checked) =>
                                            handleInputChange(
                                                "is_admin",
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="edit_is_admin"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Administrator privileges
                                    </Label>
                                </div>
                                {errors.is_admin && (
                                    <p className="text-sm text-red-600">
                                        {errors.is_admin}
                                    </p>
                                )}
                            </div>

                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingUser(null)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        "Update User"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
