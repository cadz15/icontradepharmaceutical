import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Eye,
    EyeOff,
    Lock,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from "lucide-react";

export default function ChangePassword() {
    const { auth, flash } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});

    // Password strength requirements
    const passwordRequirements = [
        {
            id: 1,
            text: "At least 8 characters",
            met: formData.password.length >= 8,
        },
        {
            id: 2,
            text: "Different from current password",
            met:
                formData.password &&
                formData.password !== formData.current_password,
        },
        {
            id: 3,
            text: "Contains uppercase letter",
            met: /[A-Z]/.test(formData.password),
        },
        {
            id: 4,
            text: "Contains lowercase letter",
            met: /[a-z]/.test(formData.password),
        },
        {
            id: 5,
            text: "Contains number",
            met: /[0-9]/.test(formData.password),
        },
        {
            id: 6,
            text: "Contains special character",
            met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
        },
    ];

    const allRequirementsMet = passwordRequirements.every((req) => req.met);
    const passwordsMatch = formData.password === formData.password_confirmation;

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await router.put(route("profile.password.update"), formData, {
                onSuccess: () => {
                    setFormData({
                        current_password: "",
                        password: "",
                        password_confirmation: "",
                    });
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

    const togglePasswordVisibility = (field) => {
        switch (field) {
            case "current":
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case "new":
                setShowNewPassword(!showNewPassword);
                break;
            case "confirm":
                setShowConfirmPassword(!showConfirmPassword);
                break;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Change Password" />

            <div className="container max-w-2xl mx-auto py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Change Password
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Update your password to keep your account secure
                    </p>
                </div>

                {/* Success/Error Messages */}
                {flash?.success && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert className="mb-6 bg-red-50 border-red-200">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {flash.error}
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                            <Lock className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle>Update Your Password</CardTitle>
                        <CardDescription>
                            Enter your current password and set a new one
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="current_password"
                                    className="text-sm font-medium"
                                >
                                    Current Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="current_password"
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.current_password}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your current password"
                                        className={`pr-10 ${
                                            errors.current_password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            togglePasswordVisibility("current")
                                        }
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                {errors.current_password && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.current_password}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showNewPassword
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
                                        placeholder="Enter your new password"
                                        className={`pr-10 ${
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            togglePasswordVisibility("new")
                                        }
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            {formData.password && (
                                <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                                    <p className="text-sm font-medium text-gray-900">
                                        Password Requirements
                                    </p>
                                    <div className="space-y-1">
                                        {passwordRequirements.map(
                                            (requirement) => (
                                                <div
                                                    key={requirement.id}
                                                    className="flex items-center gap-2 text-xs"
                                                >
                                                    {requirement.met ? (
                                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-3 w-3 text-gray-400" />
                                                    )}
                                                    <span
                                                        className={
                                                            requirement.met
                                                                ? "text-green-700"
                                                                : "text-gray-500"
                                                        }
                                                    >
                                                        {requirement.text}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium"
                                >
                                    Confirm New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.password_confirmation}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Confirm your new password"
                                        className={`pr-10 ${
                                            errors.password_confirmation
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            togglePasswordVisibility("confirm")
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                {formData.password_confirmation && (
                                    <p
                                        className={`text-sm flex items-center gap-1 ${
                                            passwordsMatch
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {passwordsMatch ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                        {passwordsMatch
                                            ? "Passwords match"
                                            : "Passwords do not match"}
                                    </p>
                                )}
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() =>
                                        router.visit(route("dashboard"))
                                    }
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={
                                        isSubmitting ||
                                        !allRequirementsMet ||
                                        !passwordsMatch ||
                                        !formData.current_password
                                    }
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Password"
                                    )}
                                </Button>
                            </div>
                        </form>

                        {/* Security Tips */}
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                Security Tips
                            </h4>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>
                                    • Use a unique password that you don't use
                                    elsewhere
                                </li>
                                <li>• Consider using a password manager</li>
                                <li>
                                    • Avoid using personal information in your
                                    password
                                </li>
                                <li>• Change your password regularly</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
