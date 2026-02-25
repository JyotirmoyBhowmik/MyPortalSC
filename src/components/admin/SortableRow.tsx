"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableRowProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function SortableRow({ id, children, className = "", disabled = false }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative" as "relative",
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <tr ref={setNodeRef} style={style} className={className}>
            {children}
            {!disabled && (
                <td className="px-2 py-3 w-8">
                    <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground p-1">
                        ⋮⋮
                    </button>
                </td>
            )}
        </tr>
    );
}
