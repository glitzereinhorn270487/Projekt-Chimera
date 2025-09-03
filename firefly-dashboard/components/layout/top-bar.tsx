
import { Panel } from '@/components/ui/panel';
import { Firefly } from 'lucide-react';

export function TopBar() {
  return (
    <header className="p-4 sm:p-6">
      <Panel className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Firefly className="h-8 w-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Firefly</h1>
        </div>
        {/* Placeholder for future controls like settings or user profile */}
        <div className="h-8 w-24 rounded-md bg-white/10"></div>
      </Panel>
    </header>
  );
}
