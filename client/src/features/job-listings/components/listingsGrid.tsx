import {ComponentProps} from "react";
import {cn} from "@/utils/shadcnUtils.ts";

type  ListingsGridProps = ComponentProps<"div">

const ListingsGrid = ({className , ...props} : ListingsGridProps) => {
    return (
        <div
        className={cn(
            "flex flex-col sm:grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]",
            className
        )}
        {...props}
        >
        </div>
    );
};

export default ListingsGrid;