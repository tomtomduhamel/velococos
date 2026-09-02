import React, { useState } from 'react';
import { ShoppingCart, AlertTriangle, CheckCircle2, Plus, Calendar, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ChecklistItem from './ChecklistItem';

export default function MiamTab() {
  const {
    menuList,
    refillsList,
    toggleItem,
    toggleRefillCompleted,
    addCustomItem,
    removeCustomItem,
    resetList
  } = useAppStore();

  const [selectedDay, setSelectedDay] = useState('ALL');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('Collation');
  const [newItemDay, setNewItemDay] = useState('J2');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filtrage du menu
  const filteredMenu =
    selectedDay === 'ALL'
      ? menuList
      : menuList.filter((item) => item.day === selectedDay);

  const checkedCount = menuList.filter((i) => i.checked).length;
  const totalCount = menuList.length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100) || 0;

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    addCustomItem('menuList', {
      title: newItemTitle.trim(),
      day: newItemDay,
      type: newItemType
    });

    setNewItemTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Refill Alerts Banner */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-white">Points de Ravitaillement (Refill)</h2>
        </div>

        {refillsList.map((refill) => (
          <div
            key={refill.id}
            className={`rounded-2xl p-4 border transition-all duration-200 shadow-lg ${
              refill.completed
                ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                : 'bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/60 text-slate-100 shadow-amber-950/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-md">
                    {refill.stage}
                  </span>
                  <span className="text-xs text-amber-300/90 font-semibold">
                    {refill.deadline}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{refill.location}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleRefillCompleted(refill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all touch-target active:scale-95 flex items-center space-x-1.5 ${
                  refill.completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md'
                }`}
              >
                {refill.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Fait !</span>
                  </>
                ) : (
                  <span>Valider le Refill</span>
                )}
              </button>
            </div>

            {/* Liste des achats requis pour ce refill */}
            <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                Achats indispensables à effectuer :
              </span>
              {refill.items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span className={refill.completed ? 'line-through text-slate-400' : ''}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Menu Quotidien & Consommation */}
      <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">Menu & Consommation</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {checkedCount} / {totalCount} consommés ({progressPercent}%)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl font-bold touch-target active:scale-95 flex items-center justify-center"
              title="Ajouter un aliment"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Réinitialiser la liste des repas ?')) resetList('menuList');
              }}
              className="p-2 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl touch-target active:scale-95"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddFood} className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-2">
            <input
              type="text"
              placeholder="Ex: Bananes, Chocolat noir, Barres Clif..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <select
                value={newItemDay}
                onChange={(e) => setNewItemDay(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-xs flex-1"
              >
                <option value="J1">Jour 1</option>
                <option value="J2">Jour 2</option>
                <option value="J3">Jour 3</option>
                <option value="J4">Jour 4</option>
              </select>
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-xs flex-1"
              >
                <option value="Déjeuner">Déjeuner</option>
                <option value="Dîner">Dîner</option>
                <option value="Souper">Souper</option>
                <option value="Collation">Collation</option>
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

        {/* Day Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {['ALL', 'J1', 'J2', 'J3', 'J4'].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border touch-target active:scale-95 ${
                selectedDay === day
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {day === 'ALL' ? 'Tous les jours' : day}
            </button>
          ))}
        </div>

        {/* Food Items List */}
        <div className="space-y-1">
          {filteredMenu.map((item) => (
            <ChecklistItem
              key={item.id}
              item={{
                ...item,
                category: `${item.day} • ${item.type}`
              }}
              showCategory={true}
              onToggle={() => toggleItem('menuList', item.id)}
              onDelete={item.id.startsWith('custom-') ? () => removeCustomItem('menuList', item.id) : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
