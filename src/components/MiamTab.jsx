import React, { useState } from 'react';
import { ShoppingCart, CheckCircle2, Plus, RotateCcw, Apple, Calendar, PackageCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ChecklistItem from './ChecklistItem';

export default function MiamTab() {
  const {
    provisionsList = [],
    menuList = [],
    refillsList = [],
    toggleItem,
    toggleRefillCompleted,
    addCustomItem,
    removeCustomItem,
    updateItemNote,
    resetList
  } = useAppStore();

  const [activeSubView, setActiveSubView] = useState('provisions'); // 'provisions' | 'planning'
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState('J1');
  const [newType, setNewType] = useState('Collation');

  // Stats provisions
  const provChecked = provisionsList.filter((i) => i.checked).length;
  const provTotal = provisionsList.length;
  const provPercent = Math.round((provChecked / provTotal) * 100) || 0;

  // Stats menu planning
  const menuChecked = menuList.filter((i) => i.checked).length;
  const menuTotal = menuList.length;
  const menuPercent = Math.round((menuChecked / menuTotal) * 100) || 0;

  const filteredMenu =
    selectedDay === 'ALL'
      ? menuList
      : menuList.filter((item) => item.day === selectedDay);

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeSubView === 'provisions') {
      addCustomItem('provisionsList', {
        title: newTitle.trim()
      });
    } else {
      addCustomItem('menuList', {
        title: newTitle.trim(),
        day: newDay,
        type: newType
      });
    }

    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Segmented Controller (Provisions vs Planning) */}
      <div className="bg-slate-900/95 rounded-2xl p-2 border border-slate-800 shadow-md">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveSubView('provisions')}
            className={`flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-xs font-black transition-all touch-target active:scale-95 border ${
              activeSubView === 'provisions'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Provisions Départ</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeSubView === 'provisions' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-200'
              }`}
            >
              {provChecked}/{provTotal}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('planning')}
            className={`flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-xs font-black transition-all touch-target active:scale-95 border ${
              activeSubView === 'planning'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Repas & Refills</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeSubView === 'planning' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-200'
              }`}
            >
              {menuChecked}/{menuTotal}
            </span>
          </button>
        </div>
      </div>

      {/* VUE 1 : PROVISIONS DE DÉPART (16 articles exacts) */}
      {activeSubView === 'provisions' && (
        <div className="space-y-4">
          <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Apple className="w-5 h-5 text-emerald-400" />
                  Liste des Provisions au Départ
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {provChecked} / {provTotal} emballés dans le chariot ({provPercent}%)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl font-bold touch-target active:scale-95 flex items-center justify-center"
                  title="Ajouter une provision"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Réinitialiser la liste des provisions ?')) resetList('provisionsList');
                  }}
                  className="p-2 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl touch-target active:scale-95"
                  title="Réinitialiser"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${provPercent}%` }}
              />
            </div>

            {/* Add item form */}
            {showAddForm && (
              <form onSubmit={handleAddCustom} className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-2">
                <input
                  type="text"
                  placeholder="Ex: Pommes, biscuits, fruits secs..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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

          {/* Provisions checklist */}
          <div className="space-y-1">
            {provisionsList.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                onToggle={() => toggleItem('provisionsList', item.id)}
                onDelete={() => removeCustomItem('provisionsList', item.id)}
                onUpdateNote={(itemId, note) => updateItemNote('provisionsList', itemId, note)}
              />
            ))}
          </div>
        </div>
      )}

      {/* VUE 2 : PLANNING DE CONSOMMATION & REFILLS */}
      {activeSubView === 'planning' && (
        <div className="space-y-4">
          {/* Refill Alerts Banner */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black text-white">Points de Refill Indispensables</h3>
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
                      <span>Valider Refill</span>
                    )}
                  </button>
                </div>

                {/* Achats obligatoires */}
                <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                    Achats à faire sur place :
                  </span>
                  {refill.items.map((it, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span className={refill.completed ? 'line-through text-slate-400' : ''}>
                        {it}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Planning de consommation */}
          <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Consommation Quotidienne</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {menuChecked} / {menuTotal} repas consommés ({menuPercent}%)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl font-bold touch-target active:scale-95 flex items-center justify-center"
                  title="Ajouter un repas"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Réinitialiser le planning des repas ?')) resetList('menuList');
                  }}
                  className="p-2 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl touch-target active:scale-95"
                  title="Réinitialiser"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${menuPercent}%` }}
              />
            </div>

            {/* Add form */}
            {showAddForm && (
              <form onSubmit={handleAddCustom} className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-2">
                <input
                  type="text"
                  placeholder="Ex: Sandwich jambon-beurre..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-xs flex-1"
                  >
                    <option value="J1">J1</option>
                    <option value="J2">J2</option>
                    <option value="J3">J3</option>
                    <option value="J4">J4</option>
                  </select>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
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

            {/* Day Filter Grid */}
            <div className="grid grid-cols-5 gap-1.5 w-full pt-1">
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'J1', label: 'J1' },
                { id: 'J2', label: 'J2' },
                { id: 'J3', label: 'J3' },
                { id: 'J4', label: 'J4' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDay(item.id)}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all border touch-target active:scale-95 ${
                    selectedDay === item.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Food items list */}
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
                  onDelete={() => removeCustomItem('menuList', item.id)}
                  onUpdateNote={(itemId, note) => updateItemNote('menuList', itemId, note)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
