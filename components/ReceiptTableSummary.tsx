import React from 'react';
import { ReceiptItem } from './types';

export default function ReceiptTableSummary({ tableItems }: { tableItems: ReceiptItem[] }) {
  if (tableItems.length === 0) return null;

  const personTotals: Record<string, number> = {};
  tableItems.forEach(item => {
    if (item.who.length === 0) {
      personTotals['Unassigned'] = (personTotals['Unassigned'] || 0) + item.price;
    } else {
      const splitAmount = item.price / item.who.length;
      item.who.forEach(person => {
        personTotals[person] = (personTotals[person] || 0) + splitAmount;
      });
    }
  });

  return (
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Split Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(personTotals).map(([person, total]) => (
          <div 
            key={person} 
            className={`flex items-center justify-between p-4 rounded-xl border ${person === 'Unassigned' ? 'bg-red-50/50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30' : 'bg-gray-50/50 border-gray-200 dark:bg-white/5 dark:border-white/10'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${person === 'Unassigned' ? 'bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-200' : 'bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200'}`}>
                {person === 'Unassigned' ? '?' : person.charAt(0).toUpperCase()}
              </div>
              <span className={`font-semibold ${person === 'Unassigned' ? 'text-red-700 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                {person}
              </span>
            </div>
            <span className="font-bold tabular-nums text-gray-900 dark:text-white">
              ${total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
