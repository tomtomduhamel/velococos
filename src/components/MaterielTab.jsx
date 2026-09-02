import React, { useState } from 'react';
import { Backpack, Plus, RotateCcw, Filter, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ChecklistItem from './ChecklistItem';

export default function MaterielTab() {
  const {
    materielList,
    toggleItem,
    addCustomItem,
    removeCustomItem,
    resetList
  } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Course & Chariot');

  const categories = [
    'ALL',
    'Bivouac & Dodo',
    'Cuisine & Popote',
    'Vélo & Chariot',
    'Hygiène & Santé',
    'Énergie & Divers'
  ];

  const filteredItems =
    selectedCategory === 'ALL'
      ? materielList
      : materielList.filter((item) => item.category === selectedCategory);

  const checkedCount = materielList.filter((i) => i.checked).length;
  const totalCount = materielList.length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100) || 0;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCustomItem('materielList', {
      title: newTitle.trim(),
      category: newCategory
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Header card with progress */}
      <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Backpack className="w-5 h-5 text-emerald-400" />
              Matériel & Équipement
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {checkedCount} / {totalCount} équipés ({progressPercent}%)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl touch-target active:scale-95"
              title="Ajouter du matériel"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Réinitialiser la checklist matériel ?')) resetList('materielList');
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl touch-target active:scale-95"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Add item form */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-2">
            <input
              type="text"
              placeholder="Ex: Tendeurs pour le chariot, mousquetons..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-xs flex-1"
              >
                {categories.filter((c) => c !== 'ALL').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold"
              >
                Ajouter
              </button>
            </div>
          </form>
        )}

        {/* Filter pills - Wrap 100% visible sans aucun débordement */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => {
            const count =
              cat === 'ALL'
                ? materielList.length
                : materielList.filter((i) => i.category === cat).length;
            const label = cat === 'ALL' ? 'Tout le matériel' : cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border touch-target active:scale-95 flex items-center space-x-1.5 ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold leading-none ${
                    selectedCategory === cat
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1">
        {filteredItems.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            showCategory={selectedCategory === 'ALL'}
            onToggle={() => toggleItem('materielList', item.id)}
            onDelete={item.id.startsWith('custom-') ? () => removeCustomItem('materielList', item.id) : null}
          />
        ))}
      </div>
    </div>
  );
}
