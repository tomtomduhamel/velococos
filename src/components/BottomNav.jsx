import React from 'react';
import { MapPin, UtensilsCrossed, Backpack, Shirt } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function BottomNav() {
  const {
    activeTab,
    setActiveTab,
    materielList,
    lingePapaList,
    lingeEnfantsList,
    menuList,
    refillsList
  } = useAppStore();

  // Badges calculation
  const pendingMateriel = materielList.filter((i) => !i.checked).length;
  const pendingLinge =
    lingePapaList.filter((i) => !i.checked).length +
    lingeEnfantsList.filter((i) => !i.checked).length;
  const pendingRefills = refillsList.filter((r) => !r.completed).length;

  const tabs = [
    {
      id: 'trajet',
      label: 'Trajet',
      icon: MapPin,
      badge: null
    },
    {
      id: 'miam',
      label: 'Nourriture',
      icon: UtensilsCrossed,
      badge: pendingRefills > 0 ? `${pendingRefills} Refill` : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    {
      id: 'materiel',
      label: 'Matériel',
      icon: Backpack,
      badge: pendingMateriel > 0 ? pendingMateriel : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold'
    },
    {
      id: 'linge',
      label: 'Linge',
      icon: Shirt,
      badge: pendingLinge > 0 ? pendingLinge : null,
      badgeColor: 'bg-blue-500 text-white font-bold'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-[env(safe-area-inset-bottom,8px)] pt-1 px-2 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 touch-target active:scale-95 ${
                isActive
                  ? 'text-emerald-400 bg-slate-800/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.badge && (
                <span
                  className={`absolute top-1 right-2 text-[10px] px-1.5 py-0.2 rounded-full leading-tight shadow-sm ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
