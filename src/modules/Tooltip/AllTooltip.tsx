import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function AllTooltip({
  children,
  content,
  className,
}: {
  children: React.ReactNode;
  content: string;
  className?:string
}) {
  return (
    <TooltipProvider>
      <Tooltip
      
      >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
        className={cn(className,"bg-gray-700 border border-gray-900")}
        align="center"
        side="left"
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
