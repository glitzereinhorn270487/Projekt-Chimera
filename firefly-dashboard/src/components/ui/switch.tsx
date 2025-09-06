// firefly-dashboard/src/components/ui/switch.tsx
"use client";

import * as React from "react";
import * as SwitchPr from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export type UISwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
};

const Root = SwitchPr.Root as unknown as React.ComponentType<any>;
const Thumb = SwitchPr.Thumb as unknown as React.ComponentType<any>;

const SwitchImpl = React.forwardRef<HTMLButtonElement, UISwitchProps>(
  ({ className, ...props }, ref) => (
    <Root
      ref={ref}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full bg-white/10 ring-1 ring-white/15",
        "data-[state=checked]:bg-cyan/30 data-[state=checked]:ring-cyan/40 transition",
        className
      )}
      {...props}
    >
      <Thumb
        className={cn(
          "block h-5 w-5 translate-x-0.5 rounded-full bg-white/90 transition-transform",
          "data-[state=checked]:translate-x-[22px]"
        )}
      />
    </Root>
  )
);
SwitchImpl.displayName = "Switch";

export const Switch = SwitchImpl as unknown as React.ComponentType<UISwitchProps>;
