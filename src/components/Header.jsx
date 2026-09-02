import React from 'react';
import { Wifi, WifiOff, RefreshCw, Compass, CheckCircle2, AlertCircle, ShieldAlert, Lock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { syncWithSupabase } from '../services/syncService';

export default function Header({ onOpenSync, onOpenSecurity, onLock }) {
  const { isOnline, syncStatus, lastSyncedAt, hasPendingChanges } = useAppStore();

  const handleSyncClick = (e) => {
    e.stopPropagation();
    syncWithSupabase();
  };

  const formatLastSync = (isoString) => {
    if (!isoString) return 'Non synchronisé';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-2 flex items-center justify-between shadow-md">
      {/* Branding gauche */}
      <div className="flex items-center space-x-2 min-w-0 pr-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md flex-shrink-0">
          <Compass className="w-4.5 h-4.5 text-slate-950" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <h1 className="text-base font-black tracking-tight text-white truncate">
              Vélococos
            </h1>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              Expé
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
            4-7 Sept • R-à-P ➔ Québec
          </p>
        </div>
      </div>

      {/* Actions droite - 3 boutons compacts anti-coupure */}
      <div className="flex items-center space-x-1.5 flex-shrink-0">
        {/* Sécurité & Urgence */}
        <button
          type="button"
          onClick={onOpenSecurity}
          title="Sécurité & Urgences (Faune, 911)"
          className="w-8 h-8 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 active:scale-95 transition-all flex items-center justify-center touch-target"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>

        {/* Verrouillage accès */}
        {onLock && (
          <button
            type="button"
            onClick={onLock}
            title="Verrouiller l'accès"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white active:scale-95 transition-all flex items-center justify-center touch-target"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}

        {/* Réseau & Sync unifié */}
        <button
          type="button"
          onClick={onOpenSync}
          title={isOnline ? `En ligne (Sync: ${formatLastSync(lastSyncedAt)})` : 'Hors-ligne (100% autonome)'}
          className={`h-8 px-2.5 rounded-xl border text-xs font-bold transition-all active:scale-95 flex items-center space-x-1.5 touch-target ${
            isOnline
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Wifi className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <WifiOff className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </header>
  );
}
