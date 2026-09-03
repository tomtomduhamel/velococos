import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Clock, Gauge, Coffee, Play, Compass } from 'lucide-react';

// Profils d'élévation et rééchantillonnage exacts issus du lissage topographique des traces GPX
const ALTITUDE_PROFILES = {
  1: {
    day: 1,
    title: 'Rivière-à-Pierre ➔ Lac Simon',
    distanceKm: 21.6,
    start: 215,
    end: 176,
    min: 170,
    max: 275,
    dPlus: 165,
    dMinus: 205,
    diff: -39,
    trend: 'Montée progressive sur 11 km (+60m), puis descente régulière vers le lac (-99m)',
    points: [
      { km: 0, ele: 215 }, { km: 1.1, ele: 215 }, { km: 2.2, ele: 216 }, { km: 3.3, ele: 222 },
      { km: 4.4, ele: 224 }, { km: 5.5, ele: 227 }, { km: 6.6, ele: 235 }, { km: 7.7, ele: 246 },
      { km: 8.8, ele: 256 }, { km: 9.9, ele: 268 }, { km: 11.0, ele: 275 }, { km: 12.2, ele: 271 },
      { km: 13.3, ele: 265 }, { km: 14.4, ele: 256 }, { km: 15.5, ele: 238 }, { km: 16.6, ele: 216 },
      { km: 17.7, ele: 197 }, { km: 18.8, ele: 179 }, { km: 19.9, ele: 173 }, { km: 21.0, ele: 177 },
      { km: 21.6, ele: 176 }
    ]
  },
  2: {
    day: 2,
    title: 'Lac Simon ➔ Saint-Raymond',
    distanceKm: 21.6,
    start: 177,
    end: 175,
    min: 134,
    max: 177,
    dPlus: 120,
    dMinus: 122,
    diff: -2,
    trend: 'Descente douce en vallée vers 134m (km 16), puis remontée graduelle vers Saint-Raymond (+40m)',
    points: [
      { km: 0, ele: 177 }, { km: 1.1, ele: 176 }, { km: 2.2, ele: 177 }, { km: 3.3, ele: 173 },
      { km: 4.4, ele: 172 }, { km: 5.5, ele: 169 }, { km: 6.6, ele: 161 }, { km: 7.7, ele: 149 },
      { km: 8.8, ele: 153 }, { km: 9.9, ele: 155 }, { km: 11.0, ele: 147 }, { km: 12.2, ele: 162 },
      { km: 13.3, ele: 172 }, { km: 14.4, ele: 156 }, { km: 15.5, ele: 154 }, { km: 16.6, ele: 135 },
      { km: 17.7, ele: 138 }, { km: 18.8, ele: 159 }, { km: 19.9, ele: 156 }, { km: 21.0, ele: 171 },
      { km: 21.6, ele: 175 }
    ]
  },
  3: {
    day: 3,
    title: 'Saint-Raymond ➔ Val-Bélair',
    distanceKm: 36.0,
    start: 175,
    end: 228,
    min: 145,
    max: 228,
    dPlus: 240,
    dMinus: 185,
    diff: 53,
    trend: 'Étape reine : vallonné en forêt jusqu\'à Sainte-Catherine, puis montée régulière des Cheminots vers Val-Bélair',
    points: [
      { km: 0, ele: 175 }, { km: 1.8, ele: 151 }, { km: 3.7, ele: 156 }, { km: 5.5, ele: 160 },
      { km: 7.4, ele: 159 }, { km: 9.2, ele: 162 }, { km: 11.1, ele: 165 }, { km: 12.9, ele: 194 },
      { km: 14.8, ele: 177 }, { km: 16.6, ele: 165 }, { km: 18.5, ele: 166 }, { km: 20.3, ele: 169 },
      { km: 22.2, ele: 173 }, { km: 24.0, ele: 168 }, { km: 25.9, ele: 160 }, { km: 27.7, ele: 172 },
      { km: 29.6, ele: 173 }, { km: 31.4, ele: 168 }, { km: 33.3, ele: 165 }, { km: 35.1, ele: 202 },
      { km: 36.0, ele: 228 }
    ]
  },
  4: {
    day: 4,
    title: 'Val-Bélair ➔ Québec (1937 av. du Monument)',
    distanceKm: 22.6,
    start: 228,
    end: 8,
    min: 6,
    max: 228,
    dPlus: 42,
    dMinus: 262,
    diff: -220,
    trend: 'Descente continue et très roulante depuis Val-Bélair jusqu\'au fleuve Saint-Laurent (-220m net)',
    points: [
      { km: 0, ele: 228 }, { km: 1.2, ele: 200 }, { km: 2.3, ele: 162 }, { km: 3.5, ele: 160 },
      { km: 4.6, ele: 157 }, { km: 5.8, ele: 153 }, { km: 7.0, ele: 145 }, { km: 8.1, ele: 132 },
      { km: 9.3, ele: 117 }, { km: 10.4, ele: 105 }, { km: 11.6, ele: 89 }, { km: 12.8, ele: 75 },
      { km: 13.9, ele: 59 }, { km: 15.1, ele: 45 }, { km: 16.2, ele: 30 }, { km: 17.4, ele: 17 },
      { km: 18.5, ele: 16 }, { km: 19.7, ele: 8 }, { km: 20.9, ele: 8 }, { km: 22.0, ele: 8 },
      { km: 22.6, ele: 8 }
    ]
  }
};

