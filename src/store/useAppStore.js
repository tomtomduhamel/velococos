import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. MATÉRIEL - 31 articles exacts selon votre liste de préparation
export const INITIAL_MATERIEL = [
  { id: 'mat-1', title: 'Casques enfants', category: 'Vélo & Chariot', checked: false },
  { id: 'mat-2', title: 'Rustines', category: 'Vélo & Chariot', checked: false },
  { id: 'mat-3', title: 'Pompe vélo', category: 'Vélo & Chariot', checked: false },
  { id: 'mat-4', title: 'Sangles', category: 'Vélo & Chariot', checked: false },
  { id: 'mat-5', title: 'Sleeping (*3)', category: 'Bivouac & Dodo', checked: false },
  { id: 'mat-6', title: 'Tapis de sol (*2)', category: 'Bivouac & Dodo', checked: false },
  { id: 'mat-7', title: 'Tente', category: 'Bivouac & Dodo', checked: false },
  { id: 'mat-8', title: 'Tendeurs (*6)', category: 'Bivouac & Dodo', checked: false },
  { id: 'mat-9', title: 'Corde', category: 'Bivouac & Dodo', checked: false },
  { id: 'mat-10', title: 'Gourdes eau (*3)', category: 'Bivouac & Dodo', checked: false },
  { id: 'mat-11', title: 'Réchaud', category: 'Cuisine & Popote', checked: false },
  { id: 'mat-12', title: 'Bouteille propane', category: 'Cuisine & Popote', checked: false },
  { id: 'mat-13', title: 'Gamelle', category: 'Cuisine & Popote', checked: false },
  { id: 'mat-14', title: 'Assiettes (*3)', category: 'Cuisine & Popote', checked: false },
  { id: 'mat-15', title: 'Ustensiles', category: 'Cuisine & Popote', checked: false },
  { id: 'mat-16', title: 'Anti-moustique (spray + spirales)', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-17', title: 'Filtre à eau', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-18', title: 'Papier toilette dans 1 ziploc (*2)', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-19', title: 'Ziplocs', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-20', title: 'Lingettes bébé', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-21', title: 'Crème solaire', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-22', title: 'Savon pour se laver', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-23', title: 'Produit vaisselle', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-24', title: 'Trousse de premiers soins', category: 'Hygiène & Santé', checked: false },
  { id: 'mat-25', title: 'Batterie de rechange', category: 'Énergie & Divers', checked: false },
  { id: 'mat-26', title: 'Fil de recharge cellulaire', category: 'Énergie & Divers', checked: false },
  { id: 'mat-27', title: 'Panneau solaire', category: 'Énergie & Divers', checked: false },
  { id: 'mat-28', title: 'Lampes frontales (*3)', category: 'Énergie & Divers', checked: false },
  { id: 'mat-29', title: 'Liseuse', category: 'Énergie & Divers', checked: false },
  { id: 'mat-30', title: 'Briquet', category: 'Énergie & Divers', checked: false },
  { id: 'mat-31', title: 'Sacs poubelles (gros) (*5)', category: 'Énergie & Divers', checked: false }
];

// 2. LINGE PAPA - 12 articles exacts
export const INITIAL_LINGE_PAPA = [
  { id: 'lp-1', title: 'Casquette (*1)', checked: false },
  { id: 'lp-2', title: 'Pantalons chauds (*1)', checked: false },
  { id: 'lp-3', title: 'Short de course', checked: false },
  { id: 'lp-4', title: 'Pull chaud (*1)', checked: false },
  { id: 'lp-5', title: 'Manteau de pluie (*1)', checked: false },
  { id: 'lp-6', title: 'Bobettes (*4)', checked: false },
  { id: 'lp-7', title: 'Paires de chaussettes (*4)', checked: false },
  { id: 'lp-8', title: 'T-shirt (*2)', checked: false },
  { id: 'lp-9', title: 'T-shirt de course (*3)', checked: false },
  { id: 'lp-10', title: 'Maillot de bain (*1)', checked: false },
  { id: 'lp-11', title: 'Serviette (*1)', checked: false },
  { id: 'lp-12', title: 'Tuque (*1)', checked: false }
];

