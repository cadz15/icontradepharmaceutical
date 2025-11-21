import { useState, useEffect } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function CreateEvent({
    showModal,
    onClose,
    selectedDate = null,
}) {
    const { medicalRepresentatives, customers } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedReps, setSelectedReps] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        event_date: selectedDate || new Date().toISOString().split("T")[0],
        end_date: "",
        start_time: "",
        end_time: "",
        event_type: "meeting",
        medical_representative_ids: [],
        customer_id: "",
        location: "",
        notes: "",
        is_recurring: false,
        recurring_pattern: "",
    });

    useEffect(() => {
        if (selectedDate) {
            setData("event_date", selectedDate);
        }
    }, [selectedDate]);

    useEffect(() => {
        setData("medical_representative_ids", selectedReps);
    }, [selectedReps]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedReps.length === 0) {
            alert("Please select at least one medical representative");
            return;
        }

        setIsSubmitting(true);

        post(route("admin.events.store"), {
            onSuccess: () => {
                onClose();
                resetForm();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const resetForm = () => {
        reset();
        setSelectedReps([]);
        setSelectAll(false);
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedReps(medicalRepresentatives.map((rep) => rep.id));
        } else {
            setSelectedReps([]);
        }
    };

    const handleRepSelection = (repId, checked) => {
        if (checked) {
            setSelectedReps((prev) => [...prev, repId]);
        } else {
            setSelectedReps((prev) => prev.filter((id) => id !== repId));
            setSelectAll(false);
        }
    };

    const removeSelectedRep = (repId) => {
        setSelectedReps((prev) => prev.filter((id) => id !== repId));
        setSelectAll(false);
    };

    const eventTypes = [
        { value: "meeting", label: "Meeting" },
        { value: "call", label: "Phone Call" },
        { value: "visit", label: "Customer Visit" },
        { value: "task", label: "Task" },
        { value: "training", label: "Training" },
        { value: "other", label: "Other" },
    ];

    const recurringPatterns = [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
    ];

    const getSelectedRepsNames = () => {
        return selectedReps
            .map((repId) => {
                const rep = medicalRepresentatives.find((r) => r.id === repId);
                return rep?.name;
            })
            .filter(Boolean);
    };

    return (
        <Dialog open={showModal} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column - Event Details */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="Enter event title"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="event_type">Event Type *</Label>
                                <Select
                                    value={data.event_type}
                                    onValueChange={(value) =>
                                        setData("event_type", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eventTypes.map((type) => (
                                            <SelectItem
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.event_type && (
                                    <p className="text-sm text-red-600">
                                        {errors.event_type}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="event_date">
                                        Start Date *
                                    </Label>
                                    <Input
                                        id="event_date"
                                        type="date"
                                        value={data.event_date}
                                        onChange={(e) =>
                                            setData(
                                                "event_date",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.event_date && (
                                        <p className="text-sm text-red-600">
                                            {errors.event_date}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">
                                        End Date (Optional)
                                    </Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData("end_date", e.target.value)
                                        }
                                        min={data.event_date}
                                    />
                                    {errors.end_date && (
                                        <p className="text-sm text-red-600">
                                            {errors.end_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">
                                        Start Time (Optional)
                                    </Label>
                                    <Input
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) =>
                                            setData(
                                                "start_time",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time">
                                        End Time (Optional)
                                    </Label>
                                    <Input
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) =>
                                            setData("end_time", e.target.value)
                                        }
                                    />
                                    {errors.end_time && (
                                        <p className="text-sm text-red-600">
                                            {errors.end_time}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">
                                    Location (Optional)
                                </Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    placeholder="Enter event location"
                                />
                            </div>

                            {/* <div className="space-y-2">
                                <Label htmlFor="customer_id">
                                    Customer (Optional)
                                </Label>
                                <Select
                                    value={data.customer_id}
                                    onValueChange={(value) =>
                                        setData("customer_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">
                                            No Customer
                                        </SelectItem>
                                        {customers?.map((customer) => (
                                            <SelectItem
                                                key={customer.id}
                                                value={customer.id}
                                            >
                                                {customer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div> */}
                        </div>

                        {/* Right Column - Medical Representatives & Notes */}
                        <div className="space-y-4">
                            {/* Medical Representatives Selection */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">
                                    Select Medical Representatives *
                                </Label>

                                {/* Select All */}
                                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                    <Checkbox
                                        id="select_all"
                                        checked={selectAll}
                                        onCheckedChange={handleSelectAll}
                                    />
                                    <Label
                                        htmlFor="select_all"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        Select All Representatives
                                    </Label>
                                </div>

                                {/* Selected Reps Badges */}
                                {selectedReps.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">
                                            Selected ({selectedReps.length}):
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {getSelectedRepsNames().map(
                                                (name, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="flex items-center gap-1"
                                                    >
                                                        {name}
                                                        <X
                                                            className="h-3 w-3 cursor-pointer"
                                                            onClick={() =>
                                                                removeSelectedRep(
                                                                    selectedReps[
                                                                        index
                                                                    ]
                                                                )
                                                            }
                                                        />
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Representatives List */}
                                <div className="border rounded-lg max-h-48 overflow-y-auto">
                                    {medicalRepresentatives?.map((rep) => (
                                        <div
                                            key={rep.id}
                                            className="flex items-center space-x-2 p-3 border-b last:border-b-0"
                                        >
                                            <Checkbox
                                                id={`rep-${rep.id}`}
                                                checked={selectedReps.includes(
                                                    rep.id
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handleRepSelection(
                                                        rep.id,
                                                        checked
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`rep-${rep.id}`}
                                                className="text-sm cursor-pointer flex-1"
                                            >
                                                {rep.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.medical_representative_ids && (
                                    <p className="text-sm text-red-600">
                                        {errors.medical_representative_ids}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description (Optional)
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Enter event description"
                                    rows={3}
                                />
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    placeholder="Additional notes"
                                    rows={2}
                                />
                            </div>

                            {/* Recurring Event */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_recurring"
                                        checked={data.is_recurring}
                                        onCheckedChange={(checked) =>
                                            setData("is_recurring", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="is_recurring"
                                        className="text-sm font-medium"
                                    >
                                        This is a recurring event
                                    </Label>
                                </div>

                                {data.is_recurring && (
                                    <div className="space-y-2">
                                        <Label htmlFor="recurring_pattern">
                                            Recurring Pattern
                                        </Label>
                                        <Select
                                            value={data.recurring_pattern}
                                            onValueChange={(value) =>
                                                setData(
                                                    "recurring_pattern",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select pattern" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {recurringPatterns.map(
                                                    (pattern) => (
                                                        <SelectItem
                                                            key={pattern.value}
                                                            value={
                                                                pattern.value ??
                                                                " "
                                                            }
                                                        >
                                                            {pattern.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                "Create Event"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
