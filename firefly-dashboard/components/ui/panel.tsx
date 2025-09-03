
import * as React from 'react';
import { cn } from '@/lib/utils';

const Panel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-lg sm:p-6',
      className
    )}
    {...props}
  />
));
Panel.displayName = 'Panel';

export { Panel };