// 3. LINGE ENFANTS (Jojo & Gusto - chacun) - 11 articles exacts
export const INITIAL_LINGE_ENFANTS = [
  { id: 'le-1', title: 'Casquette (*1)', checked: false },
  { id: 'le-2', title: 'Pantalons chauds (*1)', checked: false },
  { id: 'le-3', title: 'Pull chaud (*1)', checked: false },
  { id: 'le-4', title: 'Manteau de pluie (*1)', checked: false },
  { id: 'le-5', title: 'Bobettes (*4)', checked: false },
  { id: 'le-6', title: 'Paires de chaussettes (*4)', checked: false },
  { id: 'le-7', title: 'T-shirt (*3)', checked: false },
  { id: 'le-8', title: 'Maillot de bain (*1)', checked: false },
  { id: 'le-9', title: 'Serviette (*1 pour les 2)', checked: false },
  { id: 'le-10', title: 'Tuques (*2)', checked: false },
  { id: 'le-11', title: 'Gants (*2)', checked: false }
];

// 4. PROVISIONS DE DÉPART (16 articles exacts de la liste de courses)
export const INITIAL_PROVISIONS = [
  { id: 'prov-1', title: 'Pain sandwich (dîner J1 + dîner J2)', checked: false },
  { id: 'prov-2', title: 'Babibel (dîner J1 + dîner J2)', checked: false },
  { id: 'prov-3', title: 'Jambon sec (dîner J1 + dîner J2)', checked: false },
  { id: 'prov-4', title: 'Sardines (dîner J1 + dîner J2)', checked: false },
  { id: 'prov-5', title: 'Avocats (*5) (dîner J1 + dîner J2)', checked: false },
  { id: 'prov-6', title: 'Tomates (*5) (dîner J1 + dîner J2)', checked: false },
  { id: 'prov-7', title: 'Wrap (déjeuner J2 + collation J1 + collation J2)', checked: false },
  { id: 'prov-8', title: 'Beurre de peanut (déjeuner J2)', checked: false },
  { id: 'prov-9', title: 'Brisures de chocolat (déjeuner J2 + col. J1 + col. J2)', checked: false },
  { id: 'prov-10', title: 'Noix (déjeuner J2 + collation J1 + collation J2)', checked: false },
  { id: 'prov-11', title: 'Lait végétal (1L) (déjeuner J2)', checked: false },
  { id: 'prov-12', title: 'Conserves (souper J1)', checked: false },
  { id: 'prov-13', title: "Collation (poissons Annie's) (col. J1 + col. J2)", checked: false },
  { id: 'prov-14', title: 'Barres tendres (collation J1 + collation J2)', checked: false },
  { id: 'prov-15', title: 'Électrolytes', checked: false },
  { id: 'prov-16', title: 'Riz préparé à réchauffer (*2) (souper J1)', checked: false }
];

// 5. PLANNING DE CONSOMMATION PAR REPAS (J1 à J4)
export const INITIAL_MENU = [
  // J1 : 2 collations + 1 dîner + 1 souper
  { id: 'm-j1-col1', day: 'J1', type: 'Collation', title: "Collation 1 : Wraps brisures de chocolat / Poissons Annie's", checked: false },
  { id: 'm-j1-din', day: 'J1', type: 'Dîner', title: 'Dîner J1 : Pain sandwich, Babibel, Jambon sec, Sardines, Avocats & Tomates', checked: false },
  { id: 'm-j1-col2', day: 'J1', type: 'Collation', title: 'Collation 2 : Barres tendres & Mélange de noix', checked: false },
  { id: 'm-j1-soup', day: 'J1', type: 'Souper', title: 'Souper J1 : Conserves & Riz préparé à réchauffer (*2)', checked: false },

  // J2 : 1 déjeuner + 2 collations + 1 dîner + 1 souper (Refill Saint-Raymond)
  { id: 'm-j2-dej', day: 'J2', type: 'Déjeuner', title: 'Déjeuner J2 : Wrap, Beurre de peanut, Brisures de chocolat, Noix & Lait végétal 1L', checked: false },
  { id: 'm-j2-col1', day: 'J2', type: 'Collation', title: "Collation 1 : Poissons Annie's & Barres tendres", checked: false },
  { id: 'm-j2-din', day: 'J2', type: 'Dîner', title: 'Dîner J2 : Pain sandwich, Babibel, Jambon sec, Sardines, Avocats & Tomates', checked: false },
  { id: 'm-j2-col2', day: 'J2', type: 'Collation', title: 'Collation 2 : Noix & Wrap chocolat', checked: false },
  { id: 'm-j2-soup', day: 'J2', type: 'Souper', title: 'Souper J2 : Repas acheté lors du Refill Saint-Raymond', checked: false },

  // J3 : 1 déjeuner + 2 collations + 1 dîner + 1 souper (Chez Annick et Vincent)
  { id: 'm-j3-dej', day: 'J3', type: 'Déjeuner', title: 'Déjeuner J3 : Déjeuner acheté au Refill Saint-Raymond', checked: false },
  { id: 'm-j3-col1', day: 'J3', type: 'Collation', title: 'Collation 1 J3 : Fruits & collations fraîches de Saint-Raymond', checked: false },
  { id: 'm-j3-din', day: 'J3', type: 'Dîner', title: 'Dîner J3 : Pique-nique acheté à Saint-Raymond', checked: false },
  { id: 'm-j3-col2', day: 'J3', type: 'Collation', title: 'Collation 2 J3 : Collation énergétique', checked: false },
  { id: 'm-j3-soup', day: 'J3', type: 'Souper', title: 'Souper J3 : Festin Chez Annick et Vincent (Val-Bélair)', checked: false },

  // J4 : 1 déjeuner + 2 collations + 1 dîner
  { id: 'm-j4-dej', day: 'J4', type: 'Déjeuner', title: 'Déjeuner J4 : Déjeuner Chez Annick et Vincent / Refill Val-Bélair', checked: false },
  { id: 'm-j4-col1', day: 'J4', type: 'Collation', title: 'Collation 1 J4 : Fruits & biscuits', checked: false },
  { id: 'm-j4-din', day: 'J4', type: 'Dîner', title: 'Dîner J4 : Pique-nique final de fête à l’arrivée à Québec', checked: false },
  { id: 'm-j4-col2', day: 'J4', type: 'Collation', title: 'Collation 2 J4 : Goûter de célébration d’arrivée', checked: false }
];

