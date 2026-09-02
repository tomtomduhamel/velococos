import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TrajetTab from './components/TrajetTab';
import MiamTab from './components/MiamTab';
import MaterielTab from './components/MaterielTab';
import LingeTab from './components/LingeTab';
import SyncModal from './components/SyncModal';
import SecurityModal from './components/SecurityModal';
import AuthLockScreen from './components/AuthLockScreen';
import { useAppStore } from './store/useAppStore';
import { initSyncService } from './services/syncService';

export default function App() {
  const { activeTab } = useAppStore();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Authentification locale persistante
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('velococos_auth_token') === 'authenticated_familleNobregaDuhamel';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Initialisation des écouteurs réseau et synchronisation asynchrone
    const cleanup = initSyncService();
    return cleanup;
  }, []);

  const handleLock = () => {
    try {
      localStorage.removeItem('velococos_auth_token');
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
  };

  // Si non authentifié, afficher l'écran de verrouillage
  if (!isAuthenticated) {
    return <AuthLockScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Conteneur strict Mobile-First centré sur les écrans plus larges */}
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col bg-slate-950 min-h-screen relative shadow-2xl border-x border-slate-800/40">
        {/* En-tête mobile */}
        <Header
          onOpenSync={() => setIsSyncModalOpen(true)}
          onOpenSecurity={() => setIsSecurityModalOpen(true)}
          onLock={handleLock}
        />

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

        {/* Modale de sécurité, faune et urgences */}
        <SecurityModal
          isOpen={isSecurityModalOpen}
          onClose={() => setIsSecurityModalOpen(false)}
        />
      </div>
    </div>
  );
}
