import React, { useState } from 'react';
import { Shirt, User, Users, Plus, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ChecklistItem from './ChecklistItem';

export default function LingeTab() {
  const {
    lingePapaList,
    lingeEnfantsList,
    toggleItem,
    addCustomItem,
    removeCustomItem,
    resetList
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState('papa'); // 'papa' | 'enfants'
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');

  const currentList = activeSubTab === 'papa' ? lingePapaList : lingeEnfantsList;
  const currentListName = activeSubTab === 'papa' ? 'lingePapaList' : 'lingeEnfantsList';

  const papaChecked = lingePapaList.filter((i) => i.checked).length;
  const papaTotal = lingePapaList.length;
  const papaPercent = Math.round((papaChecked / papaTotal) * 100) || 0;

  const enfantsChecked = lingeEnfantsList.filter((i) => i.checked).length;
  const enfantsTotal = lingeEnfantsList.length;
  const enfantsPercent = Math.round((enfantsChecked / enfantsTotal) * 100) || 0;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    addCustomItem(currentListName, {
      title: newItemTitle.trim()
    });

    setNewItemTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Segmented Controller (Papa vs Enfants) */}
      <div className="bg-slate-900/95 rounded-2xl p-2 border border-slate-800 shadow-md">
        <div className="grid grid-cols-2 gap-1.5">
          {/* Papa button */}
          <button
            type="button"
            onClick={() => setActiveSubTab('papa')}
            className={`flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-sm font-black transition-all touch-target active:scale-95 border ${
              activeSubTab === 'papa'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Linge Papa</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeSubTab === 'papa' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-200'
              }`}
            >
              {papaChecked}/{papaTotal}
            </span>
          </button>

          {/* Enfants button */}
          <button
            type="button"
            onClick={() => setActiveSubTab('enfants')}
            className={`flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-sm font-black transition-all touch-target active:scale-95 border ${
              activeSubTab === 'enfants'
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gusto & Jojo</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeSubTab === 'enfants' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-200'
              }`}
            >
              {enfantsChecked}/{enfantsTotal}
            </span>
          </button>
        </div>
      </div>

      {/* Profile summary card */}
      <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Shirt className="w-5 h-5 text-emerald-400" />
              {activeSubTab === 'papa' ? 'Sacoche Linge Papa' : 'Sacoche Enfants (Gusto & Jojo)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeSubTab === 'papa'
                ? `${papaChecked} / ${papaTotal} emballés (${papaPercent}%)`
                : `${enfantsChecked} / ${enfantsTotal} emballés (${enfantsPercent}%)`}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl touch-target active:scale-95"
              title="Ajouter un vêtement"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Réinitialiser cette liste de linge ?')) {
                  resetList(currentListName);
                }
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
            className={`h-full rounded-full transition-all duration-300 ${
              activeSubTab === 'papa' ? 'bg-emerald-500' : 'bg-sky-500'
            }`}
            style={{ width: `${activeSubTab === 'papa' ? papaPercent : enfantsPercent}%` }}
          />
        </div>

        {/* Add item form */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-2">
            <input
              type="text"
              placeholder={activeSubTab === 'papa' ? 'Ex: Bonnet chaud pour la nuit...' : 'Ex: Chaussettes chaudes Gusto...'}
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold"
              >
                Ajouter
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Items list */}
      <div className="space-y-1">
        {currentList.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={() => toggleItem(currentListName, item.id)}
            onDelete={() => removeCustomItem(currentListName, item.id)}
          />
        ))}
      </div>
    </div>
  );
}
