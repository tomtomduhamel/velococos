// script-gpx-geojson.js
// Exécution : node script-gpx-geojson.js
// Prérequis : npm install @tmcw/togeojson xmldom

import fs from 'fs';
import { DOMParser } from 'xmldom';
import * as toGeoJSON from '@tmcw/togeojson';

// Chemins relatifs vers le dossier public
const files = [
  './public/gpx/t318583107_j1 - velococos.gpx',
  './public/gpx/t318831228_j2 - velococos.gpx',
  './public/gpx/t318832812_j3bis - velococos.gpx',
  './public/gpx/t318833080_j4 - velococos.gpx'
];

const mergedFeatures = [];

files.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      const gpxData = fs.readFileSync(file, 'utf8');
      const gpxDom = new DOMParser().parseFromString(gpxData);
      const geojson = toGeoJSON.gpx(gpxDom);
      if (geojson && geojson.features) {
        mergedFeatures.push(...geojson.features);
      }
      console.log(`✓ Fichier traité avec succès: ${file}`);
    } else {
      console.warn(`! Fichier non trouvé (ignoré pour le moment): ${file}`);
    }
  } catch (error) {
    console.error(`Erreur de lecture/parsing sur ${file}:`, error);
  }
});

if (!fs.existsSync('./public/gpx')) {
  fs.mkdirSync('./public/gpx', { recursive: true });
}

// Ne pas écraser les traces par défaut si aucun GPX n'a encore été déposé
if (mergedFeatures.length > 0) {
  const finalGeoJSON = {
    type: "FeatureCollection",
    features: mergedFeatures
  };
  fs.writeFileSync('./public/gpx/traces_fusionnees.json', JSON.stringify(finalGeoJSON, null, 2));
  console.log(`Fusion GeoJSON terminée : ${mergedFeatures.length} traces fusionnées dans traces_fusionnees.json.`);
} else {
  console.log('Aucun nouveau fichier GPX trouvé dans ./public/gpx. Le fichier traces_fusionnees.json existant est conservé.');
}
