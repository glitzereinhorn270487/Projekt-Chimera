
'use client';

import { Panel } from '../../components/ui/panel';
import { useTrades } from '../../hooks/use-trades';
import { TradeTable } from './trade-table';
import { openPositionsColumns } from './columns';
import { Loader2 } from 'lucide-react';

export function OpenPositionsPanel() {
  const { trades, isLoading, isError } = useTrades();

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;
    }
    if (isError) {
      return <div className="text-center text-red-400">Failed to load trades.</div>;
    }
    if (!trades || trades.open.length === 0) {
      return <div className="text-center text-gray-400">No open positions.</div>;
    }
    return <TradeTable columns={openPositionsColumns} data={trades.open} />;
  };

  return (
    <Panel className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-white mb-4">Open Positions</h2>
      <div className="flex-grow relative">
        {renderContent()}
      </div>
    </Panel>
  );
}
