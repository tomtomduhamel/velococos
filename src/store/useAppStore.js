import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Données initiales par défaut selon le PRD
const INITIAL_MATERIEL = [
  { id: 'mat-1', title: 'Chariot de course + fixation vélo', category: 'Course & Chariot', checked: false },
  { id: 'mat-2', title: 'Kit anti-crevaison, démonte-pneus & pompe', category: 'Course & Chariot', checked: false },
  { id: 'mat-3', title: 'Chambre à air de rechange (vélo + chariot)', category: 'Course & Chariot', checked: false },
  { id: 'mat-4', title: 'Multi-outils vélo complet + dérive-chaîne', category: 'Course & Chariot', checked: false },
  { id: 'mat-5', title: 'Casques vélo (Papa + Enfants)', category: 'Course & Chariot', checked: false },
  { id: 'mat-6', title: 'Tente légère de bivouac / camping', category: 'Bivouac', checked: false },
  { id: 'mat-7', title: 'Matelas gonflables / auto-gonflants (x3)', category: 'Bivouac', checked: false },
  { id: 'mat-8', title: 'Sacs de couchage adaptés aux nuits fraîches', category: 'Bivouac', checked: false },
  { id: 'mat-9', title: 'Draps de sac / oreillers compressibles', category: 'Bivouac', checked: false },
  { id: 'mat-10', title: 'Lampes frontales + piles / accus chargés', category: 'Bivouac', checked: false },
  { id: 'mat-11', title: 'Réchaud léger + cartouche de gaz', category: 'Bivouac', checked: false },
  { id: 'mat-12', title: 'Popote, couverts légers & gobelets', category: 'Bivouac', checked: false },
  { id: 'mat-13', title: 'Gourdes d\'eau (capacité min 3L) + électrolytes', category: 'Bivouac', checked: false },
  { id: 'mat-14', title: 'Trousse de premiers secours + pansements ampoules', category: 'Santé & Sécurité', checked: false },
  { id: 'mat-15', title: 'Crème solaire indice 50 + répulsif moustiques', category: 'Santé & Sécurité', checked: false },
  { id: 'mat-16', title: 'Médicaments usuels enfants & adulte', category: 'Santé & Sécurité', checked: false },
  { id: 'mat-17', title: 'Batterie externe 20 000 mAh + câbles USB', category: 'Énergie & Navigation', checked: false },
  { id: 'mat-18', title: 'Support téléphone étanche pour guidon', category: 'Énergie & Navigation', checked: false },
  { id: 'mat-19', title: 'Sacs étanches / poubelles pour protection pluie', category: 'Divers', checked: false },
  { id: 'mat-20', title: 'Briquet / allumettes étanches + couteau suisse', category: 'Divers', checked: false },
  { id: 'mat-21', title: 'Tendeurs / sardines d\'ancrage pour plateforme bois (12x12)', category: 'Bivouac', checked: false },
  { id: 'mat-22', title: 'Pastilles purification (Aquatabs) ou filtre à eau (zone nord non-potable)', category: 'Santé & Sécurité', checked: false },
  { id: 'mat-23', title: 'Clochette / sifflet anti-ours pour le chariot', category: 'Course & Chariot', checked: false },
  { id: 'mat-24', title: 'Lubrifiant chaîne spécial temps sec / poussière de pierre', category: 'Course & Chariot', checked: false },
  { id: 'mat-25', title: 'Preuve de réservation camping sauvegardée (hors-ligne)', category: 'Divers', checked: false }
];

const INITIAL_LINGE_PAPA = [
  { id: 'lp-1', title: 'Cuissards vélo / shorts de course (x2)', checked: false },
  { id: 'lp-2', title: 'Maillots techniques respirants (x3)', checked: false },
  { id: 'lp-3', title: 'Veste coupe-vent & imperméable légère', checked: false },
  { id: 'lp-4', title: 'Sous-vêtements techniques de rechange (x3)', checked: false },
  { id: 'lp-5', title: 'Paires de chaussettes anti-ampoules (x4)', checked: false },
  { id: 'lp-6', title: 'Chaussures de course confortables', checked: false },
  { id: 'lp-7', title: 'Sandales légères / tongs pour le campement', checked: false },
  { id: 'lp-8', title: 'Pantalon léger de soirée / jogging', checked: false },
  { id: 'lp-9', title: 'Polaire chaude pour la nuit', checked: false },
  { id: 'lp-10', title: 'Casquette + lunettes de soleil sport', checked: false },
  { id: 'lp-11', title: 'Buff / tour de cou', checked: false },
  { id: 'lp-12', title: 'Serviette microfibre à séchage rapide', checked: false }
];

