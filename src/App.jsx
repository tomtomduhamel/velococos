import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TrajetTab from './components/TrajetTab';
import MiamTab from './components/MiamTab';
import MaterielTab from './components/MaterielTab';
import LingeTab from './components/LingeTab';
import SyncModal from './components/SyncModal';
import { useAppStore } from './store/useAppStore';
import { initSyncService } from './services/syncService';

export default function App() {
  const { activeTab } = useAppStore();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  useEffect(() => {
    // Initialisation des écouteurs réseau et synchronisation asynchrone
    const cleanup = initSyncService();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Conteneur strict Mobile-First centré sur les écrans plus larges */}
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col bg-slate-950 min-h-screen relative shadow-2xl border-x border-slate-800/40">
        {/* En-tête mobile */}
        <Header onOpenSync={() => setIsSyncModalOpen(true)} />

        {/* Zone de contenu défilable */}
        <main className="flex-1 p-3.5 sm:p-4 overflow-y-auto">
          {activeTab === 'trajet' && <TrajetTab />}
          {activeTab === 'miam' && <MiamTab />}
          {activeTab === 'materiel' && <MaterielTab />}
          {activeTab === 'linge' && <LingeTab />}
        </main>

        {/* Barre de navigation inférieure persistante */}
        <BottomNav />

        {/* Modale d'état et contrôle de synchronisation */}
        <SyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
        />
      </div>
    </div>
  );
}
