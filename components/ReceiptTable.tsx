"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ReceiptItem } from './types';
import ReceiptTableRow from './ReceiptTableRow';
import ReceiptTableSummary from './ReceiptTableSummary';

// Re-export for backwards compatibility with tests and app/page.tsx
export type { ReceiptItem };

interface ReceiptTableProps {
  items: ReceiptItem[];
}

export default function ReceiptTable({ items }: ReceiptTableProps) {
  const [tableItems, setTableItems] = useState<ReceiptItem[]>(items);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Column resizing state (Item, Price, Who, Actions)
  const [colWidths, setColWidths] = useState([35, 15, 35, 15]);
  const [isResizing, setIsResizing] = useState<number | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthsRef = useRef<number[]>([35, 15, 35, 15]);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleMouseDown = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    setIsResizing(colIndex);
    startXRef.current = e.clientX;
    startWidthsRef.current = [...colWidths];
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing === null || !tableRef.current) return;
      
      const tableWidth = tableRef.current.getBoundingClientRect().width;
      const deltaX = e.clientX - startXRef.current;
      const deltaPercentage = (deltaX / tableWidth) * 100;
      
      setColWidths(() => {
        const newWidths = [...startWidthsRef.current];
        const nextColIndex = isResizing + 1;
        
        let newWidthLeft = startWidthsRef.current[isResizing] + deltaPercentage;
        let newWidthRight = startWidthsRef.current[nextColIndex] - deltaPercentage;
        
        if (newWidthLeft < 10) {
          newWidthLeft = 10;
          newWidthRight = startWidthsRef.current[isResizing] + startWidthsRef.current[nextColIndex] - 10;
        } else if (newWidthRight < 10) {
          newWidthRight = 10;
          newWidthLeft = startWidthsRef.current[isResizing] + startWidthsRef.current[nextColIndex] - 10;
        }
        
        newWidths[isResizing] = newWidthLeft;
        newWidths[nextColIndex] = newWidthRight;
        
        return newWidths;
      });
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    if (isResizing !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing]);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleDeleteClick = (index: number) => {
    setTableItems(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && index < editingIndex) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleSaveClick = (index: number, newItem: ReceiptItem) => {
    setTableItems(prev => prev.map((item, i) => i === index ? newItem : item));
    setEditingIndex(null);
  };

  const handleCancelClick = (index: number) => {
    // If it was a newly added empty row
    if (tableItems[index].item === "" && tableItems[index].price === 0 && tableItems[index].who.length === 0) {
      setTableItems(prev => prev.filter((_, i) => i !== index));
    }
    setEditingIndex(null);
  };

  const handleAddNewItem = () => {
    const newItem: ReceiptItem = { item: "", price: 0, who: [] };
    setTableItems(prev => [...prev, newItem]);
    setEditingIndex(tableItems.length);
  };

  const allUniqueNames = useMemo(() => {
    return Array.from(new Set(tableItems.flatMap(i => i.who)));
  }, [tableItems]);

  const grandTotal = tableItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="w-full max-w-5xl mx-auto my-8 space-y-8">
      {/* Table Section */}
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 select-none">
                <th 
                  style={{ width: `${colWidths[0]}%` }}
                  className="relative px-6 py-5 font-semibold text-gray-800 dark:text-gray-200 tracking-wide uppercase text-xs border-r border-gray-200 dark:border-white/10"
                >
                  Item
                  <div 
                    onMouseDown={(e) => handleMouseDown(e, 0)}
                    className={`absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400 dark:hover:bg-blue-500 z-10 transition-colors ${isResizing === 0 ? 'bg-blue-500' : ''}`}
                  />
                </th>
                <th 
                  style={{ width: `${colWidths[1]}%` }}
                  className="relative px-6 py-5 font-semibold text-gray-800 dark:text-gray-200 tracking-wide uppercase text-xs text-right border-r border-gray-200 dark:border-white/10"
                >
                  Price
                  <div 
                    onMouseDown={(e) => handleMouseDown(e, 1)}
                    className={`absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400 dark:hover:bg-blue-500 z-10 transition-colors ${isResizing === 1 ? 'bg-blue-500' : ''}`}
                  />
                </th>
                <th 
                  style={{ width: `${colWidths[2]}%` }}
                  className="relative px-6 py-5 font-semibold text-gray-800 dark:text-gray-200 tracking-wide uppercase text-xs border-r border-gray-200 dark:border-white/10"
                >
                  Who
                  <div 
                    onMouseDown={(e) => handleMouseDown(e, 2)}
                    className={`absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400 dark:hover:bg-blue-500 z-10 transition-colors ${isResizing === 2 ? 'bg-blue-500' : ''}`}
                  />
                </th>
                <th 
                  style={{ width: `${colWidths[3]}%` }}
                  className="px-6 py-5 font-semibold text-gray-800 dark:text-gray-200 tracking-wide uppercase text-xs text-center"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {tableItems.map((entry, index) => (
                <ReceiptTableRow 
                  key={index}
                  item={entry}
                  isEditing={editingIndex === index}
                  allUniqueNames={allUniqueNames}
                  onEdit={() => handleEditClick(index)}
                  onDelete={() => handleDeleteClick(index)}
                  onSave={(newItem) => handleSaveClick(index, newItem)}
                  onCancel={() => handleCancelClick(index)}
                />
              ))}
            </tbody>
            {/* Table Footer for Grand Total */}
            <tfoot className="border-t-2 border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
              <tr>
                <td className="px-6 py-5 font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wide break-words">
                  Grand Total
                </td>
                <td className="px-6 py-5 font-bold text-gray-900 dark:text-white text-right tabular-nums text-lg break-words">
                  ${grandTotal.toFixed(2)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Add Item Button */}
        <div className="p-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex justify-center">
          <button
            onClick={handleAddNewItem}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-900"
          >
            <span className="text-lg leading-none">+</span> Add New Item
          </button>
        </div>

        {tableItems.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-medium border-t border-gray-200 dark:border-white/10">
            No receipt items added yet.
          </div>
        )}
      </div>

      <ReceiptTableSummary tableItems={tableItems} />
    </div>
  );
}
