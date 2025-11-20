import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    FileText,
    Trash2,
    Edit,
    AlertTriangle,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EventDetails({ event, showModal, onClose, onEdit }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!event) return null;

    const getEventTypeColor = (eventType) => {
        const colors = {
            meeting: "bg-blue-100 text-blue-800",
            call: "bg-green-100 text-green-800",
            visit: "bg-purple-100 text-purple-800",
            task: "bg-orange-100 text-orange-800",
            other: "bg-gray-100 text-gray-800",
        };
        return colors[eventType] || colors.other;
    };

    const getStatusColor = (status) => {
        const colors = {
            scheduled: "bg-blue-500",
            completed: "bg-green-500",
            cancelled: "bg-red-500",
        };
        return colors[status] || colors.scheduled;
    };

    const formatDateRange = (startDate, endDate) => {
        if (!endDate || startDate === endDate) {
            return new Date(startDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (
            start.getMonth() === end.getMonth() &&
            start.getFullYear() === end.getFullYear()
        ) {
            return `${start.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
            })} - ${end.toLocaleDateString("en-US", {
                day: "numeric",
                year: "numeric",
            })}`;
        } else if (start.getFullYear() === end.getFullYear()) {
            return `${start.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
            })} - ${end.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })}`;
        } else {
            return `${start.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })} - ${end.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })}`;
        }
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route("events.destroy", event.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                onClose();
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <>
            <Dialog open={showModal} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Event Details</span>
                            <div className="flex items-center gap-2">
                                <Badge
                                    className={getEventTypeColor(
                                        event.event_type
                                    )}
                                >
                                    {event.event_type.charAt(0).toUpperCase() +
                                        event.event_type.slice(1)}
                                </Badge>
                                <div
                                    className={`h-3 w-3 rounded-full ${getStatusColor(
                                        event.status
                                    )}`}
                                />
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Event Title */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {event.title}
                            </h2>
                            {event.is_multi_day && (
                                <Badge
                                    variant="outline"
                                    className="mt-2 bg-yellow-50 text-yellow-700 border-yellow-200"
                                >
                                    Multi-day Event
                                </Badge>
                            )}
                        </div>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date & Time */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Date
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {formatDateRange(
                                                event.event_date,
                                                event.end_date
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {(event.start_time || event.end_time) && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Time
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {event.start_time &&
                                                event.end_time
                                                    ? `${event.start_time} - ${event.end_time}`
                                                    : event.start_time
                                                    ? `Starts at ${event.start_time}`
                                                    : event.end_time
                                                    ? `Ends at ${event.end_time}`
                                                    : "All day"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                {event.location && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Location
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Customer */}
                                {event.customer && (
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Customer
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {event.customer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status & Type */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Status
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={`capitalize ${
                                            event.status === "completed"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : event.status === "cancelled"
                                                ? "bg-red-50 text-red-700 border-red-200"
                                                : "bg-blue-50 text-blue-700 border-blue-200"
                                        }`}
                                    >
                                        {event.status}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Event Type
                                    </p>
                                    <Badge
                                        className={getEventTypeColor(
                                            event.event_type
                                        )}
                                    >
                                        {event.event_type
                                            .charAt(0)
                                            .toUpperCase() +
                                            event.event_type.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {event.description && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <p className="text-sm font-medium text-gray-900">
                                        Description
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </div>
                        )}

                        {/* Notes */}
                        {event.notes && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <p className="text-sm font-medium text-gray-900">
                                        Additional Notes
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                    {event.notes}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(true)}
                                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Event
                            </Button>
                            {/* <Button
                                onClick={() => onEdit(event)}
                                className="gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Event
                            </Button> */}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Delete Event
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the event "
                            {event.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                "Delete Event"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
