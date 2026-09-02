import React, { useState } from 'react';
import { TrendingDown, Clock, Gauge, Coffee, Play } from 'lucide-react';

export default function ElevationAndPaceCalculator({ stage }) {
  const [speed, setSpeed] = useState(7.5); // km/h par défaut
  const [startTime, setStartTime] = useState('09:00');
  const [breakMinutes, setBreakMinutes] = useState(30); // 30 min de pause avec les enfants

  // Extraction de la distance en nombre
  const distanceKm = parseFloat(stage.distance) || 20;

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

  // Altitude et dénivelés exacts extraits des fichiers GPX
  const altitudeProfiles = {
    1: { start: 215, end: 178, diff: -37, dPlus: 325, dMinus: 361, trend: 'Descente nette (-37m, D+ 325m)' },
    2: { start: 179, end: 174, diff: -5, dPlus: 265, dMinus: 270, trend: 'Vallonné régulier (D+ 265m / D- 270m)' },
    3: { start: 176, end: 230, diff: 54, dPlus: 461, dMinus: 407, trend: 'Étape reine vallonnée (D+ 461m)' },
    4: { start: 231, end: 7, diff: -224, dPlus: 185, dMinus: 408, trend: 'Descente vers le fleuve (-224m)' }
  };

  const profile = altitudeProfiles[stage.day] || { start: 200, end: 50, diff: -150, dPlus: 300, dMinus: 450, trend: 'Profil GPX' };

  return (
    <div className="bg-slate-900/95 rounded-2xl p-4 border border-slate-800 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base font-black text-white">Profil Altimétrique & Allure Chariot</h4>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          D+ {profile.dPlus}m / D- {profile.dMinus}m
        </span>
      </div>

      {/* Profil Dénivelé */}
      <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Tendance du relief :</span>
          <span className="text-emerald-300 font-bold">{profile.trend}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Altitude départ ➔ arrivée :</span>
          <span className="text-slate-200 font-mono font-bold">{profile.start} m ➔ {profile.end} m</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Dénivelé total de l'étape :</span>
          <span className="text-slate-200 font-mono font-bold text-amber-300">+{profile.dPlus}m / -{profile.dMinus}m</span>
        </div>

        {/* Visual Bar Indicator */}
        <div className="relative pt-2">
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden flex">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 h-full w-full rounded-full" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Départ ({profile.start}m)</span>
            <span className="text-emerald-400 font-bold">{profile.diff} m de dénivelé</span>
            <span>Arrivée ({profile.end}m)</span>
          </div>
        </div>
      </div>

      {/* Calculateur de Temps & Allure */}
      <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span>Allure de course avec chariot ({stage.distance})</span>
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
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                speed === mode.val
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <div>{mode.label}</div>
              <div className="text-[10px] opacity-80">{mode.val} km/h</div>
            </button>
          ))}
        </div>

        {/* Paramètres de départ & pauses */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 flex items-center gap-1">
              <Play className="w-3 h-3 text-sky-400" />
              Départ le matin
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1 flex items-center gap-1">
              <Coffee className="w-3 h-3 text-amber-400" />
              Pauses enfants
            </label>
            <select
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1h00</option>
              <option value={75}>1h15</option>
              <option value={90}>1h30</option>
              <option value={105}>1h45</option>
              <option value={120}>2h00</option>
              <option value={150}>2h30</option>
              <option value={180}>3h00</option>
            </select>
          </div>
        </div>

        {/* Résultat d'estimation */}
        <div className="mt-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Durée totale estimée</div>
            <div className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              {hours > 0 ? `${hours}h ` : ''}{minutes.toString().padStart(2, '0')} min
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Arrivée au camp</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              ~ {arrivalTimeString}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
