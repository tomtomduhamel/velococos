import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Phone,
  Locate,
  Home,
  Tent,
  Droplets,
  Wrench,
  Layers,
  Radio,
  Sparkles,
  Info,
  ExternalLink,
  Upload,
  FileText,
  Film,
  Clock
} from 'lucide-react';
import { useAppStore, INITIAL_STAGES, TRAIL_POIS } from '../store/useAppStore';
import ElevationAndPaceCalculator from './ElevationAndPaceCalculator';
import WeatherWidget from './WeatherWidget';
import ReservationProofModal from './ReservationProofModal';

// Icônes personnalisées pour les étapes (J1 à J4)
const createStageIcon = (day, color) => {
  return L.divIcon({
    className: 'custom-stage-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.4);
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: 800;
          font-size: 13px;
        ">J${day}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Icône personnalisée pour les POI officiels
const createPoiIcon = (type) => {
  let bgColor = '#0284c7';
  let emoji = '📍';

  if (type === 'water') {
    bgColor = '#06b6d4';
    emoji = '💧';
  } else if (type === 'grocery') {
    bgColor = '#f59e0b';
    emoji = '🛒';
  } else if (type === 'repair') {
    bgColor = '#64748b';
    emoji = '🔧';
  } else if (type === 'toilets') {
    bgColor = '#8b5cf6';
    emoji = '🚻';
  } else if (type === 'cinema') {
    bgColor = '#d946ef';
    emoji = '🎬';
  }

  return L.divIcon({
    className: 'custom-poi-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        font-size: 12px;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
  });
};

const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        background-color: #10b981;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.4);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const STAGE_START_COORDS = {
  1: [46.989283, -72.179923], // Gare Rivière-à-Pierre
  2: [46.898764, -72.025730], // Lac Simon
  3: [46.872680, -71.800480], // Saint-Raymond
  4: [46.851818, -71.441756]  // Val-Bélair
};

const getStageBounds = (stage, data) => {
  if (data?.features) {
    const dayFeature = data.features.find((f) => f.properties?.day === stage.day);
    if (dayFeature?.geometry?.coordinates?.length) {
      const latLngs = dayFeature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      return L.latLngBounds(latLngs);
    }
  }

  const startCoord = STAGE_START_COORDS[stage.day] || stage.coordinates;
  const endCoord = stage.coordinates;
  return L.latLngBounds([startCoord, endCoord]);
};

function MapController({ center, zoom, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, {
        paddingTopLeft: [20, 25],
        paddingBottomRight: [20, 25],
        maxZoom: 13,
        animate: true,
        duration: 0.8
      });
    } else if (center) {
      map.setView(center, zoom || 12, { animate: true });
    }
  }, [bounds, center, zoom, map]);
  return null;
}

