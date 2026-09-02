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
  ExternalLink
} from 'lucide-react';
import { useAppStore, INITIAL_STAGES, TRAIL_POIS } from '../store/useAppStore';
import ElevationAndPaceCalculator from './ElevationAndPaceCalculator';

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
  } else if (type === 'repair') {
    bgColor = '#f59e0b';
    emoji = '🔧';
  } else if (type === 'toilets') {
    bgColor = '#8b5cf6';
    emoji = '🚻';
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

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 12, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function TrajetTab() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [activeStage, setActiveStage] = useState(INITIAL_STAGES[0]);
  const [mapCenter, setMapCenter] = useState([46.91, -71.75]);
  const [mapZoom, setMapZoom] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(null);

  // Filtres POI interactifs
  const [activePoiFilters, setActivePoiFilters] = useState({
    stages: true,
    water: true,
    toilets: true,
    repair: true
  });

  const toggleFilter = (filterKey) => {
    setActivePoiFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  // Chargement du fichier traces_fusionnees.json
  useEffect(() => {
    fetch('/gpx/traces_fusionnees.json')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
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

  const handleSelectStage = (stage) => {
    setActiveStage(stage);
    setMapCenter(stage.coordinates);
    setMapZoom(13);
  };

  const handleSelectPoi = (poi) => {
    setMapCenter(poi.coordinates);
    setMapZoom(14);
  };

  const geoJsonStyle = (feature) => ({
    color: feature.properties?.color || '#10b981',
    weight: 5,
    opacity: 0.9,
    lineCap: 'round',
    lineJoin: 'round'
  });

  // Filtrage des POIs à afficher
  const visiblePois = TRAIL_POIS.filter((poi) => {
    if (poi.type === 'water' && activePoiFilters.water) return true;
    if (poi.type === 'toilets' && activePoiFilters.toilets) return true;
    if (poi.type === 'repair' && activePoiFilters.repair) return true;
    return false;
  });

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Overview Card */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              Trace Jacques-Cartier / Portneuf
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Km 68 (R-à-P) ➔ Km 0 (Valcartier) ➔ Québec (91 km)
            </p>
          </div>
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all touch-target"
          >
            <Locate className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Recherche...' : 'Ma position'}</span>
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

      {/* POI Filter Toggles Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => toggleFilter('stages')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 active:scale-95 ${
            activePoiFilters.stages
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span>⛺ Étapes J1-J4</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('water')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 active:scale-95 ${
            activePoiFilters.water
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span>💧 Eau potable</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('toilets')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 active:scale-95 ${
            activePoiFilters.toilets
              ? 'bg-purple-500 text-white border-purple-400 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span>🚻 Toilettes</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFilter('repair')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 active:scale-95 ${
            activePoiFilters.repair
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}
        >
          <span>🔧 Réparation</span>
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
          <MapController center={mapCenter} zoom={mapZoom} />
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
                <div className="p-1 text-slate-900 font-sans max-w-[200px]">
                  <div className="font-extrabold text-sm text-slate-900">{poi.name}</div>
                  <div className="text-xs font-bold text-sky-700">{poi.km}</div>
                  <div className="flex flex-wrap gap-1 my-1">
                    {poi.hasWater && <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Eau</span>}
                    {poi.hasToilets && <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Toilettes</span>}
                    {poi.hasRepair && <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">Outils</span>}
                    {poi.hasParking && <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Parking</span>}
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight mt-1">
                    {poi.description}
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

      {/* Stage Selector Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {INITIAL_STAGES.map((stg) => (
          <button
            key={stg.id}
            type="button"
            onClick={() => handleSelectStage(stg)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border touch-target active:scale-95 ${
              activeStage.id === stg.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            J{stg.day} • {stg.distance}
          </button>
        ))}
      </div>

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
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2">
          <div className="flex items-center space-x-2 text-white">
            {activeStage.day <= 2 ? (
              <Tent className="w-4 h-4 text-amber-400" />
            ) : (
              <Home className="w-4 h-4 text-sky-400" />
            )}
            <span className="font-bold text-sm">{activeStage.accommodation}</span>
          </div>

          <div className="inline-block bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
            {activeStage.bookingDetail}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="text-slate-400 font-semibold">Adresse : </span>
            {activeStage.address}
          </p>

          {activeStage.phone && (
            <div className="pt-1">
              <a
                href={`tel:${activeStage.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center space-x-1.5 text-xs text-sky-400 font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{activeStage.phone}</span>
              </a>
            </div>
          )}
        </div>

        {/* Note logistique */}
        <div className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
          <span className="text-amber-400 font-bold mr-1">Info Piste :</span>
          {activeStage.notes}
        </div>
      </div>

      {/* Profil altimétrique & Calculateur d'allure de course chariot */}
      <ElevationAndPaceCalculator stage={activeStage} />

      {/* État du sentier officiel & Météo prévisionnelle */}
      <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-sky-400" />
            <h4 className="text-sm font-black text-white">État du Sentier & Météo Piste</h4>
          </div>
          <a
            href="https://velopistejcp.com/la-piste/etat-du-sentier/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/30"
          >
            <span>Site officiel JCP</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 font-bold block mb-1">🌤️ Climat (4-7 Sept)</span>
            <p className="text-slate-300 leading-snug">
              Journée : <strong>18°C à 23°C</strong><br/>
              Nuit (tente) : <strong>8°C à 12°C</strong>
            </p>
          </div>
          <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 font-bold block mb-1">🛤️ Surface de roulement</span>
            <p className="text-slate-300 leading-snug">
              Poussière de pierre fine compactée. Idéale pour chariot de course et pneus gravel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
