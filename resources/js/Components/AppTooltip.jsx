import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function AppTooltip({ title, children, className }) {
    return (
        <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent className={className}>
                <p>{title}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default AppTooltip;