export default function TrajetTab() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [activeStage, setActiveStage] = useState(INITIAL_STAGES[0]);
  const [mapCenter, setMapCenter] = useState([46.91, -71.75]);
  const [mapZoom, setMapZoom] = useState(10);
  const [mapBounds, setMapBounds] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationModalDay, setReservationModalDay] = useState(1);

  // Filtres POI interactifs
  const [activePoiFilters, setActivePoiFilters] = useState({
    stages: true,
    water: true,
    grocery: true,
    toilets: true,
    repair: false
  });

  const toggleFilter = (filterKey) => {
    setActivePoiFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  // Chargement du fichier traces_fusionnees.json et cadrage initial sur le J1 entier
  useEffect(() => {
    fetch('/gpx/traces_fusionnees.json')
      .then((res) => res.json())
      .then((data) => {
        setGeoJsonData(data);
        const j1Bounds = getStageBounds(INITIAL_STAGES[0], data);
        setMapBounds(j1Bounds);
      })
      .catch((err) => console.error('Erreur chargement GeoJSON:', err));
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocError('Géolocalisation non supportée par votre appareil.');
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setMapBounds(null);
        setMapCenter(coords);
        setMapZoom(14);
        setLocating(false);
      },
      (err) => {
        setLocError('Position inaccessible : ' + err.message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Au clic sur un jour, centrer la carte sur TOUT le parcours du jour (départ à gauche, arrivée à droite)
  const handleSelectStage = (stage) => {
    setActiveStage(stage);
    const bounds = getStageBounds(stage, geoJsonData);
    setMapCenter(null);
    setMapBounds(bounds);
  };

  const handleSelectPoi = (poi) => {
    setMapBounds(null);
    setMapCenter(poi.coordinates);
    setMapZoom(14);
  };

  // Importateur GPX direct dans le navigateur (Mobile / PC)
  const handleGpxFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const dom = new DOMParser().parseFromString(text, 'text/xml');
      // Import dynamique de toGeoJSON si disponible, ou parsing simple
      const toGeoJSON = await import('@tmcw/togeojson');
      const converted = toGeoJSON.gpx(dom);

      if (converted && converted.features && converted.features.length > 0) {
        // Associer une couleur
        converted.features.forEach((feat) => {
          feat.properties = {
            ...feat.properties,
            name: file.name.replace('.gpx', ''),
            color: '#f59e0b',
            distance: 'Trace importée'
          };
        });

        // Mettre à jour l'état local
        const updated = geoJsonData
          ? { ...geoJsonData, features: [...geoJsonData.features, ...converted.features] }
          : converted;

        setGeoJsonData(updated);
        alert(`✓ Tracé importé avec succès (${file.name}) !`);
      }
    } catch (err) {
      console.error('Erreur import GPX:', err);
      alert("Erreur lors de l'import du fichier GPX : " + err.message);
    }
  };

  const geoJsonStyle = (feature) => {
    const isSelected = activeStage && feature.properties?.day === activeStage.day;
    return {
      color: feature.properties?.color || '#10b981',
      weight: isSelected ? 7 : 4,
      opacity: isSelected ? 1 : 0.7,
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  // Filtrage des POIs à afficher
  const visiblePois = TRAIL_POIS.filter((poi) => {
    if (poi.type === 'cinema') return true; // Toujours visible pour la surprise des enfants !
    if (poi.type === 'water' && activePoiFilters.water) return true;
    if (poi.type === 'grocery' && activePoiFilters.grocery) return true;
    if (poi.type === 'toilets' && activePoiFilters.toilets) return true;
    if (poi.type === 'repair' && activePoiFilters.repair) return true;
    return false;
  });

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Overview Card */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Trace Jacques-Cartier / Portneuf</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Km 68 (R-à-P) ➔ Km 0 (Valcartier) ➔ Québec • 101.8 km au total
          </p>
        </div>

        {/* Boutons d'actions en rangée 50/50 sans écrasement */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <label className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 cursor-pointer active:scale-95 transition-all touch-target">
            <Upload className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Import GPX</span>
            <input
              type="file"
              accept=".gpx"
              onChange={handleGpxFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all touch-target"
          >
            <Locate className={`w-4 h-4 ${locating ? 'animate-spin' : ''} flex-shrink-0`} />
            <span>{locating ? 'GPS...' : 'Ma position'}</span>
          </button>
        </div>

        {locError && (
          <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
            {locError}
          </div>
        )}

        {/* Alerte Zone Blanche Réseau Cellulaire */}
        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-start space-x-2 text-amber-300 text-xs">
          <Radio className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-black">Zone Blanche Cellulaire :</span> Du Km 68 (Rivière-à-Pierre) au Km 48 (Lac Simon), le réseau cellulaire est inexistant. L'application reste 100% active hors-ligne.
          </div>
        </div>
      </div>

      {/* POI Filter Toggles Bar - Grid 5 colonnes Responsive */}
      <div className="grid grid-cols-5 gap-1.5 w-full">
        <button
          type="button"
          onClick={() => toggleFilter('stages')}
          className={`py-2 px-1 rounded-xl text-center border transition-all flex flex-col items-center justify-center active:scale-95 ${
            activePoiFilters.stages
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span className="text-sm leading-none">⛺</span>
          <span className="text-[10px] font-bold mt-1 tracking-tight leading-none truncate w-full">Étapes</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('water')}
          className={`py-2 px-1 rounded-xl text-center border transition-all flex flex-col items-center justify-center active:scale-95 ${
            activePoiFilters.water
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span className="text-sm leading-none">💧</span>
          <span className="text-[10px] font-bold mt-1 tracking-tight leading-none truncate w-full">Eau</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('grocery')}
          className={`py-2 px-1 rounded-xl text-center border transition-all flex flex-col items-center justify-center active:scale-95 ${
            activePoiFilters.grocery
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span className="text-sm leading-none">🛒</span>
          <span className="text-[10px] font-bold mt-1 tracking-tight leading-none truncate w-full">Épiceries</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('toilets')}
          className={`py-2 px-1 rounded-xl text-center border transition-all flex flex-col items-center justify-center active:scale-95 ${
            activePoiFilters.toilets
              ? 'bg-purple-500 text-white border-purple-400 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span className="text-sm leading-none">🚻</span>
          <span className="text-[10px] font-bold mt-1 tracking-tight leading-none truncate w-full">Toilettes</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('repair')}
          className={`py-2 px-1 rounded-xl text-center border transition-all flex flex-col items-center justify-center active:scale-95 ${
            activePoiFilters.repair
              ? 'bg-slate-200 text-slate-950 border-slate-300 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span className="text-sm leading-none">🔧</span>
          <span className="text-[10px] font-bold mt-1 tracking-tight leading-none truncate w-full">Outils</span>
        </button>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="h-80 w-full rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-xl relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <MapController center={mapCenter} zoom={mapZoom} bounds={mapBounds} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* GeoJSON Trail */}
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={geoJsonStyle}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(`
                    <div style="font-family: sans-serif; font-size: 13px; font-weight: bold; color: #0f172a;">
                      ${feature.properties.name}<br/>
                      <span style="color: #64748b; font-weight: normal;">Distance: ${feature.properties.distance}</span>
                    </div>
                  `);
                }
              }}
            />
          )}

          {/* Markers for stages (J1 à J4) */}
          {activePoiFilters.stages &&
            INITIAL_STAGES.map((stage) => (
              <Marker
                key={stage.id}
                position={stage.coordinates}
                icon={createStageIcon(stage.day, stage.color)}
                eventHandlers={{
                  click: () => handleSelectStage(stage)
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 font-sans">
                    <div className="font-bold text-sm">{stage.title}</div>
                    <div className="text-xs text-emerald-700 font-semibold">{stage.accommodation}</div>
                    <div className="text-xs bg-slate-100 p-1 rounded mt-1 font-mono">
                      {stage.bookingDetail}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Markers for Official POIs */}
          {visiblePois.map((poi) => (
            <Marker
              key={poi.id}
              position={poi.coordinates}
              icon={createPoiIcon(poi.type)}
              eventHandlers={{
                click: () => handleSelectPoi(poi)
              }}
            >
              <Popup>
                <div className="p-1 text-slate-900 font-sans max-w-[220px]">
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                    {poi.type === 'grocery' && <span>🛒</span>}
                    <span>{poi.name}</span>
                  </div>
                  <div className="text-xs font-bold text-sky-700">{poi.km}</div>

                  {poi.distanceFromTrail && (
                    <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                      📍 {poi.distanceFromTrail}
                    </div>
                  )}

                  {poi.role && (
                    <div className="text-[10px] bg-amber-100 border border-amber-300 text-amber-900 font-bold p-1 rounded mt-1 leading-tight">
                      ⭐ {poi.role}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 my-1">
                    {poi.type === 'cinema' && <span className="bg-fuchsia-100 text-fuchsia-900 text-[10px] px-1.5 py-0.5 rounded font-bold">🎬 Cinéma &amp; Bubble Tea</span>}
                    {poi.type === 'grocery' && <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-bold">Épicerie</span>}
                    {poi.hasWater && <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Eau</span>}
                    {poi.hasToilets && <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Toilettes</span>}
                    {poi.hasRepair && <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Outils</span>}
                    {poi.hasParking && <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Parking</span>}
                  </div>

                  <div className="text-[11px] text-slate-600 leading-tight mt-1">
                    {poi.description}
                  </div>

                  <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between">
                    {poi.coordinates && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${poi.coordinates[0]},${poi.coordinates[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                      >
                        <span>🧭 Itinéraire GPS</span>
                      </a>
                    )}
                    {poi.type === 'cinema' && (
                      <a
                        href="https://www.cinemaalouette.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-fuchsia-600 hover:text-fuchsia-800"
                      >
                        <span>cinemaalouette.com ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* User Live Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={createUserLocationIcon()}>
              <Popup>
                <div className="text-xs font-bold text-emerald-700">Vous êtes ici !</div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Stage Selector Grid - 100% Mobile Responsive sans débordement */}
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {INITIAL_STAGES.map((stg) => (
          <button
            key={stg.id}
            type="button"
            onClick={() => handleSelectStage(stg)}
            className={`py-2 px-1 rounded-xl text-center transition-all border touch-target active:scale-95 flex flex-col items-center justify-center ${
              activeStage.id === stg.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span className="text-xs font-black tracking-tight leading-tight">J{stg.day}</span>
            <span
              className={`text-[11px] font-bold tracking-tight leading-tight mt-0.5 ${
                activeStage.id === stg.id ? 'text-slate-950 font-black' : 'text-slate-400'
              }`}
            >
              {stg.distance}
            </span>
          </button>
        ))}
      </div>

      {/* Bouton d'accès direct aux Preuves de Réservation Campings Hors-ligne */}
      <button
        type="button"
        onClick={() => {
          setReservationModalDay(activeStage.day <= 2 ? activeStage.day : 1);
          setIsReservationModalOpen(true);
        }}
        className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-sky-950/90 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:text-white hover:border-emerald-400 flex items-center justify-between transition-all shadow-md active:scale-[0.99]"
      >
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm">⛺</span>
          <span className="font-extrabold text-white">Preuves de réservation campings (J1 &amp; J2)</span>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px]">
          <span className="bg-emerald-900/80 text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-500/30">J1 Payé ✓</span>
          <span className="bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded font-black border border-amber-500/30">J2 Reste 31,04$</span>
          <FileText className="w-3.5 h-3.5 ml-1 text-sky-400" />
        </div>
      </button>

      {/* Accommodation & Stage Detail Card */}
      <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span
              className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: activeStage.color }}
            >
              Jour {activeStage.day} ({activeStage.distance})
            </span>
            <h3 className="text-lg font-black text-white mt-1.5">{activeStage.title}</h3>
            <p className="text-xs text-slate-400 font-medium">{activeStage.date}</p>
          </div>
          <button
            type="button"
            onClick={() => handleSelectStage(activeStage)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700"
            title="Centrer la carte"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>

        {/* Hébergement Bloc Spécifique */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white">
              {activeStage.day <= 2 ? (
                <Tent className="w-4 h-4 text-amber-400" />
              ) : (
                <Home className="w-4 h-4 text-sky-400" />
              )}
              <span className="font-bold text-sm">{activeStage.accommodation}</span>
            </div>

            {activeStage.booking && (
              <button
                type="button"
                onClick={() => {
                  setReservationModalDay(activeStage.day);
                  setIsReservationModalOpen(true);
                }}
                className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition shadow-sm active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Preuve &amp; PDF</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-block bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
              {activeStage.bookingDetail}
            </div>

            {activeStage.booking && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                activeStage.booking.isFullyPaid
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-950 text-amber-300 border-amber-500/40'
              }`}>
                {activeStage.booking.isFullyPaid ? 'Facture 100% Payée ✓' : `Solde restant : ${activeStage.booking.remainingBalance}`}
              </span>
            )}
          </div>

          {activeStage.booking?.waterAlert && (
            <div className="bg-red-950/50 border border-red-500/40 p-2.5 rounded-xl text-[11px] text-red-200 space-y-0.5">
              <div className="font-bold flex items-center gap-1 text-red-300">
                <span>⚠️</span>
                <span>Avis Eau Non Potable (Lac Simon)</span>
              </div>
              <p className="opacity-90 leading-tight">
                Blocs sanitaires pour douches/vaisselle, mais eau non potable. Eau embouteillée en vente à l'accueil.
              </p>
            </div>
          )}

          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="text-slate-400 font-semibold">Adresse : </span>
            {activeStage.address}
          </p>

          <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-700/60 gap-2">
            {activeStage.phone && (
              <a
                href={`tel:${activeStage.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center space-x-1.5 text-xs text-sky-400 font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{activeStage.phone}</span>
              </a>
            )}

            {activeStage.booking && (
              <button
                type="button"
                onClick={() => {
                  setReservationModalDay(activeStage.day);
                  setIsReservationModalOpen(true);
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <span>📄 Voir confirmation officielle (Offline)</span>
              </button>
            )}
          </div>
        </div>

        {/* Note logistique */}
        <div className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
          <span className="text-amber-400 font-bold mr-1">Info Piste :</span>
          {activeStage.notes}
        </div>
      </div>

      {/* Surprise Enfants : Cinéma Alouette (Étape J2 Saint-Raymond) */}
      {activeStage.day === 2 && (
        <div className="bg-gradient-to-br from-fuchsia-950/70 via-slate-900 to-purple-950/70 rounded-2xl p-4 border border-fuchsia-500/40 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-fuchsia-500/20 pb-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-fuchsia-500/20 text-fuchsia-300 rounded-xl border border-fuchsia-500/30">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black px-1.5 py-0.2 rounded bg-fuchsia-500 text-slate-950">SURPRISE</span>
                  <h4 className="text-sm font-black text-white">Cinéma Alouette • Saint-Raymond</h4>
                </div>
                <p className="text-[11px] text-fuchsia-200/80">Pour Jojo (6 ans) &amp; Gusto (4 ans) • Si le timing le permet</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500/30">
              Séance 13h30
            </span>
          </div>

          {/* Film à l'affiche */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider">À l'affiche (Semaine du 04 au 10 sept 2026)</div>
                <div className="text-base font-black text-white">« Vincent : La prophétie des mers »</div>
                <div className="text-xs text-slate-300 font-semibold flex items-center gap-2 mt-0.5">
                  <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded text-[10px] font-bold">Général (Dès 3-4 ans)</span>
                  <span>Durée : 1h31</span>
                </div>
              </div>
              <div className="text-3xl">🐳</div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Vincent, une jeune baleine à bosse, s'allie avec son gardien Walter (un rémora) et sa nouvelle amie Darya (une orque sourde courageuse) pour sauver les océans du Léviathan. <em>Un film d'animation tendre, héroïque et parfaitement adapté à Jojo et Gusto !</em>
            </p>

            {/* Friandises & Bubble Tea */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-1.5">
                <span>🧋</span>
                <strong>Comptoir Bubble Tea &amp; Popcorn sur place !</strong>
              </span>
              <span className="text-slate-400 text-[10px]">Samedi 5 sept • 13h30</span>
            </div>
          </div>

          {/* Simulation du timing avec le chariot */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulation du timing (Étape 2 : 21.6 km)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              • <strong>Départ conseillé du Lac Simon :</strong> vers 08h30 - 08h45.<br />
              • <strong>À 7.5 km/h + 30 min de pause :</strong> Arrivée à Saint-Raymond vers <strong>12h00 - 12h15</strong>.<br />
              • <strong>Timing parfait :</strong> ~1h15 pour pique-niquer, s'installer tranquillement et faire la surprise pour <strong>13h30</strong> !
            </p>
          </div>

          {/* Coordonnées & Actions */}
          <div className="flex flex-wrap items-center justify-between pt-1 gap-2 text-xs">
            <div className="text-[11px] text-slate-400">
              📍 380, rue St-Joseph, Saint-Raymond (à 500m de la piste)
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="tel:4183372465"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-[11px] flex items-center gap-1 border border-slate-700"
              >
                <Phone className="w-3 h-3" />
                <span>418 337-2465</span>
              </a>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=46.888500,-71.834000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-[11px] flex items-center gap-1 shadow"
              >
                <Navigation className="w-3 h-3" />
                <span>GPS Cinéma</span>
              </a>

              <a
                href="https://www.cinemaalouette.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 border border-slate-700"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Site Web</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Profil altimétrique & Calculateur d'allure de course chariot */}
      <ElevationAndPaceCalculator stage={activeStage} />

      {/* Météo haute précision & alertes expédition (Pluie mm/h, Fortes chaleurs, Éphéméride) */}
      <WeatherWidget stage={activeStage} />

      {/* Réseau cyclable & Surfaces de roulement (JCP + Corridor des Cheminots) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs text-slate-300 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-base">🛤️</span>
            <span className="font-black text-white text-sm">Surfaces & Réseau Cyclable (Route Verte 6)</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            101.8 km connectés
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Section 1: JCP */}
          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-xs">1. Vélopiste Jacques-Cartier / Portneuf</span>
              <span className="text-[10px] font-bold text-amber-300">Km 68 ➔ Km 0</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Rivière-à-Pierre ➔ Saint-Gabriel-de-Valcartier (68 km)
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              <strong className="text-amber-400">Poussière de pierre fine compactée</strong> sur ancienne voie ferrée (pente &lt; 2%). Très roulante avec le chariot. Devient légèrement plus souple uniquement en cas de fortes averses prolongées.
            </p>
          </div>

          {/* Section 2: Corridor des Cheminots */}
          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-xs">2. Corridor des Cheminots (Québec)</span>
              <span className="text-[10px] font-bold text-emerald-300">Km 0 ➔ Québec (23 km)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Valcartier ➔ Val-Bélair ➔ Limoilou ➔ Beauport
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              <strong className="text-emerald-400">100% Asphalte lisse & descente continue (-220m)</strong>. Piste polyvalente ultra rapide pour le chariot, traversant 4 arrondissements (Laurentien, Haute-St-Charles, Rivières, Limoilou) jusqu'au Domaine de Maizerets et au 1937 av. du Monument.
            </p>
          </div>
        </div>

        {/* Info gestionnaire & services */}
        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 gap-1">
          <span>Gestion : Vélopiste JCP (MRC Portneuf) & Ville de Québec (418 641-6412)</span>
          <a
            href="https://www.pleinairalacarte.com/pistes-cyclables/corridor-des-cheminots/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:underline flex items-center gap-1 font-bold"
          >
            <span>Guide Plein Air À la Carte</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Modal des Preuves de Réservation et PDFs Hors-ligne */}
      <ReservationProofModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        stages={INITIAL_STAGES}
        initialStageDay={reservationModalDay}
      />
    </div>
  );
}
