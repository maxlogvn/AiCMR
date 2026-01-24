"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    src?: string | null;
    alt?: string;
    fallback?: string;
    className?: string;
  }
>(({ src, alt, fallback, className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        "bg-muted",
        "inline-flex items-center justify-center",
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm font-medium text-muted-foreground">
          {fallback || "?"}
        </span>
      )}
    </span>
  );
});
Avatar.displayName = "Avatar";

export { Avatar };
