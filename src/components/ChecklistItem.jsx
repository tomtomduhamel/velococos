import React from 'react';
import { Check, Trash2 } from 'lucide-react';

export default function ChecklistItem({ item, onToggle, onDelete, showCategory = false }) {
  const isChecked = item.checked;

  return (
    <div
      onClick={onToggle}
      className={`group flex items-center justify-between p-3.5 my-1.5 rounded-xl border transition-all duration-150 cursor-pointer active:scale-[0.98] select-none touch-target ${
        isChecked
          ? 'bg-slate-900/60 border-emerald-500/30 text-slate-400'
          : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-100 shadow-sm'
      }`}
    >
      <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-2">
        {/* Checkbox circle with high contrast */}
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            isChecked
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'border-2 border-slate-500 group-hover:border-emerald-400 bg-slate-900/50'
          }`}
        >
          {isChecked && <Check className="w-5 h-5 stroke-[3]" />}
        </div>

        <div className="flex flex-col min-w-0">
          <span
            className={`text-base font-medium leading-snug break-words ${
              isChecked ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {item.title}
          </span>
          {showCategory && item.category && (
            <span className="text-xs text-emerald-400/90 font-semibold tracking-wide uppercase mt-0.5">
              {item.category}
            </span>
          )}
        </div>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-2 text-slate-500 hover:text-rose-400 active:text-rose-500 rounded-lg"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