const INITIAL_LINGE_ENFANTS = [
  { id: 'le-1', title: 'T-shirts respirants Gusto (x4)', checked: false },
  { id: 'le-2', title: 'T-shirts respirants Jojo (x4)', checked: false },
  { id: 'le-3', title: 'Shorts confortables Gusto (x3)', checked: false },
  { id: 'le-4', title: 'Shorts confortables Jojo (x3)', checked: false },
  { id: 'le-5', title: 'Pulls polaires chauds (x1 par enfant)', checked: false },
  { id: 'le-6', title: 'Pantalons longs confortables pour la soirée (x2)', checked: false },
  { id: 'le-7', title: 'Pyjamas chauds pour la tente (x2)', checked: false },
  { id: 'le-8', title: 'Sous-vêtements & culottes de rechange (x5 par enfant)', checked: false },
  { id: 'le-9', title: 'Chaussettes de rechange (x5 par enfant)', checked: false },
  { id: 'le-10', title: 'K-ways / vestes de pluie étanches (x2)', checked: false },
  { id: 'le-11', title: 'Baskets confortables + sandales d\'eau', checked: false },
  { id: 'le-12', title: 'Casquettes soleil (x2)', checked: false },
  { id: 'le-13', title: 'Doudous / couvertures réconfortantes', checked: false }
];

const INITIAL_MENU = [
  // J1
  { id: 'm-j1-1', day: 'J1', type: 'Dîner', title: 'Sandwichs jambon sec, fromage & crudités', checked: false },
  { id: 'm-j1-2', day: 'J1', type: 'Collation', title: 'Barres céréales, fruits secs & compotes', checked: false },
  { id: 'm-j1-3', day: 'J1', type: 'Souper', title: 'Pâtes au thon & sauce tomate au réchaud (Lac Simon)', checked: false },
  // J2
  { id: 'm-j2-1', day: 'J2', type: 'Déjeuner', title: 'Gruau d\'avoine aux fruits, pain & beurre de cacahuète', checked: false },
  { id: 'm-j2-2', day: 'J2', type: 'Collation', title: 'Pommes fraîches & biscuits énergétiques', checked: false },
  { id: 'm-j2-3', day: 'J2', type: 'Dîner', title: 'Wraps dinde, fromage Babibel & carottes', checked: false },
  { id: 'm-j2-4', day: 'J2', type: 'Souper', title: 'Ravitaillement Saint-Raymond : Burgers / Repas chaud local', checked: false },
  // J3
  { id: 'm-j3-1', day: 'J3', type: 'Déjeuner', title: 'Pancakes / pain doré & confiture + fruits', checked: false },
  { id: 'm-j3-2', day: 'J3', type: 'Collation', title: 'Mélange randonneur (noix, canneberges, chocolat)', checked: false },
  { id: 'm-j3-3', day: 'J3', type: 'Dîner', title: 'Pique-nique ombragé sur la piste (sandwichs & crudités)', checked: false },
  { id: 'm-j3-4', day: 'J3', type: 'Souper', title: 'Festin Chez Annick et Vincent (Val-Bélair)', checked: false },
  // J4
  { id: 'm-j4-1', day: 'J4', type: 'Déjeuner', title: 'Grand déjeuner d\'arrivée Chez Annick et Vincent', checked: false },
  { id: 'm-j4-2', day: 'J4', type: 'Collation', title: 'Fruits frais & berlingots de boisson énergisante', checked: false },
  { id: 'm-j4-3', day: 'J4', type: 'Dîner', title: 'Célébration d\'arrivée à Québec (Croisement François de Laval)', checked: false }
];

