import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

const SYNC_ROW_ID = 'velococos_main_expedition_2026';

/**
 * Lance la synchronisation asynchrone avec Supabase
 */
export async function syncWithSupabase() {
  const store = useAppStore.getState();

  // Si pas de réseau
  if (!navigator.onLine) {
    store.setOnlineStatus(false);
    return { success: false, reason: 'offline' };
  }

  // Si Supabase n'est pas encore configuré avec les clés d'API
  if (!isSupabaseConfigured || !supabase) {
    store.setOnlineStatus(true);
    store.setSyncStatus('local_only', 'Mode 100% autonome local (variables Supabase non configurées)');
    return { success: true, mode: 'local_only' };
  }

  store.setSyncStatus('syncing');

  try {
    const localPayload = store.exportSyncPayload();

    // 1. Récupération de l'état distant s'il existe
    const { data: remoteData, error: fetchError } = await supabase
      .from('velococos_state')
      .select('id, data, updated_at')
      .eq('id', SYNC_ROW_ID)
      .maybeSingle();

    if (fetchError) {
      console.warn('Erreur de lecture distante Supabase:', fetchError);
    }

    // 2. Stratégie de conciliation (Last-Write-Wins avec préférence locale si modifications en attente)
    const remoteTimestamp = remoteData?.updated_at ? new Date(remoteData.updated_at).getTime() : 0;
    const localTimestamp = store.lastSyncedAt ? new Date(store.lastSyncedAt).getTime() : 0;

    // Si le serveur a une version plus récente et qu'on n'a pas de modifs locales pendant la coupure
    if (remoteData && remoteTimestamp > localTimestamp && !store.hasPendingChanges) {
      store.importRemoteState(remoteData.data);
      store.setSyncStatus('synced');
      return { success: true, action: 'pulled_from_remote' };
    }

    // Sinon, on pousse notre état local (upsert)
    const { error: upsertError } = await supabase
      .from('velococos_state')
      .upsert({
        id: SYNC_ROW_ID,
        data: localPayload,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      throw upsertError;
    }

    store.setSyncStatus('synced');
    return { success: true, action: 'pushed_to_remote' };

  } catch (err) {
    console.error('Échec de la synchronisation Supabase:', err);
    store.setSyncStatus('error', err.message || 'Erreur réseau de synchronisation');
    return { success: false, error: err };
  }
}

/**
 * Initialise les écouteurs d'événements réseau globaux (online / offline)
 */
export function initSyncService() {
  const store = useAppStore.getState();

  const handleOnline = () => {
    store.setOnlineStatus(true);
    // Déclenchement automatique de la synchronisation en arrière-plan
    syncWithSupabase();
  };

  const handleOffline = () => {
    store.setOnlineStatus(false);
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Synchronisation initiale au chargement
  if (navigator.onLine) {
    syncWithSupabase();
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
