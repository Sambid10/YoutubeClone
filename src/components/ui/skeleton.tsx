import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-200 dark:bg-gray-200  duration-500 rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