const INITIAL_REFILLS = [
  {
    id: 'refill-j2',
    stage: 'J2 - Saint-Raymond',
    location: 'Camping Plage Saint-Raymond / Supermarché local',
    deadline: 'Fin d\'après-midi J2',
    items: [
      '1x Souper J2 (option barbecue ou prêt-à-manger)',
      '2x Collations J3 (fruits frais, barres, compotes)',
      '1x Dîner J3 (pain sandwich, fromage Babibel, jambon sec)',
      '1x Déjeuner J3 (œufs ou gruau, lait, jus)'
    ],
    completed: false
  },
  {
    id: 'refill-j3',
    stage: 'J3 - Val-Bélair',
    location: 'Épicerie Val-Bélair / Chez Annick et Vincent',
    deadline: 'Soirée J3',
    items: [
      '1x Souper J3 (repas convivial partagé)',
      '2x Collations J4 (bananes, biscuits)',
      '1x Dîner J4 (sandwichs de fête pour l\'arrivée finale)',
      '1x Déjeuner J4 (bagels, fruits, café/chocolat chaud)'
    ],
    completed: false
  }
];

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
    coordinates: [46.9928, -72.0002],
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
    coordinates: [46.9601, -71.8845],
    description: 'Accès Centre de Vacances et campings. Toilettes sèches. Attention : eau non-potable sur les sites de camping nord.'
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
    coordinates: [46.8872, -71.8335],
    description: 'Grand pôle de services : eau potable, toilettes, borne de réparation avec outils/pompe, commerces et grand Refill J2.'
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
    coordinates: [46.8680, -71.7200],
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
    coordinates: [46.8650, -71.6450],
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
    coordinates: [46.8831, -71.5175],
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
    coordinates: [46.8710, -71.4720],
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
    coordinates: [46.8534, -71.4282],
    description: 'Services urbains complets, épiceries et hébergement Chez Annick et Vincent.'
  },
  {
    id: 'poi-quebec-arrivee',
    name: 'Québec - Croisement François de Laval',
    km: 'Arrivée J4',
    type: 'toilets',
    hasWater: true,
    hasToilets: true,
    hasRepair: false,
    hasParking: true,
    coordinates: [46.8202, -71.2421],
    description: 'Point d\'arrivée de l\'expédition ! Célébration finale et transports.'
  }
];

export const INITIAL_STAGES = [
  {
    id: 'stage-j1',
    day: 1,
    date: 'Vendredi 4 Septembre 2026',
    title: 'Rivière-à-Pierre ➔ Lac Simon',
    distance: '21.6 km',
    accommodation: 'Centre de Vacances Lac Simon',
    bookingDetail: 'Emplacement #60',
    address: '150 chemin du Lac Simon, Saint-Léonard-de-Portneuf, QC G0A 4A0',
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
    bookingDetail: 'Emplacement #C26',
    address: '1070 Rang de la Sagamité, Saint-Raymond, QC G3L 4K8',
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
    bookingDetail: 'Hébergement familial / Val-Bélair',
    address: 'Val-Bélair, Québec, QC',
    phone: 'Contact privé',
    coordinates: [46.851818, -71.441756],
    color: '#f59e0b',
    notes: 'Étape la plus longue. Accueil chaleureux, lit confortable et recharge des batteries pour la dernière ligne droite !'
  },
  {
    id: 'stage-j4',
    day: 4,
    date: 'Lundi 7 Septembre 2026',
    title: 'Val-Bélair ➔ Québec (François de Laval)',
    distance: '22.6 km',
    accommodation: 'Ligne d\'arrivée - Célébration',
    bookingDetail: 'Croisement François de Laval / Corridor des Cheminots',
    address: 'Québec, QC',
    phone: '',
    coordinates: [46.846965, -71.205736],
    color: '#ef4444',
    notes: 'Arrivée triomphale de l\'expédition Vélococos ! Photos de groupe et pique-nique final.'
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
      syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error' | 'local_only'
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

      // Données des modules
      materielList: INITIAL_MATERIEL,
      lingePapaList: INITIAL_LINGE_PAPA,
      lingeEnfantsList: INITIAL_LINGE_ENFANTS,
      menuList: INITIAL_MENU,
      refillsList: INITIAL_REFILLS,
      stages: INITIAL_STAGES,

      // Actions de modification (Local-First immédiat avec flag pending sync)
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
          else if (listName === 'menuList') resetData = INITIAL_MENU;
          else return state;

          return {
            [listName]: resetData,
            hasPendingChanges: true,
            syncStatus: 'idle'
          };
        });
      },

      // Export / Import pour synchronisation avec Supabase
      exportSyncPayload: () => {
        const s = get();
        return {
          updated_at: new Date().toISOString(),
          materiel: s.materielList,
          linge_papa: s.lingePapaList,
          linge_enfants: s.lingeEnfantsList,
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
          menuList: remoteState.menu || state.menuList,
          refillsList: remoteState.refills || state.refillsList,
          hasPendingChanges: false,
          syncStatus: 'synced',
          lastSyncedAt: new Date().toISOString()
        }));
      }
    }),
    {
      name: 'velococos-local-first-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        materielList: state.materielList,
        lingePapaList: state.lingePapaList,
        lingeEnfantsList: state.lingeEnfantsList,
        menuList: state.menuList,
        refillsList: state.refillsList,
        lastSyncedAt: state.lastSyncedAt,
        hasPendingChanges: state.hasPendingChanges,
        activeTab: state.activeTab
      })
    }
  )
);
