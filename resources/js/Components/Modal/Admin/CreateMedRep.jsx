import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";

function CreateMedRep({ className, children, onCreate }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("medical-rep.store"), {
            data: data,
            onSuccess: () => {
                console.log("Medical Rep Created Successfully");
                reset();
                setIsOpen(false); // Close the modal after success

                // Call the onCreate callback to notify the parent to refresh the list
                if (onCreate) {
                    onCreate();
                }
            },
            onError: (errors) => {
                console.log("Errors:", errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className={className} onClick={() => setIsOpen(true)}>
                    {children}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Medical Representative</DialogTitle>
                    <DialogDescription>
                        Add a new medical representative to the system.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="medrep_name">Name</Label>
                        <Input
                            id="medrep_name"
                            name="name"
                            placeholder="Juan Dela Cruz"
                            value={data.name}
                            onChange={handleChange}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateMedRep;