// 6. REFILLS EXACTS (Saint-Raymond & Val-Bélair)
export const INITIAL_REFILLS = [
  {
    id: 'refill-j2',
    stage: 'J2 - Saint-Raymond',
    location: 'Camping Plage Saint-Raymond / Épiceries locales',
    deadline: 'Fin d’après-midi J2',
    items: [
      '1x Souper (J2)',
      '2x Collations (J3)',
      '1x Dîner (J3)',
      '1x Déjeuner (J3)'
    ],
    completed: false
  },
  {
    id: 'refill-j3',
    stage: 'J3 - Val-Bélair',
    location: 'Commerces Val-Bélair / Chez Annick et Vincent',
    deadline: 'Soirée J3',
    items: [
      '1x Souper (J3)',
      '2x Collations (J4)',
      '1x Dîner (J4)',
      '1x Déjeuner (J4)'
    ],
    completed: false
  }
];

// 7. POI OFFICIELS ALIGNÉS AVEC LE TRACÉ GPX
export const TRAIL_POIS = [
  {
    id: 'poi-rap',
    name: 'Gare de Rivière-à-Pierre',
    km: 'Km 68 (Départ)',
    type: 'water',
    hasWater: true,
    hasToilets: true,
    hasRepair: true,
    hasParking: true,
    coordinates: [46.989283, -72.179923],
    description: 'Point de départ au nord. Eau potable à la gare, toilettes, stationnement et point de débarquement VIA Rail.'
  },
  {
    id: 'poi-lac-simon',
    name: 'Halte Saint-Léonard / Lac Simon',
    km: 'Km 48.5',
    type: 'toilets',
    hasWater: false,
    hasToilets: true,
    hasRepair: false,
    hasParking: true,
    coordinates: [46.898764, -72.025730],
    description: 'Accès Centre de Vacances (Emplacement 60). Toilettes. Attention : eau non-potable sur les sites de camping nord.'
  },
  {
    id: 'poi-st-raymond',
    name: 'Gare / Halte Saint-Raymond',
    km: 'Km 31',
    type: 'repair',
    hasWater: true,
    hasToilets: true,
    hasRepair: true,
    hasParking: true,
    coordinates: [46.872680, -71.800480],
    description: 'Grand pôle de services : eau potable, toilettes, borne de réparation vélo, épiceries et grand Refill J2.'
  },
  {
    id: 'poi-lac-sergent',
    name: 'Halte Lac-Sergent',
    km: 'Km 26.5',
    type: 'toilets',
    hasWater: false,
    hasToilets: true,
    hasRepair: false,
    hasParking: true,
    coordinates: [46.855942, -71.732195],
    description: 'Halte panoramique boisée avec tables de pique-nique et toilettes.'
  },
  {
    id: 'poi-sainte-catherine',
    name: 'Halte Duchesnay / Sainte-Catherine',
    km: 'Km 14',
    type: 'repair',
    hasWater: true,
    hasToilets: true,
    hasRepair: true,
    hasParking: true,
    coordinates: [46.862179, -71.624387],
    description: 'Halte principale près de la Station Duchesnay. Eau potable, toilettes et station de réparation vélo.'
  },
  {
    id: 'poi-shannon',
    name: 'Halte de Shannon',
    km: 'Km 5',
    type: 'water',
    hasWater: true,
    hasToilets: true,
    hasRepair: false,
    hasParking: true,
    coordinates: [46.883654, -71.503609],
    description: 'Halte municipale avec point d\'eau potable, toilettes et stationnement.'
  },
  {
    id: 'poi-valcartier',
    name: 'Halte Saint-Gabriel-de-Valcartier',
    km: 'Km 0 (Extrémité Sud)',
    type: 'toilets',
    hasWater: true,
    hasToilets: true,
    hasRepair: true,
    hasParking: true,
    coordinates: [46.868200, -71.472500],
    description: 'Extrémité Sud de la Vélopiste JCP. Jonction directe avec le Corridor des Cheminots vers Québec.'
  },
  {
    id: 'poi-val-belair',
    name: 'Halte Val-Bélair (Cheminots)',
    km: 'Étape J3',
    type: 'water',
    hasWater: true,
    hasToilets: true,
    hasRepair: true,
    hasParking: false,
    coordinates: [46.851818, -71.441756],
    description: 'Services urbains complets, épiceries et étape Chez Annick et Vincent.'
  },
  {
    id: 'poi-quebec-arrivee',
    name: 'Ligne d\'arrivée (1937 av. du Monument)',
    km: 'Arrivée J4',
    type: 'toilets',
    hasWater: true,
    hasToilets: true,
    hasRepair: false,
    hasParking: true,
    coordinates: [46.849143, -71.208919],
    description: '1937 avenue du Monument, G1E 3Y5, Québec, QC. Point d\'arrivée officiel de l\'expédition Vélococos ! Célébration finale.'
  }
];