export default function ElevationAndPaceCalculator({ stage }) {
  const [speed, setSpeed] = useState(7.5); // km/h par défaut
  const [startTime, setStartTime] = useState('09:00');
  const [breakMinutes, setBreakMinutes] = useState(45); // 45 min de pause avec les enfants
  const [activePointIndex, setActivePointIndex] = useState(null);

  const profile = ALTITUDE_PROFILES[stage.day] || ALTITUDE_PROFILES[1];
  const distanceKm = profile.distanceKm;

  // Calcul du temps en mouvement
  const movingHours = distanceKm / speed;
  const totalMinutes = Math.round(movingHours * 60 + breakMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Calcul de l'heure d'arrivée estimée
  const [startH, startM] = startTime.split(':').map(Number);
  const arrivalDate = new Date();
  arrivalDate.setHours(startH, startM, 0, 0);
  arrivalDate.setMinutes(arrivalDate.getMinutes() + totalMinutes);
  const arrivalTimeString = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Génération du chemin SVG pour la courbe d'altitude
  const pts = profile.points;
  const minEle = Math.max(0, profile.min - 10);
  const maxEle = profile.max + 15;
  const eleRange = maxEle - minEle || 1;

  const svgW = 400;
  const svgH = 85;
  const paddingX = 10;
  const paddingY = 8;

  const scaleX = (km) => paddingX + (km / distanceKm) * (svgW - paddingX * 2);
  const scaleY = (ele) => svgH - paddingY - ((ele - minEle) / eleRange) * (svgH - paddingY * 2);

  const pathD = pts
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.km).toFixed(1)} ${scaleY(p.ele).toFixed(1)}`)
    .join(' ');

  const areaD = `${pathD} L ${scaleX(distanceKm).toFixed(1)} ${svgH} L ${scaleX(0).toFixed(1)} ${svgH} Z`;

  const activePoint = activePointIndex !== null ? pts[activePointIndex] : null;

  return (
    <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-4">
      {/* En-tête avec métriques certifiées */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {profile.diff <= 0 ? (
            <TrendingDown className="w-5 h-5 text-emerald-400" />
          ) : (
            <TrendingUp className="w-5 h-5 text-amber-400" />
          )}
          <div>
            <h4 className="text-base font-black text-white">Profil Altimétrique Réel</h4>
            <p className="text-[11px] text-slate-400">Tracé GPX lissé • Étape {stage.day}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            D+ {profile.dPlus}m
          </span>
          <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            D- {profile.dMinus}m
          </span>
        </div>
      </div>

      {/* Profil Dénivelé & Graphique SVG interactif */}
      <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-3">
        {/* Résumé textuel */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Tendance du sentier :</span>
            <span className="text-emerald-300 font-bold text-right ml-2">{profile.trend}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Altitude départ ➔ arrivée :</span>
            <span className="text-slate-200 font-mono font-bold">{profile.start} m ➔ {profile.end} m ({profile.diff > 0 ? `+${profile.diff}` : profile.diff} m)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Altitudes extrêmes :</span>
            <span className="text-slate-300 font-mono text-[11px]">Min : <strong>{profile.min} m</strong> • Max : <strong>{profile.max} m</strong></span>
          </div>
        </div>

        {/* Graphique SVG d'altitude */}
        <div className="relative pt-1">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full h-24 overflow-visible touch-none cursor-crosshair"
            onMouseLeave={() => setActivePointIndex(null)}
          >
            <defs>
              <linearGradient id="elevGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Lignes repères horizontales */}
            <line x1="0" y1={svgH - paddingY} x2={svgW} y2={svgH - paddingY} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="0" y1={paddingY} x2={svgW} y2={paddingY} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

            {/* Remplissage sous la courbe */}
            <path d={areaD} fill="url(#elevGrad)" />

            {/* Ligne de profil altimétrique */}
            <path d={pathD} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Point de départ */}
            <circle cx={scaleX(0)} cy={scaleY(pts[0].ele)} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

            {/* Point d'arrivée */}
            <circle cx={scaleX(distanceKm)} cy={scaleY(pts[pts.length - 1].ele)} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

            {/* Curseur actif au toucher */}
            {activePoint && (
              <>
                <line
                  x1={scaleX(activePoint.km)}
                  y1={0}
                  x2={scaleX(activePoint.km)}
                  y2={svgH}
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                />
                <circle
                  cx={scaleX(activePoint.km)}
                  cy={scaleY(activePoint.ele)}
                  r="5"
                  fill="#fbbf24"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Zones tactiles invisibles pour chaque point */}
            {pts.map((p, idx) => (
              <rect
                key={idx}
                x={scaleX(p.km) - (svgW / pts.length) / 2}
                y="0"
                width={svgW / pts.length}
                height={svgH}
                fill="transparent"
                onMouseEnter={() => setActivePointIndex(idx)}
                onTouchStart={() => setActivePointIndex(idx)}
              />
            ))}
          </svg>

          {/* Infobulle dynamique ou repères kilométriques */}
          {activePoint ? (
            <div className="flex justify-between items-center bg-slate-900/90 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs mt-1 animate-fadeIn">
              <span className="font-bold text-amber-300">📍 Km {activePoint.km}</span>
              <span className="font-mono font-black text-white">Altitude : {activePoint.ele} m</span>
            </div>
          ) : (
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Km 0 ({profile.start}m)</span>
              <span className="text-slate-500">Touchez la courbe pour explorer</span>
              <span>Km {distanceKm} ({profile.end}m)</span>
            </div>
          )}
        </div>
      </div>

      {/* Calculateur de Temps & Allure Course avec Chariot */}
      <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span>Simulateur d'allure chariot ({profile.distanceKm} km)</span>
        </div>

        {/* Sélecteur de vitesse */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {[
            { label: 'Marche', val: 5.5 },
            { label: 'Trot', val: 7.0 },
            { label: 'Course', val: 8.5 },
            { label: 'Rapide', val: 10.0 }
          ].map((mode) => (
            <button
              key={mode.val}
              type="button"
              onClick={() => setSpeed(mode.val)}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border active:scale-95 ${
                speed === mode.val
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <div>{mode.label}</div>
              <div className="text-[10px] font-normal opacity-80">{mode.val} km/h</div>
            </button>
          ))}
        </div>

        {/* Paramètres de Départ et Pauses */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 flex flex-col justify-between">
            <span className="text-slate-400 flex items-center space-x-1 mb-1">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Heure de départ</span>
            </span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 flex flex-col justify-between">
            <span className="text-slate-400 flex items-center space-x-1 mb-1">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Pauses enfants</span>
            </span>
            <select
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
              className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            >
              <option value={15}>15 min (Express)</option>
              <option value={30}>30 min (Collation)</option>
              <option value={45}>45 min (Détente)</option>
              <option value={60}>1h00 (Pique-nique)</option>
              <option value={75}>1h15</option>
              <option value={90}>1h30 (Baignade)</option>
              <option value={105}>1h45</option>
              <option value={120}>2h00 (Grand arrêt)</option>
              <option value={150}>2h30</option>
              <option value={180}>3h00 (Après-midi)</option>
            </select>
          </div>
        </div>

        {/* Résultat : Temps total et Heure d'arrivée */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-400">Durée totale estimée :</div>
            <div className="text-sm font-black text-white">
              {hours}h{minutes.toString().padStart(2, '0')} <span className="text-[10px] font-normal text-slate-300">({breakMinutes}m de pause)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-400">Arrivée estimée :</div>
            <div className="text-base font-black text-emerald-400 font-mono">
              ~ {arrivalTimeString}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
