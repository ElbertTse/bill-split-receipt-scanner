import React, { useState, useEffect } from 'react';
import { ReceiptItem } from './types';

interface ReceiptTableRowProps {
  item: ReceiptItem;
  isEditing: boolean;
  allUniqueNames: string[];
  onEdit: () => void;
  onDelete: () => void;
  onSave: (newItem: ReceiptItem) => void;
  onCancel: () => void;
}

export default function ReceiptTableRow({
  item,
  isEditing,
  allUniqueNames,
  onEdit,
  onDelete,
  onSave,
  onCancel
}: ReceiptTableRowProps) {
  const [formData, setFormData] = useState<ReceiptItem>(item);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isEditing) {
      setFormData(item);
      setTagInput("");
    }
  }, [isEditing, item]);

  const handleSaveClick = () => {
    onSave(formData);
  };

  const handleCancelClick = () => {
    setFormData(item);
    setTagInput("");
    onCancel();
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== "") {
      e.preventDefault();
      setFormData(prev => ({ ...prev, who: [...prev.who, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setFormData(prev => ({ ...prev, who: prev.who.filter((_, i) => i !== indexToRemove) }));
  };

  const handleAddAllTags = () => {
    setFormData(prev => {
      const currentNames = new Set(prev.who);
      const namesToAdd = allUniqueNames.filter(name => !currentNames.has(name));
      return { ...prev, who: [...prev.who, ...namesToAdd] };
    });
  };

  return (
    <tr className={`transition-colors duration-300 group ${isEditing ? 'bg-blue-50/30 dark:bg-white/10' : 'hover:bg-blue-50/50 dark:hover:bg-white/5'}`}>
      {/* ITEM COLUMN */}
      <td className="px-6 py-4 text-gray-800 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors align-top break-words">
        {isEditing ? (
          <textarea 
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder="Item name"
          />
        ) : (
          item.item
        )}
      </td>

      {/* PRICE COLUMN */}
      <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300 tabular-nums align-top break-words">
        {isEditing ? (
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            <input 
              type="number" 
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full pl-7 pr-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-right tabular-nums"
            />
          </div>
        ) : (
          `$${item.price.toFixed(2)}`
        )}
      </td>

      {/* WHO COLUMN */}
      <td className="px-6 py-4 align-top break-words">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {formData.who.map((person, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-sm pr-1"
                >
                  {person}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-100 focus:outline-none transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-center mt-1 flex-wrap sm:flex-nowrap">
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a name & press Enter"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={handleAddAllTags}
                className="whitespace-nowrap px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/50 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Add everyone currently listed in the receipt"
              >
                Add All
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {item.who.map((person, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-sm"
              >
                {person}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* ACTIONS COLUMN */}
      <td className="px-6 py-4 text-center align-top whitespace-nowrap overflow-hidden">
        {isEditing ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button 
              onClick={handleSaveClick}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-900"
            >
              Save
            </button>
            <button 
              onClick={handleCancelClick}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-900"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
            <button 
              onClick={onEdit}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
            <button 
              onClick={onDelete}
              className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
