
import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlassShellProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassShell({ children, className }: GlassShellProps) {
  return (
    <main
      className={cn(
        'flex min-h-screen w-full flex-col bg-gradient-to-br from-gray-900 to-black',
        className
      )}
    >
      {children}
    </main>
  );
}
