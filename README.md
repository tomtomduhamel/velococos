# Vélococos - Application Mobile PWA Local-First 🚴‍♂️⛺

Application mobile PWA (Progressive Web App) conçue pour l'autonomie logistique complète lors de l'expédition vélo-course de 4 jours (4 au 7 septembre 2026) reliant **Rivière-à-Pierre à Québec** le long de la Vélopiste Jacques-Cartier / Portneuf.

## Points Clés & Architecture

- **100% Fonctionnelle Hors-Ligne** : PWA propulsée par `vite-plugin-pwa` avec pré-mise en cache agressive des assets et runtime caching (`CacheFirst`) des tuiles OpenStreetMap.
- **Architecture Local-First** : Gestion d'état avec **Zustand** et le middleware `persist` (`localStorage`). Aucune latence, aucune perte de données lors des coupures de réseau sur la piste.
- **Synchronisation Supabase** : Moteur de synchronisation bidirectionnelle asynchrone déclenché automatiquement dès la captation de l'événement navigateur `online`.
- **Interface Mobile-First Outdoor** : Conçue pour une utilisation à une main lors de la poussée d'un chariot de course, avec de larges zones tactiles (≥ 48px) et un contraste élevé pour lisibilité en plein soleil.

## Les 4 Modules

1. **Trajet (Cartographie)** : Carte interactive Leaflet, tracé GeoJSON officiel et fiches étapes d'hébergement (J1 à J4 avec emplacements de camping et adresses).
2. **Nourriture (Miam & Refill)** : Alertes visuelles pour les points de réapprovisionnement indispensables (J2 Saint-Raymond et J3 Val-Bélair) et menu quotidien par repas.
3. **Matériel** : Checklist dynamique d'équipement classée par catégorie (Course/Chariot, Bivouac, Sécurité, etc.).
4. **Linge** : Checklists scindées entre *Linge Papa* et *Linge Enfants (Gusto & Jojo)*.

## Développement

```bash
# Installation des dépendances
npm install

# Démarrage local avec accès mobile sur le Wi-Fi
npm run dev -- --host

# Compilation de production PWA
npm run build
```
