
'use client';

import { Row, flexRender } from '@tanstack/react-table';
import { Trade } from '../../hooks/use-trades';
import { motion, Variants } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { ExternalLink } from 'lucide-react';

interface TradeRowProps {
  row: Row<Trade>;
}

export function TradeRow({ row }: TradeRowProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 20, rotateX: -45, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 25 },
    },
  };

  return (
    <motion.tr
      variants={variants}
      initial="hidden"
      animate="visible"
      layout
      className="border-b border-white/10 text-sm text-gray-300 hover:bg-white/5"
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
      <td className="px-4 py-3 text-right">
        <Button variant="ghost" size="sm" disabled>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </td>
    </motion.tr>
  );
}
