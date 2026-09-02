import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Phone, ExternalLink, Locate, Home, Tent, Flame, Flag } from 'lucide-react';
import { useAppStore, INITIAL_STAGES } from '../store/useAppStore';

// Création d'icônes Leaflet personnalisées à haut contraste en DivIcon (évite les bugs d'images manquantes Leaflet)
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

const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        background-color: #0284c7;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.4);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Composant interne pour recentrer la carte
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

  const geoJsonStyle = (feature) => ({
    color: feature.properties?.color || '#10b981',
    weight: 5,
    opacity: 0.9,
    lineCap: 'round',
    lineJoin: 'round'
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
              91 km au total • 4 jours en autonomie vélo-course
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
      </div>

      {/* Interactive Leaflet Map */}
      <div className="h-72 w-full rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-xl relative z-0">
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

          {/* Markers for each stage */}
          {INITIAL_STAGES.map((stage) => (
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

          {/* User Live Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={createUserLocationIcon()}>
              <Popup>
                <div className="text-xs font-bold text-sky-700">Vous êtes ici !</div>
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
    </div>
  );
}
