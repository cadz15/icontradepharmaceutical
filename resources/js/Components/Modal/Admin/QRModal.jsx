import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Copy, CheckCheck, Smartphone } from "lucide-react";
import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

function QRModal({
    qrValue,
    className,
    children,
    title = "Medical Representative QR Code",
    description = "To activate the app, please scan this QR code using the mobile application.",
}) {
    const [isCopied, setIsCopied] = useState(false);
    const qrRef = useRef(null);

    const handleCopyValue = async () => {
        try {
            await navigator.clipboard.writeText(qrValue);
            setIsCopied(true);
            toast.success("QR code value copied to clipboard!");

            // Reset copy state after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleDownloadQR = () => {
        if (!qrRef.current) return;

        const svg = qrRef.current.querySelector("svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `qr-code-${qrValue.slice(-8)}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
        toast.success("QR code downloaded successfully!");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="icon" className={className}>
                        <QrCode className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <QrCode className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-1 mt-1">
                                <Smartphone className="h-3 w-3" />
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 py-4">
                    {/* QR Code Container */}
                    <div
                        ref={qrRef}
                        className="p-6 bg-white rounded-lg border-2 border-muted shadow-sm"
                    >
                        <QRCode
                            value={qrValue}
                            size={200}
                            style={{
                                height: "auto",
                                maxWidth: "100%",
                                width: "100%",
                            }}
                            viewBox="0 0 256 256"
                        />
                    </div>

                    {/* QR Value Display */}
                    <div className="w-full space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            QR Code Value
                        </label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 text-sm bg-muted rounded-md truncate font-mono">
                                {qrValue}
                            </code>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopyValue}
                                disabled={isCopied}
                                className="flex-shrink-0"
                            >
                                {isCopied ? (
                                    <CheckCheck className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 w-full">
                        <Button
                            variant="outline"
                            onClick={handleDownloadQR}
                            className="flex-1 gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download QR
                        </Button>
                        <Button
                            onClick={handleCopyValue}
                            disabled={isCopied}
                            className="flex-1 gap-2"
                        >
                            {isCopied ? (
                                <CheckCheck className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                            {isCopied ? "Copied!" : "Copy Value"}
                        </Button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        How to use:
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Open the mobile app on your device</li>
                        <li>• Navigate to the QR scanner section</li>
                        <li>• Point your camera at this QR code</li>
                        <li>• Wait for the app to process the code</li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default QRModal;
