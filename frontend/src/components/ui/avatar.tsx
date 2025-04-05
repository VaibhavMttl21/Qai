import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} 
      {...props}
    >
      {children}
    </div>
  )
);
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("h-full w-full object-cover", className)}
    alt={alt}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-900",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";
