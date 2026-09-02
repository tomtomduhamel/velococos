import React, { useState } from 'react';
import { X, Cloud, CloudOff, RefreshCw, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { syncWithSupabase } from '../services/syncService';
import { isSupabaseConfigured } from '../lib/supabase';

export default function SyncModal({ isOpen, onClose }) {
  const { isOnline, syncStatus, syncError, lastSyncedAt, hasPendingChanges } = useAppStore();
  const [syncing, setSyncing] = useState(false);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setSyncing(true);
    await syncWithSupabase();
    setSyncing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-black text-white">Synchronisation Local-First</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status card */}
        <div className="bg-slate-800/80 p-4 rounded-xl space-y-3 border border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Statut Réseau :</span>
            <span className={`font-bold flex items-center gap-1.5 ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isOnline ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
              {isOnline ? 'Connecté à Internet' : 'Hors-ligne (Local Pur)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Serveur Supabase :</span>
            <span className={`font-bold ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isSupabaseConfigured ? 'Configuré' : 'Non configuré (Mode autonome)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Modifications locales :</span>
            <span className="font-bold text-slate-200">
              {hasPendingChanges ? 'En attente de sync' : 'À jour localement'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Dernière synchronisation :</span>
            <span className="font-bold text-slate-200 text-xs">
              {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Jamais'}
            </span>
          </div>

          {syncError && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{syncError}</span>
            </div>
          )}
        </div>

        {/* Explication Local-First */}
        <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <p className="font-semibold text-slate-300 mb-1">Architecture 100% Hors-Ligne :</p>
          Toutes les modifications (cases cochées, ajouts d'articles) sont enregistrées immédiatement sur votre téléphone sans latence. Dès qu'un réseau cellulaire ou Wi-Fi est détecté, la synchronisation en arrière-plan s'exécute automatiquement avec Supabase.
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleManualSync}
          disabled={syncing || !isOnline}
          className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 touch-target transition-all ${
            !isOnline
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 shadow-lg'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Synchronisation en cours...' : 'Forcer la synchronisation maintenant'}</span>
        </button>
      </div>
    </div>
  );
}
