import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function AppTooltip({ title, children }) {
    return (
        <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent>
                <p>{title}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default AppTooltip;
