// script-gpx-geojson.js
// Exécution : node script-gpx-geojson.js
// Prérequis : npm install @tmcw/togeojson xmldom

import fs from 'fs';
import { DOMParser } from 'xmldom';
import * as toGeoJSON from '@tmcw/togeojson';

const stageConfigs = [
  {
    file: './public/gpx/t318583107_j1 - velococos.gpx',
    day: 1,
    name: 'Étape 1 : Rivière-à-Pierre ➔ Lac Simon',
    distance: '21.6 km',
    color: '#10b981'
  },
  {
    file: './public/gpx/t318831228_j2 - velococos.gpx',
    day: 2,
    name: 'Étape 2 : Lac Simon ➔ Saint-Raymond',
    distance: '21.6 km',
    color: '#3b82f6'
  },
  {
    file: './public/gpx/t318832812_j3bis - velococos.gpx',
    day: 3,
    name: 'Étape 3 : Saint-Raymond ➔ Val-Bélair',
    distance: '36.0 km',
    color: '#f59e0b'
  },
  {
    file: './public/gpx/t318833080_j4 - velococos.gpx',
    day: 4,
    name: 'Étape 4 : Val-Bélair ➔ Québec (1937 av. du Monument)',
    distance: '22.6 km',
    color: '#ef4444'
  }
];

const mergedFeatures = [];

stageConfigs.forEach(cfg => {
  try {
    if (fs.existsSync(cfg.file)) {
      const gpxData = fs.readFileSync(cfg.file, 'utf8');
      const gpxDom = new DOMParser().parseFromString(gpxData);
      const geojson = toGeoJSON.gpx(gpxDom);

      if (geojson && geojson.features && geojson.features.length > 0) {
        geojson.features.forEach(feat => {
          feat.properties = {
            ...feat.properties,
            day: cfg.day,
            name: cfg.name,
            distance: cfg.distance,
            color: cfg.color
          };
          mergedFeatures.push(feat);
        });
        console.log(`✓ Fichier traité avec succès (Jour ${cfg.day}): ${cfg.file}`);
      }
    } else {
      console.warn(`! Fichier non trouvé : ${cfg.file}`);
    }
  } catch (error) {
    console.error(`Erreur de lecture/parsing sur ${cfg.file}:`, error);
  }
});

if (!fs.existsSync('./public/gpx')) {
  fs.mkdirSync('./public/gpx', { recursive: true });
}

if (mergedFeatures.length > 0) {
  const finalGeoJSON = {
    type: "FeatureCollection",
    features: mergedFeatures
  };
  fs.writeFileSync('./public/gpx/traces_fusionnees.json', JSON.stringify(finalGeoJSON, null, 2));
  console.log(`\n🎉 Fusion GeoJSON réussie : ${mergedFeatures.length} tracés officiels fusionnés dans ./public/gpx/traces_fusionnees.json`);
} else {
  console.warn('Aucun tracé valide extrait des fichiers GPX.');
}
