
'use client';

import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Trade } from '@/hooks/use-trades';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const columnHelper = createColumnHelper<Trade>();

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

const baseColumns = [
  columnHelper.accessor('tokenSymbol', {
    header: () => 'Token',
    cell: (info) => (
      <div className="font-medium text-white">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('amount', {
    header: () => 'Amount',
    cell: (info) => `${info.getValue()} SOL`,
  }),
  columnHelper.accessor('entryPrice', {
    header: () => 'Entry Price',
    cell: (info) => formatCurrency(info.getValue()),
  }),
] as ColumnDef<Trade>[];

export const openPositionsColumns = [
  ...baseColumns,
  columnHelper.accessor('currentPrice', {
    header: () => 'Current Price',
    cell: (info) => formatCurrency(info.getValue() ?? 0),
  }),
  columnHelper.accessor('pnl', {
    header: () => 'P&L',
    cell: (info) => {
      const pnl = info.getValue();
      const isPositive = pnl >= 0;
      return (
        <span className={cn(isPositive ? 'text-green-400' : 'text-red-400')}>
          {formatCurrency(pnl)}
        </span>
      );
    },
  }),
  columnHelper.accessor('pnlPercentage', {
    header: () => 'P&L %',
    cell: (info) => {
        const pnl = info.getValue();
        const isPositive = pnl >= 0;
        return (
            <span className={cn('flex items-center', isPositive ? 'text-green-400' : 'text-red-400')}>
                {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1"/> : <ArrowDownRight className="h-4 w-4 mr-1"/>}
                {formatPercentage(pnl)}
            </span>
        )
    }
  })
] as ColumnDef<Trade>[];

export const closedPositionsColumns = [
    ...baseColumns,
    columnHelper.accessor('exitPrice', {
        header: () => 'Exit Price',
        cell: (info) => formatCurrency(info.getValue() ?? 0)
    }),
    columnHelper.accessor('pnl', {
        header: () => 'P&L',
        cell: (info) => {
            const pnl = info.getValue();
            const isPositive = pnl >= 0;
            return (
                <span className={cn(isPositive ? 'text-green-400' : 'text-red-400')}>
                {formatCurrency(pnl)}
                </span>
            );
        }
    }),
    columnHelper.accessor('pnlPercentage', {
        header: () => 'P&L %',
        cell: (info) => {
            const pnl = info.getValue();
            const isPositive = pnl >= 0;
            return (
                <span className={cn('flex items-center', isPositive ? 'text-green-400' : 'text-red-400')}>
                    {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1"/> : <ArrowDownRight className="h-4 w-4 mr-1"/>}
                    {formatPercentage(pnl)}
                </span>
            )
        }
      })
] as ColumnDef<Trade>[];
