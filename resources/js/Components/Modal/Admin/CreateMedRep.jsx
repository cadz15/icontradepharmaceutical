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
import axios from "axios";

function CreateMedRep({ className, children }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("medical-rep.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <Dialog>
            <form className={className} onSubmit={handleSubmit}>
                <DialogTrigger asChild>
                    <Button>{children}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Medical Representative</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="medrep_name">Name</Label>
                            <Input
                                id="medrep_name"
                                name="name"
                                placeholder="Juan Dela Cruz"
                                value={data.name}
                                onChange={handleChange}
                            />
                            {errors.name && (
                                <span className="text-sm text-red-500">
                                    {errors.name}
                                </span>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

export default CreateMedRep;
