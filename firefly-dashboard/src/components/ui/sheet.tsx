// firefly-dashboard/src/components/ui/sheet.tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Primitive Re-Exports – we cast to ComponentType<any> to avoid JSX type quirks */
export const Sheet = DialogPrimitive.Root as unknown as React.ComponentType<any>;
export const SheetTrigger =
  DialogPrimitive.Trigger as unknown as React.ComponentType<any>;
export const SheetClose =
  DialogPrimitive.Close as unknown as React.ComponentType<any>;

const SheetPortal =
  DialogPrimitive.Portal as unknown as React.ComponentType<any>;

const OverlayImpl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 bg-black/40 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  )
);
/** cast to keep JSX happy in all TS setups */
const SheetOverlay = OverlayImpl as unknown as React.ComponentType<any>;

type Side = "right" | "left";
type SheetContentProps = {
  side?: Side;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ContentImpl = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed top-0 h-full w-[380px] glass glow-cyan p-6",
          "border border-white/10 rounded-none",
          side === "right" ? "right-0" : "left-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          side === "right"
            ? "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
            : "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full p-2 bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
          aria-label="Schließen"
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
);

export const SheetContent =
  ContentImpl as unknown as React.ComponentType<SheetContentProps>;

export function SheetHeader({ children }: { children?: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
export function SheetTitle({ children }: { children?: React.ReactNode }) {
  return <h3 className="text-lg t-strong">{children}</h3>;
}
export function SheetDescription({ children }: { children?: React.ReactNode }) {
  return <p className="t-soft text-sm">{children}</p>;
}
export function SheetFooter({ children }: { children?: React.ReactNode }) {
  return <div className="mt-6 flex items-center justify-end gap-2">{children}</div>;
}
