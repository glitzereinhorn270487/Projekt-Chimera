
'use client';

import { Panel } from '@/components/ui/panel';
import { useTrades } from '@/hooks/use-trades';
import { TradeTable } from './trade-table';
import { closedPositionsColumns } from './columns';
import { Loader2 } from 'lucide-react';

export function ClosedPositionsPanel() {
  const { trades, isLoading, isError } = useTrades();

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;
    }
    if (isError) {
      return <div className="text-center text-red-400">Failed to load trades.</div>;
    }
    if (!trades || trades.closed.length === 0) {
      return <div className="text-center text-gray-400">No closed positions.</div>;
    }
    return <TradeTable columns={closedPositionsColumns} data={trades.closed} />;
  };

  return (
    <Panel className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-white mb-4">Closed Positions</h2>
      <div className="flex-grow relative">
        {renderContent()}
      </div>
    </Panel>
  );
}