// 8. HÉBERGEMENTS EXACTS (J1 à J4)
export const INITIAL_STAGES = [
  {
    id: 'stage-j1',
    day: 1,
    date: 'Vendredi 4 Septembre 2026',
    title: 'Rivière-à-Pierre ➔ Lac Simon',
    distance: '21.6 km',
    accommodation: 'Centre Vacances Lac Simon',
    bookingDetail: 'Emplacement 60',
    address: '60 Chem. du Lac Simon, Saint-Léonard-de-Portneuf, QC G0A 4A0',
    phone: '(418) 337-6734',
    coordinates: [46.898764, -72.02573],
    color: '#10b981',
    notes: 'Terrain ombragé proche du lac, point d\'eau et sanitaires au centre de vacances.'
  },
  {
    id: 'stage-j2',
    day: 2,
    date: 'Samedi 5 Septembre 2026',
    title: 'Lac Simon ➔ Saint-Raymond',
    distance: '21.6 km',
    accommodation: 'Camping Plage Saint-Raymond',
    bookingDetail: 'Emplacement C26',
    address: '615 Chem. de Bourg Louis, Saint-Raymond, QC G3L 4G3',
    phone: '(418) 337-2270',
    coordinates: [46.87268, -71.80048],
    color: '#3b82f6',
    notes: 'Accès plage, douches chaudes, proximité avec les commerces de Saint-Raymond pour le grand Refill J2.'
  },
  {
    id: 'stage-j3',
    day: 3,
    date: 'Dimanche 6 Septembre 2026',
    title: 'Saint-Raymond ➔ Val-Bélair',
    distance: '36.0 km',
    accommodation: 'Chez Annick et Vincent',
    bookingDetail: 'Hébergement familial',
    address: "1085 Rue de l'Esplanade, Québec, QC G3J 1G2",
    phone: 'Contact privé',
    coordinates: [46.851818, -71.441756],
    color: '#f59e0b',
    notes: 'Étape reine la plus longue. Accueil chaleureux, lit confortable et recharge des batteries pour la dernière ligne droite !'
  },
  {
    id: 'stage-j4',
    day: 4,
    date: 'Lundi 7 Septembre 2026',
    title: 'Val-Bélair ➔ Québec (1937 av. du Monument)',
    distance: '22.6 km',
    accommodation: 'Ligne d\'arrivée - Célébration Finale',
    bookingDetail: '1937 avenue du Monument, G1E 3Y5, Québec',
    address: '1937 avenue du Monument, G1E 3Y5, Québec, QC, Canada',
    phone: '',
    coordinates: [46.849143, -71.208919],
    color: '#ef4444',
    notes: 'Arrivée triomphale de l\'expédition Vélococos au 1937 avenue du Monument ! Photos de groupe et célébration finale.'
  }
];

