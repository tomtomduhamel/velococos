import React from 'react';
import { Wifi, WifiOff, RefreshCw, Compass, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { syncWithSupabase } from '../services/syncService';

export default function Header({ onOpenSync, onOpenSecurity }) {
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
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-950/40">
          <Compass className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
            Vélococos
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Expédition
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            4-7 Sept 2026 • R-à-P ➔ Québec
          </p>
        </div>
      </div>

      {/* Actions & Status */}
      <div className="flex items-center space-x-1.5">
        {/* Security & Emergency Button */}
        <button
          type="button"
          onClick={onOpenSecurity}
          title="Sécurité, Faune & Urgences"
          className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 active:scale-95 transition-all touch-target flex items-center justify-center"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>

        {/* Offline / Online badge */}
        <button
          type="button"
          onClick={onOpenSync}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
            isOnline
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>En ligne</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Hors-ligne</span>
            </>
          )}
        </button>

        {/* Sync Trigger button */}
        <button
          type="button"
          onClick={handleSyncClick}
          disabled={syncStatus === 'syncing'}
          title={`Sync Supabase (${formatLastSync(lastSyncedAt)})`}
          className={`p-2 rounded-lg border transition-all active:scale-95 touch-target flex items-center justify-center ${
            syncStatus === 'syncing'
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
              : syncStatus === 'error'
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : hasPendingChanges
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <RefreshCw
            className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin text-amber-400' : ''}`}
          />
        </button>
      </div>
    </header>
  );
}
