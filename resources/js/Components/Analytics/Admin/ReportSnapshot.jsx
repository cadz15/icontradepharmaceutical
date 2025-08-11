import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import SalesBar from "@/Components/Charts/Admin/SalesBar";

function ReportSnapshot({ className, ...props }) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-xl">Reports Snapshot</CardTitle>
                <CardDescription className="font-normal">
                    Demographic properties of your customer
                </CardDescription>
            </CardHeader>

            <CardContent className="mt-8">
                <SalesBar />
            </CardContent>
        </Card>
    );
}

export default ReportSnapshot;
