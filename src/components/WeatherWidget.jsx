import React, { useEffect, useState } from 'react';
import {
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  ShieldAlert,
  Droplets,
  RefreshCw,
  ExternalLink,
  Flame,
  Tent,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { getStageWeather, analyzeExpeditionWeather } from '../services/weatherService';

export default function WeatherWidget({ stage, onSelectDay }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);

  const activeDay = stage?.day || 1;

  const loadWeather = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getStageWeather(activeDay, force);
      setWeatherData(data);
    } catch (err) {
      console.error('Erreur chargement météo:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather(false);
    setSelectedHour(null);
  }, [activeDay]);

  const alerts = weatherData ? analyzeExpeditionWeather(weatherData) : [];

  // Calcul de la durée du jour
  const getDaylightDuration = (sunriseStr, sunsetStr) => {
    if (!sunriseStr || !sunsetStr || !sunriseStr.includes(':') || !sunsetStr.includes(':')) return '';
    const [h1, m1] = sunriseStr.split(':').map(Number);
    const [h2, m2] = sunsetStr.split(':').map(Number);
    const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const daylight = weatherData ? getDaylightDuration(weatherData.sunrise, weatherData.sunset) : '';

  // Formater la date du dernier relevé
  const formatUpdateTime = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-4">
      {/* En-tête Météo avec Titre et Boutons */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl leading-none">🌤️</span>
            <h3 className="text-base font-black text-white">Météo & Précipitations Précises</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {weatherData?.locationName || `Étape ${activeDay}`} • {stage?.date || ''}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => loadWeather(true)}
            disabled={refreshing}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl active:scale-95 transition-all touch-target flex items-center justify-center border border-slate-700"
            title="Rafraîchir les données météo"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
          <a
            href="https://velopistejcp.com/la-piste/etat-du-sentier/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 rounded-xl active:scale-95 transition-all touch-target flex items-center justify-center border border-sky-500/30"
            title="État officiel du sentier Vélopiste JCP"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
          <span>Chargement des prévisions haute précision...</span>
        </div>
      ) : (
        <>
          {/* Carte Résumé : Températures, Nuit & Ressenti */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Max de la journée */}
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Journée Max
              </span>
              <div className="text-lg font-black text-amber-300 mt-0.5">
                {weatherData.tMax}°C
              </div>
              <span className="text-[10px] text-slate-400">
                Ressenti {weatherData.tAppMax}°C
              </span>
            </div>

            {/* Nuit sous la tente */}
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Nuit Min (Tente)
              </span>
              <div className="text-lg font-black text-sky-300 mt-0.5">
                {weatherData.tMin}°C
              </div>
              <span className="text-[10px] text-slate-400">
                {weatherData.tMin <= 10 ? 'Très frais' : 'Doux'}
              </span>
            </div>

            {/* Pluie cumulée */}
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Pluie Totale
              </span>
              <div className="text-lg font-black text-blue-400 mt-0.5">
                {weatherData.rainSumMm} mm
              </div>
              <span className="text-[10px] text-slate-400">
                {weatherData.rainSumMm > 0 ? 'Prévoir bâche' : 'Sec'}
              </span>
            </div>
          </div>

          {/* Éphéméride & Ensoleillement (Lever / Coucher) */}
          <div className="bg-gradient-to-r from-amber-950/30 via-slate-800/60 to-indigo-950/30 p-3 rounded-xl border border-slate-700/70 grid grid-cols-2 gap-3 text-xs">
            {/* Lever & Coucher */}
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>Lever : {weatherData.sunrise}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-indigo-300 font-bold">
                <Sunset className="w-4 h-4 text-indigo-400" />
                <span>Coucher : {weatherData.sunset}</span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-0.5">
                ☀️ {daylight} de lumière du jour
              </span>
            </div>

            {/* UV & Vent */}
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-200">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>UV Max : <strong>{weatherData.uvMax}</strong> ({weatherData.uvMax >= 6 ? 'Élevé' : 'Modéré'})</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-200">
                <Wind className="w-4 h-4 text-sky-400" />
                <span>Vent max : <strong>~{weatherData.hourly[6]?.windGusts || 15} km/h</strong></span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-0.5">
                Crème & casquettes recommandées
              </span>
            </div>
          </div>

          {/* Chronologie Horaire Précise (Heure par Heure 06h00 ➔ 21h00) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Détail Horaire (Pluie mm/h & Chaleur)
              </span>
              <span className="text-[10px] text-slate-400">
                Faites défiler horizontalement ➔
              </span>
            </div>

            {/* Frise horaire défilante sans scrollbar */}
            <div className="flex space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
              {weatherData.hourly.map((h, idx) => {
                const isRainy = h.rainMm > 0 || h.rainProb >= 30;
                const isVeryHot = h.apparent >= 25;
                const isSelected = selectedHour?.hour === h.hour;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedHour(h)}
                    className={`flex flex-col items-center justify-between p-2.5 rounded-xl border min-w-[72px] flex-shrink-0 transition-all active:scale-95 text-center ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg scale-105'
                        : isRainy && h.rainMm >= 1.0
                        ? 'bg-blue-950/60 border-blue-500/60 text-blue-200'
                        : isVeryHot
                        ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {/* Heure */}
                    <span className={`text-[11px] font-black tracking-tight ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                      {h.time}
                    </span>

                    {/* Icône Météo */}
                    <span className="text-xl my-1 leading-none">{h.weather.icon}</span>

                    {/* Température & Ressenti */}
                    <div className="my-0.5">
                      <span className={`text-xs font-black block leading-none ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                        {h.temp}°C
                      </span>
                      <span className={`text-[9px] block mt-0.5 leading-none ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                        Ress. {h.apparent}°
                      </span>
                    </div>

                    {/* Précipitations : Probabilité & Quantité d'eau en mm/h */}
                    <div className="mt-1.5 pt-1 border-t border-slate-700/60 w-full flex flex-col items-center">
                      <span className={`text-[10px] font-extrabold leading-tight ${
                        isSelected
                          ? 'text-slate-950'
                          : h.rainProb >= 40
                          ? 'text-sky-300 font-black'
                          : 'text-slate-400'
                      }`}>
                        {h.rainProb}%
                      </span>

                      {/* Quantité d'eau en mm/h */}
                      <span className={`text-[10px] font-mono font-black mt-0.5 px-1 py-0.2 rounded ${
                        isSelected
                          ? 'bg-slate-950/20 text-slate-950'
                          : h.rainMm >= 2.0
                          ? 'bg-blue-500 text-white'
                          : h.rainMm >= 0.5
                          ? 'bg-sky-500/30 text-sky-300'
                          : 'text-slate-500'
                      }`}>
                        {h.rainMm > 0 ? `${h.rainMm} mm` : '0 mm'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Zoom sur l'heure sélectionnée */}
            {selectedHour && (
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-1.5 text-xs animate-fadeIn">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span>{selectedHour.weather.icon}</span>
                    <span>Créneau {selectedHour.time} : {selectedHour.weather.label}</span>
                  </span>
                  <span className="font-mono text-white">{selectedHour.temp}°C (Ressenti {selectedHour.apparent}°C)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 text-slate-300">
                  <div>🌧️ Pluie : <strong className={selectedHour.rainMm > 0 ? 'text-sky-300' : ''}>{selectedHour.rainMm} mm/h ({selectedHour.rainProb}%)</strong></div>
                  <div>💨 Vent : <strong>{selectedHour.windKm} km/h (rafales {selectedHour.windGusts})</strong></div>
                  <div>🧴 Indice UV : <strong>{selectedHour.uv} / 10</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Alertes Stratégiques pour l'Expédition Chariot & Enfants */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
              Conseils Expédition Vélopiste
            </span>

            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start space-x-2.5 text-xs leading-snug ${
                  alert.level === 'danger'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                    : alert.level === 'warning'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                    : alert.level === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-base flex-shrink-0 leading-none">{alert.icon}</span>
                <div className="space-y-0.5 flex-1">
                  <div className="font-black text-white">{alert.title}</div>
                  <div className="text-[11px] opacity-90">{alert.message}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Horodatage & Statut Hors-ligne */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            <span>Données météo Open-Meteo & Cache local PWA</span>
            <span>
              {weatherData.isOfflineFallback ? 'Mode hors-ligne' : `Relevé de ${formatUpdateTime(weatherData.fetchedAt)}`}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
