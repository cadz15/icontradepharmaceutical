import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import React from "react";
import QRCode from "react-qr-code";

function QRModal({ qrValue, className, children }) {
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Medical Representative QR Code</DialogTitle>
                    <DialogDescription>
                        To activate the app, please scan using the app.
                    </DialogDescription>
                </DialogHeader>

                <QRCode title="QR CODE" value={qrValue} size={""} />
            </DialogContent>
        </Dialog>
    );
}

export default QRModal;
