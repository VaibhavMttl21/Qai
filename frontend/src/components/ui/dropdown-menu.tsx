import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownMenuProps = {
  children: React.ReactNode;
};

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div className="relative inline-block text-left" onBlur={(e) => {
      // Only close if focus moves outside the dropdown
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setOpen(false);
      }
    }}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            open,
            setOpen,
          });
        }
        return child;
      })}
    </div>
  );
};

type DropdownMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  asChild?: boolean;
};

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ children, className, open, setOpen, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("focus:outline-none", className)}
    onClick={() => setOpen?.(!open)}
    aria-expanded={open}
    type="button"
    {...props}
  >
    {children}
  </button>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

type DropdownMenuContentProps = {
  children: React.ReactNode;
  align?: "start" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number; // Add this line
  open?: boolean;
  className?: string;
};

export const DropdownMenuContent = ({
  children,
  align = "end",
  side = "bottom",
  sideOffset = 0, // Default value for sideOffset
  open,
  className,
}: DropdownMenuContentProps) => {
  if (!open) return null;

  return (
    <div
      style={{
        marginTop: side === "bottom" ? sideOffset : undefined,
        marginBottom: side === "top" ? sideOffset : undefined,
        marginLeft: side === "right" ? sideOffset : undefined,
        marginRight: side === "left" ? sideOffset : undefined,
      }}
      className={cn(
        "absolute z-10 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md animate-in fade-in-80",
        align === "end" ? "right-0" : "left-0",
        side === "top" ? "bottom-full" : side === "bottom" ? "top-full" : "",
        className
      )}
    >
      {children}
    </div>
  );
};

type DropdownMenuItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  asChild?: boolean;
};

export const DropdownMenuItem = ({
  children,
  onClick,
  className,
  asChild = false,
}: DropdownMenuItemProps) => {
  const Comp = asChild ? React.Fragment : "div";
  
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      {children}
    </Comp>
  );
};