export const useAppStore = create(
  persist(
    (set, get) => ({
      // État de l'UI
      activeTab: 'trajet', // 'trajet' | 'miam' | 'materiel' | 'linge'
      setActiveTab: (activeTab) => set({ activeTab }),

      // État Réseau & Synchronisation
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      syncStatus: 'idle',
      lastSyncedAt: null,
      syncError: null,
      hasPendingChanges: false,

      setOnlineStatus: (isOnline) => set({ isOnline }),
      setSyncStatus: (syncStatus, syncError = null) =>
        set({
          syncStatus,
          syncError,
          lastSyncedAt: syncStatus === 'synced' ? new Date().toISOString() : get().lastSyncedAt,
          hasPendingChanges: syncStatus === 'synced' ? false : get().hasPendingChanges
        }),

      // Données calibrées sur votre liste exacte
      materielList: INITIAL_MATERIEL,
      lingePapaList: INITIAL_LINGE_PAPA,
      lingeEnfantsList: INITIAL_LINGE_ENFANTS,
      provisionsList: INITIAL_PROVISIONS,
      menuList: INITIAL_MENU,
      refillsList: INITIAL_REFILLS,
      stages: INITIAL_STAGES,

      // Actions de modification
      toggleItem: (listName, itemId) => {
        set((state) => {
          const targetList = state[listName];
          if (!targetList) return state;

          const updatedList = targetList.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          );

          return {
            [listName]: updatedList,
            hasPendingChanges: true,
            syncStatus: 'idle'
          };
        });
      },

      toggleRefillCompleted: (refillId) => {
        set((state) => ({
          refillsList: state.refillsList.map((r) =>
            r.id === refillId ? { ...r, completed: !r.completed } : r
          ),
          hasPendingChanges: true,
          syncStatus: 'idle'
        }));
      },

      addCustomItem: (listName, item) => {
        set((state) => {
          const targetList = state[listName] || [];
          const newItem = {
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            checked: false,
            ...item
          };
          return {
            [listName]: [newItem, ...targetList],
            hasPendingChanges: true,
            syncStatus: 'idle'
          };
        });
      },

      removeCustomItem: (listName, itemId) => {
        set((state) => {
          const targetList = state[listName] || [];
          return {
            [listName]: targetList.filter((item) => item.id !== itemId),
            hasPendingChanges: true,
            syncStatus: 'idle'
          };
        });
      },

      resetList: (listName) => {
        set((state) => {
          let resetData;
          if (listName === 'materielList') resetData = INITIAL_MATERIEL;
          else if (listName === 'lingePapaList') resetData = INITIAL_LINGE_PAPA;
          else if (listName === 'lingeEnfantsList') resetData = INITIAL_LINGE_ENFANTS;
          else if (listName === 'provisionsList') resetData = INITIAL_PROVISIONS;
          else if (listName === 'menuList') resetData = INITIAL_MENU;
          else return state;

          return {
            [listName]: resetData,
            hasPendingChanges: true,
            syncStatus: 'idle'
          };
        });
      },

      // Export / Import Supabase
      exportSyncPayload: () => {
        const s = get();
        return {
          updated_at: new Date().toISOString(),
          materiel: s.materielList,
          linge_papa: s.lingePapaList,
          linge_enfants: s.lingeEnfantsList,
          provisions: s.provisionsList,
          menu: s.menuList,
          refills: s.refillsList
        };
      },

      importRemoteState: (remoteState) => {
        if (!remoteState) return;
        set((state) => ({
          materielList: remoteState.materiel || state.materielList,
          lingePapaList: remoteState.linge_papa || state.lingePapaList,
          lingeEnfantsList: remoteState.linge_enfants || state.lingeEnfantsList,
          provisionsList: remoteState.provisions || state.provisionsList,
          menuList: remoteState.menu || state.menuList,
          refillsList: remoteState.refills || state.refillsList,
          hasPendingChanges: false,
          syncStatus: 'synced',
          lastSyncedAt: new Date().toISOString()
        }));
      }
    }),
    {
      name: 'velococos-storage-v4-exact',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        materielList: state.materielList,
        lingePapaList: state.lingePapaList,
        lingeEnfantsList: state.lingeEnfantsList,
        provisionsList: state.provisionsList,
        menuList: state.menuList,
        refillsList: state.refillsList,
        lastSyncedAt: state.lastSyncedAt,
        hasPendingChanges: state.hasPendingChanges,
        activeTab: state.activeTab
      })
    }
  )
);
